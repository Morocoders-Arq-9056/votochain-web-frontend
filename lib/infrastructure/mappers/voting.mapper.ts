import {
  VoterReceiptSchema,
  type VoterReceipt,
} from "@/lib/domain/voting/voter-receipt.vo";
import {
  TALLY_FROZEN_RULE_SERVER,
  TALLY_OPTION_ABSTENCION_LABEL,
  TALLY_OPTION_NO_LABEL,
  TALLY_OPTION_SI_LABEL,
} from "@/lib/ui/copy";
import {
  tallyPercent,
  TallyResultSchema,
  type TallyResult,
} from "@/lib/domain/voting/tally.vo";

/**
 * Wire shape of the Voting BC (`VoteReceiptResource`). It never leaves
 * infrastructure: the assembler turns it into a domain `VoterReceipt`.
 */
export type VoteReceiptResource = {
  voteId: string;
  proposalId: string;
  voterAddress: string;
  choice: string;
  status: string;
  txHash: string | null;
};

export function toVoterReceipt(dto: VoteReceiptResource): VoterReceipt {
  const confirmed = dto.status.toUpperCase() === "CONFIRMED";
  return VoterReceiptSchema.parse({
    voteId: dto.voteId,
    proposalId: dto.proposalId,
    voterAddress: dto.voterAddress,
    choice: dto.choice,
    status: dto.status.toUpperCase(),
    txHash: confirmed ? (dto.txHash ?? undefined) : undefined,
  });
}

/**
 * Wire shape of the Voting BC (`ProofResource`, `GET /votes/:id`). It never
 * leaves infrastructure. `recovered` is the ecrecover signer address, which
 * plays the voter role in the domain receipt.
 */
export type ProofResource = {
  voteId: string;
  proposalId: string;
  choice: string;
  signature: { v: number; r: string; s: string };
  txHash: string | null;
  blockNumber: number | null;
  recovered: string;
  status: string;
};

export function toVoterReceiptFromProof(dto: ProofResource): VoterReceipt {
  return toVoterReceipt({
    voteId: dto.voteId,
    proposalId: dto.proposalId,
    voterAddress: dto.recovered,
    choice: dto.choice,
    status: dto.status,
    txHash: dto.txHash,
  });
}

/**
 * Wire shape of the Voting BC (`TallyResource`, `GET /proposals/:id/tally`).
 * It never leaves infrastructure.
 */
export type TallyResource = {
  proposalId: string;
  counts: Record<string, number>;
  turnout: number;
  quorumMet: boolean;
};

/**
 * Wire shape of a roster entry (`MembershipResource`, `GET /memberships`).
 * Only the status is consumed by the tally enrichment.
 */
export type MembershipResource = {
  membershipId: string;
  personId: string;
  communityId: string;
  status: string;
};

/**
 * Wire shape of the Voting BC (`ProposalResource`, `GET /proposals/:id`).
 * The tally enrichment consumes `communityId`; `closeStep` the status.
 */
export type ProposalResource = {
  proposalId: string;
  communityId: string;
  status: string;
  options: string[];
  quorum: { threshold: number; basis: string } | null;
  tally: {
    counts: Record<string, number>;
    turnout: number;
    quorumMet: boolean;
  } | null;
};

const TALLY_OPTION_LABELS = {
  SI: TALLY_OPTION_SI_LABEL,
  NO: TALLY_OPTION_NO_LABEL,
  ABSTENCION: TALLY_OPTION_ABSTENCION_LABEL,
} as const;

/**
 * Assembles a domain `TallyResult` from the server tally. The backend only
 * reports raw counts per option plus turnout: labels come from UI copy, the
 * title falls back to the proposal id (the only identifier the server
 * returns). `eligible` arrives from the community roster when the caller
 * could resolve it; otherwise participation reads as confirmed-over-counted.
 */
export function toTallyResult(
  dto: TallyResource,
  opts?: { eligible?: number },
): TallyResult {
  const confirmed = dto.turnout;
  const options = (Object.keys(TALLY_OPTION_LABELS) as ("SI" | "NO" | "ABSTENCION")[]).map(
    (value) => {
      const count = dto.counts[value] ?? 0;
      return {
        value,
        label: TALLY_OPTION_LABELS[value],
        count,
        percent: tallyPercent(count, confirmed),
      };
    },
  );
  return TallyResultSchema.parse({
    proposalId: dto.proposalId,
    proposalTitle: dto.proposalId,
    options,
    confirmed,
    eligible: opts?.eligible ?? dto.turnout,
    quorumReached: dto.quorumMet,
    frozenRule: TALLY_FROZEN_RULE_SERVER,
  });
}
