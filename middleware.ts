import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/verify-email", "/menu"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/public/") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("user");

  // ─── Not authenticated ───────────────────────────────────────────────────
  if (!cookie) {
    // Protect admin and rider sections from unauthenticated access
    if (pathname.startsWith("/admin") || pathname.startsWith("/rider")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let user: { role?: string } | null = null;
  try {
    user = JSON.parse(cookie.value);
  } catch {
    // Corrupt cookie — clear and send to login
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("user");
    res.cookies.delete("token");
    return res;
  }

  const role = user?.role;

  // ─── Redirect authenticated users away from auth pages ───────────────────
  const AUTH_PATHS = ["/login", "/register", "/verify-email"];
  if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (role === "rider") { url.pathname = "/rider"; return NextResponse.redirect(url); }
    if (role === "admin") { url.pathname = "/admin"; return NextResponse.redirect(url); }
    url.pathname = "/"; // user role
    return NextResponse.redirect(url);
  }

  // ─── Role-based guards ───────────────────────────────────────────────────

  // Admins can go anywhere
  if (role === "admin") {
    return NextResponse.next();
  }

  // Riders: keep on /rider, redirect away from /admin and /
  if (role === "rider") {
    if (pathname === "/") {
      url.pathname = "/rider";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/admin")) {
      url.pathname = "/rider";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Regular users: block /admin and /rider
  if (role === "user") {
    if (pathname.startsWith("/admin")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/rider")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Unknown role — send to home
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
