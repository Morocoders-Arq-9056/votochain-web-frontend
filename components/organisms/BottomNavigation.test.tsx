import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomNavigation } from "./BottomNavigation";

describe("BottomNavigation", () => {
  it("muestra los destinos con enlaces reales y marca el activo", () => {
    render(
      <BottomNavigation
        items={[
          { href: "/", label: "Inicio", icon: "home" },
          { href: "/votar", label: "Votar", icon: "vote", active: true },
          { href: "/recibo/demo", label: "Mi recibo", icon: "receipt" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: /Inicio/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Votar/ })).toHaveAttribute("href", "/votar");
    expect(screen.getByRole("link", { name: /Mi recibo/ })).toHaveAttribute(
      "href",
      "/recibo/demo",
    );
    expect(screen.getByRole("link", { name: /Votar/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
