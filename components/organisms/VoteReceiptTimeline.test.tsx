import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VoteReceiptTimeline, type ReceiptStep } from "./VoteReceiptTimeline";

const steps: ReceiptStep[] = [
  {
    key: "signed",
    label: "Firmado",
    dateTime: "12/02/2026 · 10:01 PET (UTC−5)",
    status: "done",
  },
  {
    key: "queued",
    label: "En cola",
    dateTime: "12/02/2026 · 10:02 PET (UTC−5)",
    status: "done",
  },
  {
    key: "sent",
    label: "Enviado",
    dateTime: "12/02/2026 · 10:03 PET (UTC−5)",
    status: "done",
  },
  {
    key: "confirmed",
    label: "Confirmado en blockchain",
    dateTime: "12/02/2026 · 10:04 PET (UTC−5)",
    status: "current",
  },
];

describe("VoteReceiptTimeline", () => {
  it("CONFIRMED: muestra que ya cuenta en el escrutinio y la constancia", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        steps={steps}
        result={{
          status: "CONFIRMED",
          hash: "0x9f3a7c21b8e4d5f6a2c9b0d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
          explorerUrl: "https://explorador.example/voto/0x9f3a",
        }}
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

  it("CONFIRMED: enlaza al explorador blockchain", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        steps={steps}
        result={{
          status: "CONFIRMED",
          hash: "0xabc",
          explorerUrl: "https://explorador.example/voto/0xabc",
        }}
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
        steps={steps}
        result={{ status: "CONFIRMED", hash: "0xabc" }}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Ver en explorador blockchain" }),
    ).toBeNull();
  });

  it("FAILED: muestra motivo, marca aún no cuenta y no da enlace", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        steps={[
          ...steps.slice(0, 3),
          {
            key: "failed",
            label: "Fallido",
            dateTime: "12/02/2026 · 10:04 PET (UTC−5)",
            status: "failed",
          },
        ]}
        result={{
          status: "FAILED",
          reason: "Rechazado por la red. Reintento automático 1 de 3 en curso.",
          retryable: true,
        }}
      />,
    );

    expect(screen.getByText("Aún no cuenta")).toBeInTheDocument();
    expect(
      screen.getByText(/Rechazado por la red\. Reintento automático 1 de 3/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Ver en explorador blockchain" }),
    ).toBeNull();
  });

  it("FAILED terminal: indica contactar soporte y no reintentar", () => {
    render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        steps={steps}
        result={{
          status: "FAILED",
          reason: "Se agotó el límite de 3 reintentos automáticos.",
          retryable: false,
        }}
      />,
    );

    expect(screen.getByText(/Contacte soporte/)).toBeInTheDocument();
    expect(
      screen.getByText(/No habrá más reintentos/),
    ).toBeInTheDocument();
  });

  it("marca solo el paso corriente y expone aria-live", () => {
    const { container } = render(
      <VoteReceiptTimeline
        proposal="Mantenimiento de áreas comunes"
        steps={steps}
        result={{ status: "CONFIRMED", hash: "0xabc" }}
      />,
    );

    expect(container.querySelector("ol")).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByText(/estado actual/)).toBeInTheDocument();
    expect(screen.getAllByText(/estado actual/)).toHaveLength(1);
  });
});
