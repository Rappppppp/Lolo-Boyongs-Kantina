import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const cookie = req.cookies.get("user");
  if (!cookie) return NextResponse.next();

  let user;
  try {
    user = JSON.parse(cookie.value);
  } catch {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  // Rider trying to access home page (/) → redirect to /rider
  if (user.role === "rider" && req.nextUrl.pathname === "/") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/rider";
    return NextResponse.redirect(redirectUrl);
  }

  // User trying to access /rider → redirect to home (/)
  if (user.role === "user" && url.pathname.startsWith("/rider")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next).*)"], // apply to all pages except _next
};
