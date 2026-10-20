import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root path redirect based on Accept-Language
  if (pathname === "/") {
    const acceptLang = request.headers.get("accept-language") || "";
    const isGerman = /^(de\b|de-)/i.test(acceptLang.trim());
    const targetLocale = isGerman ? "de-de" : "de-en";
    const redirectUrl = new URL(`/${targetLocale}`, request.url);
    return NextResponse.redirect(redirectUrl, 307);
  }

  // Allowed locales
  if (pathname.startsWith("/de-de") || pathname.startsWith("/de-en")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    const localeTag = pathname.startsWith("/de-de") ? "de-DE" : "en-DE";
    requestHeaders.set("x-locale", localeTag);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Static assets and internal next paths bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/branding") ||
    pathname.startsWith("/derived") ||
    pathname.startsWith("/founder") ||
    pathname.startsWith("/partners") ||
    pathname.startsWith("/media") ||
    pathname === "/favicon.ico" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Any other unprefixed route (e.g. /nicht-existiert) falls through without redirect
  // with English default for the root 404 handler.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-locale", "en-DE");
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
