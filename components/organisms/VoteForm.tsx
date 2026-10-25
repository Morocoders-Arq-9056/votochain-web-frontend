import { Button } from "@/components/atoms/Button";
import { RadioCard } from "@/components/atoms/RadioCard";

export type OpcionVoto = {
  valor: string;
  etiqueta: string;
  descripcion?: string;
};

type VoteFormProps = {
  propuestaTitulo: string;
  reglaCongelada: string;
  votanteResumen: string;
  autorizacionCodigo: string;
  validaHasta: string;
  opciones: OpcionVoto[];
  seleccionada: string | null;
  onSeleccionar: (valor: string) => void;
  onSolicitarFirma: () => void;
  firmando?: boolean;
};

export function VoteForm({
  propuestaTitulo,
  reglaCongelada,
  votanteResumen,
  autorizacionCodigo,
  validaHasta,
  opciones,
  seleccionada,
  onSeleccionar,
  onSolicitarFirma,
  firmando = false,
}: VoteFormProps) {
  const hayOpcion = Boolean(seleccionada);
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <span className="text-sm text-text-secondary">
          Miembro / Condominio Los Olivos
        </span>
        <h1 className="font-display text-2xl text-text-primary">Emitir voto</h1>
        <span className="text-base text-text-primary">{propuestaTitulo}</span>
        <span className="text-sm text-text-secondary">{reglaCongelada}</span>
      </header>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
        <span className="text-base font-semibold text-text-primary">
          {votanteResumen}
        </span>
        <span className="text-sm text-text-secondary">
          Autorización {autorizacionCodigo} · hasta {validaHasta}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-base font-semibold text-text-primary">
          Seleccione una opción
        </span>
        <div role="radiogroup" className="flex flex-col gap-2">
          {opciones.map((opcion) => (
            <RadioCard
              key={opcion.valor}
              name="opcion-voto"
              valor={opcion.valor}
              etiqueta={opcion.etiqueta}
              descripcion={opcion.descripcion}
              seleccionada={seleccionada === opcion.valor}
              onSeleccionar={onSeleccionar}
            />
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={onSolicitarFirma}
        disabled={!hayOpcion}
        loading={firmando}
      >
        Firmar y votar
      </Button>
      <p className="text-sm text-text-secondary">
        {hayOpcion
          ? "Revisará el contenido antes de autorizar la firma."
          : "Elija una opción para habilitar la firma. Aún no se ha firmado ni consumido la autorización."}
      </p>
      <p className="text-sm text-text-secondary">
        La firma requiere su autorización explícita. Se olvida inmediatamente.
        Solo Confirmado cuenta.
      </p>
    </section>
  );
}
