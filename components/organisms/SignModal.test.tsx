import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignModal } from "./SignModal";

const baseProps = {
  proposalTitle: "Mantenimiento de áreas comunes",
  optionLabel: "Sí · Apruebo la propuesta",
  voterSummary: "María Quispe · DNI 4821xxxx · Dpto 302",
  onSign: () => undefined,
  onCancel: () => undefined,
};

describe("SignModal", () => {
  it("no renderiza cuando está cerrado", () => {
    render(<SignModal {...baseProps} open={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("muestra el resumen y el aviso de olvido de la firma", () => {
    render(<SignModal {...baseProps} open />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Mantenimiento de áreas comunes")).toBeInTheDocument();
    expect(
      screen.getByText("La firma se olvida inmediatamente"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Solo los votos confirmados en blockchain/),
    ).toBeInTheDocument();
  });

  it("nunca pide ni muestra claves", () => {
    render(<SignModal {...baseProps} open />);
    expect(screen.queryByText(/clave/i)).toBeNull();
    expect(screen.queryByText(/wallet/i)).toBeNull();
  });

  it("emite onSign y onCancel", async () => {
    const onSign = vi.fn();
    const onCancel = vi.fn();
    render(
      <SignModal
        {...baseProps}
        open
        onSign={onSign}
        onCancel={onCancel}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Firmar" }));
    expect(onSign).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("cierra con la tecla Escape", async () => {
    const onCancel = vi.fn();
    render(<SignModal {...baseProps} open onCancel={onCancel} />);

    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
