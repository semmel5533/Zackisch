import type { Locale } from "./site-data";

export interface LegalDocument {
  title: string;
  metaTitle: string;
  metaDescription: string;
  lastUpdated: string;
  statusBadge: string;
  sections: Array<{
    heading: string;
    text: string;
    subsections?: Array<{ title: string; content: string }>;
  }>;
}

export const LEGAL_DOCS: Record<Locale, Record<string, LegalDocument>> = {
  "de-de": {
    "legal-notice": {
      title: "Impressum",
      metaTitle: "Impressum (§ 5 DDG) - Zackisch",
      metaDescription: "Gesetzliche Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) für Zackisch.",
      lastUpdated: "20. Oktober 2026",
      statusBadge: "Gesetzliche Anbieterkennzeichnung",
      sections: [
        {
          heading: "1. Angaben gemäß § 5 DDG",
          text: "Zackisch\nInhaber: Selim Eser\nPostanschrift: Mannheim, Baden-Württemberg, Deutschland\n(Vollständige ladungsfähige Anschrift vor dem offiziellen Livegang in Prüfung)",
        },
        {
          heading: "2. Kontakt",
          text: "E-Mail: selim@zackisch.com\nWebsite: https://zackisch.com\nSupport: https://support.zackisch.com",
        },
        {
          heading: "3. Umsatzsteuer-Identifikationsnummer & Registereintrag",
          text: "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: Beantragt / in behördlicher Zuteilung.\nRegistereintrag: Einzelfirma in Gründung; kein Handelsregistereintrag erforderlich.",
        },
        {
          heading: "4. Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
          text: "Selim Eser, Mannheim, Deutschland.",
        },
        {
          heading: "5. EU-Streitschlichtung & Verbraucherstreitbeilegung",
          text: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/.\nWir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        },
      ],
    },
    privacy: {
      title: "Datenschutzerklärung",
      metaTitle: "Datenschutzerklärung (DSGVO) - Zackisch",
      metaDescription:
        "Transparente Informationen über die Verarbeitung personenbezogener Daten auf der Website, im B2B-Konto und beim Gast-Bestellprozess.",
      lastUpdated: "20. Oktober 2026",
      statusBadge: "Datenschutz nach Art. 13 & 14 DSGVO",
      sections: [
        {
          heading: "1. Überblick und Verantwortlicher",
          text: "Verantwortlicher für die Datenverarbeitung auf dieser Marketingwebsite ist Selim Eser (Zackisch), erreichbar unter selim@zackisch.com. Diese Datenschutzerklärung klärt transparent über die Art, den Umfang und den Zweck der Erhebung und Verwendung personenbezogener Daten auf unserer Website, in unserer Gast-Bestellplattform und in unserem Betreiber-Dashboard auf.",
        },
        {
          heading: "2. Besuch der Marketingwebsite (zackisch.com)",
          text: "Unsere Marketingwebsite wird rein informativ betrieben. Zur sicheren Bereitstellung der Inhalte verarbeiten wir technische Server-Logdaten (IP-Adresse, Datum, Uhrzeit, Browsertyp, Referrer) auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO. Es werden keine ungefragten Tracking-Cookies von Drittanbietern gesetzt.",
        },
        {
          heading: "3. Gast-Bestellungen & Intelligentes Menü",
          text: "Beim Bestellen über den QR-Code erfassen wir ausschließlich die zur Abwicklung der Bestellung und Zubereitung zwingend erforderlichen Daten (Tischnummer, ausgewählte Speisen, Zahlungsreferenz) auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.\n\nOptionale Funktionen ('Für dich', gespeicherte Vorlieben) werden ausschließlich nach vorheriger, ausdrücklicher und freiwilliger Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) aktiviert und können jederzeit widerrufen werden.",
        },
        {
          heading: "4. Zahlungsabwicklung über Stripe Connect",
          text: "Die Zahlungsabwicklung für digitale Bestellungen erfolgt über Stripe Payments Europe, Ltd. (1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland). Kartendaten und Bezahldaten werden direkt von Stripe im Rahmen des Connect Direct Charges Modells verarbeitet. Zackisch speichert zu keinem Zeitpunkt sensible Kreditkartendaten.",
        },
        {
          heading: "5. Betreiber-Registrierung (B2B)",
          text: "Für die Eröffnung eines Restaurant-Accounts auf app.zackisch.com verarbeiten wir Unternehmensstammdaten, Namen und Anmeldedaten des Betreibers zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) sowie zur Erfüllung steuerlicher und handelsrechtlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO).",
        },
        {
          heading: "6. Deine Rechte als betroffene Person",
          text: "Du hast nach der DSGVO jederzeit das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie das Recht auf Widerspruch (Art. 21). Wende dich dazu formlos an selim@zackisch.com.",
        },
      ],
    },
    cookies: {
      title: "Cookie- & Speicherrichtlinie",
      metaTitle: "Cookie-Informationen (§ 25 TDDDG) - Zackisch",
      metaDescription: "Informationen über den Einsatz technisch notwendiger Speichertechnologien und optionale Personalisierungs-Cookies bei Zackisch.",
      lastUpdated: "20. Oktober 2026",
      statusBadge: "Information nach § 25 TDDDG",
      sections: [
        {
          heading: "1. Grundsatz der Datensparsamkeit",
          text: "Zackisch verzichtet auf der Marketingwebsite vollständig auf kommerzielle Werbetracker, Third-Party Marketing-Cookies oder Fingerprinting. Wir respektieren deine Privatsphäre ab dem ersten Klick.",
        },
        {
          heading: "2. Technisch notwendige Cookies (§ 25 Abs. 2 TDDDG)",
          text: "Wir setzen ausschließlich Speicherfunktionen ein, die für den Betrieb und die Bereitstellung der gewünschten Dienste technisch zwingend erforderlich sind. Hierzu gehören Session-Cookies zur Bereitstellung der gewählten Spracheinstellung (z. B. de-de oder de-en) sowie CSRF-Sicherheitstoken.",
        },
        {
          heading: "3. Gast-Menü Personalisierung (Freiwillig)",
          text: "In der Gast-Bestell-App kann der Gast freiwillig einwilligen, dass getätigte Bestellungen lokal auf seinem Gerät gespeichert werden, um Favoriten beim nächsten Besuch des selben Lokals wieder anzuzeigen. Diese Speicherung erfolgt nur mit aktiver Zustimmung.",
        },
      ],
    },
    "business-terms": {
      title: "Allgemeine Geschäftsbedingungen (B2B)",
      metaTitle: "B2B Geschäftsbedingungen - Zackisch",
      metaDescription: "Vertragsbedingungen für Gastronomiebetreiber zur Nutzung der Zackisch Bestell- und Menüplattform.",
      lastUpdated: "20. Oktober 2026",
      statusBadge: "B2B-Nutzungsvertrag (Entwurf)",
      sections: [
        {
          heading: "1. Vertragsgegenstand & Leistungsbeschreibung",
          text: "Zackisch stellt Gastronomiebetrieben eine webbasierte Plattform zur Bereitstellung digitaler Speisekarten, zur Entgegennahme digitaler Bestellungen und zur Annahme digitaler Zahlungen bereit. Zackisch stellt ausdrücklich kein Kassensystem bereit und ersetzt das vorhandene Kassensystem des Betriebs nicht.",
        },
        {
          heading: "2. Pflichten des Gastronomiebetriebs",
          text: "Der Betrieb ist verpflichtet, bezahlte Bestellungen eigenverantwortlich in sein bestehendes, finanzamtskonformes Kassensystem (TSE) zu erfassen. Der Betrieb ist alleiniger Verkäufer der Speisen und Getränke gegenüber dem Gast und für die Einhaltung der Preisangabenverordnung, der LMIV (Allergene) und der KassenSichV verantwortlich.",
        },
        {
          heading: "3. Vergütung & Abrechnung",
          text: "Zackisch erhebt keine monatliche Grundgebühr und keine Einrichtungsgebühr. Für jede erfolgreich über Zackisch abgewickelte und bezahlte Bestellung fällt eine variable Plattformgebühr in Höhe von 2,0 % des Speisen- und Getränkebestellwerts an. Freiwillig durch Gäste gegebene Trinkgelder sind von der 2 % Plattformgebühr befreit. Zahlungsabwicklungsgebühren von Stripe werden gesondert abgerechnet.",
        },
        {
          heading: "4. Vertragslaufzeit & Kündigung",
          text: "Der Vertrag wird auf unbestimmte Zeit geschlossen. Da keine monatlichen Fixkosten anfallen, kann der Betrieb die Nutzung jederzeit ohne Einhaltung einer Frist einstellen oder das Konto kündigen.",
        },
      ],
    },
    "guest-terms": {
      title: "Gast-Nutzungsinformationen",
      metaTitle: "Gast-Bedingungen & Bestellinformationen - Zackisch",
      metaDescription: "Hinweise für Gäste zur Nutzung des digitalen QR-Menüs und zur Bezahlung im Lokal.",
      lastUpdated: "20. Oktober 2026",
      statusBadge: "Gast-Informationen",
      sections: [
        {
          heading: "1. Vertragspartner beim Bestellen",
          text: "Wenn du über das Zackisch-Menü Speisen oder Getränke bestellst, kommt der Kaufvertrag ausschließlich zwischen dir und dem jeweiligen Gastronomiebetrieb zustande. Zackisch stellt lediglich die technische Vermittlungs- und Bestellplattform bereit.",
        },
        {
          heading: "2. Preise & Bezahlung",
          text: "Alle angegebenen Preise verstehen sich in Euro inklusive der jeweils geltenden gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt digital über Stripe. Du erhältst nach Abschluss eine digitale Bestell- und Zahlungsbestätigung.",
        },
        {
          heading: "3. Freiwilliges Trinkgeld",
          text: "Die Trinkgeldoption im Checkout ist standardmäßig auf 0 % voreingestellt. Wenn du dem Service-Team ein Trinkgeld geben möchtest, kannst du dies freiwillig auswählen. Das Trinkgeld wird ungekürzt an den Gastronomiebetrieb weitergeleitet.",
        },
      ],
    },
    payments: {
      title: "Zahlungsinformationen & Stripe Connect",
      metaTitle: "Zahlungsmodell & Stripe Connect - Zackisch",
      metaDescription: "Detaillierte Erläuterungen zum Direct-Charges-Geldfluss, Gebührentrennung und Stripe Connect.",
      lastUpdated: "20. Oktober 2026",
      statusBadge: "Zahlungsarchitektur",
      sections: [
        {
          heading: "1. Das Direct-Charges-Modell",
          text: "Zackisch nutzt Stripe Connect mit Direct Charges. Das bedeutet: Jeder Gastronomiebetrieb verbindet sein eigenes Stripe-Konto. Bei einer Bestellung bezahlt der Gast direkt an das Konto des Betriebs. Zackisch zieht lediglich die vereinbarte Plattformgebühr von 2 % (Application Fee) ein.",
        },
        {
          heading: "2. Transparente Gebührentrennung (Beispiel)",
          text: "Bestellwert: 20,00 € Speisen + 2,00 € freiwilliges Trinkgeld = 22,00 € Gesamtbetrag.\n- Zackisch-Plattformgebühr (2 % auf Speisenwert 20 €): 0,40 €\n- Stripe-Standardgebühr (z. B. 1,5 % + 0,25 € auf 22 €): 0,58 €\n- Verbleibendes Guthaben beim Betrieb: 21,02 € (wovon 2,00 € als Trinkgeld dokumentiert werden).",
        },
        {
          heading: "3. Auszahlungen auf dein Bankkonto",
          text: "Die Auszahlung der Guthaben erfolgt nach dem regulären Stripe-Auszahlungsplan direkt auf das Bankkonto des Gastronomiebetriebs. Zackisch hält zu keinem Zeitpunkt treuhänderische Kundengelder auf eigenen Konten.",
        },
      ],
    },
  },
  "de-en": {
    "legal-notice": {
      title: "Legal Notice (Imprint)",
      metaTitle: "Legal Notice (§ 5 DDG) - Zackisch",
      metaDescription: "Statutory provider identification pursuant to § 5 of the German Digital Services Act (DDG).",
      lastUpdated: "October 20, 2026",
      statusBadge: "Statutory Provider Identification",
      sections: [
        {
          heading: "1. Information pursuant to § 5 DDG",
          text: "Zackisch\nOwner: Selim Eser\nPostal Address: Mannheim, Baden-Württemberg, Germany\n(Full summons-ready address undergoing formal registration review prior to public launch)",
        },
        {
          heading: "2. Contact",
          text: "Email: selim@zackisch.com\nWebsite: https://zackisch.com\nSupport: https://support.zackisch.com",
        },
        {
          heading: "3. VAT Identification Number & Commercial Register",
          text: "VAT ID pursuant to § 27a German VAT Act (UStG): Pending allocation.\nRegister: Sole proprietorship in formation; commercial register entry not mandatory.",
        },
        {
          heading: "4. Editorial Responsibility pursuant to § 18 (2) MStV",
          text: "Selim Eser, Mannheim, Germany.",
        },
        {
          heading: "5. Online Dispute Resolution",
          text: "The European Commission provides a platform for online dispute resolution (ODR): https://ec.europa.eu/consumers/odr/.\nWe are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      metaTitle: "Privacy Policy (GDPR) - Zackisch",
      metaDescription:
        "Transparent information on personal data processing on the website, merchant accounts, and guest ordering flows.",
      lastUpdated: "October 20, 2026",
      statusBadge: "GDPR Articles 13 & 14 Disclosure",
      sections: [
        {
          heading: "1. Overview & Data Controller",
          text: "The data controller for this website is Selim Eser (Zackisch), reachable at selim@zackisch.com. This privacy policy explains the scope and purpose of personal data processing across our marketing website, guest ordering app, and merchant dashboard.",
        },
        {
          heading: "2. Visiting our Marketing Website (zackisch.com)",
          text: "Our marketing website is operated purely for informational purposes. Server log files (IP address, timestamp, browser, referrer) are processed based on legitimate interest (Art. 6(1)(f) GDPR) to ensure server security. No unsolicited marketing trackers or third-party cookies are deployed.",
        },
        {
          heading: "3. Guest QR Ordering & Smart Menu",
          text: "When placing an order via QR code, we process only data strictly necessary for order fulfillment and kitchen preparation (table number, ordered items, transaction reference) based on Art. 6(1)(b) GDPR.\n\nOptional features ('For You', saved preferences) are only activated upon explicit, voluntary consent (Art. 6(1)(a) GDPR) and can be revoked at any time.",
        },
        {
          heading: "4. Payment Processing via Stripe Connect",
          text: "Digital payments are processed via Stripe Payments Europe, Ltd. (Dublin, Ireland) under the Stripe Connect Direct Charges model. Card data is handled directly by Stripe in compliance with PCI-DSS. Zackisch never stores credit card details.",
        },
        {
          heading: "5. Merchant Registration (B2B)",
          text: "When setting up a venue account, we process business master data and merchant login credentials to fulfill the platform contract (Art. 6(1)(b) GDPR) and comply with statutory accounting requirements (Art. 6(1)(c) GDPR).",
        },
        {
          heading: "6. Your Rights as a Data Subject",
          text: "Under the GDPR, you have the right to access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and objection (Art. 21). Contact selim@zackisch.com for any inquiries.",
        },
      ],
    },
    cookies: {
      title: "Cookie & Storage Policy",
      metaTitle: "Cookie Information (§ 25 TDDDG) - Zackisch",
      metaDescription: "Details on strictly necessary storage and optional personalization cookies on Zackisch.",
      lastUpdated: "October 20, 2026",
      statusBadge: "Information pursuant to § 25 TDDDG",
      sections: [
        {
          heading: "1. Principle of Data Minimization",
          text: "Zackisch deploys zero commercial advertising trackers, third-party marketing cookies, or fingerprinting scripts on its marketing site. Your privacy is respected from the very first click.",
        },
        {
          heading: "2. Strictly Necessary Storage (§ 25 (2) TDDDG)",
          text: "We use only storage functions strictly necessary for core service delivery, such as language preference cookies (de-de / de-en) and CSRF protection tokens.",
        },
        {
          heading: "3. Voluntary Guest Personalization",
          text: "In the guest ordering app, guests can voluntarily consent to storing recent order choices locally on their device to surface favorite items during future visits. This is entirely optional.",
        },
      ],
    },
    "business-terms": {
      title: "Merchant Terms of Service (B2B)",
      metaTitle: "Merchant B2B Terms - Zackisch",
      metaDescription: "Contractual terms for hospitality venues utilizing the Zackisch ordering and menu platform.",
      lastUpdated: "October 20, 2026",
      statusBadge: "B2B Service Agreement (Draft)",
      sections: [
        {
          heading: "1. Subject of Contract & Service Scope",
          text: "Zackisch provides venues with a web-based platform for digital menus, order intake, and digital payment acceptance. Zackisch explicitly does not provide a POS cash register and does not replace the merchant's existing POS register.",
        },
        {
          heading: "2. Venue Responsibilities",
          text: "The venue is independently responsible for recording paid orders into its existing, legally compliant fiscal cash register (TSE). The venue is the sole seller of food and beverages and is responsible for allergen notices and statutory price disclosures.",
        },
        {
          heading: "3. Fees & Settlement",
          text: "Zackisch charges zero setup fees and zero monthly subscription fees. A variable platform fee of 2.0% applies to successfully captured food and beverage order volume. Voluntary guest tips are exempt from the 2% fee. Stripe processing fees apply separately.",
        },
        {
          heading: "4. Contract Term & Termination",
          text: "Agreements are concluded for an indefinite term. Since no recurring fixed base fees apply, venues can pause or terminate usage at any time with immediate effect.",
        },
      ],
    },
    "guest-terms": {
      title: "Guest Ordering Information",
      metaTitle: "Guest Terms & Information - Zackisch",
      metaDescription: "Information for dining guests using the digital QR code menu and on-site payment.",
      lastUpdated: "October 20, 2026",
      statusBadge: "Guest Notice",
      sections: [
        {
          heading: "1. Contracting Party",
          text: "When placing an order through the Zackisch menu, the purchase contract is formed exclusively between you and the respective hospitality venue. Zackisch acts solely as the technical ordering intermediary.",
        },
        {
          heading: "2. Prices & Payment",
          text: "All listed menu prices are in Euros including applicable VAT. Payment is processed securely via Stripe. You receive a digital order and payment confirmation upon completion.",
        },
        {
          heading: "3. Voluntary Tips",
          text: "Tip selection defaults to 0% in checkout. If you wish to tip the service team, you can voluntarily select an amount. Tips are passed through to the venue without platform fee deduction.",
        },
      ],
    },
    payments: {
      title: "Payment Architecture & Stripe Connect",
      metaTitle: "Payment Architecture & Stripe Connect - Zackisch",
      metaDescription: "Detailed explanation of the Direct Charges money flow, fee separation, and Stripe Connect.",
      lastUpdated: "October 20, 2026",
      statusBadge: "Payment Architecture",
      sections: [
        {
          heading: "1. Direct Charges Model",
          text: "Zackisch utilizes Stripe Connect Direct Charges. Each venue connects its own Stripe account. Guest payments flow directly to the venue's account, and Zackisch deducts only its 2% application fee.",
        },
        {
          heading: "2. Transparent Fee Separation (Example)",
          text: "Order amount: 20.00 € meals + 2.00 € voluntary tip = 22.00 € total payment.\n- Zackisch fee (2% on 20 € food): 0.40 €\n- Stripe card processing fee (e.g. 1.5% + 0.25 € on 22 €): 0.58 €\n- Net balance on venue account: 21.02 € (of which 2.00 € is documented as voluntary tip).",
        },
        {
          heading: "3. Direct Payouts to Your Bank Account",
          text: "Available balances are transferred directly to the venue's verified business bank account according to Stripe's rolling payout schedule. Zackisch never holds merchant funds in custody.",
        },
      ],
    },
  },
};
