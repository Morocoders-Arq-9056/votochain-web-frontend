import type { AuthPort } from "@/lib/domain/auth/ports";
import {
  RegisterSchema,
  type RegisterOutcome,
} from "@/lib/domain/auth/register.vo";

export function createRegisterService(port: AuthPort) {
  return {
    async register(input: unknown): Promise<RegisterOutcome> {
      const parsed = RegisterSchema.safeParse(input);
      if (!parsed.success) {
        const paths = parsed.error.issues.map((issue) => issue.path.join("."));
        if (paths.includes("email")) return { ok: false, code: "INVALID_EMAIL" };
        if (paths.includes("password"))
          return { ok: false, code: "INVALID_PASSWORD" };
        if (
          parsed.error.issues.some((issue) => issue.code === "custom") &&
          !("acceptedPolicyVersion" in (input as object))
        ) {
          return { ok: false, code: "TERMS_REQUIRED" };
        }
        const termsMissing =
          typeof input === "object" &&
          input !== null &&
          (input as { acceptedPolicyVersion?: string }).acceptedPolicyVersion ===
            "";
        if (termsMissing) return { ok: false, code: "TERMS_REQUIRED" };
        return { ok: false, code: "INVALID_EMAIL" };
      }
      if (!parsed.data.acceptedPolicyVersion) {
        return { ok: false, code: "TERMS_REQUIRED" };
      }
      return port.register(parsed.data);
    },
  };
}
