import { describe, expect, it } from "vitest";
import {
  toLoginErrorCode,
  toRegisterErrorCode,
} from "./access-error-mapping";

describe("toLoginErrorCode", () => {
  it("status 0 (red caída) es NETWORK_UNREACHABLE, no UNAVAILABLE", () => {
    expect(toLoginErrorCode(0, "NETWORK_ERROR")).toBe("NETWORK_UNREACHABLE");
  });

  it("404 (dirección sin identidad) es INVALID_CREDENTIALS", () => {
    expect(toLoginErrorCode(404, "user not found")).toBe(
      "INVALID_CREDENTIALS",
    );
  });

  it("409 'access suspended' es SUSPENDED", () => {
    expect(toLoginErrorCode(409, "access suspended")).toBe("SUSPENDED");
  });

  it("409 'proof not held' es OUTSIDE_NOT_LINKED", () => {
    expect(toLoginErrorCode(409, "proof not held")).toBe("OUTSIDE_NOT_LINKED");
  });

  it("409 PreviousSession se conserva para el Fake", () => {
    expect(toLoginErrorCode(409, "PreviousSession")).toBe("PREVIOUS_SESSION");
  });

  it("500 sigue siendo UNAVAILABLE", () => {
    expect(toLoginErrorCode(500, "InternalError")).toBe("UNAVAILABLE");
  });
});

describe("toRegisterErrorCode", () => {
  it("400 (validación) es INVALID_EMAIL", () => {
    expect(toRegisterErrorCode(400, "HTTP_400")).toBe("INVALID_EMAIL");
  });

  it("400 con mensaje de contraseña es INVALID_PASSWORD", () => {
    expect(
      toRegisterErrorCode(400, "password must mix lower, upper and digit"),
    ).toBe("INVALID_PASSWORD");
  });

  it("409 (dirección ocupada) es DUPLICATE", () => {
    expect(toRegisterErrorCode(409, "address already held")).toBe("DUPLICATE");
  });
});
