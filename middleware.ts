import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
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
  if (user.role === "rider" && url.pathname === "/") {
    url.pathname = "/rider";
    return NextResponse.redirect(url);
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
