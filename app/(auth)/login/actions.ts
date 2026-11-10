"use server";

import { cookies } from "next/headers";
import { createLoginService } from "@/lib/application/login-user";
import { authPort } from "@/lib/infrastructure/api/composition";

export async function loginUser(input: {
  email: string;
  proofKind: "LOCAL" | "OUTSIDE";
}) {
  const service = createLoginService(authPort());
  const outcome = await service.login(input);
  if (outcome.ok) {
    const jar = await cookies();
    jar.set("session", outcome.userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    jar.set("personId", outcome.personId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return outcome;
}

export async function recoverAccess(email: string) {
  return authPort().requestPasswordRecovery(email);
}
