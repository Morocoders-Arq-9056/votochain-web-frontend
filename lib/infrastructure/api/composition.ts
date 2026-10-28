import { FakeAuthorizationAdapter } from "@/lib/infrastructure/api/authorization.fake";
import { VotingAuthorizationAdapter } from "@/lib/infrastructure/api/authorization.client";
import { FakeVotingDeliveryAdapter } from "@/lib/infrastructure/api/voting.fake";
import { VotingDeliveryAdapter } from "@/lib/infrastructure/api/voting.client";
import { env } from "@/lib/infrastructure/env";
import type { AuthorizationPort } from "@/lib/domain/voting/ports";
import type { VoteDeliveryPort } from "@/lib/domain/voting/ports";

/**
 * Composition root: the single place where the application layer is wired to
 * concrete adapters.
 *
 * `USE_MOCK_API=true` (default) keeps the prototype runnable without a
 * backend. Set `USE_MOCK_API=false` to talk to the real Voting BC.
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
