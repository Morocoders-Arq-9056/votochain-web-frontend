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

export class ApiError extends Error {
  readonly status: number;
  readonly backendMessage: string;

  constructor(status: number, backendMessage: string) {
    super(translateError(backendMessage));
    this.name = "ApiError";
    this.status = status;
    this.backendMessage = backendMessage;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message =
      typeof data?.message === "string" ? data.message : `HTTP_${res.status}`;
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}
