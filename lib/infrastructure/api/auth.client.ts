import type { AuthPort } from "@/lib/domain/auth/ports";
import type {
  LoginCommand,
  LoginOutcome,
} from "@/lib/domain/auth/login.vo";
import type {
  RegisterCommand,
  RegisterOutcome,
} from "@/lib/domain/auth/register.vo";
import { UserResourceSchema } from "@/lib/domain/auth/user.vo";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";
import {
  toLoginErrorCode,
  toRegisterErrorCode,
} from "@/lib/infrastructure/api/access-error-mapping";

export class HttpAuthAdapter implements AuthPort {
  async register(command: RegisterCommand): Promise<RegisterOutcome> {
    try {
      const raw = await apiFetch<unknown>("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ email: command.email, password: command.password }),
      });
      const user = UserResourceSchema.parse(raw);
      return { ok: true, email: user.email, personId: user.personId };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          ok: false,
          code: toRegisterErrorCode(error.status, error.backendMessage),
        };
      }
      return { ok: false, code: "UNAVAILABLE" };
    }
  }

  async login(command: LoginCommand): Promise<LoginOutcome> {
    try {
      const body =
        command.proofKind === "LOCAL"
          ? { email: command.email, password: command.password }
          : { email: command.email, proofKind: command.proofKind };
      const raw = await apiFetch<unknown>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const user = UserResourceSchema.parse(raw);
      if (user.standing === "SUSPENDED") {
        return { ok: false, code: "SUSPENDED" };
      }
      return { ok: true, userId: user.userId, personId: user.personId };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          ok: false,
          code: toLoginErrorCode(error.status, error.backendMessage),
        };
      }
      return { ok: false, code: "UNAVAILABLE" };
    }
  }

  async requestPasswordRecovery(email: string): Promise<{ ok: boolean }> {
    try {
      await apiFetch("/challenges/by-email", {
        method: "POST",
        body: JSON.stringify({ email, purpose: "password-reset" }),
      });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }

  async changePassword(
    userId: string,
    newSecret: string,
  ): Promise<{ ok: boolean }> {
    try {
      await apiFetch(`/users/${userId}/secret`, {
        method: "PATCH",
        body: JSON.stringify({ newSecret }),
      });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }

  async signOut(email: string): Promise<void> {
    await apiFetch("/auth/sign-out", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).catch(() => undefined);
  }
}
