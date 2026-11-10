import type { TallyPort } from "@/lib/domain/voting/ports";
import {
  CloseProposalCommandSchema,
  type CloseProposalOutcome,
} from "@/lib/domain/voting/close-proposal.vo";

export function createCloseProposalService(port: TallyPort) {
  return {
    async close(input: unknown): Promise<CloseProposalOutcome> {
      const parsed = CloseProposalCommandSchema.safeParse(input);
      if (!parsed.success) {
        return { ok: false, code: "INVALID_REASON" };
      }
      return port.closeProposal(parsed.data);
    },
  };
}
