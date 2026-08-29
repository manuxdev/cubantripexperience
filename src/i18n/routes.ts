import type { Locale } from "./config";

const normalizePathname = (pathname: string): string => {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
};

/** Builds a locale-prefixed route without consulting request state. */
export const localePath = (locale: Locale, pathname = "/"): string => {
  const path = normalizePathname(pathname);
  return path === "/" ? `/${locale}/` : `/${locale}${path}`;
};

export const localeHomePath = (locale: Locale): string => localePath(locale);
