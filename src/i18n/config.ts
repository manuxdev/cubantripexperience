export const supportedLocales = ["es", "en", "ru"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "es";

export const localeMetadata: Record<Locale, { readonly label: string }> = {
  es: { label: "Español" },
  en: { label: "English" },
  ru: { label: "Русский" },
};

export const i18n = {
  defaultLocale,
  supportedLocales,
  localeMetadata,
} as const;
