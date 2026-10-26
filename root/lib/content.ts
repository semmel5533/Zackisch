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
    nav: ["So funktioniert’s", "Kosten", "Fragen", "Hilfe"],
    login: "Anmelden",
    start: "Lokal einrichten",
    title: "QR-Bestellung für dein Lokal – Zackisch",
    description:
      "Gäste bestellen und bezahlen per QR-Code. Dein Team behält den Überblick, deine bestehende Kasse bleibt. 2 % Zackisch-Gebühr plus Stripe-Gebühren.",
    hero: "Guter Service. Ein Bestellweg mehr.",
    intro:
      "Gäste bestellen und bezahlen direkt am Smartphone. Dein Team sieht die bezahlten Aufträge auf dem Tablet. Und deine Kasse bleibt, wo sie ist.",
    heroNote: "Für Cafés, Bars und alle, die gern Gastgeber sind.",
    heroAlt: "Ein Barista bereitet an einer Espressomaschine Kaffee zu.",
    photoCredit:
      "Foto: Shixart1985 · verkleinert. Symbolbild, kein Zackisch-Kundenlokal.",
    problemTitle: "Noch eine Runde. Ohne noch einmal zu winken.",
    problemText:
      "Ein Getränk nachbestellen, das Menü in Ruhe ansehen oder bezahlen: Gäste können selbst entscheiden, wann sie den digitalen Bestellweg nutzen. Für Fragen und persönlichen Service bleibt dein Team da.",
    statistic: "27 %",
    statisticText:
      "der Befragten in Deutschland hatten wegen Wartezeiten schon einmal ein Lokal vor der Bestellung verlassen.",
    source: "Lightspeed × Medallia · Mai 2025 · rund 1.000 Erwachsene",
    caveat:
      "Selbstauskunft, keine Abbruchquote pro Besuch und kein gemessener Zackisch-Effekt.",
    researchLink: "Quelle und Einordnung lesen",
    storyTitle: "Vom Tisch zu deinem Team.",
    storyIntro:
      "Ein zusätzlicher Weg für Gäste. Ein klarer Ablauf für dein Lokal.",
    steps: [
      {
        title: "Scannen",
        text: "Der QR-Code führt zum richtigen Tisch oder zur Abholung. Ohne App-Installation und ohne Gastkonto.",
        placeholder: "Hier erscheint: QR-Aufsteller",
        detail:
          "Schwarz-weiße Karte mit Tischkennung und Hinweis auf persönlichen Service.",
      },
      {
        title: "Auswählen & bezahlen",
        text: "Gäste sehen dein Lokal, dein Menü und die Preise. Sie wählen Artikel und Extras und bezahlen über Stripe.",
        placeholder: "Hier erscheint: Gäste-Menü",
        detail:
          "Echter mobiler Screenshot mit Lokallogo, Artikeln, Preisen und Warenkorb.",
      },
      {
        title: "Zubereiten & erfassen",
        text: "Nach serverseitig bestätigter Zahlung erscheint der Auftrag beim Personal. Dein Team bereitet ihn zu und erfasst ihn einmal in eurer Kasse.",
        placeholder: "Hier erscheint: Personal-Tablet",
        detail:
          "Echte Personalansicht mit bezahltem Auftrag und separater Kassenerfassung.",
      },
    ],
    placeholderNote: "Produktaufnahme folgt",
    hybridTitle: "Gastfreundschaft bleibt persönlich.",
    hybridText:
      "QR-Bestellen ist eine Möglichkeit. Wer lieber persönlich bestellt, wendet sich weiterhin an dein Team. Bestehende Kasse, persönliche Beratung und gewohnter Service bleiben Teil deines Lokals.",
    setupTitle: "Dein Lokal. Schritt für Schritt eingerichtet.",
    setupIntro:
      "Du richtest Zackisch selbst ein. Die öffentliche Hilfe begleitet dich dabei.",
    setup: [
      "Konto und Lokal anlegen",
      "Menü mit Preisen und Optionen pflegen",
      "Zahlungen über Stripe einrichten",
      "Tische und QR-Codes vorbereiten",
      "Personal-Tablet verbinden",
      "Ablauf testen, dann starten",
    ],
    setupHelp: "Einrichtungsanleitungen öffnen",
    priceTitle: "Eine klare Gebühr. Wenn Gäste bestellen.",
    fee: "2 %",
    feeLabel: "Zackisch-Gebühr je erfolgreich bezahlter Bestellung",
    feeText:
      "Auf den bezahlten Bruttobestellwert ohne freiwilliges Trinkgeld, inklusive der gegebenenfalls auf unsere Gebühr entfallenden Umsatzsteuer. Stripe-Gebühren kommen separat hinzu.",
    free: "0 € Einrichtung. 0 € monatliche Zackisch-Grundgebühr.",
    requirements:
      "Du brauchst ein geeignetes Tablet, Internet, ein für Zahlungen freigegebenes Stripe-Konto und deinen bestehenden Kassenablauf. Geräte, Verbindung und Druck können eigene Kosten verursachen.",
    priceLink: "Gebühren und Voraussetzungen ansehen",
    faqTitle: "Gut zu wissen, bevor du loslegst.",
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
    endTitle: "Mach Platz für eine weitere Art zu bestellen.",
    endText:
      "Starte mit deinem Lokal und prüfe in Ruhe, was du für den digitalen Bestellweg brauchst.",
    footerProduct: "Zackisch",
    footerHelp: "Kontakt & Hilfe",
    footerLegal: "Rechtliches",
    contact: "Kontakt",
    research: "Forschung & Quellen",
    legalSources: "Rechtsquellen und weiterführende Informationen",
    guestTerms: "Gastbestellung",
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
    nav: ["How it works", "Pricing", "Questions", "Help"],
    login: "Sign in",
    start: "Set up your venue",
    title: "QR ordering for your venue – Zackisch",
    description:
      "Guests order and pay by QR code. Your team keeps track and your existing POS stays. 2% Zackisch fee plus Stripe fees.",
    hero: "Good service. One more way to order.",
    intro:
      "Guests order and pay on their phones. Your team sees paid orders on a tablet. And your existing POS stays right where it is.",
    heroNote: "For cafés, bars and people who love hosting.",
    heroAlt: "A barista prepares coffee at an espresso machine.",
    photoCredit:
      "Photo: Shixart1985 · resized. Illustrative photo, not a Zackisch customer venue.",
    problemTitle: "Another round. Without waving again.",
    problemText:
      "Ordering a drink, browsing the menu or paying: guests choose when to use the digital option. Your team is still there for questions and personal service.",
    statistic: "27%",
    statisticText:
      "of respondents in Germany had left a venue before ordering because of waiting times.",
    source: "Lightspeed × Medallia · May 2025 · around 1,000 adults",
    caveat:
      "Self-reported experience, not a per-visit abandonment rate or a measured Zackisch effect.",
    researchLink: "Read the source and context",
    storyTitle: "From the table to your team.",
    storyIntro: "An extra option for guests. A clear process for your venue.",
    steps: [
      {
        title: "Scan",
        text: "The QR code opens the right table or pickup menu. No app installation and no guest account.",
        placeholder: "Coming here: QR table stand",
        detail:
          "Black-and-white card with a table identifier and a reminder of personal service.",
      },
      {
        title: "Choose & pay",
        text: "Guests see your venue, menu and prices. They select items and extras and pay through Stripe.",
        placeholder: "Coming here: guest menu",
        detail:
          "An actual mobile screenshot with the venue logo, items, prices and cart.",
      },
      {
        title: "Prepare & record",
        text: "After the server verifies payment, the order appears for staff. Your team prepares it and records it once in your existing POS.",
        placeholder: "Coming here: staff tablet",
        detail:
          "An actual staff view showing a paid order and separate POS recording status.",
      },
    ],
    placeholderNote: "Product image to follow",
    hybridTitle: "Hospitality stays personal.",
    hybridText:
      "QR ordering is an option. Guests who prefer ordering in person can still turn to your team. Your existing POS, personal advice and familiar service remain part of your venue.",
    setupTitle: "Your venue. Set up step by step.",
    setupIntro:
      "You set up Zackisch yourself. Public help guides you along the way.",
    setup: [
      "Create your account and venue",
      "Add your menu, prices and options",
      "Set up payments with Stripe",
      "Prepare tables and QR codes",
      "Connect your staff tablet",
      "Test the process, then start",
    ],
    setupHelp: "Open setup guides",
    priceTitle: "A clear fee. When guests order.",
    fee: "2%",
    feeLabel: "Zackisch fee per successfully paid order",
    feeText:
      "On the paid gross order value excluding voluntary tips, including any VAT applicable to our fee. Stripe fees are charged separately.",
    free: "€0 setup. €0 monthly Zackisch base fee.",
    requirements:
      "You need a suitable tablet, internet, a Stripe account approved for payments and your existing POS process. Devices, connectivity and printing may have their own costs.",
    priceLink: "See fees and prerequisites",
    faqTitle: "Good to know before you start.",
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
    endTitle: "Make room for another way to order.",
    endText:
      "Start with your venue and take your time checking what you need for digital ordering.",
    footerProduct: "Zackisch",
    footerHelp: "Contact & help",
    footerLegal: "Legal",
    contact: "Contact",
    research: "Research & sources",
    legalSources: "Legal references and further information",
    guestTerms: "Guest ordering",
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
      ...guestTerms["de-en"],
    },
    notFound: "This page doesn’t exist.",
    notFoundText: "Check the address or return to the homepage.",
    back: "Back to home",
  },
} as const;
export type Copy = (typeof content)[Locale];
