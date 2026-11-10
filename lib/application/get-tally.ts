import type { TallyPort } from "@/lib/domain/voting/ports";
import type { TallyResult } from "@/lib/domain/voting/tally.vo";

export function createTallyService(port: TallyPort) {
  return {
    async tally(proposalId: string): Promise<TallyResult> {
      return port.getTally(proposalId);
    },
  };
}
