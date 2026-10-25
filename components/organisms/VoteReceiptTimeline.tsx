import { Badge } from "@/components/atoms/Badge";
import { StepDot, type EstadoPaso } from "@/components/atoms/StepDot";

export type PasoRecibo = {
  clave: string;
  etiqueta: string;
  fechaHora?: string;
  estado: EstadoPaso;
};

export type ResultadoRecibo =
  | { estado: "CONFIRMADO"; hash: string; exploradorUrl?: string }
  | { estado: "FALLIDO"; motivo: string; reintentable: boolean };

type VoteReceiptTimelineProps = {
  propuesta: string;
  pasos: PasoRecibo[];
  resultado: ResultadoRecibo;
};

export function VoteReceiptTimeline({
  propuesta,
  pasos,
  resultado,
}: VoteReceiptTimelineProps) {
  const confirmado = resultado.estado === "CONFIRMADO";
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <header className="flex flex-col gap-1">
        <span className="text-sm text-text-secondary">Miembro / Mi recibo</span>
        <h1 className="font-display text-2xl text-text-primary">Mi recibo</h1>
        <span className="text-base text-text-secondary">{propuesta}</span>
      </header>

      <div className="flex flex-col gap-2">
        {confirmado ? (
          <Badge tone="success">Confirmado</Badge>
        ) : resultado.reintentable ? (
          <Badge tone="warning">Fallido · reintentando</Badge>
        ) : (
          <Badge tone="danger">Fallido</Badge>
        )}

        {confirmado ? (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-success p-4">
            <span className="text-base font-semibold text-success">
              Ya cuenta en el escrutinio
            </span>
            <span className="text-sm text-text-secondary">
              Confirmado en blockchain. Solo los votos confirmados cuentan.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-danger p-4">
            <span className="text-base font-semibold text-danger">
              Aún no cuenta
            </span>
            <span className="text-sm text-text-secondary">{resultado.motivo}</span>
            <span className="text-sm text-text-secondary">
              {resultado.reintentable
                ? "Su voto firmado se conserva sin cambios. El sistema reintenta automáticamente. No hay reenvío manual."
                : "Su voto firmado se conserva sin cambios, pero no cuenta. No habrá más reintentos. Contacte soporte; no vuelva a votar con la misma autorización."}
            </span>
          </div>
        )}
      </div>

      <ol aria-live="polite" className="flex flex-col">
        {pasos.map((paso) => (
          <li key={paso.clave} className="flex gap-3 py-2">
            <StepDot estado={paso.estado} />
            <span className="flex flex-col">
              <span className="text-base text-text-primary">
                {paso.etiqueta}
                {paso.estado === "current" && " · estado actual"}
              </span>
              {paso.fechaHora && (
                <span className="text-sm text-text-secondary">
                  {paso.fechaHora}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      {confirmado && (
        <div className="flex flex-col gap-2">
          <details className="rounded-md border border-border bg-bg p-3">
            <summary className="cursor-pointer text-sm font-semibold text-text-primary">
              Código de constancia (hash al expandir)
            </summary>
            <code className="mt-2 block font-mono text-[13px] break-all text-text-secondary">
              {resultado.hash}
            </code>
          </details>
          {resultado.exploradorUrl && (
            <a
              href={resultado.exploradorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-brand-primary"
            >
              Ver en explorador blockchain
            </a>
          )}
        </div>
      )}
    </section>
  );
}
