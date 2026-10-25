import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoteForm, type OpcionVoto } from "./VoteForm";

const opciones: OpcionVoto[] = [
  { valor: "SI", etiqueta: "Sí", descripcion: "Apruebo la propuesta" },
  { valor: "NO", etiqueta: "No", descripcion: "No apruebo la propuesta" },
  { valor: "ABSTENCION", etiqueta: "Abstención" },
];

describe("VoteForm", () => {
  it("muestra las tres opciones y la regla congelada", () => {
    render(
      <VoteForm
        propuestaTitulo="Mantenimiento de áreas comunes"
        reglaCongelada="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        votanteResumen="María Quispe · DNI 4821xxxx · Dpto 302"
        autorizacionCodigo="AUT-4821-0212"
        validaHasta="10:05 PET (UTC−5)"
        opciones={opciones}
        seleccionada={null}
        onSeleccionar={() => undefined}
        onSolicitarFirma={() => undefined}
      />,
    );

    expect(screen.getByRole("radio", { name: /Sí/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /No/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Abstención/ })).toBeInTheDocument();
    expect(screen.getByText(/Regla aplicada: 50%\+1/)).toBeInTheDocument();
    expect(screen.getByText(/AUT-4821-0212/)).toBeInTheDocument();
  });

  it("deshabilita Firmar y votar hasta elegir opción", () => {
    render(
      <VoteForm
        propuestaTitulo="Mantenimiento de áreas comunes"
        reglaCongelada="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        votanteResumen="María Quispe · DNI 4821xxxx · Dpto 302"
        autorizacionCodigo="AUT-4821-0212"
        validaHasta="10:05 PET (UTC−5)"
        opciones={opciones}
        seleccionada={null}
        onSeleccionar={() => undefined}
        onSolicitarFirma={() => undefined}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Firmar y votar" }),
    ).toBeDisabled();
    expect(
      screen.getByText(/Elija una opción para habilitar la firma/),
    ).toBeInTheDocument();
  });

  it("emite onSeleccionar al marcar una opción", async () => {
    const onSeleccionar = vi.fn();
    render(
      <VoteForm
        propuestaTitulo="Mantenimiento de áreas comunes"
        reglaCongelada="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        votanteResumen="María Quispe · DNI 4821xxxx · Dpto 302"
        autorizacionCodigo="AUT-4821-0212"
        validaHasta="10:05 PET (UTC−5)"
        opciones={opciones}
        seleccionada={null}
        onSeleccionar={onSeleccionar}
        onSolicitarFirma={() => undefined}
      />,
    );

    await userEvent.click(screen.getByRole("radio", { name: /Sí/ }));
    expect(onSeleccionar).toHaveBeenCalledWith("SI");
  });

  it("con opción elegida habilita el botón y emite onSolicitarFirma", async () => {
    const onSolicitarFirma = vi.fn();
    render(
      <VoteForm
        propuestaTitulo="Mantenimiento de áreas comunes"
        reglaCongelada="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
        votanteResumen="María Quispe · DNI 4821xxxx · Dpto 302"
        autorizacionCodigo="AUT-4821-0212"
        validaHasta="10:05 PET (UTC−5)"
        opciones={opciones}
        seleccionada="SI"
        onSeleccionar={() => undefined}
        onSolicitarFirma={onSolicitarFirma}
      />,
    );

    const boton = screen.getByRole("button", { name: "Firmar y votar" });
    expect(boton).toBeEnabled();
    await userEvent.click(boton);
    expect(onSolicitarFirma).toHaveBeenCalledTimes(1);
  });
});
