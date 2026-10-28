import type { EligibilitySnapshot } from "@/lib/domain/voting/eligibility-snapshot.vo";

/**
 * Presentation of the eligibility snapshot as the P24 checklist. The domain
 * decides eligibility; this module only turns the frozen snapshot into labels
 * and badge tones.
 */

export type CriterionTone = "success" | "warning" | "danger" | "neutral";

export type ChecklistCriterion = {
  id: string;
  question: string;
  met: boolean;
  status: string;
  tone: CriterionTone;
};

export const MEMBERSHIP_QUESTION = "1. ¿Membresía activa?";
export const BIOMETRICS_QUESTION = "2. ¿Biometría fresca?";

export function membershipCriterion(
  snapshot: EligibilitySnapshot,
): ChecklistCriterion {
  const met = snapshot.membershipStanding === "ACTIVE";
  const statusByStanding = {
    ACTIVE: "Sí · Activa",
    DELINQUENT: "No · Moroso",
    SUSPENDED: "No · Suspendida",
  } as const;
  return {
    id: "membership",
    question: MEMBERSHIP_QUESTION,
    met,
    status: statusByStanding[snapshot.membershipStanding],
    tone: met ? "success" : "warning",
  };
}

export function biometricsCriterion(
  snapshot: EligibilitySnapshot,
): ChecklistCriterion {
  return {
    id: "biometrics",
    question: BIOMETRICS_QUESTION,
    met: snapshot.verifiedNow,
    status: snapshot.verifiedNow ? "Sí · Verificado" : "No · Expirado",
    tone: snapshot.verifiedNow ? "success" : "neutral",
  };
}

export function checklistCriteria(
  snapshot: EligibilitySnapshot | undefined,
): ChecklistCriterion[] {
  if (!snapshot) return [];
  return [membershipCriterion(snapshot), biometricsCriterion(snapshot)];
}
