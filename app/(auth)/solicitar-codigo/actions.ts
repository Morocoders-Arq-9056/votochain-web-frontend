"use server";

import { cookies } from "next/headers";
import { createOtpService } from "@/lib/application/otp-challenge";
import { otpPort } from "@/lib/infrastructure/api/composition";

export async function requestRecoveryCode() {
  const personId = (await cookies()).get("personId")?.value ?? "";
  return createOtpService(otpPort()).request({
    personId,
    purpose: "recovery",
  });
}
