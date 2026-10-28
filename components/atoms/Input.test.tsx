import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("etiqueta el control y permite escribir", () => {
    render(<Input id="correo" label="Correo" />);

    const input = screen.getByLabelText("Correo");
    expect(input).toHaveAttribute("id", "correo");
  });

  it("en estado error marca aria-invalid y describe el campo", () => {
    render(
      <Input id="correo" label="Correo" state="error" hint="Correo inválido" />,
    );

    const input = screen.getByLabelText("Correo");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "correo-hint");
    expect(screen.getByRole("alert")).toHaveTextContent("Correo inválido");
  });

  it("sin estado error no muestra mensaje", () => {
    render(<Input id="correo" label="Correo" />);

    expect(screen.queryByRole("alert")).toBeNull();
  });
});
