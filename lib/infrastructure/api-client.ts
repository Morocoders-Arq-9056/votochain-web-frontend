import { env } from "@/lib/infrastructure/env";

/**
 * Transport-level error: it carries the HTTP status and the backend message
 * verbatim. Translating it into a domain code is the job of
 * `error-mapping.ts`; the es-PE text lives in `lib/ui/copy.ts`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly backendMessage: string;

  constructor(status: number, backendMessage: string) {
    super(backendMessage);
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
