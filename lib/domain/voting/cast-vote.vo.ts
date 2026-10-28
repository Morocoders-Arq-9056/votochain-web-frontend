import { z } from "zod";

/**
 * Cast vote command (Voting BC, UC4). A granted `VoteAuthorization` is
 * consumed by this command; eligibility is not re-checked.
 */
export const CastVoteCommandSchema = z.object({
  authorizationId: z.string().min(1),
  choice: z.string().min(1),
});

export type CastVoteCommand = z.infer<typeof CastVoteCommandSchema>;
