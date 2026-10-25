import { env } from "@/lib/infrastructure/env";

const ERROR_ES_PE: Record<string, string> = {
  DeliveryConfirmed: "Tu voto ya cuenta",
  DoubleVote: "Ya usó esta autorización",
  LateVoteRejected: "Votación cerrada, voto tardío rechazado",
  VerdictExpired: "Necesita verificar su rostro ahora",
  UNREADABLE: "Documento borroso, retome la foto",
  "DeliveryFailed": "No se pudo registrar. Contacte soporte, no vote de nuevo con la misma autorización",
};

export function translateError(code: string): string {
  return ERROR_ES_PE[code] ?? "Ocurrió un error. Intente de nuevo.";
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const code = typeof data?.code === "string" ? data.code : `HTTP_${res.status}`;
    throw new Error(translateError(code));
  }
  return res.json() as Promise<T>;
}
