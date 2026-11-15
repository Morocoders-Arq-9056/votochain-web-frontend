import { describe, expect, it } from "vitest";
import { LoginSchema } from "./login.vo";

describe("LoginSchema", () => {
  it("LOCAL exige contraseña", () => {
    expect(
      LoginSchema.safeParse({ email: "ada@votachain.dev", proofKind: "LOCAL" })
        .success,
    ).toBe(false);
    expect(
      LoginSchema.safeParse({
        email: "ada@votachain.dev",
        password: "x",
        proofKind: "LOCAL",
      }).success,
    ).toBe(true);
  });

  it("OUTSIDE no exige contraseña", () => {
    expect(
      LoginSchema.safeParse({ email: "ada@votachain.dev", proofKind: "OUTSIDE" })
        .success,
    ).toBe(true);
  });
});
