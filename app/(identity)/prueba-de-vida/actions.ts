"use server";

import { cookies } from "next/headers";
import { createLivenessService } from "@/lib/application/verify-liveness";
import { identityPort } from "@/lib/infrastructure/api/composition";

async function personId(): Promise<string> {
  return (await cookies()).get("personId")?.value ?? "";
}

export async function startLivenessAttempt() {
  return createLivenessService(identityPort()).start(await personId());
}

export async function confirmLivenessAttempt(attemptId: string) {
  return createLivenessService(identityPort()).confirm(attemptId);
}
