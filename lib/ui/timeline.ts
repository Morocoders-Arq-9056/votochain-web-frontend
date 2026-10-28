import {
  voteJourney,
  type VoteJourneyStage,
  type VoterReceipt,
} from "@/lib/domain/voting/voter-receipt.vo";
import type { TimelineVisual } from "@/lib/ui/visuals";

/**
 * Presentation of the voter receipt journey as the P26 timeline. The domain
 * owns the lifecycle order; this module maps it to visual states and labels.
 */

export type TimelineStep = {
  key: VoteJourneyStage;
  label: string;
  dateTime?: string;
  visual: TimelineVisual;
};

const STAGE_LABELS: Record<VoteJourneyStage, string> = {
  SIGNED: "Firmado",
  QUEUED: "En cola",
  SENT: "Enviado",
  CONFIRMED: "Confirmado en blockchain",
  FAILED: "Fallido",
};

function toVisual(
  stage: VoteJourneyStage,
  index: number,
  journey: VoteJourneyStage[],
): TimelineVisual {
  if (stage === "FAILED") return "failed";
  if (stage === "CONFIRMED") return "done";
  return index === journey.length - 1 ? "current" : "done";
}

export function timelineSteps(receipt: VoterReceipt): TimelineStep[] {
  const journey = voteJourney(receipt.status);
  return journey.map((stage, index) => ({
    key: stage,
    label: STAGE_LABELS[stage],
    visual: toVisual(stage, index, journey),
  }));
}
