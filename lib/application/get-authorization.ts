import {
  AuthorizationCaseSchema,
  type AuthorizationCase,
  type ChecklistCriterion,
} from "@/lib/domain/voting/authorization.vo";

/**
 * Application stub until the API exists (F7).
 * Assembles the P24 checklist model from a mock case; decides no rules.
 * Domain Zod validates the model before it reaches the view.
 */
export async function getAuthorization(caso?: string): Promise<AuthorizationCase> {
  const activeMembership: ChecklistCriterion = {
    question: "1. ¿Membresía activa?",
    met: true,
    status: "Sí · Activa",
    tone: "success",
  };
  const freshBiometrics: ChecklistCriterion = {
    question: "2. ¿Biometría fresca?",
    met: true,
    status: "Sí · Verificado",
    tone: "success",
  };

  if (caso === "mora") {
    return AuthorizationCaseSchema.parse({
      membership: {
        question: "1. ¿Membresía activa?",
        met: false,
        status: "No · Moroso",
        tone: "warning",
      },
      biometrics: freshBiometrics,
      result: {
        status: "DENIED",
        reason:
          "Su membresía está morosa. Revise su situación con el administrador de la comunidad.",
      },
    });
  }

  if (caso === "noverificado") {
    return AuthorizationCaseSchema.parse({
      membership: activeMembership,
      biometrics: {
        question: "2. ¿Biometría fresca?",
        met: false,
        status: "No · Expirado",
        tone: "neutral",
      },
      result: {
        status: "DENIED",
        reason:
          "Su membresía está activa. Complete la prueba de vida; no se emitió ninguna autorización.",
      },
    });
  }

  if (caso === "expirada") {
    return AuthorizationCaseSchema.parse({
      membership: activeMembership,
      biometrics: freshBiometrics,
      result: { status: "EXPIRED" },
    });
  }

  return AuthorizationCaseSchema.parse({
    membership: activeMembership,
    biometrics: freshBiometrics,
    result: {
      status: "AUTHORIZED",
      code: "AUT-4821-0212",
      validUntil: "10:05 PET (UTC−5)",
    },
  });
}
