import { dataProcessing } from "./data-processing";
import { platformPrivacy } from "./platform-privacy";
import { guestTerms } from "./guest-terms";
import { merchantTerms } from "./merchant-terms";
import { legalPages } from "./legal-content";
export const locales = ["de-de", "de-en"] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
export function resolveBrowserLocale(
  languages?: readonly string[],
  primaryLanguage?: string,
): Locale {
  const candidates = [
    ...(Array.isArray(languages) ? languages : []),
    ...(primaryLanguage ? [primaryLanguage] : []),
  ];
  for (const raw of candidates) {
    if (typeof raw !== "string") continue;
    const normalized = raw.trim().toLowerCase().replace(/_/g, "-");
    if (!normalized) continue;
    if (isLocale(normalized)) return normalized;
    const [language] = normalized.split("-");
    if (language === "de") return "de-de";
    if (language === "en") return "de-en";
  }
  return "de-de";
}
export const surveyUrl = "https://www.presseportal.de/pm/165632/6151909";
export const websiteUrl = "https://zackisch.com";
export const signupUrl = "https://app.zackisch.com/sign-up";
export const loginUrl = "https://app.zackisch.com/sign-in";
export const pageSlugs = [
  "research",
  "legal-notice",
  "privacy",
  "privacy-policy",
  "gtc",
  "data-processing",
  "guest-terms",
] as const;
export type PageSlug = (typeof pageSlugs)[number];
export const content = {
  "de-de": {
    lang: "de",
    other: "English",
    otherLocale: "de-en",
    skip: "Zum Inhalt",
    home: "Zackisch Startseite",
    navLabel: "Hauptnavigation",
    menu: "Menü öffnen",
    close: "Menü schließen",
    dismiss: "Schließen",
    navigation: "Navigation",
    localeTitle: "Region & Sprache",
    localeDescription:
      "Wähle die Region deines Betriebs und deine gewünschte Anzeigesprache.",
    nav: ["Funktionen", "Kosten", "Fragen", "Hilfe"],
    login: "Anmelden",
    start: "Lokal einrichten",
    title: "QR-Bestellung für dein Lokal | Zackisch",
    description:
      "Gäste bestellen und bezahlen per QR-Code. Dein Team behält den Überblick, deine bestehende Kasse bleibt. 2 % Zackisch-Gebühr plus Zahlungsanbietergebühren.",
    researchLink: "Quelle und Einordnung lesen",
    setupHelp: "Einrichtungsanleitungen öffnen",
    faqs: [
      {
        question: "Funktioniert Zackisch auch ohne Tische, nur mit Abholung?",
        answer:
          "Ja. Gäste scannen deinen Abhol-QR-Code, wählen Artikel und bezahlen im Browser. Danach sehen sie ihre Bestellnummer und den Abholstatus. Dein Team bereitet die Bestellung vor und markiert sie als abholbereit. Dafür brauchst du keine Tische. Die bereits bezahlte Bestellung erfasst ihr wie beim Tischservice einmal in eurer Kasse.",
      },
      {
        question: "Was kostet Zackisch auch in der Saisonpause?",
        answer:
          "Du zahlst 2 % auf den erfolgreich bezahlten Bestellwert ohne freiwilliges Trinkgeld, inklusive gegebenenfalls anfallender Umsatzsteuer auf unsere Gebühr. Hinzu kommen Zahlungsanbietergebühren. Einrichtung und Grundgebühr kosten nichts. Ohne bezahlte Bestellungen fallen keine Zackisch-Gebühren an. Das passt gut zu Saisonbetrieben. Eigene Geräte-, Internet- und weitere Anbietergebühren bleiben davon unabhängig.",
      },
      {
        question: "Wie funktioniert die Anbindung an meine Kasse?",
        answer:
          "Deine bestehende Kasse bleibt. Dein Team übernimmt jede bereits bezahlte Zackisch-Bestellung genau einmal manuell in die Kasse und kennzeichnet sie dort als bereits bezahlt. Der Gast bezahlt nicht erneut. Eine automatische Übertragung gibt es derzeit nicht. Dein Lokal stellt den erforderlichen Kassenbeleg oder die Rechnung aus. So startest du ohne technische Schnittstellenintegration. Optionale Kassenanbindungen kommen künftig infrage, ohne feste Anbieter oder Termine.",
      },
      {
        question: "Was brauche ich für den Start?",
        answer:
          "Ein Menü mit Artikeln und Preisen, ein geeignetes Tablet mit Browser, Internet und ein freigegebenes Konto beim Zahlungsanbieter. Du richtest dein Lokal selbst ein und platzierst deine QR-Codes. Vor dem Start prüfst du den gesamten Ablauf einschließlich der Erfassung bezahlter Aufträge in deiner Kasse.",
      },
      {
        question:
          "Müssen meine Gäste eine App installieren oder ein Konto anlegen?",
        answer:
          "Nein. Deine Gäste scannen den QR-Code und öffnen das Menü direkt im Browser. Bestellung und Zahlung funktionieren ohne App-Installation und ohne Zackisch-Gastkonto.",
      },
      {
        question: "Können meine Gäste persönlich bestellen oder bar bezahlen?",
        answer:
          "Ja. Wer lieber persönlich bestellt, bar bezahlen möchte oder nicht mit dem Smartphone bestellen und bezahlen kann, wendet sich wie gewohnt an dein Team. Ihr nehmt die Bestellung auf und kassiert über euren bestehenden Kassenablauf. Barzahlungen erfolgen beim Lokal, nicht im digitalen Zackisch-Checkout.",
      },
      {
        question:
          "Was mache ich, wenn ein Artikel oder eine Option ausverkauft ist?",
        answer:
          "Dein Team kann in der Personalansicht Artikel, einzelne Optionen und ganze Auswahlschritte ausschalten und wieder aktivieren. So passt ihr die Verfügbarkeit direkt im laufenden Betrieb an, ohne das Menü neu anzulegen.",
      },
      {
        question: "Was passiert, wenn das Internet ausfällt?",
        answer:
          "Neue digitale Bestellungen und Zahlungen benötigen eine Verbindung. Ihr könnt weiter persönlich Bestellungen aufnehmen und euren bestehenden Kassenablauf nutzen. Bereits bezahlte Aufträge müssen geprüft und abgeglichen werden; nicht erneut kassieren.",
      },
    ],
    footerLegal: "Rechtliches",
    contact: "Kontakt",
    research: "Forschung & Quellen",
    legalSources: "Rechtsquellen und weiterführende Informationen",
    guestTerms: "Gastbestellung",
    dataProcessing: "Auftragsverarbeitung",
    terms: "Betreibervertrag",
    imprint: "Impressum",
    platformPrivacy: "Plattform-Datenschutz",
    privacy: "Datenschutz",
    privacySettings: "Datenschutzeinstellungen",
    privacyTitle: "Deine Wahl zur Website",
    privacyText:
      "Diese Website lädt keine optionalen Analyse- oder Werbedienste. Bilder und Schriften werden lokal ausgeliefert. Hier gibt es deshalb keine optionalen Cookies einzuschalten.",
    market: "Deutschland",
    pages: {
      research: {
        title: "Was die Forschung zeigt. Und was nicht.",
        intro:
          "Warum ein zusätzlicher Bestellweg sinnvoll sein kann, ohne daraus ein Umsatzversprechen abzuleiten.",
        sections: [
          {
            title: "Wartezeiten aus Gästesicht",
            body: "Lightspeed und Medallia befragten im Mai 2025 rund 1.000 Erwachsene in Deutschland, die in den letzten sechs Monaten ein Lokal besucht hatten. 27 % berichteten, wegen Wartezeiten schon einmal vor der Bestellung gegangen zu sein. Veröffentlicht am 5. November 2025.",
          },
          {
            title: "Die Grenzen",
            body: "Es handelt sich um Selbstauskünfte in einer von einem Kassensystemanbieter beauftragten Umfrage. Die Zahl beschreibt keine Abbruchquote pro Besuch. Untersucht wurde weder Zackisch noch die Wirkung seines QR-Bestellwegs.",
          },
          {
            title: "Unsere Einordnung",
            body: "Gäste möchten bestellen können, wenn sie bereit sind. Ein freiwilliger digitaler Bestellweg ist eine zusätzliche Möglichkeit. Ob er in deinem Lokal hilft, muss im tatsächlichen Betriebsablauf geprüft werden.",
          },
        ],
      },
      ...legalPages["de-de"],
      ...platformPrivacy["de-de"],
      ...merchantTerms["de-de"],
      ...dataProcessing["de-de"],
      ...guestTerms["de-de"],
    },
    notFound: "Diese Seite gibt es nicht",
    notFoundText: "Prüfe die Adresse oder gehe zurück zur Startseite.",
    back: "Zur Startseite",
  },
  "de-en": {
    lang: "en",
    other: "Deutsch",
    otherLocale: "de-de",
    skip: "Skip to content",
    home: "Zackisch home",
    navLabel: "Main navigation",
    menu: "Open menu",
    close: "Close menu",
    dismiss: "Close",
    navigation: "Navigation",
    localeTitle: "Region & language",
    localeDescription:
      "Choose your venue’s region and your preferred display language.",
    nav: ["Features", "Pricing", "Questions", "Help"],
    login: "Sign in",
    start: "Set up your venue",
    title: "QR ordering for your venue | Zackisch",
    description:
      "Guests order and pay by QR code. Your team keeps track and your existing POS stays. 2% Zackisch fee plus payment provider fees.",
    researchLink: "Read the source and context",
    setupHelp: "Open setup guides",
    faqs: [
      {
        question: "Does Zackisch work for counter pickup without tables?",
        answer:
          "Yes. Guests scan your pickup QR code, choose items and pay in their browser. They then see their order number and pickup status. Your team prepares the order and marks it as ready for pickup. No tables are needed. As with table service, record the paid order once in your existing POS.",
      },
      {
        question: "What does Zackisch cost, including seasonal closures?",
        answer:
          "You pay 2% of the successfully paid order value excluding voluntary tips, including any VAT applicable to our fee. Payment provider fees apply in addition. There is no setup fee or monthly base fee. No paid orders means no Zackisch fees, making it a good fit for seasonal venues. Your own device, internet and other provider costs remain separate.",
      },
      {
        question: "How does it connect to my POS?",
        answer:
          "Your existing POS stays. Your team manually records each paid Zackisch order exactly once in the POS and marks it as already paid. The guest does not pay again. There is currently no automatic transfer. Your venue issues the required fiscal receipt or invoice. This lets you start without a technical integration. Optional POS connections may follow, with no confirmed providers or dates.",
      },
      {
        question: "What do I need to get started?",
        answer:
          "A menu with items and prices, a suitable tablet with a browser, internet and an approved payment provider account. Set up your venue yourself and place your QR codes. Before going live, check the complete process, including recording paid orders in your POS.",
      },
      {
        question: "Do guests need an app or an account?",
        answer:
          "No. Guests scan the QR code and open the menu directly in their browser. Ordering and payment work without installing an app or creating a Zackisch guest account.",
      },
      {
        question: "Can guests order in person or pay cash?",
        answer:
          "Yes. Guests who prefer to order in person, want to pay cash or cannot order and pay with a smartphone can speak to your team as usual. You take their order and payment through your existing POS process. Cash payments are handled by the venue, not through Zackisch’s digital checkout.",
      },
      {
        question: "What if an item or option sells out?",
        answer:
          "Your team can switch items, individual options and entire selection steps off and back on in the staff view. This lets you adjust availability during service without rebuilding your menu.",
      },
      {
        question: "What happens if the internet goes down?",
        answer:
          "New digital orders and payments need a connection. You can continue taking orders in person and using your existing POS process. Check and reconcile orders that have already been paid; do not charge again.",
      },
    ],
    footerLegal: "Legal",
    contact: "Contact",
    research: "Research & sources",
    legalSources: "Legal references and further information",
    guestTerms: "Guest ordering",
    dataProcessing: "Data processing agreement",
    terms: "Merchant agreement",
    imprint: "Legal notice",
    platformPrivacy: "Platform privacy",
    privacy: "Privacy",
    privacySettings: "Privacy settings",
    privacyTitle: "Your choices on this website",
    privacyText:
      "This website loads no optional analytics or advertising services. Images and fonts are served locally. There are therefore no optional cookies to enable here.",
    market: "Deutschland",
    pages: {
      research: {
        title: "What research shows. And what it doesn’t.",
        intro:
          "Why an additional way to order may help, without turning that into a revenue promise.",
        sections: [
          {
            title: "Waiting from the guest’s perspective",
            body: "In May 2025, Lightspeed and Medallia surveyed around 1,000 adults in Germany who had visited a venue in the previous six months. 27% reported leaving before ordering because of waiting times. Published on 5 November 2025.",
          },
          {
            title: "The limits",
            body: "These are self-reported experiences from a survey commissioned by a POS provider. The figure is not a per-visit abandonment rate. Neither Zackisch nor its QR ordering experience was tested.",
          },
          {
            title: "Our interpretation",
            body: "Guests want to order when they are ready. Voluntary digital ordering adds another option. Whether it helps your venue needs to be tested in your actual service process.",
          },
        ],
      },
      ...legalPages["de-en"],
      ...platformPrivacy["de-en"],
      ...merchantTerms["de-en"],
      ...dataProcessing["de-en"],
      ...guestTerms["de-en"],
    },
    notFound: "This page doesn’t exist",
    notFoundText: "Check the address or return to the homepage.",
    back: "Back to home",
  },
} as const;
export type Copy = (typeof content)[Locale];
