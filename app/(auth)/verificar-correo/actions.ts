"use server";

import { cookies } from "next/headers";
import { createOtpService } from "@/lib/application/otp-challenge";
import { otpPort } from "@/lib/infrastructure/api/composition";

async function personId(): Promise<string> {
  return (await cookies()).get("personId")?.value ?? "";
}

export async function requestEmailCode() {
  return createOtpService(otpPort()).request({
    personId: await personId(),
    purpose: "email",
  });
}

export async function verifyEmailCode(code: string) {
  return createOtpService(otpPort()).verify({
    personId: await personId(),
    purpose: "email",
    code,
  });
}
