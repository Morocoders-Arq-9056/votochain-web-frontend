import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [
  /^\/(votar|propuestas|recibo|padron|permisos|documento|autorizacion|cuenta|usuarios|biometria|prueba-de-vida|mi-verificacion|verificar-correo|ingresar-codigo|solicitar-codigo|cierre)/,
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");
  if (PROTECTED.some((re) => re.test(pathname)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/votar",
    "/autorizacion",
    "/padron",
    "/documento",
    "/documento/:path*",
    "/permisos",
    "/propuestas/:path*",
    "/recibo/:path*",
    "/cuenta",
    "/usuarios",
    "/biometria",
    "/prueba-de-vida",
    "/mi-verificacion",
    "/verificar-correo",
    "/ingresar-codigo",
    "/solicitar-codigo",
    "/cierre/:path*",
  ],
};
