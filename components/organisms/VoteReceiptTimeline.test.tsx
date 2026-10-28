import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { VoteReceiptTimeline } from "./VoteReceiptTimeline";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";

const confirmedReceipt: VoterReceipt = {
  voteId: "v-1",
  proposalId: "p-1",
  voterAddress: "0xabc",
  choice: "SI",
  status: "CONFIRMED",
  txHash: "0xhash",
};

const sentReceipt: VoterReceipt = {
  voteId: "v-2",
  proposalId: "p-1",
  voterAddress: "0xabc",
  choice: "SI",
  status: "SENT",
};

const failedReceipt: VoterReceipt = {
  voteId: "v-3",
  proposalId: "p-1",
  voterAddress: "0xabc",
  choice: "SI",
  status: "FAILED",
};

describe("VoteReceiptTimeline", () => {
  it("CONFIRMED: muestra que ya cuenta en el escrutinio y la constancia", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={confirmedReceipt}
      />,
    );

    expect(
      screen.getByText("Ya cuenta en el escrutinio"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Confirmado en blockchain. Solo los votos confirmados/),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Código de constancia/)).toBeInTheDocument();
  });

  it("CONFIRMED: el hash solo es visible al expandir", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={confirmedReceipt}
      />,
    );

    const hash = screen.getByText("0xhash");
    expect(hash.closest("details")).not.toHaveAttribute("open");
  });

  it("CONFIRMED: enlaza al explorador blockchain", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={confirmedReceipt}
        explorerUrl="https://explorador.example/voto/0xabc"
      />,
    );

    const link = screen.getByRole("link", {
      name: "Ver en explorador blockchain",
    });
    expect(link).toHaveAttribute("href", "https://explorador.example/voto/0xabc");
  });

  it("sin explorerUrl no renderiza el enlace", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={confirmedReceipt}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Ver en explorador blockchain" }),
    ).toBeNull();
  });

  it("SENT: muestra el journey completo con el paso corriente", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={sentReceipt}
      />,
    );

    const journey = within(screen.getByRole("list"));
    expect(journey.getByText("Firmado")).toBeInTheDocument();
    expect(journey.getByText("En cola")).toBeInTheDocument();
    expect(journey.getByText(/^Enviado · estado actual$/)).toBeInTheDocument();
    expect(journey.getAllByText(/estado actual/)).toHaveLength(1);
  });

  it("FAILED: muestra que aún no cuenta y no da enlace", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={failedReceipt}
      />,
    );

    expect(screen.getByText("Aún no cuenta")).toBeInTheDocument();
    const journey = within(screen.getByRole("list"));
    expect(journey.getByText("Fallido")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Ver en explorador blockchain" }),
    ).toBeNull();
  });

  it("expone aria-live en la lista del journey", () => {
    const { container } = render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        receipt={confirmedReceipt}
      />,
    );

    expect(container.querySelector("ol")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });
});
