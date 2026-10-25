import { z } from "zod";

export const CastVoteInputSchema = z.object({
  authorizationId: z.string().min(1),
  choice: z.string().min(1),
});

export type CastVoteInput = z.infer<typeof CastVoteInputSchema>;

export function toIdempotencyKey(input: CastVoteInput): string {
  return CastVoteInputSchema.parse(input).authorizationId;
}
