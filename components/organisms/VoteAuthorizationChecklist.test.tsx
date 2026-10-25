import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  VoteAuthorizationChecklist,
  type ChecklistCriterion,
} from "./VoteAuthorizationChecklist";

const activeMembership: ChecklistCriterion = {
  question: "1. ¿Membresía activa?",
  met: true,
  status: "Sí · Activa",
  tone: "success",
};

const verifiedBiometrics: ChecklistCriterion = {
  question: "2. ¿Biometría fresca?",
  met: true,
  status: "Sí · Verificado",
  tone: "success",
};

describe("VoteAuthorizationChecklist", () => {
  it("AUTHORIZED: muestra código de un solo uso y Votar ahora", () => {
    render(
      <VoteAuthorizationChecklist
        proposal="Mantenimiento de áreas comunes"
        membership={activeMembership}
        biometrics={verifiedBiometrics}
        result={{
          status: "AUTHORIZED",
          code: "AUT-4821-0212",
          validUntil: "10:05 PET (UTC−5)",
        }}
        onVoteNow={() => undefined}
      />,
    );

    expect(screen.getByText(/AUT-4821-0212/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Votar ahora" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ir a prueba de vida" })).toBeNull();
  });

  it("DENIED: muestra el motivo y no ofrece votar", () => {
    render(
      <VoteAuthorizationChecklist
        proposal="Mantenimiento de áreas comunes"
        membership={{
          question: "1. ¿Membresía activa?",
          met: false,
          status: "No · Moroso",
          tone: "warning",
        }}
        biometrics={verifiedBiometrics}
        result={{
          status: "DENIED",
          reason:
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
        proposal="Mantenimiento de áreas comunes"
        membership={activeMembership}
        biometrics={{
          question: "2. ¿Biometría fresca?",
          met: false,
          status: "No · Expirado",
          tone: "neutral",
        }}
        result={{ status: "DENIED", reason: "Motivo de denegación" }}
        onStartLiveness={() => undefined}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Ir a prueba de vida" }),
    ).toBeInTheDocument();
  });

  it("EXPIRED: ofrece pedir de nuevo y no vota", () => {
    render(
      <VoteAuthorizationChecklist
        proposal="Mantenimiento de áreas comunes"
        membership={activeMembership}
        biometrics={verifiedBiometrics}
        result={{ status: "EXPIRED" }}
        onRequestAgain={() => undefined}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Pedir de nuevo" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Votar ahora" })).toBeNull();
  });

  it("emite onVoteNow al pulsar Votar ahora", async () => {
    const onVoteNow = vi.fn();
    render(
      <VoteAuthorizationChecklist
        proposal="Mantenimiento de áreas comunes"
        membership={activeMembership}
        biometrics={verifiedBiometrics}
        result={{
          status: "AUTHORIZED",
          code: "AUT-4821-0212",
          validUntil: "10:05 PET (UTC−5)",
        }}
        onVoteNow={onVoteNow}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Votar ahora" }));
    expect(onVoteNow).toHaveBeenCalledTimes(1);
  });
});
