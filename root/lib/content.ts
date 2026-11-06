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
    localeTitle: "Region & Sprache",
    localeDescription: "Hier kannst du deine Region und Sprache auswählen.",
    nav: ["Funktionen", "Kosten", "Fragen", "Hilfe"],
    login: "Anmelden",
    start: "Lokal einrichten",
    title: "QR-Bestellung für dein Lokal – Zackisch",
    description:
      "Gäste bestellen und bezahlen per QR-Code. Dein Team behält den Überblick, deine bestehende Kasse bleibt. 2 % Zackisch-Gebühr plus Zahlungsanbietergebühren.",
    researchLink: "Quelle und Einordnung lesen",
    setupHelp: "Einrichtungsanleitungen öffnen",
    priceLink: "Gebühren und Voraussetzungen ansehen",
    faqs: [
      {
        question: "Wie funktioniert Zackisch im Alltag?",
        answer:
          "Deine Gäste öffnen das Menü per QR-Code, wählen Artikel und bezahlen im Browser. Dein Team sieht den bezahlten Auftrag und bereitet ihn vor. Empfehlungen und freiwilliges Trinkgeld ergänzen den Bestellweg; du entscheidest, welche Funktionen aktiv sind.",
      },
      {
        question: "Funktioniert Zackisch auch ohne Tische, nur mit Abholung?",
        answer:
          "Ja. Gäste scannen deinen Abhol-QR-Code, wählen Artikel und bezahlen im Browser. Danach sehen sie ihre Bestellnummer und den Abholstatus. Dein Team bereitet die Bestellung vor und markiert sie als abholbereit. Dafür brauchst du keine Tische. Die bereits bezahlte Bestellung erfasst ihr wie beim Tischservice einmal in eurer Kasse.",
      },
      {
        question: "Was kostet Zackisch – auch in der Saisonpause?",
        answer:
          "Du zahlst 2 % auf den erfolgreich bezahlten Bestellwert ohne freiwilliges Trinkgeld, inklusive gegebenenfalls anfallender Umsatzsteuer auf unsere Gebühr. Hinzu kommen Zahlungsanbietergebühren. Einrichtung und Grundgebühr kosten nichts. Ohne bezahlte Bestellungen fallen keine Zackisch-Gebühren an – ideal für Saisonbetriebe. Eigene Geräte-, Internet- und weitere Anbietergebühren bleiben davon unabhängig.",
      },
      {
        question: "Wie funktioniert die Anbindung an meine Kasse?",
        answer:
          "Deine bestehende Kasse bleibt. Dein Team übernimmt jede bereits bezahlte Zackisch-Bestellung genau einmal manuell in die Kasse und kennzeichnet sie dort als bereits bezahlt. Der Gast bezahlt nicht erneut. Eine automatische Übertragung gibt es derzeit nicht. Dein Lokal stellt den erforderlichen Kassenbeleg oder die Rechnung aus.",
      },
      {
        question: "Warum setzt ihr zunächst auf manuelle Kassenerfassung?",
        answer:
          "So brauchst du keine neue Kasse und keine technische Schnittstellenintegration, um einzusteigen. Du kannst Zackisch in deinen vorhandenen Ablauf aufnehmen, sobald Einrichtung und Zahlungsfreigabe abgeschlossen sind. Dafür bleibt die einmalige manuelle Erfassung jeder Bestellung nötig.",
      },
      {
        question: "Wird es automatische Kassenintegrationen geben?",
        answer:
          "Optionale Anbindungen an verbreitete Kassensysteme in Deutschland kommen für die Zukunft infrage. Aktuell gibt es keine automatische Integration und keine Zusage für bestimmte Anbieter oder Termine. Für den Einstieg nutzt du deine vorhandene Kasse mit manueller Erfassung.",
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
        question: "Kann mein Personal weiterhin Bestellungen aufnehmen?",
        answer:
          "Ja. Der digitale Bestellweg ist freiwillig und ergänzt deinen Service. Gäste können weiter persönlich bei deinem Team bestellen. Zackisch ersetzt weder dein Personal noch deine Kasse.",
      },
      {
        question: "Was passiert, wenn das Internet ausfällt?",
        answer:
          "Neue digitale Bestellungen und Zahlungen benötigen eine Verbindung. Ihr könnt weiter persönlich Bestellungen aufnehmen und euren bestehenden Kassenablauf nutzen. Bereits bezahlte Aufträge müssen geprüft und abgeglichen werden; nicht erneut kassieren.",
      },
    ],
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
    pages: {
      pricing: {
        title: "Was Zackisch kostet.",
        intro:
          "Nur wenn deine Gäste über Zackisch bezahlen, fällt eine Zackisch-Gebühr an. Keine Einrichtungskosten. Keine monatliche Grundgebühr.",
        sections: [
          {
            title: "2 % für Zackisch",
            body: "Die Gebühr bezieht sich auf den erfolgreich bezahlten Bruttobestellwert ohne freiwilliges Trinkgeld. Die gegebenenfalls auf die Zackisch-Gebühr entfallende Umsatzsteuer ist enthalten. Ohne bezahlte Bestellungen ist Zackisch kostenlos – auch in der Saisonpause. Geräte, Internet und Zahlungsabwicklung können eigene Kosten verursachen.",
          },
          {
            title: "Zahlungsanbietergebühren",
            body: "Für die Zahlungsabwicklung fallen zusätzlich die Gebühren des Zahlungsanbieters gemäß der tatsächlichen Konfiguration und Vereinbarung deines Lokals an. Eine feste pauschale Zahlungsgebühr wird hier nicht versprochen.",
          },
          {
            title: "Was du mitbringst",
            body: "Ein geeignetes Tablet mit Browser, eine Internetverbindung, ein vom Zahlungsanbieter freigegebenes Zahlungskonto und deinen bestehenden Kassenablauf. Geräte, Internet und QR-Druck können eigene Kosten verursachen.",
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
    localeTitle: "Region & language",
    localeDescription: "Choose your region and language.",
    nav: ["Features", "Pricing", "Questions", "Help"],
    login: "Sign in",
    start: "Set up your venue",
    title: "QR ordering for your venue – Zackisch",
    description:
      "Guests order and pay by QR code. Your team keeps track and your existing POS stays. 2% Zackisch fee plus payment provider fees.",
    researchLink: "Read the source and context",
    setupHelp: "Open setup guides",
    priceLink: "See fees and prerequisites",
    faqs: [
      {
        question: "How does Zackisch work day to day?",
        answer:
          "Guests open the menu by QR code, choose items and pay in their browser. Your team sees the paid order and prepares it. Recommendations and optional tipping complement the ordering flow; you choose which features are active.",
      },
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
          "Your existing POS stays. Your team manually records each paid Zackisch order exactly once in the POS and marks it as already paid. The guest does not pay again. There is currently no automatic transfer. Your venue issues the required fiscal receipt or invoice.",
      },
      {
        question: "Why start with manual POS recording?",
        answer:
          "You do not need a new POS or a technical integration to get started. You can add Zackisch to your existing process once setup and payment approval are complete. Each order still needs to be recorded manually once.",
      },
      {
        question: "Will automatic POS integrations become available?",
        answer:
          "Optional connections to widely used German POS systems are a possibility for the future. There is currently no automatic integration and no commitment to particular providers or dates. To get started, use your existing POS with manual recording.",
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
        question: "Can staff still take orders?",
        answer:
          "Yes. Digital ordering is optional and complements your service. Guests can still order from your team in person. Zackisch replaces neither your staff nor your POS.",
      },
      {
        question: "What happens if the internet goes down?",
        answer:
          "New digital orders and payments need a connection. You can continue taking orders in person and using your existing POS process. Check and reconcile orders that have already been paid; do not charge again.",
      },
    ],
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
    pages: {
      pricing: {
        title: "What Zackisch costs.",
        intro:
          "A Zackisch fee applies only when guests pay through Zackisch. No setup fee. No monthly base fee.",
        sections: [
          {
            title: "2% for Zackisch",
            body: "The fee applies to the successfully paid gross order value excluding voluntary tips. Any VAT applicable to the Zackisch fee is included. Without paid orders, Zackisch is free, including during seasonal closures. Devices, internet and payment processing may have their own costs.",
          },
          {
            title: "Zahlungsanbietergebührenely",
            body: "Payment provider fees apply in addition, according to your venue’s actual configuration and agreement. We do not promise a fixed flat processing fee here.",
          },
          {
            title: "What you bring",
            body: "A suitable tablet with a browser, an internet connection, an account approved by the payment provider and your existing POS process. Devices, internet and QR printing may incur separate costs.",
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
