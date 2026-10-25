import { describe, expect, it } from "vitest";
import { canRequestAuthorization } from "./eligibility.vo";

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
    const r = canRequestAuthorization({
      membershipStanding: "DELINQUENT",
      verifiedNow: true,
      communityStanding: "ACTIVE",
    });
    expect(r.ok).toBe(false);
    expect(r.motivo).toMatch(/Membresía/);
  });

  it("no verificado → pide rostro", () => {
    const r = canRequestAuthorization({
      membershipStanding: "ACTIVE",
      verifiedNow: false,
      communityStanding: "ACTIVE",
    });
    expect(r).toEqual({ ok: false, motivo: "Necesita verificar su rostro ahora" });
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
