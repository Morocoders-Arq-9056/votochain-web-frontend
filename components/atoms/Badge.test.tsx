import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("muestra punto y texto (nunca solo color)", () => {
    render(<Badge tone="success">Tu voto ya cuenta</Badge>);

    const badge = screen.getByText("Tu voto ya cuenta");
    expect(badge).toBeInTheDocument();
    expect(badge.querySelector("span")).toBeInTheDocument();
  });

  it("el punto es decorativo para el lector de pantalla", () => {
    render(<Badge tone="success">Confirmado</Badge>);

    expect(screen.getByText("Confirmado").querySelector("span")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("el texto se muestra en mayúsculas", () => {
    render(<Badge tone="danger">Denegada</Badge>);

    expect(screen.getByText("Denegada")).toHaveClass("uppercase");
  });
});
