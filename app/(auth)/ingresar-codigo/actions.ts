"use server";

import { cookies } from "next/headers";
import { createOtpService } from "@/lib/application/otp-challenge";
import { otpPort } from "@/lib/infrastructure/api/composition";

async function personId(): Promise<string> {
  return (await cookies()).get("personId")?.value ?? "";
}

export async function requestVoteCode() {
  return createOtpService(otpPort()).request({
    personId: await personId(),
    purpose: "vote",
  });
}

export async function verifyVoteCode(code: string) {
  return createOtpService(otpPort()).verify({
    personId: await personId(),
    purpose: "vote",
    code,
  });
}

export async function requestRecoveryCode(email?: string) {
  const id = await personId();
  return createOtpService(otpPort()).request(
    id
      ? { personId: id, purpose: "recovery" }
      : { email: email ?? "", purpose: "recovery" },
  );
}

export async function verifyRecoveryCode(code: string, email?: string) {
  const id = await personId();
  return createOtpService(otpPort()).verify(
    id
      ? { personId: id, purpose: "recovery", code }
      : { email: email ?? "", purpose: "recovery", code },
  );
}

export async function resetRecoverySecret(newSecret: string, email?: string) {
  const id = await personId();
  return createOtpService(otpPort()).resetSecret(
    id
      ? { personId: id, purpose: "recovery", newSecret }
      : { email: email ?? "", purpose: "recovery", newSecret },
  );
}
