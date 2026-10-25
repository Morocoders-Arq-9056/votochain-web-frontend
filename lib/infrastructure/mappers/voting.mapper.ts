import {
  ReceiptSchema,
  type Receipt,
} from "@/lib/domain/voting/receipt.vo";
import { translateError } from "@/lib/infrastructure/api-client";

export type VoteReceiptResource = {
  voteId: string;
  proposalId: string;
  voterAddress: string;
  choice: string;
  status: string;
  txHash: string | null;
};

export function mapDeliveryStatus(code: string): string {
  return translateError(code);
}

/**
 * Backend (status, message) → español es-PE. Fuente: voting-exception.filter
 * (409 ReplayRejected/AuthorizationAlreadyConsumed, 422 ProposalNotOpen,
 * 410 AuthorizationExpired, 404 desconocidos).
 */
export function toCastVoteError(status: number, message: string): string {
  if (
    status === 409 &&
    (message === "ReplayRejected" ||
      message === "AuthorizationAlreadyConsumed")
  ) {
    return "Ya usó esta autorización";
  }
  if (status === 422 && message === "ProposalNotOpen") {
    return "Votación cerrada, voto tardío rechazado";
  }
  if (status === 410 && message === "AuthorizationExpired") {
    return "La autorización venció. Solicite una nueva desde el detalle de la propuesta.";
  }
  if (status === 404) {
    return "No encontramos ese registro. Vuelva al inicio.";
  }
  return "Ocurrió un error. Intente de nuevo.";
}

function toStepStatus(
  status: string,
): "done" | "current" | "failed" {
  const normalized = status.toUpperCase();
  if (normalized === "CONFIRMED") return "done";
  if (normalized === "FAILED" || normalized === "ABANDONED") return "failed";
  return "current";
}

/**
 * DTO crudo → VO de dominio. El hash solo cruza si el voto ya está CONFIRMED;
 * la firma nunca viaja en este recurso y jamás se expone.
 */
export function toReceipt(dto: VoteReceiptResource): Receipt {
  const confirmed = dto.status.toUpperCase() === "CONFIRMED";
  return ReceiptSchema.parse({
    proposal: dto.proposalId,
    steps: [
      { key: "cast", label: "Firmado", status: "done" as const },
      {
        key: "delivery",
        label: confirmed ? "Confirmado en blockchain" : "En curso",
        status: toStepStatus(dto.status),
      },
    ],
    result: confirmed
      ? {
          status: "CONFIRMED" as const,
          hash: dto.txHash ?? dto.voteId,
        }
      : {
          status: "FAILED" as const,
          reason: "Su voto aún no cuenta. Consulte su recibo.",
          retryable: true,
        },
  });
}
