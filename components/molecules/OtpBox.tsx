"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { OtpInput } from "@/components/atoms/OtpInput";

type OtpBoxProps = {
  codigo: string;
  onCodigoChange: (codigo: string) => void;
  onVerificar?: () => void;
  onReenviar?: () => void;
  vigenciaSegundos?: number;
  intentosRestantes?: number;
  reenviando?: boolean;
  verificando?: boolean;
};

function formatTiempo(segundos: number): string {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

export function OtpBox({
  codigo,
  onCodigoChange,
  onVerificar,
  onReenviar,
  vigenciaSegundos = 300,
  intentosRestantes = 5,
  reenviando = false,
  verificando = false,
}: OtpBoxProps) {
  const [restantes, setRestantes] = useState(vigenciaSegundos);
  const [vigenciaPrevia, setVigenciaPrevia] = useState(vigenciaSegundos);

  if (vigenciaPrevia !== vigenciaSegundos) {
    setVigenciaPrevia(vigenciaSegundos);
    setRestantes(vigenciaSegundos);
  }

  useEffect(() => {
    if (restantes <= 0) return;
    const id = setInterval(() => {
      setRestantes((previo) => (previo > 0 ? previo - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [restantes]);

  const expirado = restantes <= 0;

  return (
    <div className="flex w-full flex-col gap-4">
      <OtpInput value={codigo} onChange={onCodigoChange} />
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span aria-live="polite">
          {expirado ? "El código expiró" : `Vigencia ${formatTiempo(restantes)}`}
        </span>
        <span>{intentosRestantes} intentos restantes</span>
      </div>
      <Button type="button" onClick={onVerificar} loading={verificando}>
        Verificar código
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onReenviar}
        loading={reenviando}
      >
        Reenviar código
      </Button>
      <p className="text-sm text-text-secondary">
        Reenviar invalida el código anterior. Un código confirmado no se puede
        reutilizar.
      </p>
    </div>
  );
}
