import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("se anuncia con aria-live polite", () => {
    render(<Toast message="Su voto firmado está en cola" />);

    const toast = screen.getByRole("status");
    expect(toast).toHaveAttribute("aria-live", "polite");
    expect(toast).toHaveTextContent("Su voto firmado está en cola");
  });

  it("ofrece la acción y la emite", async () => {
    const onAction = vi.fn();
    render(
      <Toast
        message="Su voto firmado está en cola"
        tone="warning"
        action={{ label: "Ver recibo", onAction }}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Ver recibo" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("permite cerrar el aviso", async () => {
    const onDismiss = vi.fn();
    render(<Toast message="Ocurrió un error" tone="danger" onDismiss={onDismiss} />);

    await userEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
