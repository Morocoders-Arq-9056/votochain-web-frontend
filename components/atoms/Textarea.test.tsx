import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("permite escribir un motivo", () => {
    render(<Textarea id="motivo" label="Motivo obligatorio" />);

    expect(screen.getByLabelText("Motivo obligatorio")).toBeInTheDocument();
  });

  it("marca el estado inválido cuando hay error", () => {
    render(
      <Textarea id="motivo" label="Motivo" state="error" hint="Indique el motivo" />,
    );

    expect(screen.getByLabelText("Motivo")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Indique el motivo");
  });
});
