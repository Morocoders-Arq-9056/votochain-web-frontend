export function isProtectedPath(pathname: string): boolean {
  return /^\/(votar|voting|community|privacy|identity|padron|propuestas|recibo|permisos|documento)/.test(
    pathname,
  );
}
