import type { AuthorizationFacts } from "@/lib/domain/voting/authorization-facts.vo";
import type { AuthorizationPort } from "@/lib/domain/voting/ports";

/**
 * Prototype adapter (F7 swaps it for the real `POST /authorizations` client).
 * It reports FACTS only — the eligibility snapshot and the state of the
 * authorization. The domain decides what those facts mean.
 */
export class FakeAuthorizationAdapter implements AuthorizationPort {
  constructor(private readonly caso?: string) {}

  async request(): Promise<AuthorizationFacts> {
    switch (this.caso) {
      case "mora":
        return {
          snapshot: {
            membershipStanding: "DELINQUENT",
            verifiedNow: true,
            communityStanding: "ACTIVE",
          },
          authorizationState: "DENIED",
        };
      case "noverificado":
        return {
          snapshot: {
            membershipStanding: "ACTIVE",
            verifiedNow: false,
            communityStanding: "ACTIVE",
          },
          authorizationState: "DENIED",
        };
      case "expirada":
        return {
          snapshot: {
            membershipStanding: "ACTIVE",
            verifiedNow: true,
            communityStanding: "ACTIVE",
          },
          authorizationState: "EXPIRED",
        };
      default:
        return {
          snapshot: {
            membershipStanding: "ACTIVE",
            verifiedNow: true,
            communityStanding: "ACTIVE",
          },
          authorizationState: "GRANTED",
          authorization: {
            code: "AUT-4821-0212",
            validUntil: "10:05 PET (UTC−5)",
          },
        };
    }
  }
}
