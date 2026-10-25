import { z } from "zod";

export const EligibilitySchema = z.object({
  membershipStanding: z.enum(["ACTIVE", "DELINQUENT", "SUSPENDED"]),
  verifiedNow: z.boolean(),
  communityStanding: z.enum(["ACTIVE", "SUSPENDED"]),
});

export type Eligibility = z.infer<typeof EligibilitySchema>;

export function canRequestAuthorization(
  input: Eligibility,
): { ok: true; motivo: string } | { ok: false; motivo: string } {
  const parsed = EligibilitySchema.parse(input);
  if (parsed.communityStanding !== "ACTIVE") {
    return { ok: false, motivo: "Comunidad suspendida" };
  }
  if (parsed.membershipStanding !== "ACTIVE") {
    return { ok: false, motivo: "Membresía no activa" };
  }
  if (!parsed.verifiedNow) {
    return { ok: false, motivo: "Necesita verificar su rostro ahora" };
  }
  return { ok: true, motivo: "Elegible para solicitar autorización" };
}
