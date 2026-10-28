import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renderiza su etiqueta y emite el click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Firmar y votar</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Firmar y votar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("no emite el click cuando está deshabilitado", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Firmar y votar
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Firmar y votar" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("en estado loading se deshabilita y marca aria-busy", () => {
    render(<Button loading>Enviando</Button>);

    const button = screen.getByRole("button", { name: /Enviando/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
