"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";

type SignModalProps = {
  open: boolean;
  proposalTitle: string;
  optionLabel: string;
  voterSummary: string;
  onSign: () => void;
  onCancel: () => void;
  signing?: boolean;
};

export function SignModal({
  open,
  proposalTitle,
  optionLabel,
  voterSummary,
  onSign,
  onCancel,
  signing = false,
}: SignModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text-primary/40 sm:items-center"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-4 rounded-t-sheet bg-surface p-6 sm:rounded-lg"
      >
        <h2 id="sign-modal-title" className="font-display text-xl text-text-primary">
          Autoriza firmar este contenido
        </h2>
        <div className="flex flex-col gap-1">
          <span className="text-base text-text-primary">{proposalTitle}</span>
          <span className="text-base text-text-primary">{optionLabel}</span>
          <span className="text-sm text-text-secondary">{voterSummary}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-border bg-bg p-4">
          <span className="text-base text-text-primary">
            La firma se olvida inmediatamente
          </span>
          <span className="text-sm text-text-secondary">
            Su voto firmado aún no cuenta. Solo los votos confirmados en
            blockchain cuentan en el escrutinio.
          </span>
        </div>
        <div className="dialog-actions">
          <Button type="button" onClick={onSign} loading={signing}>
            Firmar
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
