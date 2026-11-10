import type { OtpPort, OtpRequest, OtpVerify } from "@/lib/domain/otp/ports";
import type {
  OtpChallenge,
  OtpPurpose,
  OtpVerifyOutcome,
} from "@/lib/domain/otp/otp.vo";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";
import { toOtpVerifyErrorCode } from "@/lib/infrastructure/api/access-error-mapping";

/**
 * Wire shape of the Verification BC (`ChallengeResource`). It never leaves
 * infrastructure.
 */
export type ChallengeResource = {
  challengeId: string;
  personId: string;
  purpose: string;
  standing: string;
  attempts: number;
  maxAttempts: number;
  remaining: number;
  requestedAt: string;
  expiresAt: string;
  reason: string | null;
};

/**
 * Front purposes to backend closed purposes (`Purpose` value object:
 * login | email-verification | password-reset).
 */
const PURPOSE_MAP: Record<OtpPurpose, string> = {
  email: "email-verification",
  recovery: "password-reset",
  vote: "login",
};

function toOtpChallenge(
  purpose: OtpPurpose,
  dto: ChallengeResource,
): OtpChallenge {
  const expiresInSeconds = Math.max(
    0,
    Math.round((new Date(dto.expiresAt).getTime() - Date.now()) / 1000),
  );
  return {
    purpose,
    expiresInSeconds,
    attemptsLeft: Math.min(dto.remaining, 5),
  };
}

function historyQuery(input: OtpVerify): string {
  const purpose = PURPOSE_MAP[input.purpose];
  if ("personId" in input && input.personId) {
    return `/challenges?personId=${encodeURIComponent(input.personId)}&purpose=${encodeURIComponent(purpose)}`;
  }
  return `/challenges?email=${encodeURIComponent((input as { email: string }).email)}&purpose=${encodeURIComponent(purpose)}`;
}

function latestOpen(history: ChallengeResource[]): ChallengeResource | undefined {
  return history
    .filter((c) => c.standing === "OPEN")
    .sort((a, b) => +new Date(b.requestedAt) - +new Date(a.requestedAt))[0];
}

function latestConfirmed(history: ChallengeResource[]): ChallengeResource | undefined {
  return history
    .filter((c) => c.standing === "CONFIRMED")
    .sort((a, b) => +new Date(b.requestedAt) - +new Date(a.requestedAt))[0];
}

export class HttpOtpAdapter implements OtpPort {
  async request(input: OtpRequest): Promise<OtpChallenge> {
    try {
      const purpose = PURPOSE_MAP[input.purpose];
      const dto =
        "personId" in input && input.personId
          ? await apiFetch<ChallengeResource>(`/challenges`, {
              method: "POST",
              body: JSON.stringify({ personId: input.personId, purpose }),
            })
          : await apiFetch<ChallengeResource>(`/challenges/by-email`, {
              method: "POST",
              body: JSON.stringify({
                email: (input as { email: string }).email,
                purpose,
              }),
            });
      return toOtpChallenge(input.purpose, dto);
    } catch {
      return { purpose: input.purpose, expiresInSeconds: 300, attemptsLeft: 5 };
    }
  }

  async verify(input: OtpVerify): Promise<OtpVerifyOutcome> {
    try {
      const history = await apiFetch<ChallengeResource[]>(historyQuery(input));
      const open = latestOpen(history);
      if (!open) {
        return { ok: false, code: "INVALIDATED" };
      }
      await apiFetch(`/challenges/${open.challengeId}/answers`, {
        method: "POST",
        body: JSON.stringify({ code: input.code }),
      });
      return { ok: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          ok: false,
          code: toOtpVerifyErrorCode(error.status, error.backendMessage),
        };
      }
      return { ok: false, code: "UNAVAILABLE" };
    }
  }

  async resetSecret(input: {
    personId?: string;
    email?: string;
    purpose: OtpPurpose;
    newSecret: string;
  }): Promise<{ ok: boolean }> {
    try {
      const purpose = PURPOSE_MAP[input.purpose];
      const query =
        input.personId != null && input.personId !== ""
          ? `/challenges?personId=${encodeURIComponent(input.personId)}&purpose=${encodeURIComponent(purpose)}`
          : `/challenges?email=${encodeURIComponent(input.email ?? "")}&purpose=${encodeURIComponent(purpose)}`;
      const history = await apiFetch<ChallengeResource[]>(query);
      const confirmed = latestConfirmed(history);
      if (!confirmed) return { ok: false };
      await apiFetch(`/challenges/${confirmed.challengeId}/secret`, {
        method: "POST",
        body: JSON.stringify({ newSecret: input.newSecret }),
      });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
}
