import { describe, expect, it, vi } from "vitest";
import { createRequestAuthorizationService } from "./request-authorization";
import type { AuthorizationFacts } from "@/lib/domain/voting/authorization-facts.vo";
import type { AuthorizationPort } from "@/lib/domain/voting/ports";

const activeSnapshot = {
  membershipStanding: "ACTIVE" as const,
  verifiedNow: true,
  communityStanding: "ACTIVE" as const,
};

function portWith(facts: AuthorizationFacts): AuthorizationPort {
  return { request: vi.fn(async () => facts) };
}

describe("createRequestAuthorizationService", () => {
  it("otorga la autorización cuando la elegibilidad lo permite", async () => {
    const service = createRequestAuthorizationService(
      portWith({
        snapshot: activeSnapshot,
        authorizationState: "GRANTED",
        authorization: { code: "AUT-1", validUntil: "10:05 PET (UTC−5)" },
      }),
    );

    const { outcome } = await service.request({ proposalId: "p-1", personId: "per-1" });

    expect(outcome).toEqual({
      kind: "AUTHORIZED",
      authorization: { code: "AUT-1", validUntil: "10:05 PET (UTC−5)" },
    });
  });

  it("deniega con el motivo del dominio cuando la membresía no está activa", async () => {
    const service = createRequestAuthorizationService(
      portWith({
        snapshot: { ...activeSnapshot, membershipStanding: "DELINQUENT" },
        authorizationState: "DENIED",
      }),
    );

    const { outcome } = await service.request({ proposalId: "p-1", personId: "per-1" });

    expect(outcome.kind).toBe("DENIED");
    if (outcome.kind === "DENIED") {
      expect(outcome.reason).toMatch(/Membresía/);
    }
  });

  it("informa la expiración cuando la autorización venció", async () => {
    const service = createRequestAuthorizationService(
      portWith({ snapshot: activeSnapshot, authorizationState: "EXPIRED" }),
    );

    const { outcome } = await service.request({ proposalId: "p-1", personId: "per-1" });

    expect(outcome).toEqual({ kind: "EXPIRED" });
  });

  it("devuelve el snapshot congelado junto a la decisión", async () => {
    const service = createRequestAuthorizationService(
      portWith({ snapshot: activeSnapshot, authorizationState: "EXPIRED" }),
    );

    const { snapshot } = await service.request({ proposalId: "p-1", personId: "per-1" });

    expect(snapshot).toEqual(activeSnapshot);
  });
});
