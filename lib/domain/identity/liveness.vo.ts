import { z } from "zod";

export const LivenessStepSchema = z.enum(["LOOK", "BLINK", "TURN"]);

export type LivenessStep = z.infer<typeof LivenessStepSchema>;

export const LivenessStatusSchema = z.enum([
  "READY",
  "COMPARING",
  "VERIFIED",
  "NOT_VERIFIED",
  "EXPIRED",
]);

export type LivenessStatus = z.infer<typeof LivenessStatusSchema>;

export const BiometricReferenceStatusSchema = z.enum([
  "NONE",
  "ACTIVE",
  "STALE",
  "NOT_VERIFIED",
]);

export type BiometricReferenceStatus = z.infer<
  typeof BiometricReferenceStatusSchema
>;

export function isBiometricUsable(
  status: BiometricReferenceStatus,
): boolean {
  return (
    BiometricReferenceStatusSchema.parse(status) === "ACTIVE"
  );
}
