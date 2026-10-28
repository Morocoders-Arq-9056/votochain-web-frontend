import { describe, expect, it } from "vitest";
import {
  biometricsCriterion,
  checklistCriteria,
  membershipCriterion,
} from "./checklist";

const active = {
  membershipStanding: "ACTIVE" as const,
  verifiedNow: true,
  communityStanding: "ACTIVE" as const,
};

describe("checklist", () => {
  it("membresía activa: conocida y con tono success", () => {
    const criterion = membershipCriterion(active);

    expect(criterion.question).toBe("1. ¿Membresía activa?");
    expect(criterion.met).toBe(true);
    expect(criterion.status).toBe("Sí · Activa");
    expect(criterion.tone).toBe("success");
  });

  it("membresía morosa: no cumplida y con tono warning", () => {
    const criterion = membershipCriterion({
      ...active,
      membershipStanding: "DELINQUENT",
    });

    expect(criterion.met).toBe(false);
    expect(criterion.status).toBe("No · Moroso");
    expect(criterion.tone).toBe("warning");
  });

  it("biometría fresca: verificada", () => {
    const criterion = biometricsCriterion(active);

    expect(criterion.question).toBe("2. ¿Biometría fresca?");
    expect(criterion.met).toBe(true);
    expect(criterion.tone).toBe("success");
  });

  it("biometría no fresca: neutral y pide prueba de vida", () => {
    const criterion = biometricsCriterion({ ...active, verifiedNow: false });

    expect(criterion.met).toBe(false);
    expect(criterion.status).toBe("No · Expirado");
    expect(criterion.tone).toBe("neutral");
  });

  it("el checklist tiene los dos criterios, en orden", () => {
    const criteria = checklistCriteria(active);

    expect(criteria.map((c) => c.id)).toEqual(["membership", "biometrics"]);
  });
});
