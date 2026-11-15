"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";
import { LOGIN_PASSWORD_REQUIRED, LOGIN_SUBMIT } from "@/lib/ui/copy";

describe("LoginForm", () => {
  it("envía email y contraseña", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <LoginForm
        onSubmit={onSubmit}
        onGoogle={() => undefined}
        onRecover={() => undefined}
        onRegister={() => undefined}
      />,
    );

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "maria.quispe@correo.pe",
    );
    await user.type(screen.getByLabelText("Contraseña"), "S3gura-Acceso-2026");
    await user.click(screen.getByRole("button", { name: LOGIN_SUBMIT }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "maria.quispe@correo.pe",
      password: "S3gura-Acceso-2026",
    });
  });

  it("bloquea el envío sin contraseña y avisa", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <LoginForm
        onSubmit={onSubmit}
        onGoogle={() => undefined}
        onRecover={() => undefined}
        onRegister={() => undefined}
      />,
    );

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "maria.quispe@correo.pe",
    );
    await user.click(screen.getByRole("button", { name: LOGIN_SUBMIT }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      LOGIN_PASSWORD_REQUIRED,
    );
  });
});
