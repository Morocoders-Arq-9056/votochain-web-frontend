import { z } from "zod";

/**
 * Rejection codes the UI can act on. The es-PE text lives in `lib/ui/copy.ts`;
 * the domain only names what happened.
 */
export const VoteCastErrorCodeSchema = z.enum([
  "DOUBLE_VOTE",
  "LATE_VOTE",
  "AUTHORIZATION_EXPIRED",
  "NOT_FOUND",
  "UNAVAILABLE",
  "UNEXPECTED",
]);

export type VoteCastErrorCode = z.infer<typeof VoteCastErrorCodeSchema>;

export class VoteCastError extends Error {
  readonly code: VoteCastErrorCode;

  constructor(code: VoteCastErrorCode) {
    super(code);
    this.name = "VoteCastError";
    this.code = code;
  }
}
