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
export const surveyUrl = "https://www.presseportal.de/pm/165632/6151909";
export const websiteUrl = "https://zackisch.com";
export const signupUrl = "https://app.zackisch.com/sign-up";
export const loginUrl = "https://app.zackisch.com/sign-in";
export const pageSlugs = [
  "pricing",
  "research",
  "contact",
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
    nav: ["Funktionen", "Kosten", "Fragen", "Hilfe"],
    login: "Anmelden",
    start: "Lokal einrichten",
    title: "QR-Bestellung für dein Lokal – Zackisch",
    description:
      "Gäste bestellen und bezahlen per QR-Code. Dein Team behält den Überblick, deine bestehende Kasse bleibt. 2 % Zackisch-Gebühr plus Stripe-Gebühren.",
    heroAlt: "Eine Servicekraft begrüßt zwei Gäste beim Essen im Café.",
    photoCredit:
      "Stockfoto: Ketut Subiyanto / Pexels. Kein Zackisch-Kundenlokal.",
    researchLink: "Quelle und Einordnung lesen",
    conversationAlt: "Freunde lachen gemeinsam an einem Tisch im Café.",
    setupHelp: "Einrichtungsanleitungen öffnen",
    priceLink: "Gebühren und Voraussetzungen ansehen",
    faqs: [
      {
        question: "Brauche ich eine neue Kasse?",
        answer:
          "Nein. Zackisch ergänzt deinen bestehenden Kassenablauf. Bereits bezahlte Zackisch-Bestellungen werden einmal in deiner Kasse erfasst. Die für dein Lokal geltenden Beleg- und Steuerpflichten bleiben bestehen.",
      },
      {
        question: "Müssen meine Gäste einen Account anlegen?",
        answer:
          "Nein. Gäste öffnen das Menü per QR-Code im Browser und bestellen ohne Zackisch-Account oder App-Installation.",
      },
      {
        question: "Kann mein Personal weiterhin Bestellungen aufnehmen?",
        answer:
          "Ja. Der digitale Bestellweg ist optional. Gäste können sich wie gewohnt persönlich an dein Team wenden.",
      },
      {
        question: "Was passiert bei einer Störung?",
        answer:
          "Neue digitale Bestellungen und Zahlungen benötigen eine Verbindung. Euer persönlicher Service und die bestehende Kasse bleiben unabhängig davon nutzbar. Bereits bezahlte Aufträge müssen geprüft und abgeglichen werden; nicht erneut kassieren.",
      },
      {
        question: "Ist die Zahlungsbestätigung ein Kassenbeleg?",
        answer:
          "Nein. Zackisch zeigt eine Bestell- und Zahlungsbestätigung. Den gesetzlich erforderlichen Beleg oder eine Rechnung stellt dein Lokal über seinen eigenen zulässigen Ablauf bereit.",
      },
    ],
    footerProduct: "Zackisch",
    footerHelp: "Kontakt & Hilfe",
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
    footerNote: "Zusätzlich bestellen. Persönlich bleiben.",
    pages: {
      pricing: {
        title: "Was Zackisch kostet.",
        intro: "Softwaregebühr und Zahlungsabwicklung klar getrennt.",
        sections: [
          {
            title: "2 % für Zackisch",
            body: "Die Gebühr bezieht sich auf den erfolgreich bezahlten Bruttobestellwert ohne freiwilliges Trinkgeld. Die gegebenenfalls auf die Zackisch-Gebühr entfallende Umsatzsteuer ist enthalten. Ohne Zackisch-Bestellungen fällt keine prozentuale Zackisch-Gebühr an.",
          },
          {
            title: "Stripe separat",
            body: "Für die Zahlungsabwicklung fallen zusätzlich die Gebühren von Stripe gemäß der tatsächlichen Konfiguration und Vereinbarung deines Lokals an. Eine feste pauschale Zahlungsgebühr wird hier nicht versprochen.",
          },
          {
            title: "Was du mitbringst",
            body: "Ein geeignetes Tablet mit Browser, eine Internetverbindung, ein von Stripe freigegebenes Zahlungskonto und deinen bestehenden Kassenablauf. Geräte, Internet und QR-Druck können eigene Kosten verursachen.",
          },
          {
            title: "Vor dem Echtbetrieb prüfen",
            body: "Zahlungsfreigabe, Menüangaben, QR-Ziele, Tablet-Verbindung und die Übernahme bereits bezahlter Aufträge in die Kasse müssen stimmen. Beleg-, Steuer- und Datenschutzpflichten werden durch Zackisch nicht ersetzt.",
          },
        ],
      },
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
      contact: {
        title: "Ein guter Einstieg beginnt mit einer Frage.",
        intro:
          "Hilfe zur Einrichtung und zum Betrieb findest du im öffentlichen Hilfe-Center. Für betriebsbezogene Anliegen nutze dort deinen privaten Ticketbereich.",
        sections: [],
      },
      ...legalPages["de-de"],
      ...platformPrivacy["de-de"],
      ...merchantTerms["de-de"],
      ...dataProcessing["de-de"],
      ...guestTerms["de-de"],
    },
    notFound: "Diese Seite gibt es nicht.",
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
    nav: ["Features", "Pricing", "Questions", "Help"],
    login: "Sign in",
    start: "Set up your venue",
    title: "QR ordering for your venue – Zackisch",
    description:
      "Guests order and pay by QR code. Your team keeps track and your existing POS stays. 2% Zackisch fee plus Stripe fees.",
    heroAlt: "A member of the café team welcomes two guests over lunch.",
    photoCredit:
      "Stock photo: Ketut Subiyanto / Pexels. Not a Zackisch customer venue.",
    researchLink: "Read the source and context",
    conversationAlt: "Friends laughing together around a café table.",
    setupHelp: "Open setup guides",
    priceLink: "See fees and prerequisites",
    faqs: [
      {
        question: "Do I need a new POS?",
        answer:
          "No. Zackisch supplements your existing POS process. Paid Zackisch orders are recorded once in your POS. Your venue’s receipt and tax obligations remain.",
      },
      {
        question: "Do guests need an account?",
        answer:
          "No. Guests open the menu by QR code in their browser and order without a Zackisch account or app installation.",
      },
      {
        question: "Can staff still take orders?",
        answer:
          "Yes. Digital ordering is optional. Guests can still order from your team in person.",
      },
      {
        question: "What happens during an outage?",
        answer:
          "New digital orders and payments need a connection. Personal service and your existing POS remain independent. Already paid orders must be checked and reconciled; do not charge again.",
      },
      {
        question: "Is the payment confirmation a fiscal receipt?",
        answer:
          "No. Zackisch provides an order and payment confirmation. Your venue issues the legally required receipt or invoice through its own lawful process.",
      },
    ],
    footerProduct: "Zackisch",
    footerHelp: "Contact & help",
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
    footerNote: "Another way to order. Still personal.",
    pages: {
      pricing: {
        title: "What Zackisch costs.",
        intro: "Software fees and payment processing, clearly separated.",
        sections: [
          {
            title: "2% for Zackisch",
            body: "The fee applies to the successfully paid gross order value excluding voluntary tips. Any VAT applicable to the Zackisch fee is included. With no Zackisch orders, there is no percentage Zackisch transaction fee.",
          },
          {
            title: "Stripe separately",
            body: "Stripe’s payment processing fees apply in addition, according to your venue’s actual configuration and agreement. We do not promise a fixed flat processing fee here.",
          },
          {
            title: "What you bring",
            body: "A suitable tablet with a browser, an internet connection, a Stripe account approved for payments and your existing POS process. Devices, internet and QR printing may incur separate costs.",
          },
          {
            title: "Check before going live",
            body: "Payment approval, menu information, QR destinations, tablet connectivity and recording paid orders in your POS all need to work. Zackisch does not replace receipt, tax or privacy obligations.",
          },
        ],
      },
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
      contact: {
        title: "A good start begins with a question.",
        intro:
          "Find setup and operating guidance in the public help centre. For venue-specific matters, use your private ticket area there.",
        sections: [],
      },
      ...legalPages["de-en"],
      ...platformPrivacy["de-en"],
      ...merchantTerms["de-en"],
      ...dataProcessing["de-en"],
      ...guestTerms["de-en"],
    },
    notFound: "This page doesn’t exist.",
    notFoundText: "Check the address or return to the homepage.",
    back: "Back to home",
  },
} as const;
export type Copy = (typeof content)[Locale];
