import { describe, expect, it } from "vitest";
import { canRequestAuthorization } from "./eligibility-snapshot.vo";

describe("canRequestAuthorization", () => {
  it("ACTIVE + verified → ok", () => {
    expect(
      canRequestAuthorization({
        membershipStanding: "ACTIVE",
        verifiedNow: true,
        communityStanding: "ACTIVE",
      }).ok,
    ).toBe(true);
  });

  it("moroso → motivo", () => {
    const decision = canRequestAuthorization({
      membershipStanding: "DELINQUENT",
      verifiedNow: true,
      communityStanding: "ACTIVE",
    });
    expect(decision.ok).toBe(false);
    expect(decision.reason).toMatch(/Membresía/);
  });

  it("no verificado → pide rostro", () => {
    expect(
      canRequestAuthorization({
        membershipStanding: "ACTIVE",
        verifiedNow: false,
        communityStanding: "ACTIVE",
      }),
    ).toEqual({ ok: false, reason: "Necesita verificar su rostro ahora" });
  });

  it("comunidad suspendida → motivo", () => {
    expect(
      canRequestAuthorization({
        membershipStanding: "ACTIVE",
        verifiedNow: true,
        communityStanding: "SUSPENDED",
      }).ok,
    ).toBe(false);
  });
});
