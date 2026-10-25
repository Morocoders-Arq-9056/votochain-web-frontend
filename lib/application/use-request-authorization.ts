import {
  canRequestAuthorization,
  type Eligibility,
} from "@/lib/domain/voting/eligibility.vo";

export type AuthorizationRequest = Eligibility;

export async function requestAuthorization(
  input: AuthorizationRequest,
): Promise<{ ok: boolean; motivo: string }> {
  return canRequestAuthorization(input);
}
