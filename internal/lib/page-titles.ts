export const pageTitles = {
  de: {
    "/": "Übersicht", "/sign-in": "Anmelden", "/businesses": "Betriebe",
    "/orders": "Bestellungen", "/tickets": "Support-Tickets", "/staff": "Mitarbeiter",
    "/partners": "Vertriebspartner", "/newsletter": "Newsletter", "/emails": "E-Mail-Log",
    "/audit": "Audit-Trail", "/settings": "Einstellungen",
  },
  en: {
    "/": "Overview", "/sign-in": "Sign in", "/businesses": "Businesses",
    "/orders": "Orders", "/tickets": "Support tickets", "/staff": "Staff",
    "/partners": "Partners", "/newsletter": "Newsletter", "/emails": "Email log",
    "/audit": "Audit trail", "/settings": "Settings",
  },
} as const;
export function pageTitle(pathname: string, locale: string) {
  const titles = pageTitles[locale === "en" ? "en" : "de"];
  const subject = pathname in titles ? titles[pathname as keyof typeof titles] : "Team Dashboard";
  return `${subject} | Zackisch`;
}
