import { z } from "zod";
import type { EligibilitySnapshot } from "@/lib/domain/voting/eligibility-snapshot.vo";
import { VoteAuthorizationSchema } from "@/lib/domain/voting/vote-authorization.vo";

/**
 * Facts reported by the authorization port. The port reports what happened;
 * the domain decides what it means. The snapshot is optional: the Voting BC
 * freezes it internally and the authorization endpoint does not expose it.
 */
export const AuthorizationFactsSchema = z.object({
  snapshot: z
    .object({
      membershipStanding: z.enum(["ACTIVE", "DELINQUENT", "SUSPENDED"]),
      verifiedNow: z.boolean(),
      communityStanding: z.enum(["ACTIVE", "SUSPENDED"]),
    })
    .optional(),
  authorizationState: z.enum(["GRANTED", "EXPIRED", "DENIED"]),
  authorization: VoteAuthorizationSchema.optional(),
  denialReason: z.string().min(1).optional(),
});

export type AuthorizationFacts = z.infer<typeof AuthorizationFactsSchema>;
export type { EligibilitySnapshot };
