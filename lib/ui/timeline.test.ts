import { describe, expect, it } from "vitest";
import { timelineSteps } from "./timeline";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";

function receipt(status: VoterReceipt["status"]): VoterReceipt {
  return {
    voteId: "v-1",
    proposalId: "p-1",
    voterAddress: "0xabc",
    choice: "SI",
    status,
  };
}

describe("timelineSteps", () => {
  it("SENT: marca las etapas previas como hechas y la actual en curso", () => {
    const steps = timelineSteps(receipt("SENT"));

    expect(steps.map((step) => step.label)).toEqual([
      "Firmado",
      "En cola",
      "Enviado",
    ]);
    expect(steps.map((step) => step.visual)).toEqual([
      "done",
      "done",
      "current",
    ]);
  });

  it("CONFIRMED: todas las etapas quedan hechas", () => {
    const steps = timelineSteps(receipt("CONFIRMED"));

    expect(steps).toHaveLength(4);
    expect(steps.every((step) => step.visual === "done")).toBe(true);
    expect(steps.at(-1)?.label).toBe("Confirmado en blockchain");
  });

  it("FAILED: la última etapa queda fallida", () => {
    const steps = timelineSteps(receipt("FAILED"));

    expect(steps.at(-1)).toEqual({
      key: "FAILED",
      label: "Fallido",
      visual: "failed",
    });
  });
});
