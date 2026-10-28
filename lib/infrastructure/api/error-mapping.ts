import type { VoteCastErrorCode } from "@/lib/domain/voting/vote-cast-error";

/**
 * Single translation point between the backend's HTTP rejections and the
 * domain's error codes. Source: voting-exception.filter
 * (409 ReplayRejected/AuthorizationAlreadyConsumed, 422 ProposalNotOpen,
 * 410 AuthorizationExpired, 404 unknown ids).
 */
export function toVoteCastErrorCode(
  status: number,
  backendMessage: string,
): VoteCastErrorCode {
  if (
    status === 409 &&
    (backendMessage === "ReplayRejected" ||
      backendMessage === "AuthorizationAlreadyConsumed")
  ) {
    return "DOUBLE_VOTE";
  }
  if (status === 422 && backendMessage === "ProposalNotOpen") {
    return "LATE_VOTE";
  }
  if (status === 410 && backendMessage === "AuthorizationExpired") {
    return "AUTHORIZATION_EXPIRED";
  }
  if (status === 404) {
    return "NOT_FOUND";
  }
  if (status === 0 || status >= 500) {
    return "UNAVAILABLE";
  }
  return "UNEXPECTED";
}
