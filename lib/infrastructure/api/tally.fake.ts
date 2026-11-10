import type { TallyPort } from "@/lib/domain/voting/ports";
import type {
  CloseProposalCommand,
  CloseProposalOutcome,
} from "@/lib/domain/voting/close-proposal.vo";
import type { TallyResult } from "@/lib/domain/voting/tally.vo";

const SEED_TALLY: TallyResult = {
  proposalId: "prop-001",
  proposalTitle: "Mantenimiento de áreas comunes",
  options: [
    { value: "SI", label: "Sí", count: 48, percent: 66.67 },
    { value: "NO", label: "No", count: 18, percent: 25 },
    { value: "ABSTENCION", label: "Abstención", count: 6, percent: 8.33 },
  ],
  confirmed: 72,
  eligible: 100,
  quorumReached: true,
  frozenRule: "50%+1 sobre 100 miembros activos al abrir el 12/02/2026 a las 09:00 PET (UTC-5).",
};

export class FakeTallyAdapter implements TallyPort {
  async getTally(): Promise<TallyResult> {
    return SEED_TALLY;
  }

  async closeProposal(
    command: CloseProposalCommand,
  ): Promise<CloseProposalOutcome> {
    if (command.reason.trim().length < 8) {
      return { ok: false, code: "INVALID_REASON" };
    }
    if (!command.confirmedIrreversible) {
      return { ok: true, step: "STEP_1" };
    }
    return { ok: true, step: "CLOSED" };
  }

  async closeStep() {
    return { step: "STEP_1" as const };
  }
}
