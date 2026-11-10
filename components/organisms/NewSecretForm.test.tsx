"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NewSecretForm } from "./NewSecretForm";
import { NEW_SECRET_SUBMIT } from "@/lib/ui/copy";

describe("NewSecretForm", () => {
  it("envía la clave ingresada", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NewSecretForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/contraseña nueva/i),
      "nueva-clave-1",
    );
    await user.click(screen.getByRole("button", { name: NEW_SECRET_SUBMIT }));

    expect(onSubmit).toHaveBeenCalledWith("nueva-clave-1");
  });

  it("muestra el error del servidor con role alert", () => {
    render(<NewSecretForm serverError="Falló" onSubmit={() => undefined} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falló");
  });
});
