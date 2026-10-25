import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [/^\/(votar|propuestas|recibo|padron|permisos|documento)/];

export function middleware(request: NextRequest) {
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
    "/padron",
    "/documento",
    "/permisos",
    "/propuestas/:path*",
    "/recibo/:path*",
  ],
};
