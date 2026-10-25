import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";

export type TonoCriterio = "success" | "warning" | "danger" | "neutral";

export type CriterioChecklist = {
  pregunta: string;
  cumple: boolean;
  estado: string;
  tono: TonoCriterio;
};

export type ResultadoAutorizacion =
  | { estado: "AUTORIZADA"; codigo: string; validaHasta: string }
  | { estado: "DENEGADA"; motivo: string }
  | { estado: "EXPIRADA" };

type VoteAuthorizationChecklistProps = {
  propuesta: string;
  membresia: CriterioChecklist;
  biometria: CriterioChecklist;
  resultado: ResultadoAutorizacion;
  onVotarAhora?: () => void;
  onIrAPruebaDeVida?: () => void;
  onPedirDeNuevo?: () => void;
};

function Criterio({ criterio }: { criterio: CriterioChecklist }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-base text-text-primary">{criterio.pregunta}</span>
      <Badge tone={criterio.tono}>{criterio.estado}</Badge>
    </div>
  );
}

export function VoteAuthorizationChecklist({
  propuesta,
  membresia,
  biometria,
  resultado,
  onVotarAhora,
  onIrAPruebaDeVida,
  onPedirDeNuevo,
}: VoteAuthorizationChecklistProps) {
  const autorizada = resultado.estado === "AUTORIZADA";
  const expirada = resultado.estado === "EXPIRADA";
  const sinBiometria = !biometria.cumple;

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <header className="flex flex-col gap-1">
        <h2 className="font-display text-xl text-text-primary">
          Autorización
        </h2>
        <span className="text-base text-text-secondary">{propuesta}</span>
      </header>

      <div className="flex flex-col gap-4">
        <Criterio criterio={membresia} />
        <Criterio criterio={biometria} />
      </div>

      {autorizada && (
        <div className="flex flex-col gap-2">
          <Badge tone="success">Autorizada</Badge>
          <p className="text-base text-text-primary">
            Autorización de un solo uso {resultado.codigo}, válida hasta{" "}
            {resultado.validaHasta}.
          </p>
          <p className="text-sm text-text-secondary">
            Al emitirla se congelaron su elegibilidad y el veredicto biométrico.
            Los cambios posteriores no reescriben esta autorización.
          </p>
        </div>
      )}

      {resultado.estado === "DENEGADA" && (
        <div className="flex flex-col gap-2">
          <Badge tone="danger">Denegada</Badge>
          <p className="text-base text-text-primary">
            No puede votar en esta propuesta
          </p>
          <p className="text-sm text-text-secondary">{resultado.motivo}</p>
        </div>
      )}

      {expirada && (
        <div className="flex flex-col gap-2">
          <Badge tone="neutral">Expirada</Badge>
          <p className="text-base text-text-primary">La autorización venció</p>
          <p className="text-sm text-text-secondary">
            Para votar, solicite una nueva autorización desde el detalle de la
            propuesta.
          </p>
        </div>
      )}

      <div className="form-actions">
        {autorizada && (
          <Button type="button" onClick={onVotarAhora}>
            Votar ahora
          </Button>
        )}
        {sinBiometria && (
          <Button type="button" variant="secondary" onClick={onIrAPruebaDeVida}>
            Ir a prueba de vida
          </Button>
        )}
        {expirada && (
          <Button type="button" onClick={onPedirDeNuevo}>
            Pedir de nuevo
          </Button>
        )}
      </div>
    </section>
  );
}
