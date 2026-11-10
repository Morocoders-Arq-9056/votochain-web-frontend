import type { AuthPort } from "@/lib/domain/auth/ports";
import { LoginSchema, type LoginOutcome } from "@/lib/domain/auth/login.vo";

export function createLoginService(port: AuthPort) {
  return {
    async login(input: unknown): Promise<LoginOutcome> {
      const parsed = LoginSchema.safeParse(input);
      if (!parsed.success) {
        return { ok: false, code: "INVALID_CREDENTIALS" };
      }
      return port.login(parsed.data);
    },
  };
}
