import { z } from "zod";

export const ConsentRecordSchema = z.object({
  purpose: z.enum(["biometrics", "contact", "document"]),
  status: z.enum(["ALLOWED", "WITHDRAWN"]),
  policyVersion: z.string().min(1),
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

export function requiresContactBlock(consents: ConsentRecord[]): boolean {
  const parsed = z.array(ConsentRecordSchema).parse(consents);
  const contact = parsed.find((c) => c.purpose === "contact");
  return contact?.status === "WITHDRAWN";
}
