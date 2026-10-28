import { describe, expect, it } from "vitest";
import {
  VoterReceiptSchema,
  voteJourney,
} from "./voter-receipt.vo";

describe("voteJourney", () => {
  it("SIGNED: solo la etapa firmado", () => {
    expect(voteJourney("SIGNED")).toEqual(["SIGNED"]);
  });

  it("QUEUED: firmado y en cola", () => {
    expect(voteJourney("QUEUED")).toEqual(["SIGNED", "QUEUED"]);
  });

  it("SENT: firmado, en cola y enviado", () => {
    expect(voteJourney("SENT")).toEqual(["SIGNED", "QUEUED", "SENT"]);
  });

  it("CONFIRMED: el journey completo", () => {
    expect(voteJourney("CONFIRMED")).toEqual([
      "SIGNED",
      "QUEUED",
      "SENT",
      "CONFIRMED",
    ]);
  });

  it("FAILED: el journey completo termina en fallido", () => {
    expect(voteJourney("FAILED")).toEqual([
      "SIGNED",
      "QUEUED",
      "SENT",
      "FAILED",
    ]);
  });
});

describe("VoterReceiptSchema", () => {
  const base = {
    voteId: "v-1",
    proposalId: "p-1",
    voterAddress: "0xabc",
    choice: "SI",
  };

  it("un recibo confirmado debe llevar su hash", () => {
    expect(() =>
      VoterReceiptSchema.parse({ ...base, status: "CONFIRMED" }),
    ).toThrow();
  });

  it("solo un recibo confirmado puede llevar hash", () => {
    expect(() =>
      VoterReceiptSchema.parse({
        ...base,
        status: "SENT",
        txHash: "0xhash",
      }),
    ).toThrow();
  });

  it("un recibo confirmado con hash es válido", () => {
    const receipt = VoterReceiptSchema.parse({
      ...base,
      status: "CONFIRMED",
      txHash: "0xhash",
    });
    expect(receipt.txHash).toBe("0xhash");
  });
});
