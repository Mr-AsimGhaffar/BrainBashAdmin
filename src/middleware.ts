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
  return matchLocale(languages, locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set("x-current-path", pathname);
  const isRootPath = pathname === "/";
  const locale = getLocale(request);
  const hasValidToken = request.cookies.has("accessToken");

  const publicRoutes = [
    `/${locale}/index/quizHome`,
    `/${locale}/index/createQuiz`,
    `/${locale}/index/quizzesList`,
    `/${locale}/auth/login`,
    `/${locale}/auth/sign-up`,
  ];

  if (isRootPath) {
    return NextResponse.redirect(
      new URL(`/${locale}/index/quizHome`, request.url)
    );
  }

  if (!hasValidToken && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
