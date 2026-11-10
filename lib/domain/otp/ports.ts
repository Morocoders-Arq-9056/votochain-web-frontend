import type {
  OtpChallenge,
  OtpPurpose,
  OtpVerifyOutcome,
} from "./otp.vo";

export type OtpIdentity =
  | { personId: string; email?: never }
  | { personId?: never; email: string };

export type OtpRequest = OtpIdentity & { purpose: OtpPurpose };

export type OtpVerify = OtpIdentity & { purpose: OtpPurpose; code: string };

export type OtpReset = OtpIdentity & {
  purpose: Extract<OtpPurpose, "recovery">;
  newSecret: string;
};

export interface OtpPort {
  request(input: OtpRequest): Promise<OtpChallenge>;
  verify(input: OtpVerify): Promise<OtpVerifyOutcome>;
  resetSecret(input: OtpReset): Promise<{ ok: boolean }>;
}
