import { z } from "zod";

export const CriterionToneSchema = z.enum(["success", "warning", "danger", "neutral"]);

export const ChecklistCriterionSchema = z.object({
  question: z.string().min(1),
  met: z.boolean(),
  status: z.string().min(1),
  tone: CriterionToneSchema,
});

export const AuthorizationResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("AUTHORIZED"),
    code: z.string().min(1),
    validUntil: z.string().min(1),
  }),
  z.object({ status: z.literal("DENIED"), reason: z.string().min(1) }),
  z.object({ status: z.literal("EXPIRED") }),
]);

export const AuthorizationCaseSchema = z.object({
  membership: ChecklistCriterionSchema,
  biometrics: ChecklistCriterionSchema,
  result: AuthorizationResultSchema,
});

export type CriterionTone = z.infer<typeof CriterionToneSchema>;
export type ChecklistCriterion = z.infer<typeof ChecklistCriterionSchema>;
export type AuthorizationResult = z.infer<typeof AuthorizationResultSchema>;
export type AuthorizationCase = z.infer<typeof AuthorizationCaseSchema>;
