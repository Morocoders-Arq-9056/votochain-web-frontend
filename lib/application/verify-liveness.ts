import type { IdentityPort } from "@/lib/domain/identity/ports";

export function createLivenessService(port: IdentityPort) {
  return {
    async start(personId: unknown) {
      return port.startLiveness({ personId: String(personId ?? "") });
    },
    async confirm(attemptId: unknown) {
      return port.confirmLiveness({ attemptId: String(attemptId ?? "") });
    },
    async referenceStatus(personId: unknown) {
      return port.referenceStatus({ personId: String(personId ?? "") });
    },
    async enroll(personId: unknown) {
      return port.enrollReference({ personId: String(personId ?? "") });
    },
  };
}
