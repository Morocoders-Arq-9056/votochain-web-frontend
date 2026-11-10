import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  proofKind: z.enum(["LOCAL", "OUTSIDE"]),
});

export type LoginCommand = z.infer<typeof LoginSchema>;

export const LoginErrorSchema = z.enum([
  "INVALID_CREDENTIALS",
  "LOCKED",
  "SUSPENDED",
  "PREVIOUS_SESSION",
  "OUTSIDE_NOT_LINKED",
  "NETWORK_UNREACHABLE",
  "UNAVAILABLE",
]);

export type LoginErrorCode = z.infer<typeof LoginErrorSchema>;

export type LoginOutcome =
  | { ok: true; userId: string; personId: string }
  | { ok: false; code: LoginErrorCode };
