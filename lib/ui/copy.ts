import type { VoteCastErrorCode } from "@/lib/domain/voting/vote-cast-error";

/**
 * Shared UI kernel: all user-facing copy in Spanish (es-PE, treatment of
 * "usted"). One source of truth — components, application services and
 * infrastructure read from here.
 */

export const RECORD_LABEL = "Código de constancia (hash al expandir)";
export const WALLET_WARNING = "Nunca pedir ni mostrar claves";

export const SIGNED_VOTE_PENDING_TITLE = "Su voto firmado aún no cuenta";
export const SIGNED_VOTE_PENDING_DETAIL =
  "Su intención se firmó y está en cola de envío. Solo Confirmado en blockchain cuenta.";
export const SIGNED_VOTE_PENDING_ACTION = "Ver recibo";

export const CONSUMED_AUTHORIZATION_TITLE = "Ya usó esta autorización";
export const CONSUMED_AUTHORIZATION_DETAIL =
  "La autorización fue consumida al firmar. El voto original se conserva. Consulte su recibo; no vuelva a votar con esta autorización.";

export const LATE_VOTE_TITLE = "Votación cerrada, voto tardío rechazado";
export const LATE_VOTE_DETAIL =
  "La propuesta cerró. No se firmó ni registró este intento. La autorización no permite votar después del cierre.";

export const AUTHORIZATION_EXPIRED_TITLE = "La autorización venció";
export const AUTHORIZATION_EXPIRED_DETAIL =
  "Para votar, solicite una nueva autorización desde el detalle de la propuesta.";

export const NOT_FOUND_TITLE = "No encontramos ese registro";
export const NOT_FOUND_DETAIL = "Vuelva al inicio e intente de nuevo.";

export const UNAVAILABLE_TITLE = "No pudimos registrar su voto";
export const UNAVAILABLE_DETAIL =
  "Ocurrió un error. Intente de nuevo; su autorización sigue disponible.";

export const UNEXPECTED_TITLE = "Ocurrió un error";
export const UNEXPECTED_DETAIL = "Intente de nuevo en unos minutos.";

export const VOTE_CAST_MESSAGES: Record<VoteCastErrorCode, string> = {
  DOUBLE_VOTE: CONSUMED_AUTHORIZATION_TITLE,
  LATE_VOTE: LATE_VOTE_TITLE,
  AUTHORIZATION_EXPIRED: AUTHORIZATION_EXPIRED_TITLE,
  NOT_FOUND: NOT_FOUND_TITLE,
  UNAVAILABLE: UNAVAILABLE_TITLE,
  UNEXPECTED: UNEXPECTED_TITLE,
};

export const VOTE_CAST_DETAILS: Record<VoteCastErrorCode, string> = {
  DOUBLE_VOTE: CONSUMED_AUTHORIZATION_DETAIL,
  LATE_VOTE: LATE_VOTE_DETAIL,
  AUTHORIZATION_EXPIRED: AUTHORIZATION_EXPIRED_DETAIL,
  NOT_FOUND: NOT_FOUND_DETAIL,
  UNAVAILABLE: UNAVAILABLE_DETAIL,
  UNEXPECTED: UNEXPECTED_DETAIL,
};
