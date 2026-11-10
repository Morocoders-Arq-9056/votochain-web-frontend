import { z } from "zod";

export const OtpCodeSchema = z
  .string()
  .length(6)
  .regex(/^\d+$/, "OTP_MUST_BE_DIGITS");

export type OtpCode = z.infer<typeof OtpCodeSchema>;

export const OtpPurposeSchema = z.enum(["email", "recovery", "vote"]);

export type OtpPurpose = z.infer<typeof OtpPurposeSchema>;

export const OtpChallengeSchema = z.object({
  purpose: OtpPurposeSchema,
  expiresInSeconds: z.number().int().nonnegative(),
  attemptsLeft: z.number().int().min(0).max(5),
});

export type OtpChallenge = z.infer<typeof OtpChallengeSchema>;

export const OtpVerifyErrorSchema = z.enum([
  "MISMATCH",
  "EXPIRED",
  "INVALIDATED",
  "LOCKED",
  "UNAVAILABLE",
]);

export type OtpVerifyErrorCode = z.infer<typeof OtpVerifyErrorSchema>;

export type OtpVerifyOutcome =
  | { ok: true }
  | { ok: false; code: OtpVerifyErrorCode };

export function isOtpExpired(challenge: OtpChallenge): boolean {
  return OtpChallengeSchema.parse(challenge).expiresInSeconds <= 0;
}

export function canAttemptOtp(challenge: OtpChallenge): boolean {
  const parsed = OtpChallengeSchema.parse(challenge);
  return parsed.attemptsLeft > 0 && parsed.expiresInSeconds > 0;
}
