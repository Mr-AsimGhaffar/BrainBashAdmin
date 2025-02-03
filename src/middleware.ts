import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "@/config/i18n";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = [...i18n.locales];
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  const isRootPath = pathname === "/";
  const locale = getLocale(request);

  // Check if pathname is missing locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if locale is missing
  if (pathnameIsMissingLocale) {
    const sanitizedPathname = pathname.startsWith("/")
      ? pathname.substring(1)
      : pathname;
    return NextResponse.redirect(
      new URL(`/${locale}/${sanitizedPathname || "auth/login"}`, request.url)
    );
  }

  if (isRootPath) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // Authentication checks
  const pathParts = pathname.split("/");
  const localePart = pathParts[1];
  const routeSegment = pathParts[2];

  const isProtectedRoute = routeSegment === "index";
  const isAuthRoute = routeSegment === "auth";
  const hasValidToken = request.cookies.has("accessToken");
  const role = request.cookies.get("role")?.value; // Get the role from cookies

  // Debugging: Log the role and token to the console for debugging purposes
  console.log("Role from cookies:", role);
  console.log("Has valid token:", hasValidToken);

  // Handle protected routes
  if (isProtectedRoute && !hasValidToken) {
    const loginUrl = new URL(`/${localePart}/auth/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based redirection logic
  if (hasValidToken && isAuthRoute) {
    if (role === "USER") {
      // If role is USER, redirect to /index/quizHome
      console.log("User is redirected to /index/quizHome");
      return NextResponse.redirect(
        new URL(`/${localePart}/index/quizHome`, request.url)
      );
    }
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      // If role is ADMIN or SUPER_ADMIN, redirect to /index/home
      console.log("Admin or SuperAdmin is redirected to /index/home");
      return NextResponse.redirect(
        new URL(`/${localePart}/index/home`, request.url)
      );
    }
  }

  // Prevent authenticated users from accessing auth routes
  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(
      new URL(`/${localePart}/index/home`, request.url)
    );
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
