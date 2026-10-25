import {
  ReceiptSchema,
  type Receipt,
} from "@/lib/domain/voting/receipt.vo";

/**
 * Application stub until the API exists (F7).
 * Orchestrates and assembles the read model; it decides no business rules.
 * Domain Zod validates the model before it reaches the view.
 */
export async function getReceipt(id: string): Promise<Receipt | null> {
  if (id === "fallido") {
    return ReceiptSchema.parse({
      proposal: "Mantenimiento de áreas comunes",
      steps: [
        {
          key: "signed",
          label: "Firmado",
          dateTime: "12/02/2026 · 10:01 PET (UTC−5)",
          status: "done",
        },
        {
          key: "queued",
          label: "En cola",
          dateTime: "12/02/2026 · 10:02 PET (UTC−5)",
          status: "done",
        },
        {
          key: "sent",
          label: "Enviado",
          dateTime: "12/02/2026 · 10:03 PET (UTC−5)",
          status: "done",
        },
        {
          key: "failed",
          label: "Fallido",
          dateTime: "12/02/2026 · 10:04 PET (UTC−5)",
          status: "failed",
        },
      ],
      result: {
        status: "FAILED",
        reason: "Rechazado por la red. Reintento automático 1 de 3 en curso.",
        retryable: true,
      },
    });
  }

  if (id !== "demo") return null;

  return ReceiptSchema.parse({
    proposal: "Mantenimiento de áreas comunes",
    steps: [
      {
        key: "signed",
        label: "Firmado",
        dateTime: "12/02/2026 · 10:01 PET (UTC−5)",
        status: "done",
      },
      {
        key: "queued",
        label: "En cola",
        dateTime: "12/02/2026 · 10:02 PET (UTC−5)",
        status: "done",
      },
      {
        key: "sent",
        label: "Enviado",
        dateTime: "12/02/2026 · 10:03 PET (UTC−5)",
        status: "done",
      },
      {
        key: "confirmed",
        label: "Confirmado en blockchain",
        dateTime: "12/02/2026 · 10:04 PET (UTC−5)",
        status: "done",
      },
    ],
    result: {
      status: "CONFIRMED",
      hash:
        "0x9f3a7c21b8e4d5f6a2c9b0d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
      explorerUrl: "https://explorador.example/voto/0x9f3a",
    },
  });
}
