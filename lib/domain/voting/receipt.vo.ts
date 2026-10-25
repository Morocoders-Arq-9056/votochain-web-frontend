import { z } from "zod";

export const StepStatusSchema = z.enum(["done", "current", "failed"]);

export const ReceiptStepSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  dateTime: z.string().optional(),
  status: StepStatusSchema,
});

export const ReceiptResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("CONFIRMED"),
    hash: z.string().min(1),
    explorerUrl: z.string().url().optional(),
  }),
  z.object({
    status: z.literal("FAILED"),
    reason: z.string().min(1),
    retryable: z.boolean(),
  }),
]);

export const ReceiptSchema = z.object({
  proposal: z.string().min(1),
  steps: z.array(ReceiptStepSchema).min(1),
  result: ReceiptResultSchema,
});

export type StepStatus = z.infer<typeof StepStatusSchema>;
export type ReceiptStep = z.infer<typeof ReceiptStepSchema>;
export type ReceiptResult = z.infer<typeof ReceiptResultSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
