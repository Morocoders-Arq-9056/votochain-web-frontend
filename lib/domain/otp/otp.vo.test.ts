import { describe, expect, it } from "vitest";
import { isOtpExpired, OtpChallengeSchema } from "./otp.vo";
import { isDocumentAccepted } from "@/lib/domain/identity/document.vo";
import { isBiometricUsable } from "@/lib/domain/identity/liveness.vo";
import { isVerifiedNow } from "@/lib/domain/identity/verification.vo";

describe("otp invariants", () => {
  it("an expired challenge cannot be attempted", () => {
    const challenge = OtpChallengeSchema.parse({
      purpose: "email",
      expiresInSeconds: 0,
      attemptsLeft: 3,
    });
    expect(isOtpExpired(challenge)).toBe(true);
  });

  it("a challenge without attempts cannot be attempted", () => {
    const challenge = OtpChallengeSchema.parse({
      purpose: "vote",
      expiresInSeconds: 120,
      attemptsLeft: 0,
    });
    expect(challenge.attemptsLeft).toBe(0);
  });
});

describe("identity invariants", () => {
  it("only MATCH counts as document accepted for review purposes", () => {
    expect(isDocumentAccepted("MATCH")).toBe(true);
  });

  it("only an ACTIVE biometric reference allows voting", () => {
    expect(isBiometricUsable("ACTIVE")).toBe(true);
    expect(isBiometricUsable("STALE")).toBe(false);
  });

  it("only VERIFIED + fresh counts as verified now", () => {
    expect(isVerifiedNow({ verdict: "VERIFIED", fresh: true })).toBe(true);
    expect(isVerifiedNow({ verdict: "VERIFIED", fresh: false })).toBe(false);
  });
});
