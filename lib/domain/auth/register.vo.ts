import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  acceptedPolicyVersion: z.string().min(1),
});

export type RegisterCommand = z.infer<typeof RegisterSchema>;

export const RegisterErrorSchema = z.enum([
  "INVALID_EMAIL",
  "DUPLICATE",
  "TERMS_REQUIRED",
  "UNAVAILABLE",
]);

export type RegisterErrorCode = z.infer<typeof RegisterErrorSchema>;

export type RegisterOutcome =
  | { ok: true; email: string; personId: string }
  | { ok: false; code: RegisterErrorCode };
