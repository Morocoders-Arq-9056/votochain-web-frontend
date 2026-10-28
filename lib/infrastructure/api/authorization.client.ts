import type { AuthorizationFacts } from "@/lib/domain/voting/authorization-facts.vo";
import type { AuthorizationPort } from "@/lib/domain/voting/ports";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";
import { formatPetDateTime } from "@/lib/ui/datetime";

/**
 * Wire shape of the Voting BC (`AuthorizationResource`). It never leaves
 * infrastructure.
 */
export type AuthorizationResource = {
  authorizationId: string;
  proposalId: string;
  voterAddress: string;
  status: string;
  expiresAt: string;
};

/**
 * Adapter for Voting BC UC3 (`POST /authorizations`). The backend is
 * authoritative: it freezes eligibility and the biometric verdict, then grants
 * or denies. The client reports the facts; the domain decides what they mean.
 */
export class VotingAuthorizationAdapter implements AuthorizationPort {
  async request(proposalId: string): Promise<AuthorizationFacts> {
    let dto: AuthorizationResource;
    try {
      dto = await apiFetch<AuthorizationResource>("/authorizations", {
        method: "POST",
        body: JSON.stringify({
          proposalId,
          voterAddress: "0x0000000000000000000000000000000000000000",
          personId: "persona-demo",
        }),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        return {
          authorizationState: "DENIED",
          denialReason:
            "Ya tiene una autorización pendiente para esta propuesta.",
        };
      }
      if (error instanceof ApiError && error.status === 410) {
        return { authorizationState: "EXPIRED" };
      }
      throw error;
    }

    const status = dto.status.toUpperCase();
    if (status === "DENIED") {
      return {
        authorizationState: "DENIED",
        denialReason: "No se emitió ninguna autorización.",
      };
    }
    if (status === "EXPIRED" || status === "CONSUMED") {
      return { authorizationState: "EXPIRED" };
    }
    return {
      authorizationState: "GRANTED",
      authorization: {
        code: dto.authorizationId,
        validUntil: formatPetDateTime(dto.expiresAt),
      },
    };
  }
}
