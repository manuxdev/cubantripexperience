# i18n foundation

`config.ts` defines the supported locales (`es`, `en`, and `ru`), Spanish as the default locale, and locale metadata. Use the pure `localePath()` and `localeHomePath()` builders from `routes.ts` only when a localized route exists.

Spanish page content lives under `content/es/`. To add a Spanish page, add a typed `as const` content module in that directory and import it from the Spanish page/component. Keep its links pointed at the currently implemented routes until localized replacements are migrated.

To add a future locale, add its code and metadata to `config.ts`, then add only the page-content modules that have translated content. Do not create placeholder translation files. Add localized routes before using the route builders in rendered links.
