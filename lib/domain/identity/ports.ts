import type {
  BiometricReferenceStatus,
  LivenessStatus,
  LivenessStep,
} from "./liveness.vo";
import type { DocumentUpload, DocumentVerdict } from "./document.vo";
import type { VerificationVerdict } from "./verification.vo";

export interface IdentityPort {
  uploadDocument(input: {
    personId: string;
    upload: DocumentUpload;
  }): Promise<{ verdict: DocumentVerdict }>;
  documentVerdict(input: {
    personId: string;
    documentRef: string;
  }): Promise<{ verdict: DocumentVerdict }>;
  referenceStatus(input: {
    personId: string;
  }): Promise<{ status: BiometricReferenceStatus }>;
  enrollReference(input: {
    personId: string;
  }): Promise<{ status: BiometricReferenceStatus }>;
  startLiveness(input: {
    personId: string;
  }): Promise<{ attemptId: string; step: LivenessStep; status: LivenessStatus }>;
  confirmLiveness(input: {
    attemptId: string;
  }): Promise<{
    status: LivenessStatus;
    verdict: VerificationVerdict;
  }>;
}
