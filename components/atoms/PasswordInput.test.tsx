import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("oculta el valor por defecto", () => {
    render(<PasswordInput id="clave" label="Contraseña" />);

    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("permite mostrar y volver a ocultar", async () => {
    render(<PasswordInput id="clave" label="Contraseña" />);

    const input = screen.getByLabelText("Contraseña");
    await userEvent.click(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    );
    expect(input).toHaveAttribute("type", "text");

    await userEvent.click(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    );
    expect(input).toHaveAttribute("type", "password");
  });

  it("nunca pide claves ni las muestra", () => {
    render(<PasswordInput id="clave" label="Contraseña" />);

    expect(screen.queryByText(/clave privada|wallet/i)).toBeNull();
  });
});
