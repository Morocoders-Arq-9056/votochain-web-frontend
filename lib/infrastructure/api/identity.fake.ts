import type { IdentityPort } from "@/lib/domain/identity/ports";
import type { DocumentVerdict } from "@/lib/domain/identity/document.vo";

export class FakeIdentityAdapter implements IdentityPort {
  constructor(private readonly caso?: string) {}

  async uploadDocument(): Promise<{ verdict: DocumentVerdict }> {
    if (this.caso === "borrosa") return { verdict: "UNREADABLE_BLURRY" };
    if (this.caso === "recortada") return { verdict: "UNREADABLE_CROPPED" };
    if (this.caso === "vencida") return { verdict: "EXPIRED_DOCUMENT" };
    if (this.caso === "nocuincide") return { verdict: "MISMATCH" };
    if (this.caso === "revision") return { verdict: "UNDER_REVIEW" };
    return { verdict: "MATCH" };
  }

  async documentVerdict(): Promise<{ verdict: DocumentVerdict }> {
    if (this.caso === "nocuincide") return { verdict: "MISMATCH" };
    if (this.caso === "revision") return { verdict: "UNDER_REVIEW" };
    return { verdict: "MATCH" };
  }

  async referenceStatus() {
    if (this.caso === "stale") return { status: "STALE" as const };
    if (this.caso === "none") return { status: "NONE" as const };
    if (this.caso === "notverified") {
      return { status: "NOT_VERIFIED" as const };
    }
    return { status: "ACTIVE" as const };
  }

  async enrollReference() {
    return { status: "ACTIVE" as const };
  }

  async startLiveness() {
    return {
      attemptId: "fake-attempt",
      step: "LOOK" as const,
      status: "READY" as const,
    };
  }

  async confirmLiveness() {
    if (this.caso === "noverificado") {
      return { status: "NOT_VERIFIED" as const, verdict: "NOT_VERIFIED" as const };
    }
    if (this.caso === "expirado") {
      return { status: "EXPIRED" as const, verdict: "NOT_VERIFIED" as const };
    }
    return { status: "VERIFIED" as const, verdict: "VERIFIED" as const };
  }
}
