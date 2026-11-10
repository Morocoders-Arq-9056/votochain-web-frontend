import {
  canRequestAuthorization,
  type EligibilitySnapshot,
} from "@/lib/domain/voting/eligibility-snapshot.vo";
import type { AuthorizationPort } from "@/lib/domain/voting/ports";
import type { AuthorizationOutcome } from "@/lib/domain/voting/vote-authorization.vo";

export type AuthorizationServiceResult = {
  outcome: AuthorizationOutcome;
  snapshot?: EligibilitySnapshot;
};

/**
 * Application service (Voting BC, UC3). It orchestrates: it asks the port for
 * the frozen facts and lets the domain decide. It holds no business rules of
 * its own.
 */
export function createRequestAuthorizationService(port: AuthorizationPort) {
  return {
    async request(input: {
      proposalId: string;
      personId: string;
    }): Promise<AuthorizationServiceResult> {
      const facts = await port.request(input);

      if (facts.snapshot) {
        const decision = canRequestAuthorization(facts.snapshot);
        if (!decision.ok) {
          return {
            outcome: { kind: "DENIED", reason: decision.reason },
            snapshot: facts.snapshot,
          };
        }
      }

      if (facts.authorizationState === "EXPIRED" || !facts.authorization) {
        return {
          outcome: { kind: "EXPIRED" },
          snapshot: facts.snapshot,
        };
      }
      if (facts.authorizationState === "DENIED") {
        return {
          outcome: {
            kind: "DENIED",
            reason: facts.denialReason ?? "No se emitió ninguna autorización.",
          },
          snapshot: facts.snapshot,
        };
      }
      return {
        outcome: { kind: "AUTHORIZED", authorization: facts.authorization },
        snapshot: facts.snapshot,
      };
    },
  };
}
