import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuditRow } from "./AuditRow";

describe("AuditRow", () => {
  it("muestra quién, cuándo y por qué", () => {
    render(
      <AuditRow
        actor="Rosa Salazar"
        occurredAt="12/02/2026 · 10:00 PET (UTC−5)"
        reason="Revisión del vínculo con la comunidad"
      />,
    );

    expect(screen.getByText("Rosa Salazar")).toBeInTheDocument();
    expect(
      screen.getByText("12/02/2026 · 10:00 PET (UTC−5)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Revisión del vínculo con la comunidad"),
    ).toBeInTheDocument();
  });

  it("es de solo lectura: no ofrece acciones", () => {
    render(
      <AuditRow
        actor="Rosa Salazar"
        occurredAt="12/02/2026 · 10:00 PET (UTC−5)"
        reason="Motivo"
      />,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });
});
