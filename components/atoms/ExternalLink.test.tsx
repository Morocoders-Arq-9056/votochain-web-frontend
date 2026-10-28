import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it("abre en una pestaña nueva de forma segura", () => {
    render(<ExternalLink href="https://explorador.example/voto/0xabc">Ver</ExternalLink>);

    const link = screen.getByRole("link", { name: "Ver" });
    expect(link).toHaveAttribute("href", "https://explorador.example/voto/0xabc");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
