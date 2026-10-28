/**
 * Date formatting for the UI (es-PE). The wire format is UTC; the user reads
 * PET (UTC−5).
 */
const PET_TIME_ZONE = "America/Lima";

const DATE_TIME = new Intl.DateTimeFormat("es-PE", {
  timeZone: PET_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const TIME = new Intl.DateTimeFormat("es-PE", {
  timeZone: PET_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatPetDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${DATE_TIME.format(date)} · ${TIME.format(date)} PET (UTC−5)`;
}

export function formatPetTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${TIME.format(date)} PET (UTC−5)`;
}
