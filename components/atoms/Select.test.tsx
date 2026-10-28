import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  it("renderiza sus opciones", () => {
    render(
      <Select id="tipo" label="Tipo de documento">
        <option value="DNI">DNI</option>
        <option value="CE">CE</option>
      </Select>,
    );

    expect(screen.getByLabelText("Tipo de documento")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DNI" })).toBeInTheDocument();
  });

  it("marca el estado inválido cuando hay error", () => {
    render(
      <Select id="tipo" label="Tipo" state="error" hint="Seleccione uno">
        <option value="DNI">DNI</option>
      </Select>,
    );

    expect(screen.getByLabelText("Tipo")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Seleccione uno");
  });
});
