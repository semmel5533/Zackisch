import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

export const proxy = convexAuthNextjsMiddleware((request) => {
  const url = request.nextUrl;
  const token = url.searchParams.get("token");

  const terminalMatch = url.pathname.match(
    /^\/(orders|availability|staff)\/([^/]+)/,
  );
  if (token && terminalMatch) {
    const [, surface, organizationId] = terminalMatch;
    const prefix = surface === "orders" ? "order" : surface;
    const redirectUrl = url.clone();
    redirectUrl.searchParams.delete("token");
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(`${prefix}_session_${organizationId}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
