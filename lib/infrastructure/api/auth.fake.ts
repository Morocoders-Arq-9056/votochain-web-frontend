import type { AuthPort } from "@/lib/domain/auth/ports";
import type { LoginCommand, LoginOutcome } from "@/lib/domain/auth/login.vo";
import type {
  RegisterCommand,
  RegisterOutcome,
} from "@/lib/domain/auth/register.vo";

export class FakeAuthAdapter implements AuthPort {
  constructor(private readonly caso?: string) {}

  async register(command: RegisterCommand): Promise<RegisterOutcome> {
    if (command.email.includes("duplicado")) {
      return { ok: false, code: "DUPLICATE" };
    }
    if (!command.acceptedPolicyVersion) {
      return { ok: false, code: "TERMS_REQUIRED" };
    }
    return { ok: true, email: command.email, personId: "per-fake" };
  }

  async login(command: LoginCommand): Promise<LoginOutcome> {
    if (this.caso === "bloqueo" || command.email.includes("bloqueo")) {
      return { ok: false, code: "LOCKED" };
    }
    if (this.caso === "suspendida" || command.email.includes("suspendida")) {
      return { ok: false, code: "SUSPENDED" };
    }
    if (this.caso === "sesion" || command.email.includes("sesion")) {
      return { ok: false, code: "PREVIOUS_SESSION" };
    }
    if (
      command.proofKind === "LOCAL" &&
      (this.caso === "fallida" ||
        command.email.includes("incorrecta") ||
        command.password === "incorrecta")
    ) {
      return { ok: false, code: "INVALID_CREDENTIALS" };
    }
    if (
      command.proofKind === "OUTSIDE" &&
      (this.caso === "fallida" || command.email.includes("incorrecta"))
    ) {
      return { ok: false, code: "INVALID_CREDENTIALS" };
    }
    if (
      command.proofKind === "OUTSIDE" &&
      (this.caso === "sinvinculo" || command.email.includes("sinvinculo"))
    ) {
      return { ok: false, code: "OUTSIDE_NOT_LINKED" };
    }
    return { ok: true, userId: "fake-user-id", personId: "per-fake" };
  }

  async requestPasswordRecovery(): Promise<{ ok: boolean }> {
    return { ok: true };
  }

  async changePassword(): Promise<{ ok: boolean }> {
    if (this.caso === "fallida") {
      return { ok: false };
    }
    return { ok: true };
  }

  async signOut(): Promise<void> {}
}
