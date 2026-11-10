/**
 * Frontend-owned route map. The backend returns domain data only
 * (ids, statuses, codes) — never URLs. Every navigation in `app/`
 * and `components/` must build its target through this module;
 * no hardcoded route literals outside of it.
 */
export const routes = {
  home: () => "/",
  login: () => "/login",
  registro: () => "/registro",
  verificarCorreo: () => "/verificar-correo",
  ingresarCodigo: (input?: {
    purpose?: "vote" | "recovery";
    email?: string;
  }) => {
    const params = new URLSearchParams();
    if (input?.purpose) params.set("purpose", input.purpose);
    if (input?.email) params.set("email", input.email);
    const query = params.toString();
    return query ? `/ingresar-codigo?${query}` : "/ingresar-codigo";
  },
  solicitarCodigo: () => "/solicitar-codigo",
  cuenta: () => "/cuenta",
  usuarios: () => "/usuarios",
  votar: (input?: { authorization?: string; proposal?: string }) => {
    const params = new URLSearchParams();
    if (input?.authorization) params.set("authorization", input.authorization);
    if (input?.proposal) params.set("proposal", input.proposal);
    const query = params.toString();
    return query ? `/votar?${query}` : "/votar";
  },
  propuestas: () => "/propuestas/demo",
  propuesta: (id: string) => `/propuestas/${id}`,
  autorizacion: (input?: { proposal?: string }) => {
    const params = new URLSearchParams();
    if (input?.proposal) params.set("proposal", input.proposal);
    const query = params.toString();
    return query ? `/autorizacion?${query}` : "/autorizacion";
  },
  cierre: (id: string) => `/cierre/${id}`,
  recibo: (voteId: string) => `/recibo/${voteId}`,
  padron: () => "/padron",
  permisos: () => "/permisos",
  documento: () => "/documento",
  documentoResultado: () => "/documento/resultado",
  biometria: () => "/biometria",
  pruebaDeVida: () => "/prueba-de-vida",
  miVerificacion: () => "/mi-verificacion",
} as const;

export type AppRoute = keyof typeof routes;
