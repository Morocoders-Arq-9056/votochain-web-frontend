import { z } from "zod";

/**
 * Vote authorization — granted by Voting BC UC3. One single use, short
 * validity; it freezes the eligibility and the biometric verdict at that
 * instant.
 */
export const VoteAuthorizationSchema = z.object({
  code: z.string().min(1),
  validUntil: z.string().min(1),
});

export type VoteAuthorization = z.infer<typeof VoteAuthorizationSchema>;

export const AuthorizationOutcomeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("AUTHORIZED"), authorization: VoteAuthorizationSchema }),
  z.object({ kind: z.literal("DENIED"), reason: z.string().min(1) }),
  z.object({ kind: z.literal("EXPIRED") }),
]);

export type AuthorizationOutcome = z.infer<typeof AuthorizationOutcomeSchema>;
