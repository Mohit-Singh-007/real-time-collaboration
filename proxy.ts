
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(req: NextRequest) {
  const session = getSessionCookie(req)
  const { pathname } = req.nextUrl

  const isAuth = !!session
  const isPublic = pathname.startsWith("/login")

  if (!isAuth && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuth && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*"],
}