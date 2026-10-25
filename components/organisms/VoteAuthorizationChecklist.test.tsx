import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  VoteAuthorizationChecklist,
  type CriterioChecklist,
} from "./VoteAuthorizationChecklist";

const membresiaActiva: CriterioChecklist = {
  pregunta: "1. ¿Membresía activa?",
  cumple: true,
  estado: "Sí · Activa",
  tono: "success",
};

const biometriaVerificada: CriterioChecklist = {
  pregunta: "2. ¿Biometría fresca?",
  cumple: true,
  estado: "Sí · Verificado",
  tono: "success",
};

describe("VoteAuthorizationChecklist", () => {
  it("AUTORIZADA: muestra código de un solo uso y Votar ahora", () => {
    render(
      <VoteAuthorizationChecklist
        propuesta="Mantenimiento de áreas comunes"
        membresia={membresiaActiva}
        biometria={biometriaVerificada}
        resultado={{
          estado: "AUTORIZADA",
          codigo: "AUT-4821-0212",
          validaHasta: "10:05 PET (UTC−5)",
        }}
        onVotarAhora={() => undefined}
      />,
    );

    expect(screen.getByText(/AUT-4821-0212/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Votar ahora" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ir a prueba de vida" })).toBeNull();
  });

  it("DENEGADA: muestra el motivo y no ofrece votar", () => {
    render(
      <VoteAuthorizationChecklist
        propuesta="Mantenimiento de áreas comunes"
        membresia={{
          pregunta: "1. ¿Membresía activa?",
          cumple: false,
          estado: "No · Moroso",
          tono: "warning",
        }}
        biometria={biometriaVerificada}
        resultado={{
          estado: "DENEGADA",
          motivo:
            "Su membresía está morosa. Revise su situación con el administrador de la comunidad.",
        }}
      />,
    );

    expect(
      screen.getByText(/Su membresía está morosa\. Revise su situación/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Votar ahora" })).toBeNull();
  });

  it("Falta biometría: ofrece Ir a prueba de vida", () => {
    render(
      <VoteAuthorizationChecklist
        propuesta="Mantenimiento de áreas comunes"
        membresia={membresiaActiva}
        biometria={{
          pregunta: "2. ¿Biometría fresca?",
          cumple: false,
          estado: "No · Expirado",
          tono: "neutral",
        }}
        resultado={{ estado: "DENEGADA", motivo: "Motivo de denegación" }}
        onIrAPruebaDeVida={() => undefined}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Ir a prueba de vida" }),
    ).toBeInTheDocument();
  });

  it("EXPIRADA: ofrece pedir de nuevo y no vota", () => {
    render(
      <VoteAuthorizationChecklist
        propuesta="Mantenimiento de áreas comunes"
        membresia={membresiaActiva}
        biometria={biometriaVerificada}
        resultado={{ estado: "EXPIRADA" }}
        onPedirDeNuevo={() => undefined}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Pedir de nuevo" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Votar ahora" })).toBeNull();
  });

  it("emite onVotarAhora al pulsar Votar ahora", async () => {
    const onVotarAhora = vi.fn();
    render(
      <VoteAuthorizationChecklist
        propuesta="Mantenimiento de áreas comunes"
        membresia={membresiaActiva}
        biometria={biometriaVerificada}
        resultado={{
          estado: "AUTORIZADA",
          codigo: "AUT-4821-0212",
          validaHasta: "10:05 PET (UTC−5)",
        }}
        onVotarAhora={onVotarAhora}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Votar ahora" }));
    expect(onVotarAhora).toHaveBeenCalledTimes(1);
  });
});
