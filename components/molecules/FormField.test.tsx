import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("etiqueta el control y propaga lo escrito", async () => {
    const onChange = vi.fn();
    render(
      <FormField id="correo" label="Correo" onChange={onChange} />,
    );

    const input = screen.getByLabelText("Correo");
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("muestra el error amable y marca el campo como inválido", () => {
    render(
      <FormField
        id="correo"
        label="Correo"
        state="error"
        hint="Este correo ya está registrado"
      />,
    );

    expect(screen.getByLabelText("Correo")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Este correo ya está registrado",
    );
  });
});
