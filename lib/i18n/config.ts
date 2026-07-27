export const i18n = {
  defaultLocale: "id",
  locales: ["id", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeNames: Record<Locale, string> = {
  en: "EN",
  id: "ID",
};

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}
