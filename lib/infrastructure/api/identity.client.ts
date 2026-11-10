import type { IdentityPort } from "@/lib/domain/identity/ports";
import type {
  DocumentUpload,
  DocumentVerdict,
} from "@/lib/domain/identity/document.vo";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";

/**
 * Wire shapes of the Examination BC. They never leave infrastructure.
 */
export type ExaminationResource = {
  id: string;
  personId: string;
  documentRef: string;
  standing: string;
  verdict: string | null;
  consumed: boolean;
};

export type ExaminationHistoryResource = {
  items: ExaminationResource[];
};

export type ExaminationStandingResource = {
  usableMatch: boolean;
};

/**
 * Wire shapes of the Biometric BC. They never leave infrastructure.
 */
export type AttemptResource = {
  id: string;
  personId: string;
  standing: string;
};

export type VerifiedNowResource = {
  verifiedNow: boolean;
  reason: string | null;
};

function toVerdict(dto: ExaminationResource): DocumentVerdict {
  const standing = dto.standing.toUpperCase();
  if (standing === "OPEN" || standing === "EXPIRED") {
    return "UNDER_REVIEW";
  }
  const verdict = (dto.verdict ?? "").toUpperCase();
  if (verdict === "MATCH") return "MATCH";
  if (verdict === "NO_MATCH") return "MISMATCH";
  return "UNDER_REVIEW";
}

async function examine(id: string): Promise<ExaminationResource> {
  return apiFetch<ExaminationResource>(`/examinations/${id}/examine`, {
    method: "POST",
  });
}

export class HttpIdentityAdapter implements IdentityPort {
  async uploadDocument(input: {
    personId: string;
    upload: DocumentUpload;
  }): Promise<{ verdict: DocumentVerdict }> {
    const documentRef = `${input.upload.documentType}:${input.upload.frontName}`;
    try {
      const created = await apiFetch<ExaminationResource>(`/examinations`, {
        method: "POST",
        body: JSON.stringify({ personId: input.personId, documentRef }),
      });
      return { verdict: toVerdict(await examine(created.id)) };
    } catch (error) {
      // Ya hay un examen OPEN para el par: examinar ese en vez de duplicar.
      if (error instanceof ApiError && error.status === 409) {
        try {
          const history = await apiFetch<ExaminationHistoryResource>(
            `/examinations/history?personId=${encodeURIComponent(input.personId)}&documentRef=${encodeURIComponent(documentRef)}`,
          );
          const open = history.items.find((e) => e.standing === "OPEN");
          if (open) {
            return { verdict: toVerdict(await examine(open.id)) };
          }
        } catch {
          // cae al UNDER_REVIEW general
        }
      }
      if (error instanceof ApiError && error.status === 422) {
        return { verdict: "MISMATCH" };
      }
      return { verdict: "UNDER_REVIEW" };
    }
  }

  async documentVerdict(input: {
    personId: string;
    documentRef: string;
  }): Promise<{ verdict: DocumentVerdict }> {
    const dto = await apiFetch<ExaminationStandingResource>(
      `/examinations/standing?personId=${encodeURIComponent(input.personId)}&documentRef=${encodeURIComponent(input.documentRef)}`,
    );
    return { verdict: dto.usableMatch ? "MATCH" : "UNDER_REVIEW" };
  }

  async referenceStatus(input: { personId: string }) {
    try {
      const dto = await apiFetch<VerifiedNowResource>(
        `/biometric/profiles/standing?personId=${encodeURIComponent(input.personId)}`,
      );
      return dto.verifiedNow
        ? { status: "ACTIVE" as const }
        : { status: "NOT_VERIFIED" as const };
    } catch {
      return { status: "NONE" as const };
    }
  }

  async enrollReference(input: { personId: string }) {
    try {
      await apiFetch(`/biometric/profiles`, {
        method: "POST",
        body: JSON.stringify({ personId: input.personId }),
      });
    } catch (error) {
      // Una referencia viva ya existe: reutilizarla es el estado correcto.
      if (!(error instanceof ApiError && error.status === 409)) {
        throw error;
      }
    }
    return { status: "ACTIVE" as const };
  }

  async startLiveness(input: { personId: string }) {
    const dto = await apiFetch<AttemptResource>(`/biometric/attempts`, {
      method: "POST",
      body: JSON.stringify({ personId: input.personId }),
    });
    return {
      attemptId: dto.id,
      step: "LOOK" as const,
      status: "READY" as const,
    };
  }

  async confirmLiveness(input: { attemptId: string }) {
    try {
      await apiFetch(`/biometric/attempts/${input.attemptId}/liveness`, {
        method: "POST",
        body: JSON.stringify({ present: true }),
      });
      await apiFetch(`/biometric/attempts/${input.attemptId}/comparison`, {
        method: "POST",
      });
      const dto = await apiFetch<AttemptResource>(
        `/biometric/attempts/${input.attemptId}/verdict`,
        { method: "POST" },
      );
      const standing = dto.standing.toUpperCase();
      if (standing === "VERIFIED") {
        return { status: "VERIFIED" as const, verdict: "VERIFIED" as const };
      }
      if (standing === "EXPIRED") {
        return { status: "EXPIRED" as const, verdict: "NOT_VERIFIED" as const };
      }
      return {
        status: "NOT_VERIFIED" as const,
        verdict: "NOT_VERIFIED" as const,
      };
    } catch {
      return {
        status: "NOT_VERIFIED" as const,
        verdict: "NOT_VERIFIED" as const,
      };
    }
  }
}
