import type { AuthPort } from "@/lib/domain/auth/ports";
import type { IdentityPort } from "@/lib/domain/identity/ports";
import type { MembershipPort } from "@/lib/domain/membership/ports";
import type { OtpPort } from "@/lib/domain/otp/ports";
import { FakeAuthAdapter } from "@/lib/infrastructure/api/auth.fake";
import { HttpAuthAdapter } from "@/lib/infrastructure/api/auth.client";
import { FakeIdentityAdapter } from "@/lib/infrastructure/api/identity.fake";
import { HttpIdentityAdapter } from "@/lib/infrastructure/api/identity.client";
import { FakeMembershipAdapter } from "@/lib/infrastructure/api/membership.fake";
import { FakeOtpAdapter } from "@/lib/infrastructure/api/otp.fake";
import { HttpOtpAdapter } from "@/lib/infrastructure/api/otp.client";
import type { AuthorizationPort, TallyPort } from "@/lib/domain/voting/ports";
import type { VoteDeliveryPort } from "@/lib/domain/voting/ports";
import { FakeTallyAdapter } from "@/lib/infrastructure/api/tally.fake";
import { HttpTallyAdapter } from "@/lib/infrastructure/api/tally.client";
import { FakeAuthorizationAdapter } from "@/lib/infrastructure/api/authorization.fake";
import { VotingAuthorizationAdapter } from "@/lib/infrastructure/api/authorization.client";
import { FakeVotingDeliveryAdapter } from "@/lib/infrastructure/api/voting.fake";
import { VotingDeliveryAdapter } from "@/lib/infrastructure/api/voting.client";
import { env } from "@/lib/infrastructure/env";

/**
 * Composition root: the single place where the application layer is wired to
 * concrete adapters.
 *
 * `USE_MOCK_API=false` (default, see lib/infrastructure/env.ts) talks to the
 * real backend. Set `USE_MOCK_API=true` to run the UI prototype on in-memory
 * Fake adapters without a backend.
 */
export function voteDeliveryPort(): VoteDeliveryPort {
  return env.USE_MOCK_API
    ? new FakeVotingDeliveryAdapter()
    : new VotingDeliveryAdapter();
}

export function authorizationPort(caso?: string): AuthorizationPort {
  if (caso) return new FakeAuthorizationAdapter(caso);
  return env.USE_MOCK_API
    ? new FakeAuthorizationAdapter()
    : new VotingAuthorizationAdapter();
}

export function authPort(caso?: string): AuthPort {
  if (caso) return new FakeAuthAdapter(caso);
  return env.USE_MOCK_API ? new FakeAuthAdapter() : new HttpAuthAdapter();
}

export function otpPort(caso?: string): OtpPort {
  if (caso) return new FakeOtpAdapter(caso);
  return env.USE_MOCK_API ? new FakeOtpAdapter() : new HttpOtpAdapter();
}

export function identityPort(caso?: string): IdentityPort {
  if (caso) return new FakeIdentityAdapter(caso);
  return env.USE_MOCK_API
    ? new FakeIdentityAdapter()
    : new HttpIdentityAdapter();
}

export function membershipPort(): MembershipPort {
  return new FakeMembershipAdapter();
}

export function tallyPort(): TallyPort {
  return env.USE_MOCK_API ? new FakeTallyAdapter() : new HttpTallyAdapter();
}
