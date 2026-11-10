"use server";

import { cookies } from "next/headers";
import { authPort } from "@/lib/infrastructure/api/composition";

/**
 * Rotates the local secret (`PATCH /users/:id/secret`). The backend ends
 * the open session on rotation, so a success clears the local session
 * cookie: the user must sign in again with the new secret.
 */
export async function changePassword(newSecret: string) {
  const jar = await cookies();
  const userId = jar.get("session")?.value;
  if (!userId) {
    return { ok: false as const };
  }
  const outcome = await authPort().changePassword(userId, newSecret);
  if (outcome.ok) {
    jar.delete("session");
  }
  return outcome;
}
