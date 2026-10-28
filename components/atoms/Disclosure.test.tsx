import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Disclosure } from "./Disclosure";

describe("Disclosure", () => {
  it("muestra el resumen y oculta el contenido hasta expandirlo", () => {
    render(
      <Disclosure summary="Código de constancia (hash al expandir)">
        <code>0xhash</code>
      </Disclosure>,
    );

    const details = screen.getByText(
      "Código de constancia (hash al expandir)",
    ).closest("details");
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByText("0xhash")).toBeInTheDocument();
  });
});
