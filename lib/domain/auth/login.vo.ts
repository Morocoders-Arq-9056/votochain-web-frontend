import { z } from "zod";

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1).max(128).optional(),
    proofKind: z.enum(["LOCAL", "OUTSIDE"]),
  })
  .superRefine((value, ctx) => {
    if (value.proofKind === "LOCAL" && !value.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "password required",
      });
    }
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
