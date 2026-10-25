import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { VoteReceiptTimeline, type PasoRecibo } from "./VoteReceiptTimeline";

const pasos: PasoRecibo[] = [
  {
    clave: "firmado",
    etiqueta: "Firmado",
    fechaHora: "12/02/2026 · 10:01 PET (UTC−5)",
    estado: "done",
  },
  {
    clave: "en-cola",
    etiqueta: "En cola",
    fechaHora: "12/02/2026 · 10:02 PET (UTC−5)",
    estado: "done",
  },
  {
    clave: "enviado",
    etiqueta: "Enviado",
    fechaHora: "12/02/2026 · 10:03 PET (UTC−5)",
    estado: "done",
  },
  {
    clave: "confirmado",
    etiqueta: "Confirmado en blockchain",
    fechaHora: "12/02/2026 · 10:04 PET (UTC−5)",
    estado: "current",
  },
];

describe("VoteReceiptTimeline", () => {
  it("CONFIRMADO: muestra que ya cuenta en el escrutinio y la constancia", () => {
    render(
      <VoteReceiptTimeline
        propuesta="Mantenimiento de áreas comunes"
        pasos={pasos}
        resultado={{
          estado: "CONFIRMADO",
          hash: "0x9f3a7c21b8e4d5f6a2c9b0d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
          exploradorUrl: "https://explorador.example/voto/0x9f3a",
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

  it("CONFIRMADO: enlaza al explorador blockchain", () => {
    render(
      <VoteReceiptTimeline
        propuesta="Mantenimiento de áreas comunes"
        pasos={pasos}
        resultado={{
          estado: "CONFIRMADO",
          hash: "0xabc",
          exploradorUrl: "https://explorador.example/voto/0xabc",
        }}
      />,
    );

    const enlace = screen.getByRole("link", {
      name: "Ver en explorador blockchain",
    });
    expect(enlace).toHaveAttribute("href", "https://explorador.example/voto/0xabc");
  });

  it("sin exploradorUrl no renderiza el enlace", () => {
    render(
      <VoteReceiptTimeline
        propuesta="Mantenimiento de áreas comunes"
        pasos={pasos}
        resultado={{ estado: "CONFIRMADO", hash: "0xabc" }}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Ver en explorador blockchain" }),
    ).toBeNull();
  });

  it("FALLIDO: muestra motivo, marca aún no cuenta y no da enlace", () => {
    render(
      <VoteReceiptTimeline
        propuesta="Mantenimiento de áreas comunes"
        pasos={[
          ...pasos.slice(0, 3),
          {
            clave: "fallido",
            etiqueta: "Fallido",
            fechaHora: "12/02/2026 · 10:04 PET (UTC−5)",
            estado: "failed",
          },
        ]}
        resultado={{
          estado: "FALLIDO",
          motivo: "Rechazado por la red. Reintento automático 1 de 3 en curso.",
          reintentable: true,
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

  it("FALLIDO terminal: indica contactar soporte y no reintentar", () => {
    render(
      <VoteReceiptTimeline
        propuesta="Mantenimiento de áreas comunes"
        pasos={pasos}
        resultado={{
          estado: "FALLIDO",
          motivo: "Se agotó el límite de 3 reintentos automáticos.",
          reintentable: false,
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
        propuesta="Mantenimiento de áreas comunes"
        pasos={pasos}
        resultado={{ estado: "CONFIRMADO", hash: "0xabc" }}
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
