import { z } from "zod";

export const EligibilitySchema = z.object({
  membershipStanding: z.enum(["ACTIVE", "DELINQUENT", "SUSPENDED"]),
  verifiedNow: z.boolean(),
  communityStanding: z.enum(["ACTIVE", "SUSPENDED"]),
});

export type Eligibility = z.infer<typeof EligibilitySchema>;

export type EligibilityDecision =
  | { ok: true; reason: string }
  | { ok: false; reason: string };

export function canRequestAuthorization(
  input: Eligibility,
): EligibilityDecision {
  const parsed = EligibilitySchema.parse(input);
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
