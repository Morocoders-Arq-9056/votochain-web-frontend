import type { LoginCommand, LoginOutcome } from "./login.vo";
import type { RegisterCommand, RegisterOutcome } from "./register.vo";

export interface AuthPort {
  register(command: RegisterCommand): Promise<RegisterOutcome>;
  login(command: LoginCommand): Promise<LoginOutcome>;
  requestPasswordRecovery(email: string): Promise<{ ok: boolean }>;
  changePassword(userId: string, newSecret: string): Promise<{ ok: boolean }>;
  signOut(email: string): Promise<void>;
}
