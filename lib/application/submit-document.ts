import type { IdentityPort } from "@/lib/domain/identity/ports";
import {
  DocumentUploadSchema,
  type DocumentVerdict,
} from "@/lib/domain/identity/document.vo";

export function createDocumentService(port: IdentityPort) {
  return {
    async upload(input: {
      personId: unknown;
      upload: unknown;
    }): Promise<{ verdict: DocumentVerdict }> {
      return port.uploadDocument({
        personId: String(input.personId ?? ""),
        upload: DocumentUploadSchema.parse(input.upload),
      });
    },
    async verdict(input: {
      personId: unknown;
      documentRef: unknown;
    }): Promise<{ verdict: DocumentVerdict }> {
      return port.documentVerdict({
        personId: String(input.personId ?? ""),
        documentRef: String(input.documentRef ?? ""),
      });
    },
  };
}
