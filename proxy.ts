import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Checagem otimista: só vê se existe um cookie de sessão.
// A autorização de verdade é feita no servidor (lib/permissoes.ts).
export function proxy(request: NextRequest) {
  const cookie = getSessionCookie(request);
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/reservar/:path*", "/minha-conta/:path*", "/admin/:path*"],
};