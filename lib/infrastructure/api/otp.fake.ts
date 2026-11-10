import type { OtpPort, OtpRequest, OtpVerify } from "@/lib/domain/otp/ports";
import type {
  OtpChallenge,
  OtpVerifyOutcome,
} from "@/lib/domain/otp/otp.vo";

export class FakeOtpAdapter implements OtpPort {
  constructor(private readonly caso?: string) {}

  async request(input: OtpRequest): Promise<OtpChallenge> {
    return { purpose: input.purpose, expiresInSeconds: 300, attemptsLeft: 5 };
  }

  async verify(input: OtpVerify): Promise<OtpVerifyOutcome> {
    const code = input.code;
    if (this.caso === "expirado" || code === "000000") {
      return { ok: false, code: "EXPIRED" };
    }
    if (this.caso === "invalidado" || code === "111111") {
      return { ok: false, code: "INVALIDATED" };
    }
    if (this.caso === "bloqueado" || code === "999999") {
      return { ok: false, code: "LOCKED" };
    }
    if (code === "123456" || this.caso === "confirmado") {
      return { ok: true };
    }
    return { ok: false, code: "MISMATCH" };
  }

  async resetSecret(): Promise<{ ok: boolean }> {
    if (this.caso === "fallida") {
      return { ok: false };
    }
    return { ok: true };
  }
}
