import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioCard } from "./RadioCard";

describe("RadioCard", () => {
  it("etiqueta la opción y su descripción", () => {
    render(
      <RadioCard
        name="opcion"
        value="SI"
        label="Sí"
        description="Apruebo la propuesta"
        selected={false}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByText("Sí")).toBeInTheDocument();
    expect(screen.getByText("Apruebo la propuesta")).toBeInTheDocument();
  });

  it("emite el valor seleccionado", async () => {
    const onSelect = vi.fn();
    render(
      <RadioCard
        name="opcion"
        value="NO"
        label="No"
        selected={false}
        onSelect={onSelect}
      />,
    );

    await userEvent.click(screen.getByRole("radio"));
    expect(onSelect).toHaveBeenCalledWith("NO");
  });

  it("marca la opción elegida", () => {
    render(
      <RadioCard
        name="opcion"
        value="SI"
        label="Sí"
        selected
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByRole("radio")).toBeChecked();
  });
});
