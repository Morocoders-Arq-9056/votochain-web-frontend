import type { TallyPort } from "@/lib/domain/voting/ports";
import type {
  CloseProposalCommand,
  CloseProposalOutcome,
} from "@/lib/domain/voting/close-proposal.vo";
import type { TallyResult } from "@/lib/domain/voting/tally.vo";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";
import {
  toTallyResult,
  type MembershipResource,
  type ProposalResource,
  type TallyResource,
} from "@/lib/infrastructure/mappers/voting.mapper";

export class HttpTallyAdapter implements TallyPort {
  async getTally(proposalId: string): Promise<TallyResult> {
    const dto = await apiFetch<TallyResource>(
      `/proposals/${proposalId}/tally`,
    );
    return toTallyResult(dto, await this.rosterEligible(proposalId));
  }

  /**
   * Resolves the roster size (ACTIVE memberships of the proposal community).
   * Best effort: any failure degrades to turnout so the tally still renders.
   */
  private async rosterEligible(
    proposalId: string,
  ): Promise<{ eligible?: number }> {
    try {
      const proposal = await apiFetch<ProposalResource>(
        `/proposals/${proposalId}`,
      );
      if (!proposal.communityId) return {};
      const members = await apiFetch<MembershipResource[]>(
        `/memberships?communityId=${encodeURIComponent(proposal.communityId)}`,
      );
      if (!Array.isArray(members)) return {};
      return {
        eligible: members.filter((m) => m.status === "ACTIVE").length,
      };
    } catch {
      return {};
    }
  }

  async closeProposal(
    command: CloseProposalCommand,
  ): Promise<CloseProposalOutcome> {
    // Paso 1 de la confirmación en dos pasos: solo UI, sin HTTP. El motivo
    // se valida en la capa de aplicación pero el backend (`POST
    // /proposals/:id/close`) no acepta body.
    if (!command.confirmedIrreversible) {
      return { ok: true, step: "STEP_1" };
    }
    try {
      await apiFetch(`/proposals/${command.proposalId}/close`, {
        method: "POST",
      });
      return { ok: true, step: "CLOSED" };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return { ok: false, code: "NOT_OPEN" };
      }
      return { ok: false, code: "UNAVAILABLE" };
    }
  }

  async closeStep(proposalId: string) {
    const dto = await apiFetch<ProposalResource>(`/proposals/${proposalId}`);
    const status = dto.status.toUpperCase();
    if (status === "CLOSED" || status === "TALLIED") {
      return { step: "CLOSED" as const };
    }
    if (status === "OPEN") {
      return { step: "STEP_2" as const };
    }
    return { step: "STEP_1" as const };
  }
}
