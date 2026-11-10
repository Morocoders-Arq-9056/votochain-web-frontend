"use server";

import { cookies } from "next/headers";
import { createLivenessService } from "@/lib/application/verify-liveness";
import { identityPort } from "@/lib/infrastructure/api/composition";

async function personId(): Promise<string> {
  return (await cookies()).get("personId")?.value ?? "";
}

export async function enrollBiometricReference() {
  return createLivenessService(identityPort()).enroll(await personId());
}
