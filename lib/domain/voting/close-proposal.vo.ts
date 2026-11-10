import { z } from "zod";

export const CloseStepSchema = z.enum(["STEP_1", "STEP_2", "CLOSED"]);

export type CloseStep = z.infer<typeof CloseStepSchema>;

export const CloseProposalCommandSchema = z.object({
  proposalId: z.string().min(1),
  reason: z.string().min(8),
  confirmedIrreversible: z.boolean(),
});

export type CloseProposalCommand = z.infer<typeof CloseProposalCommandSchema>;

export type CloseProposalOutcome =
  | { ok: true; step: CloseStep }
  | { ok: false; code: "INVALID_REASON" | "NOT_OPEN" | "UNAVAILABLE" };
