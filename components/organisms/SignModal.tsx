"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";

type SignModalProps = {
  open: boolean;
  propuestaTitulo: string;
  opcionEtiqueta: string;
  votanteResumen: string;
  onFirmar: () => void;
  onCancelar: () => void;
  firmando?: boolean;
};

export function SignModal({
  open,
  propuestaTitulo,
  opcionEtiqueta,
  votanteResumen,
  onFirmar,
  onCancelar,
  firmando = false,
}: SignModalProps) {
  useEffect(() => {
    if (!open) return;
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [open, onCancelar]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text-primary/40 sm:items-center"
      onClick={onCancelar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-firma"
        onClick={(evento) => evento.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-4 rounded-t-sheet bg-surface p-6 sm:rounded-lg"
      >
        <h2 id="titulo-firma" className="font-display text-xl text-text-primary">
          Autoriza firmar este contenido
        </h2>
        <div className="flex flex-col gap-1">
          <span className="text-base text-text-primary">{propuestaTitulo}</span>
          <span className="text-base text-text-primary">{opcionEtiqueta}</span>
          <span className="text-sm text-text-secondary">{votanteResumen}</span>
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
          <Button type="button" onClick={onFirmar} loading={firmando}>
            Firmar
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
