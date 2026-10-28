import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("se anuncia como estado para lectores de pantalla", () => {
    render(<Spinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("acepta el tamaño md por defecto", () => {
    render(<Spinner />);

    expect(screen.getByRole("status")).toHaveClass("size-6");
  });

  it("acepta el tamaño sm", () => {
    render(<Spinner size="sm" />);

    expect(screen.getByRole("status")).toHaveClass("size-4");
  });
});
