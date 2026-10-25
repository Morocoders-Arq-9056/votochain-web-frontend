import { z } from "zod";

export const VerificationVerdictSchema = z.enum(["VERIFIED", "NOT_VERIFIED"]);

export type VerificationVerdict = z.infer<typeof VerificationVerdictSchema>;

export const IdentityVerificationSchema = z.object({
  verdict: VerificationVerdictSchema,
  fresh: z.boolean(),
});

export function isVerifiedNow(
  v: z.infer<typeof IdentityVerificationSchema>,
): boolean {
  const parsed = IdentityVerificationSchema.parse(v);
  return parsed.verdict === "VERIFIED" && parsed.fresh;
}
