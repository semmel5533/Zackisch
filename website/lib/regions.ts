export interface LocaleOption {
  code: string; // e.g. "de-de", "de-en"
  lang: "de" | "en";
  label: string; // e.g. "Deutsch", "English"
}

export interface RegionConfig {
  code: string; // ISO 3166-1 alpha-2, e.g. "de"
  nativeName: string; // Endonym: primary native language spoken in that country, e.g. "Deutschland"
  name: {
    de: string;
    en: string;
  };
  defaultLocale: string;
  locales: LocaleOption[];
}

export const REGIONS: Record<string, RegionConfig> = {
  de: {
    code: "de",
    nativeName: "Deutschland",
    name: {
      de: "Deutschland",
      en: "Germany",
    },
    defaultLocale: "de-de",
    locales: [
      { code: "de-de", lang: "de", label: "Deutsch" },
      { code: "de-en", lang: "en", label: "English" },
    ],
  },
};

export const DEFAULT_REGION = "de";
export const DEFAULT_LOCALE = "de-de";

export const ALL_LOCALES = Object.values(REGIONS).flatMap((r) =>
  r.locales.map((l) => l.code),
);

export function parseLocale(pathOrLocale: string): {
  regionCode: string;
  lang: "de" | "en";
  locale: string;
} {
  const normalized = pathOrLocale.toLowerCase().replace(/^\/+/, "");
  const match = ALL_LOCALES.find(
    (loc) => normalized === loc || normalized.startsWith(`${loc}/`),
  );

  if (match) {
    const [regionCode, lang] = match.split("-") as [string, "de" | "en"];
    return { regionCode, lang, locale: match };
  }

  return {
    regionCode: DEFAULT_REGION,
    lang: "de",
    locale: DEFAULT_LOCALE,
  };
}
