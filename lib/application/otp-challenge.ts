import type { OtpPort, OtpRequest, OtpVerify } from "@/lib/domain/otp/ports";
import {
  OtpCodeSchema,
  OtpPurposeSchema,
  type OtpChallenge,
  type OtpVerifyOutcome,
} from "@/lib/domain/otp/otp.vo";

export function createOtpService(port: OtpPort) {
  return {
    async request(
      input: { purpose: unknown } & {
        personId?: unknown;
        email?: unknown;
      },
    ): Promise<OtpChallenge> {
      const base = { purpose: OtpPurposeSchema.parse(input.purpose) };
      const request: OtpRequest =
        "personId" in input && input.personId
          ? { ...base, personId: String(input.personId) }
          : { ...base, email: String((input as { email?: unknown }).email ?? "") };
      return port.request(request);
    },
    async verify(
      input: { purpose: unknown; code: unknown } & {
        personId?: unknown;
        email?: unknown;
      },
    ): Promise<OtpVerifyOutcome> {
      const parsedPurpose = OtpPurposeSchema.parse(input.purpose);
      const parsedCode = OtpCodeSchema.safeParse(input.code);
      if (!parsedCode.success) {
        return { ok: false, code: "MISMATCH" };
      }
      const base = { purpose: parsedPurpose, code: parsedCode.data };
      const verify: OtpVerify =
        "personId" in input && input.personId
          ? { ...base, personId: String(input.personId) }
          : { ...base, email: String((input as { email?: unknown }).email ?? "") };
      return port.verify(verify);
    },
    async resetSecret(input: {
      purpose: unknown;
      newSecret: unknown;
      personId?: unknown;
      email?: unknown;
    }): Promise<{ ok: boolean }> {
      if (OtpPurposeSchema.parse(input.purpose) !== "recovery") {
        return { ok: false };
      }
      if (typeof input.newSecret !== "string" || !input.newSecret) {
        return { ok: false };
      }
      const reset =
        "personId" in input && input.personId
          ? {
              purpose: "recovery" as const,
              personId: String(input.personId),
              newSecret: input.newSecret,
            }
          : {
              purpose: "recovery" as const,
              email: String((input as { email?: unknown }).email ?? ""),
              newSecret: input.newSecret,
            };
      return port.resetSecret(reset);
    },
  };
}
