export interface RegionOption {
  code: string; // ISO 3166-1 alpha-2, e.g. "de"
  nativeName: string; // Endonym: primary native language spoken in that country, e.g. "Deutschland"
  name: {
    de: string;
    en: string;
  };
  defaultCurrency: string;
}

export const SUPPORTED_REGIONS: Record<string, RegionOption> = {
  de: {
    code: "de",
    nativeName: "Deutschland",
    name: {
      de: "Deutschland",
      en: "Germany",
    },
    defaultCurrency: "EUR",
  },
};

export const DEFAULT_REGION = "de";

export function getRegion(code?: string): RegionOption {
  if (code && SUPPORTED_REGIONS[code.toLowerCase()]) {
    return SUPPORTED_REGIONS[code.toLowerCase()];
  }
  return SUPPORTED_REGIONS[DEFAULT_REGION];
}

export function detectBrowserRegion(): string {
  if (typeof window === "undefined") return DEFAULT_REGION;

  try {
    const stored = localStorage.getItem("zakkig_region");
    if (stored && SUPPORTED_REGIONS[stored]) {
      return stored;
    }
  } catch {
    // ignore
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Berlin") || tz.includes("Germany") || tz.includes("Vienna") || tz.includes("Zurich")) {
      return "de";
    }
  } catch {
    // ignore
  }

  return DEFAULT_REGION;
}
