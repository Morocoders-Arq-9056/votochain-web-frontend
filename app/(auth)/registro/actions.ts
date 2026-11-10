"use server";

import { cookies } from "next/headers";
import { createRegisterService } from "@/lib/application/register-user";
import { authPort } from "@/lib/infrastructure/api/composition";

export async function registerUser(input: { email: string; consent: boolean }) {
  const service = createRegisterService(authPort());
  const outcome = await service.register({
    email: input.email,
    acceptedPolicyVersion: input.consent ? "v1" : "",
  });
  if (outcome.ok) {
    const jar = await cookies();
    jar.set("personId", outcome.personId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return outcome;
}
