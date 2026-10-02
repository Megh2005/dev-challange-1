import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = (token?.role as string | undefined)?.toLowerCase();

  if (pathname.startsWith("/raghav")) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (!userRole) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if (userRole !== "engineer") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  if (pathname.startsWith("/onboarding")) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", "/onboarding");
      return NextResponse.redirect(signInUrl);
    }
    if (userRole) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  if (pathname.startsWith("/profile")) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (pathname === "/auth" && isAuthenticated) {
    const destination = !userRole ? "/onboarding" : "/profile";
    return NextResponse.redirect(new URL(destination, req.url));
  }


  const requestHeaders = new Headers(req.headers);
  if (isAuthenticated && token) {
    requestHeaders.set("x-auth-id", String(token.id || token.sub || ""));
    requestHeaders.set("x-auth-role", String(token.role || ""));
    if (token.email) {
      requestHeaders.set("x-auth-email", String(token.email));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/raghav/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
    "/auth",
  ],
};
