import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoteForm, type VoteOption } from "./VoteForm";

const options: VoteOption[] = [
  { value: "SI", label: "Sí", description: "Apruebo la propuesta" },
  { value: "NO", label: "No", description: "No apruebo la propuesta" },
  { value: "ABSTENCION", label: "Abstención" },
];

describe("VoteForm", () => {
  it("muestra las tres opciones y la regla congelada", () => {
    render(
      <VoteForm
        proposalTitle="Mantenimiento de áreas comunes"
        frozenRule="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
        authorizationCode="AUT-4821-0212"
        validUntil="10:05 PET (UTC−5)"
        options={options}
        selectedValue={null}
        onSelect={() => undefined}
        onRequestSignature={() => undefined}
      />,
    );

    expect(screen.getByRole("radio", { name: /Sí/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /No/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Abstención/ })).toBeInTheDocument();
    expect(screen.getByText(/Regla aplicada: 50%\+1/)).toBeInTheDocument();
    expect(screen.getByText(/AUT-4821-0212/)).toBeInTheDocument();
  });

  it("deshabilita Firmar y votar hasta elegir opción", () => {
    render(
      <VoteForm
        proposalTitle="Mantenimiento de áreas comunes"
        frozenRule="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
        authorizationCode="AUT-4821-0212"
        validUntil="10:05 PET (UTC−5)"
        options={options}
        selectedValue={null}
        onSelect={() => undefined}
        onRequestSignature={() => undefined}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Firmar y votar" }),
    ).toBeDisabled();
    expect(
      screen.getByText(/Elija una opción para habilitar la firma/),
    ).toBeInTheDocument();
  });

  it("emite onSelect al marcar una opción", async () => {
    const onSelect = vi.fn();
    render(
      <VoteForm
        proposalTitle="Mantenimiento de áreas comunes"
        frozenRule="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
        authorizationCode="AUT-4821-0212"
        validUntil="10:05 PET (UTC−5)"
        options={options}
        selectedValue={null}
        onSelect={onSelect}
        onRequestSignature={() => undefined}
      />,
    );

    await userEvent.click(screen.getByRole("radio", { name: /Sí/ }));
    expect(onSelect).toHaveBeenCalledWith("SI");
  });

  it("con opción elegida habilita el botón y emite onRequestSignature", async () => {
    const onRequestSignature = vi.fn();
    render(
      <VoteForm
        proposalTitle="Mantenimiento de áreas comunes"
        frozenRule="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
        authorizationCode="AUT-4821-0212"
        validUntil="10:05 PET (UTC−5)"
        options={options}
        selectedValue="SI"
        onSelect={() => undefined}
        onRequestSignature={onRequestSignature}
      />,
    );

    const button = screen.getByRole("button", { name: "Firmar y votar" });
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(onRequestSignature).toHaveBeenCalledTimes(1);
  });
});
