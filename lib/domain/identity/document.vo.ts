import { z } from "zod";

export const DocumentTypeSchema = z.enum(["DNI", "CE", "PASSPORT"]);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const DocumentUploadSchema = z.object({
  documentType: DocumentTypeSchema,
  frontName: z.string().min(1),
  backName: z.string().min(1),
  selfieName: z.string().min(1),
  acceptedPolicyVersion: z.string().min(1),
});

export type DocumentUpload = z.infer<typeof DocumentUploadSchema>;

export const DocumentVerdictSchema = z.enum([
  "MATCH",
  "UNDER_REVIEW",
  "MISMATCH",
  "EXPIRED_DOCUMENT",
  "UNREADABLE_BLURRY",
  "UNREADABLE_GLARE",
  "UNREADABLE_CROPPED",
  "UNREADABLE_WRONG_TYPE",
]);

export type DocumentVerdict = z.infer<typeof DocumentVerdictSchema>;

export function isDocumentAccepted(verdict: DocumentVerdict): boolean {
  return (
    DocumentVerdictSchema.parse(verdict) === "MATCH" ||
    DocumentVerdictSchema.parse(verdict) === "UNDER_REVIEW"
  );
}
