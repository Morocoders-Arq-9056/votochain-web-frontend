import { z } from "zod";

/**
 * Eligibility snapshot — frozen by Voting BC UC3 when an authorization is
 * granted. Never rewritten by later changes.
 */
export const EligibilitySnapshotSchema = z.object({
  membershipStanding: z.enum(["ACTIVE", "DELINQUENT", "SUSPENDED"]),
  verifiedNow: z.boolean(),
  communityStanding: z.enum(["ACTIVE", "SUSPENDED"]),
});

export type EligibilitySnapshot = z.infer<typeof EligibilitySnapshotSchema>;

export type EligibilityDecision =
  | { ok: true; reason: string }
  | { ok: false; reason: string };

export function canRequestAuthorization(
  snapshot: EligibilitySnapshot,
): EligibilityDecision {
  const parsed = EligibilitySnapshotSchema.parse(snapshot);
  if (parsed.communityStanding !== "ACTIVE") {
    return { ok: false, reason: "Comunidad suspendida" };
  }
  if (parsed.membershipStanding !== "ACTIVE") {
    return { ok: false, reason: "Membresía no activa" };
  }
  if (!parsed.verifiedNow) {
    return { ok: false, reason: "Necesita verificar su rostro ahora" };
  }
  return { ok: true, reason: "Elegible para solicitar autorización" };
}
