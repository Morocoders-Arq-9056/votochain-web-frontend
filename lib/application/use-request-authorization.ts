import {
  canRequestAuthorization,
  type Eligibility,
  type EligibilityDecision,
} from "@/lib/domain/voting/eligibility.vo";

export type AuthorizationRequest = Eligibility;

export async function requestAuthorization(
  input: AuthorizationRequest,
): Promise<EligibilityDecision> {
  return canRequestAuthorization(input);
}
