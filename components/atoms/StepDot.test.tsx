import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepDot } from "./StepDot";

describe("StepDot", () => {
  it("es decorativo: el estado lo anuncia el texto del paso", () => {
    const { container } = render(<StepDot status="done" />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("distingue los estados visuales", () => {
    const { container, rerender } = render(<StepDot status="done" />);
    expect(container.firstChild).toHaveClass("text-success");

    rerender(<StepDot status="current" />);
    expect(container.firstChild).toHaveClass("text-brand-primary");

    rerender(<StepDot status="failed" />);
    expect(container.firstChild).toHaveClass("text-danger");
  });

  it("no expone texto al lector de pantalla", () => {
    render(<StepDot status="failed" />);

    expect(screen.queryByText(/fallido/i)).toBeNull();
  });
});
