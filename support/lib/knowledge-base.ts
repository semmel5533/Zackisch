export type SupportLocale = "de-de" | "de-en";

export interface SupportCategory {
  slug:
    | "onboarding"
    | "qr-tables"
    | "orders-tablet"
    | "payments-payouts"
    | "account-legal";
  ticketCategory:
    | "onboarding"
    | "qr_tables"
    | "orders_tablet"
    | "payments_payouts"
    | "account_legal"
    | "pos_reconciliation";
  title: Record<SupportLocale, string>;
  description: Record<SupportLocale, string>;
  badge: Record<SupportLocale, string>;
}

export interface SupportArticle {
  slug: string;
  categorySlug: SupportCategory["slug"];
  featured?: boolean;
  keywords: string[];
  title: Record<SupportLocale, string>;
  summary: Record<SupportLocale, string>;
  prerequisites: Record<SupportLocale, string[]>;
  steps: Record<SupportLocale, string[]>;
  verification: Record<SupportLocale, string>;
  relatedSlugs: string[];
}

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    slug: "onboarding",
    ticketCategory: "onboarding",
    title: {
      "de-de": "Erste Schritte & Einrichtung",
      "de-en": "Getting Started & Setup",
    },
    description: {
      "de-de":
        "Betriebsprofil, Speisekarte mit 7 % und 19 % MwSt., Setup-Assistent und erster Testlauf.",
      "de-en":
        "Business profile, menu with 7% and 19% VAT, setup wizard, and first test run.",
    },
    badge: {
      "de-de": "9 Artikel",
      "de-en": "9 Articles",
    },
  },
  {
    slug: "qr-tables",
    ticketCategory: "qr_tables",
    title: {
      "de-de": "QR-Codes, Tische & Druck",
      "de-en": "QR Codes, Tables & Printing",
    },
    description: {
      "de-de":
        "Tisch- und Abhol-QR-Codes generieren, A4/A6-Druckbögen, Ruhezone (Quiet Zone) und Aufsteller.",
      "de-en":
        "Generate table and pickup QR codes, A4/A6 print sheets, quiet zone rules, and table standees.",
    },
    badge: {
      "de-de": "8 Artikel",
      "de-en": "8 Articles",
    },
  },
  {
    slug: "orders-tablet",
    ticketCategory: "orders_tablet",
    title: {
      "de-de": "Bestellungen, Tablet & Kasse (POS)",
      "de-en": "Orders, Staff Tablet & POS Recording",
    },
    description: {
      "de-de":
        "Bestehendes Tablet koppeln, Live-Bestellungen bearbeiten und jede bezahlte Bestellung einmalig in der Kasse erfassen.",
      "de-en":
        "Pair your existing tablet, manage live orders, and record every paid order once in your existing POS.",
    },
    badge: {
      "de-de": "9 Artikel",
      "de-en": "9 Articles",
    },
  },
  {
    slug: "payments-payouts",
    ticketCategory: "payments_payouts",
    title: {
      "de-de": "Zahlungen, Stripe Connect & Gebühren",
      "de-en": "Payments, Stripe Connect & Fees",
    },
    description: {
      "de-de":
        "Direktzahlungen auf dein Stripe-Konto, 2 % Zackisch-Provision (inkl. USt., 0 % auf Trinkgeld), Auszahlungen und Erstattungen.",
      "de-en":
        "Direct charges on your Stripe account, 2% Zackisch fee (VAT-inclusive, 0% on tips), payouts, and refunds.",
    },
    badge: {
      "de-de": "10 Artikel",
      "de-en": "10 Articles",
    },
  },
  {
    slug: "account-legal",
    ticketCategory: "account_legal",
    title: {
      "de-de": "Konto, Rechtliches & Datenschutz",
      "de-en": "Account, Legal & Data Protection",
    },
    description: {
      "de-de":
        "Verkäuferidentität (Seller of Record), Bestell- und Zahlungsbestätigung vs. Kassenbeleg, AVV, Aufbewahrung und Kontolöschung.",
      "de-en":
        "Seller of Record identity, order & payment confirmation vs. POS receipt, DPA, statutory retention, and account deletion.",
    },
    badge: {
      "de-de": "7 Artikel",
      "de-en": "7 Articles",
    },
  },
];

const SYNONYM_MAP: Record<string, string[]> = {
  kasse: ["pos", "kassensystem", "tse", "kassenbeleg", "bon", "abgleich", "erfassen"],
  pos: ["kasse", "kassensystem", "tse", "receipt", "reconciliation", "record"],
  tse: ["kassensichv", "kassenbeleg", "kasse", "pos", "fiscal", "finanzamt"],
  beleg: ["bestätigung", "kassenbeleg", "rechnung", "confirmation", "receipt"],
  rechnung: ["kassenbeleg", "bestätigung", "xrechnung", "zugferd", "invoice"],
  stripe: ["zahlung", "auszahlung", "kyc", "onboarding", "payout", "connect", "gebühren"],
  trinkgeld: ["tip", "provision", "gebühr", "0%"],
  qr: ["tisch", "aufsteller", "druck", "scan", "quiet zone", "standee"],
  tablet: ["personal", "küche", "terminal", "ipad", "android", "koppeln"],
};

export const SUPPORT_ARTICLES: SupportArticle[] = [
  // ============================================================================
  // CATEGORY 1: ONBOARDING (9 articles)
  // ============================================================================
  {
    slug: "setup-checklist-15-minutes",
    categorySlug: "onboarding",
    featured: true,
    keywords: ["setup", "einrichtung", "start", "checkliste", "assistent", "wizard"],
    title: {
      "de-de": "Einrichtungs-Checkliste: In 8 Schritten startklar",
      "de-en": "Setup Checklist: Ready in 8 Self-Service Steps",
    },
    summary: {
      "de-de":
        "So führst du deinen Gastronomiebetrieb selbstständig durch den Zackisch Setup-Assistenten — ohne Kassenwechsel und ohne neue Hardware.",
      "de-en":
        "How to guide your hospitality venue through the Zackisch Setup Wizard on your own — without changing your POS or buying new hardware.",
    },
    prerequisites: {
      "de-de": [
        "Vorhandenes Kassensystem (POS)",
        "Ein bestehendes Tablet oder Smartphone für das Personal",
        "Handelsregister-/Gewerbedaten, Steuernummer oder USt-IdNr. und Geschäfts-IBAN",
      ],
      "de-en": [
        "Existing point-of-sale system (POS)",
        "An existing tablet or smartphone for staff",
        "Business registration details, German tax ID or VAT ID, and business IBAN",
      ],
    },
    steps: {
      "de-de": [
        "Melde dich unter app.zackisch.com an und öffne den Setup-Assistenten.",
        "Hinterlege deinen rechtlichen Firmennamen, die Betriebsanschrift und deine Steuernummer bzw. USt-IdNr.",
        "Bestätige die B2B-AGB, die Vereinbarung zur Auftragsverarbeitung (AVV) und das 2-%-Provisionsmodell.",
        "Schließe das eingebettete Stripe Connect Onboarding ab, damit Direktzahlungen auf dein eigenes Stripe-Konto fließen.",
        "Lege mindestens eine Kategorie und deine Speisen (7 % MwSt.) sowie Getränke (19 % MwSt.) an.",
        "Konfiguriere deine Tischnummern oder aktiviere den Abhol-Modus und drucke die QR-Codes aus.",
        "Kopple dein vorhandenes Personal-Tablet per QR-Code oder Sitzungslink.",
        "Bestätige den Leitfaden zur einmaligen Kassenerfassung und führe eine kontrollierte Testbestellung durch.",
      ],
      "de-en": [
        "Sign in at app.zackisch.com and open the Setup Wizard.",
        "Enter your legal business name, venue address, and German tax ID or VAT ID.",
        "Accept the B2B Terms, Data Processing Agreement (DPA), and the 2% fee model.",
        "Complete the embedded Stripe Connect onboarding so direct charges settle to your own Stripe account.",
        "Create at least one category and add food items (7% VAT) and drinks (19% VAT).",
        "Configure your table numbers or enable pickup mode and print your QR codes.",
        "Pair your existing staff tablet via QR code or session link.",
        "Confirm the single-entry POS recording guide and run a controlled test order.",
      ],
    },
    verification: {
      "de-de":
        "Im Setup-Assistenten stehen alle 8 Meilensteine auf Grün (100 % abgeschlossen).",
      "de-en":
        "All 8 milestones in the Setup Wizard show green (100% complete).",
    },
    relatedSlugs: [
      "pos-single-entry-workflow",
      "stripe-embedded-onboarding-guide",
      "menu-vat-rates-7-and-19",
    ],
  },
  {
    slug: "prerequisites-existing-pos-and-tablet",
    categorySlug: "onboarding",
    keywords: ["voraussetzungen", "kasse", "pos", "tablet", "hardware"],
    title: {
      "de-de": "Technische Voraussetzungen: Vorhandene Kasse & bestehendes Tablet",
      "de-en": "Technical Prerequisites: Existing POS & Existing Tablet",
    },
    summary: {
      "de-de":
        "Welche Ausstattung dein Betrieb benötigt und warum keine spezielle Zusatz-Hardware angeschafft werden muss.",
      "de-en":
        "What equipment your venue needs and why no proprietary hardware purchase is required.",
    },
    prerequisites: {
      "de-de": ["Stabile WLAN- oder Mobilfunkverbindung im Gastraum"],
      "de-en": ["Stable Wi-Fi or mobile connection in your dining area"],
    },
    steps: {
      "de-de": [
        "Prüfe, dass auf deinem vorhandenen Tablet (iPad, Android oder Windows) ein aktueller Browser (Safari, Chrome, Edge) installiert ist.",
        "Stelle sicher, dass dein bestehendes Kassensystem für die reguläre Erfassung deiner Tagesumsätze bereitsteht.",
        "Halte Standard-Druckpapier (A4) oder Tischaufsteller (A6) für die QR-Codes bereit.",
      ],
      "de-en": [
        "Verify that your existing tablet (iPad, Android, or Windows) runs a modern browser (Safari, Chrome, Edge).",
        "Ensure your existing POS system is ready for standard recording of daily sales.",
        "Prepare standard A4 paper or A6 table standees for printing QR codes.",
      ],
    },
    verification: {
      "de-de": "Das Tablet öffnet app.zackisch.com verzögerungsfrei im Vollbild.",
      "de-en": "The tablet opens app.zackisch.com smoothly in full screen.",
    },
    relatedSlugs: ["setup-checklist-15-minutes", "pairing-staff-tablet"],
  },
  {
    slug: "business-profile-seller-of-record",
    categorySlug: "onboarding",
    keywords: ["impressum", "verkäufer", "seller of record", "steuernummer", "ust-idnr"],
    title: {
      "de-de": "Betriebsprofil & Verkäuferangaben richtig hinterlegen",
      "de-en": "Configuring Your Business Profile & Seller of Record Details",
    },
    summary: {
      "de-de":
        "Da dein Betrieb Vertragspartner der Gäste (Seller of Record) ist, werden Firmenname, Anschrift und Steuer-ID im Checkout und auf der Bestätigung ausgewiesen.",
      "de-en":
        "Because your restaurant is the Seller of Record to guests, your legal name, address, and tax ID appear at checkout and on the confirmation.",
    },
    prerequisites: {
      "de-de": ["Gewerbeanmeldung oder Handelsregisterauszug"],
      "de-en": ["Business registration or commercial register extract"],
    },
    steps: {
      "de-de": [
        "Öffne Einstellungen -> Betriebsprofil.",
        "Trage den exakten rechtlichen Namen (z. B. Muster Gastronomie GmbH oder Inhabername bei Einzelunternehmen) ein.",
        "Hinterlege die vollständige Betriebsanschrift sowie deine Steuernummer oder USt-IdNr.",
      ],
      "de-en": [
        "Open Settings -> Business Profile.",
        "Enter your exact legal business name (e.g. Muster Gastronomie GmbH or sole proprietor name).",
        "Enter your full venue address and German tax number or VAT ID.",
      ],
    },
    verification: {
      "de-de":
        "Im Gäste-Checkout wird dein Betrieb als Verkäufer vollständig angezeigt.",
      "de-en":
        "Your venue is displayed as the legal seller in the guest checkout.",
    },
    relatedSlugs: ["setup-checklist-15-minutes", "guest-confirmation-vs-pos-receipt"],
  },
  {
    slug: "menu-categories-and-sorting",
    categorySlug: "onboarding",
    keywords: ["speisekarte", "kategorien", "sortierung", "menü", "anlegen"],
    title: {
      "de-de": "Kategorien anlegen und Reihenfolge für Gäste sortieren",
      "de-en": "Creating Menu Categories and Sorting Guest Display Order",
    },
    summary: {
      "de-de":
        "Strukturiere deine digitale Speisekarte übersichtlich nach Vorspeisen, Hauptgerichten, Getränken und Desserts.",
      "de-en":
        "Structure your digital menu clearly into starters, mains, drinks, and desserts.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang unter app.zackisch.com"],
      "de-en": ["Owner access at app.zackisch.com"],
    },
    steps: {
      "de-de": [
        "Wechsle im Dashboard zum Reiter Speisekarte.",
        "Klicke auf Kategorie hinzufügen und vergib einen klaren Namen.",
        "Ordne Kategorien per Drag-and-Drop in der gewünschten Reihenfolge an.",
      ],
      "de-en": [
        "Open the Menu tab in the dashboard.",
        "Click Add Category and enter a clear title.",
        "Drag and drop categories into the order guests should see first.",
      ],
    },
    verification: {
      "de-de": "Die Kategorieleiste im Gäste-Menü übernimmt die Sortierung sofort.",
      "de-en": "The category bar in the guest menu reflects the new order immediately.",
    },
    relatedSlugs: ["menu-vat-rates-7-and-19", "menu-customizations-and-extras"],
  },
  {
    slug: "menu-vat-rates-7-and-19",
    categorySlug: "onboarding",
    featured: true,
    keywords: ["mwst", "umsatzsteuer", "7%", "19%", "steuer", "speisen", "getränke"],
    title: {
      "de-de": "Mehrwertsteuersätze (7 % und 19 %) pro Artikel hinterlegen",
      "de-en": "Assigning German VAT Rates (7% and 19%) per Menu Item",
    },
    summary: {
      "de-de":
        "So hinterlegst du den korrekten Steuersatz für Speisen und Getränke, damit Bestellbestätigung und Kassenabgleich exakt übereinstimmen.",
      "de-en":
        "How to assign the proper tax rate for food and drinks so order confirmations and POS reconciliation match.",
    },
    prerequisites: {
      "de-de": ["Abstimmung der Steuersätze mit deinem Kassensystem / Steuerberater"],
      "de-en": ["Alignment of tax rates with your POS / tax advisor"],
    },
    steps: {
      "de-de": [
        "Wähle beim Anlegen oder Bearbeiten eines Artikels das Feld Mehrwertsteuersatz (7 % ermäßigt oder 19 % regulär).",
        "Stelle sicher, dass der Bruttopreis exakt mit dem Preis in deiner bestehenden Kasse übereinstimmt.",
        "Speichere den Artikel.",
      ],
      "de-en": [
        "When creating or editing an item, select the VAT rate (7% reduced or 19% standard).",
        "Ensure the gross price matches the exact price configured in your existing POS.",
        "Save the item.",
      ],
    },
    verification: {
      "de-de":
        "Auf der Bestell- und Zahlungsbestätigung sowie im Kassenabgleich werden 7-%- und 19-%-Umsätze getrennt ausgewiesen.",
      "de-en":
        "7% and 19% totals are broken down separately on the order confirmation and POS reconciliation view.",
    },
    relatedSlugs: ["pos-single-entry-workflow", "allergens-and-additives-lmiv"],
  },
  {
    slug: "menu-customizations-and-extras",
    categorySlug: "onboarding",
    keywords: ["extras", "optionen", "beilagen", "auswahl", "aufpreis"],
    title: {
      "de-de": "Auswahl-Schritte, Beilagen und kostenpflichtige Extras konfigurieren",
      "de-en": "Configuring Modifiers, Sides, and Paid Extras",
    },
    summary: {
      "de-de":
        "Definiere Pflichtauswahlen (z. B. Garstufe) und optionale Zusatzwünsche mit automatischer Preisberechnung.",
      "de-en":
        "Define required choices (e.g. cooking temperature) and optional add-ons with automatic server-side pricing.",
    },
    prerequisites: {
      "de-de": ["Mindestens ein angelegter Artikel"],
      "de-en": ["At least one created menu item"],
    },
    steps: {
      "de-de": [
        "Öffne einen Artikel in der Speisekarte und füge eine Auswahlgruppe hinzu.",
        "Lege Mindest- und Maximalauswahl sowie enthaltene Inklusiv-Optionen fest.",
        "Hinterlege Aufpreise in Euro; Zackisch prüft jeden Preis serverseitig vor der Zahlung.",
      ],
      "de-en": [
        "Open an item in the menu editor and add a customization group.",
        "Set minimum and maximum selections as well as included free options.",
        "Enter extra prices in EUR; Zackisch validates all prices server-side before payment.",
      ],
    },
    verification: {
      "de-de": "Die Auswahl erscheint im Gäste-Dialog und auf der Personal-Ansicht.",
      "de-en": "The options appear in the guest modal and on the staff tablet view.",
    },
    relatedSlugs: ["menu-categories-and-sorting", "86-item-availability-toggle"],
  },
  {
    slug: "allergens-and-additives-lmiv",
    categorySlug: "onboarding",
    keywords: ["allergene", "zusatzstoffe", "lmiv", "kennzeichnung", "gluten", "laktose"],
    title: {
      "de-de": "Allergene und Zusatzstoffe nach LMIV pflegen",
      "de-en": "Managing Allergens and Additives (EU FIC / LMIV)",
    },
    summary: {
      "de-de":
        "Kennzeichne die 14 Hauptallergene und deklarationspflichtigen Zusatzstoffe direkt am Artikel für Gäste vor dem Kauf.",
      "de-en":
        "Display the 14 mandatory allergens and declarable additives directly on menu items before purchase.",
    },
    prerequisites: {
      "de-de": ["Allergen-Dokumentation deiner Küche"],
      "de-en": ["Kitchen allergen documentation"],
    },
    steps: {
      "de-de": [
        "Öffne den gewünschten Artikel in der Speisekartenverwaltung.",
        "Trage Allergene und Zusatzstoffe in die vorgesehenen Kennzeichnungsfelder oder die Beschreibung ein.",
        "Prüfe die Anzeige in der Gäste-Vorschau.",
      ],
      "de-en": [
        "Open the item in the menu manager.",
        "Enter allergens and additives in the designation fields or item description.",
        "Verify the display in the guest preview.",
      ],
    },
    verification: {
      "de-de":
        "Gäste sehen alle Allergenhinweise vor Klick auf Zahlungspflichtig bestellen.",
      "de-en":
        "Guests see all allergen notices before clicking Order with obligation to pay.",
    },
    relatedSlugs: ["menu-vat-rates-7-and-19"],
  },
  {
    slug: "controlled-test-order-guide",
    categorySlug: "onboarding",
    keywords: ["testbestellung", "test", "probelauf", "livegang"],
    title: {
      "de-de": "Kontrollierte Testbestellung vor dem Live-Betrieb durchführen",
      "de-en": "Running a Controlled Test Order Before Going Live",
    },
    summary: {
      "de-de":
        "Prüfe das Zusammenspiel aus Gäste-Ansicht, Personal-Tablet und Kassenerfassung mit einer markierten Testbestellung.",
      "de-en":
        "Verify the flow between guest view, staff tablet, and POS recording with a clearly marked test order.",
    },
    prerequisites: {
      "de-de": ["Gekoppeltes Personal-Tablet"],
      "de-en": ["Paired staff tablet"],
    },
    steps: {
      "de-de": [
        "Öffne im Setup-Assistenten den Schritt Kassen-Workflow & Testbestellung.",
        "Klicke auf Kontrollierte Testbestellung auslösen (Bestellnummer T01).",
        "Prüfe, dass die Bestellung sofort auf dem Personal-Tablet erscheint und teste den Button In Kasse erfasst.",
      ],
      "de-en": [
        "Open the POS Workflow & Test Order step in the Setup Wizard.",
        "Click Trigger Controlled Test Order (Order #T01).",
        "Verify the order appears immediately on the staff tablet and test the Recorded in POS button.",
      ],
    },
    verification: {
      "de-de":
        "Der Meilenstein Testbestellung wird grün markiert; Testbestellungen werden nicht in deinen Monatsumsatz eingerechnet.",
      "de-en":
        "The test order milestone turns green; test orders are excluded from your monthly revenue totals.",
    },
    relatedSlugs: ["setup-checklist-15-minutes", "pos-single-entry-workflow"],
  },
  {
    slug: "pausing-and-resuming-ordering",
    categorySlug: "onboarding",
    keywords: ["pausieren", "stopp", "ruhetag", "schließen", "aktivieren"],
    title: {
      "de-de": "Bestellannahme bei Hochbetrieb oder Ruhetag pausieren",
      "de-en": "Pausing and Resuming Digital Ordering During Peak Hours or Closures",
    },
    summary: {
      "de-de":
        "So pausierst du neue QR-Bestellungen jederzeit mit einem Klick, während laufende Bestellungen normal abgeschlossen werden.",
      "de-en":
        "How to pause new QR orders anytime with one click while active orders finish normally.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang"],
      "de-en": ["Owner access"],
    },
    steps: {
      "de-de": [
        "Öffne Einstellungen oder den Setup-Assistenten.",
        "Schalte Bestellannahme pausieren aktiv oder deaktiviere vorübergehend Vor-Ort- und Abhol-Modus.",
        "Gäste sehen sofort einen freundlichen Hinweis, sich direkt an das Servicepersonal zu wenden.",
      ],
      "de-en": [
        "Open Settings or the Setup Wizard.",
        "Toggle Pause Ordering or temporarily disable Dine-In and Pickup modes.",
        "Guests immediately see a friendly notice to order directly with staff.",
      ],
    },
    verification: {
      "de-de": "Neue Checkout-Versuche werden serverseitig blockiert, bis du die Pause aufhebst.",
      "de-en": "New checkout attempts are blocked server-side until you resume ordering.",
    },
    relatedSlugs: ["86-item-availability-toggle"],
  },

  // ============================================================================
  // CATEGORY 2: QR CODES, TABLES & PRINTING (8 articles)
  // ============================================================================
  {
    slug: "configure-table-numbers-and-zones",
    categorySlug: "qr-tables",
    featured: true,
    keywords: ["tische", "tischnummer", "qr", "anlegen", "terrasse"],
    title: {
      "de-de": "Tischnummern anlegen und mit deinem Kassen-Tischplan abgleichen",
      "de-en": "Configuring Table Numbers to Match Your POS Floor Plan",
    },
    summary: {
      "de-de":
        "Verwende exakt dieselben Tischnummern (1–4 Zeichen, z. B. 12 oder T4) wie in deiner Kasse, damit jede Bestellung sofort zugeordnet werden kann.",
      "de-en":
        "Use the exact same table identifiers (1–4 characters, e.g. 12 or T4) as in your POS for instant table matching.",
    },
    prerequisites: {
      "de-de": ["Tischplan deines bestehenden Kassensystems"],
      "de-en": ["Floor plan of your existing POS system"],
    },
    steps: {
      "de-de": [
        "Öffne im Dashboard Einstellungen -> Tische & QR-Codes.",
        "Aktiviere Am Tisch bestellen (Vor-Ort-Verzehr).",
        "Füge deine Tischnummern einzeln oder als Zahlenbereich hinzu (maximal 4 Zeichen pro Tisch).",
      ],
      "de-en": [
        "Open Settings -> Tables & QR Codes in the dashboard.",
        "Enable Dine-In Table Ordering.",
        "Add your table numbers individually or as a range (up to 4 characters per table).",
      ],
    },
    verification: {
      "de-de": "Für jeden Tisch steht ein eigener QR-Code mit Tischnummer zum Druck bereit.",
      "de-en": "Each table has its own printable QR code with table number.",
    },
    relatedSlugs: ["printing-qr-sheets-a4-and-a6", "qr-quiet-zone-and-scan-reliability"],
  },
  {
    slug: "pickup-counter-qr-setup",
    categorySlug: "qr-tables",
    keywords: ["abholung", "takeaway", "to go", "tresen", "theke", "abholnummer"],
    title: {
      "de-de": "Abhol-QR-Code (To-Go / Theke) mit 3-stelliger Abholnummer nutzen",
      "de-en": "Using the Pickup Counter QR Code (Takeaway) with 3-Digit Order Numbers",
    },
    summary: {
      "de-de":
        "Gäste scannen am Tresen oder Schaufenster, bezahlen direkt am Smartphone und werden über ihre 3-stellige Abholnummer (001–999) aufgerufen.",
      "de-en":
        "Guests scan at the counter or window, pay on their phone, and get called by their 3-digit pickup number (001–999).",
    },
    prerequisites: {
      "de-de": ["Aktivierter Abhol-Modus in den Einstellungen"],
      "de-en": ["Pickup mode enabled in Settings"],
    },
    steps: {
      "de-de": [
        "Aktiviere unter Einstellungen -> Bestellmodi die Option Zur Abholung (Takeaway).",
        "Drucke den Abhol-QR-Code aus und platziere ihn gut sichtbar im Wartebereich oder an der Theke.",
        "Sobald das Gericht fertig ist, tippt dein Team auf Abholbereit — der Status im Smartphone des Gastes springt sofort um.",
      ],
      "de-en": [
        "Enable Pickup (Takeaway) under Settings -> Order Modes.",
        "Print the Pickup QR code and place it visibly at the counter or waiting area.",
        "When the order is ready, staff tap Ready for Pickup — the guest's phone updates in real time.",
      ],
    },
    verification: {
      "de-de": "Die URL des Abhol-QR-Codes lautet app.zackisch.com/pickup/<betriebsId>.",
      "de-en": "The pickup QR code URL resolves to app.zackisch.com/pickup/<organizationId>.",
    },
    relatedSlugs: ["configure-table-numbers-and-zones", "printing-qr-sheets-a4-and-a6"],
  },
  {
    slug: "printing-qr-sheets-a4-and-a6",
    categorySlug: "qr-tables",
    keywords: ["drucken", "a4", "a6", "aufsteller", "pdf", "etiketten"],
    title: {
      "de-de": "QR-Codes auf A4-Sammelbögen oder A6-Tischaufstellern drucken",
      "de-en": "Printing QR Codes on A4 Multi-Table Sheets or A6 Table Standees",
    },
    summary: {
      "de-de":
        "Anleitung für gestochen scharfen Vektordruck auf jedem Büro- oder Etikettendrucker.",
      "de-en":
        "Guide for crisp vector printing on any standard office or label printer.",
    },
    prerequisites: {
      "de-de": ["Konfigurierte Tischnummern oder aktivierter Abhol-Modus"],
      "de-en": ["Configured table numbers or enabled pickup mode"],
    },
    steps: {
      "de-de": [
        "Wähle in der QR-Verwaltung einzelne oder alle Tische aus.",
        "Klicke auf Druckansicht öffnen und wähle im Browser-Druckdialog Skalierung 100 %.",
        "Scanne mindestens einen gedruckten Code testweise mit einer normalen Smartphone-Kamera.",
      ],
      "de-en": [
        "Select individual or all tables in the QR manager.",
        "Click Open Print View and set scale to 100% in your browser print dialog.",
        "Test-scan at least one printed code with a standard smartphone camera.",
      ],
    },
    verification: {
      "de-de": "Die Smartphone-Kamera erkennt den Code in unter einer Sekunde aus 30 cm Abstand.",
      "de-en": "A phone camera recognizes the code in under one second from 30 cm away.",
    },
    relatedSlugs: ["qr-quiet-zone-and-scan-reliability", "weatherproof-outdoor-qr-tips"],
  },
  {
    slug: "qr-quiet-zone-and-scan-reliability",
    categorySlug: "qr-tables",
    keywords: ["ruhezone", "quiet zone", "kontrast", "scannen", "fehlerkorrektur"],
    title: {
      "de-de": "QR-Ruhezone (Quiet Zone), Kontrast und Lesbarkeit bei Schummerlicht",
      "de-en": "QR Quiet Zone, Contrast, and Low-Light Scan Reliability",
    },
    summary: {
      "de-de":
        "Warum der helle Schutzrand (mindestens 4 Module) rund um den QR-Code beim Zuschneiden niemals abgeschnitten werden darf.",
      "de-en":
        "Why the light margin (at least 4 modules) around the QR code must never be cropped when cutting cards.",
    },
    prerequisites: {
      "de-de": ["Zackisch Original-Druckvorlage"],
      "de-en": ["Original Zackisch print template"],
    },
    steps: {
      "de-de": [
        "Belasse beim Ausschneiden immer den weißen Schutzrand rund um das QR-Muster.",
        "Verwende mattes Papier oder entspiegelte Acrylhalter, damit Deckenlampen nicht spiegeln.",
        "Nutze die unter dem Code abgedruckte Kurz-URL als Fallback, falls eine Handykamera beschädigt ist.",
      ],
      "de-en": [
        "Always keep the white quiet-zone border intact when cutting cards.",
        "Use matte paper or anti-glare acrylic holders to avoid overhead light reflections.",
        "Use the human-readable fallback URL printed below the code if a guest's camera is damaged.",
      ],
    },
    verification: {
      "de-de": "Zuverlässiger Scan unter iOS Kamera und Android Google Lens auch bei gedimmtem Licht.",
      "de-en": "Reliable scanning on iOS Camera and Android Google Lens even in dimmed lighting.",
    },
    relatedSlugs: ["printing-qr-sheets-a4-and-a6"],
  },
  {
    slug: "weatherproof-outdoor-qr-tips",
    categorySlug: "qr-tables",
    keywords: ["außenbereich", "terrasse", "biergarten", "wasserfest", "laminieren"],
    title: {
      "de-de": "Wetterfeste QR-Aufsteller für Terrasse und Biergarten",
      "de-en": "Weatherproof QR Standees for Patios and Beer Gardens",
    },
    summary: {
      "de-de": "Praxistipps für UV-beständige, abwischbare Tischkarten im Außenbereich.",
      "de-en": "Practical tips for UV-resistant, wipeable table cards outdoors.",
    },
    prerequisites: {
      "de-de": ["Gedruckte Tisch-QR-Codes"],
      "de-en": ["Printed table QR codes"],
    },
    steps: {
      "de-de": [
        "Verwende matt-laminierte Taschen oder wetterfeste L-Aufsteller.",
        "Befestige Karten im Außenbereich windsicher am Tisch oder im Aufsteller.",
      ],
      "de-en": [
        "Use matte-laminated pouches or weatherproof acrylic standees.",
        "Secure outdoor cards against wind on the table or standee.",
      ],
    },
    verification: {
      "de-de": "Kein Ausbleichen und keine Spiegelung bei direkter Sonneneinstrahlung.",
      "de-en": "No fading and no glare in direct sunlight.",
    },
    relatedSlugs: ["printing-qr-sheets-a4-and-a6"],
  },
  {
    slug: "replacing-damaged-table-qr",
    categorySlug: "qr-tables",
    keywords: ["ersetzen", "einzeln", "nachdrucken", "tischkarte"],
    title: {
      "de-de": "Einzelne beschädigte Tisch-QR-Karten gezielt nachdrucken",
      "de-en": "Reprinting Individual Damaged Table QR Cards",
    },
    summary: {
      "de-de":
        "Da die Tisch-URL stabil bleibt, kannst du jeden einzelnen Tischcode jederzeit neu ausdrucken.",
      "de-en":
        "Because table URLs remain deterministic, you can reprint any single table code at any time.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Dashboard"],
      "de-en": ["Owner dashboard"],
    },
    steps: {
      "de-de": [
        "Öffne Einstellungen -> Tische & QR-Codes.",
        "Klicke neben der gewünschten Tischnummer auf das Drucksymbol.",
      ],
      "de-en": [
        "Open Settings -> Tables & QR Codes.",
        "Click the print icon next to the specific table number.",
      ],
    },
    verification: {
      "de-de": "Der nachgedruckte Code führt sofort wieder zum selben Tisch.",
      "de-en": "The reprinted code points immediately to the same table.",
    },
    relatedSlugs: ["configure-table-numbers-and-zones"],
  },
  {
    slug: "renaming-or-removing-tables",
    categorySlug: "qr-tables",
    keywords: ["umbenennen", "löschen", "entfernen", "tischplan"],
    title: {
      "de-de": "Tische umbenennen oder aus dem Tischplan entfernen",
      "de-en": "Renaming or Removing Tables from Your Floor Plan",
    },
    summary: {
      "de-de": "Was beim Entfernen einer Tischnummer mit alten ausgedruckten QR-Codes passiert.",
      "de-en": "What happens to old printed QR codes when a table number is removed.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang"],
      "de-en": ["Owner access"],
    },
    steps: {
      "de-de": [
        "Entferne nicht mehr genutzte Tischnummern in den Einstellungen und sammle alte Aufsteller ein.",
        "Drucke bei Umbenennungen die neuen Tischkarten aus.",
      ],
      "de-en": [
        "Remove unused table numbers in Settings and collect old standees.",
        "Print new table cards whenever table numbers change.",
      ],
    },
    verification: {
      "de-de": "Die Tischliste im Dashboard entspricht deinem aktuellen Gastraum.",
      "de-en": "The table list in the dashboard matches your current floor layout.",
    },
    relatedSlugs: ["configure-table-numbers-and-zones"],
  },
  {
    slug: "preventing-qr-tampering",
    categorySlug: "qr-tables",
    keywords: ["sicherheit", "aufkleber", "manipulation", "phishing", "kontrolle"],
    title: {
      "de-de": "Schutz vor überklebten QR-Codes im Gastraum (Sichtprüfung)",
      "de-en": "Protecting Against QR Sticker Tampering in the Dining Area",
    },
    summary: {
      "de-de":
        "Wie dein Team beim Eindecken in Sekunden prüft, dass keine fremden Sticker auf Tischaufsteller geklebt wurden.",
      "de-en":
        "How staff can verify in seconds during table setup that no foreign stickers were placed over standees.",
    },
    prerequisites: {
      "de-de": ["Original Zackisch-Tischaufsteller"],
      "de-en": ["Original Zackisch table standees"],
    },
    steps: {
      "de-de": [
        "Platziere den gedruckten Bogen hinter der Acrylscheibe des Tischaufstellers statt außen als Aufkleber.",
        "Prüfe beim täglichen Abwischen der Tische kurz, ob die Acrylfront frei von fremden Aufklebern ist.",
      ],
      "de-en": [
        "Insert the printed sheet behind the acrylic cover of the standee rather than sticking it on the outside.",
        "Check briefly during daily table wiping that the acrylic front has no foreign stickers.",
      ],
    },
    verification: {
      "de-de": "Jeder QR-Scan verweist auf https://app.zackisch.com/...",
      "de-en": "Every QR scan points to https://app.zackisch.com/...",
    },
    relatedSlugs: ["qr-quiet-zone-and-scan-reliability"],
  },

  // ============================================================================
  // CATEGORY 3: ORDERS, STAFF TABLET & POS RECORDING (9 articles)
  // ============================================================================
  {
    slug: "pos-single-entry-workflow",
    categorySlug: "orders-tablet",
    featured: true,
    keywords: [
      "kasse",
      "pos",
      "erfassen",
      "buchen",
      "in kasse erfasst",
      "kassenabgleich",
      "doppelbuchung",
      "tse",
    ],
    title: {
      "de-de": "Jede bezahlte Zackisch-Bestellung einmalig in der bestehenden Kasse erfassen",
      "de-en": "Recording Every Paid Zackisch Order Exactly Once in Your Existing POS",
    },
    summary: {
      "de-de":
        "Der zentrale Ablauf im Alltag: Warum jede bereits mit Zackisch bezahlte Bestellung genau einmal in deiner Kasse erfasst und anschließend als In Kasse erfasst markiert wird.",
      "de-en":
        "The core daily workflow: why every order already paid via Zackisch is entered once in your POS and marked Recorded in POS.",
    },
    prerequisites: {
      "de-de": [
        "Vorhandenes Kassensystem mit Zahlungsart Online bezahlt / Zackisch / Stripe",
        "Gekoppeltes Personal-Tablet",
      ],
      "de-en": [
        "Existing POS system with an Online Payment / Zackisch / Stripe tender type",
        "Paired staff tablet",
      ],
    },
    steps: {
      "de-de": [
        "Sobald ein Gast per QR bestellt und bezahlt hat, erscheint die Bestellung auf deinem Tablet mit dem grünen Hinweis Bereits mit Zackisch bezahlt.",
        "Erfasse die Artikel der Bestellung genau einmal in deiner vorhandenen Kasse unter der unbaren Zahlungsart (z. B. Onlinezahlung / Zackisch / Stripe — niemals als Barzahlung, damit dein Bargeldbestand stimmt!).",
        "Tippe direkt auf der Bestellkarte in Zackisch auf den Button In Kasse erfasst (optional mit Kassen-Bonnummer).",
        "Prüfe zum Schichtende den Bereich Kassenabgleich offen, damit keine Bestellung vergessen oder doppelt gebucht wurde.",
      ],
      "de-en": [
        "As soon as a guest orders and pays via QR, the order appears on your tablet with the green badge Already paid with Zackisch.",
        "Enter the order items exactly once in your existing POS under your non-cash online payment tender (never as Cash, so your cash drawer stays accurate!).",
        "Tap the Recorded in POS button directly on the Zackisch order card (optionally entering the POS receipt reference).",
        "At the end of the shift, check Open POS Reconciliation to ensure no order was missed or booked twice.",
      ],
    },
    verification: {
      "de-de":
        "Unter Kassenabgleich offen stehen 0 offene Bestellungen; die Summe der unbaren Zackisch-Buchungen in deiner Kasse entspricht dem Zackisch-Tagesbericht.",
      "de-en":
        "Open POS Reconciliation shows 0 pending orders; the sum of non-cash Zackisch entries in your POS matches the Zackisch daily total.",
    },
    relatedSlugs: [
      "guest-confirmation-vs-pos-receipt",
      "end-of-day-pos-reconciliation",
      "pairing-staff-tablet",
    ],
  },
  {
    slug: "pairing-staff-tablet",
    categorySlug: "orders-tablet",
    featured: true,
    keywords: ["tablet", "koppeln", "personal", "küche", "terminal", "qr", "sitzung"],
    title: {
      "de-de": "Bestehendes Personal-Tablet sicher ohne Inhaber-Passwort koppeln",
      "de-en": "Pairing Your Existing Staff Tablet Without Sharing Owner Credentials",
    },
    summary: {
      "de-de":
        "Erzeuge im Inhaber-Dashboard einen dedizierten Sitzungs-QR-Code für Service und Küche.",
      "de-en":
        "Generate a dedicated session QR code in the owner dashboard for floor and kitchen staff.",
    },
    prerequisites: {
      "de-de": ["Vorhandenes Tablet mit Browser"],
      "de-en": ["Existing tablet with web browser"],
    },
    steps: {
      "de-de": [
        "Öffne im Dashboard Einstellungen -> Personal-Ansichten & Sitzungen.",
        "Erstelle eine neue Sitzung für Bestell-Ansicht (Küche/Theke) oder Verfügbarkeit (86-Manager).",
        "Scanne den angezeigten Kopplungs-QR-Code mit dem Personal-Tablet oder öffne den Sitzungslink.",
      ],
      "de-en": [
        "Open Settings -> Staff Views & Sessions in the owner dashboard.",
        "Create a new session for Order View (Kitchen/Counter) or Availability (86 Manager).",
        "Scan the pairing QR code with the staff tablet or open the session URL.",
      ],
    },
    verification: {
      "de-de":
        "Das Tablet zeigt Live-Bestellungen in Echtzeit an, hat aber keinen Zugriff auf Auszahlungs- oder Kontoeinstellungen.",
      "de-en":
        "The tablet displays live orders in real time without having access to payout or account settings.",
    },
    relatedSlugs: ["pos-single-entry-workflow", "revoking-staff-tablet-sessions"],
  },
  {
    slug: "order-statuses-in-progress-ready-completed",
    categorySlug: "orders-tablet",
    keywords: ["status", "in zubereitung", "abholbereit", "abgeschlossen", "ablauf"],
    title: {
      "de-de": "Bestellstatus steuern: In Zubereitung, Abholbereit und Abgeschlossen",
      "de-en": "Managing Order Statuses: In Progress, Ready for Pickup, and Completed",
    },
    summary: {
      "de-de": "Wie dein Team Gäste in Echtzeit über den Fortschritt ihrer Bestellung informiert.",
      "de-en": "How your staff keep guests updated on their order progress in real time.",
    },
    prerequisites: {
      "de-de": ["Aktive Personal-Ansicht"],
      "de-en": ["Active staff view"],
    },
    steps: {
      "de-de": [
        "Neue bezahlte Bestellungen starten automatisch im Status In Zubereitung.",
        "Bei Abholbestellungen tippt das Team auf Abholbereit, sobald das Gericht zur Abholung bereitsteht.",
        "Nach Übergabe am Tisch oder an der Theke tippt das Team auf Abschließen.",
      ],
      "de-en": [
        "New paid orders automatically start in In Progress status.",
        "For pickup orders, staff tap Ready for Pickup when the food is ready at the counter.",
        "After serving at the table or handing over at the counter, staff tap Complete.",
      ],
    },
    verification: {
      "de-de": "Der Live-Tracker auf dem Smartphone des Gastes aktualisiert sich ohne Neuladen.",
      "de-en": "The live tracker on the guest's smartphone updates without reloading.",
    },
    relatedSlugs: ["pos-single-entry-workflow"],
  },
  {
    slug: "86-item-availability-toggle",
    categorySlug: "orders-tablet",
    keywords: ["ausverkauft", "86", "verfügbarkeit", "sperren", "küche"],
    title: {
      "de-de": "Artikel oder Extras während der Schicht sofort ausverkauft melden (86-Manager)",
      "de-en": "Marking Items or Extras Sold Out Mid-Shift (86 Availability Manager)",
    },
    summary: {
      "de-de":
        "Wenn ein Gericht in der Küche ausgeht, sperrt dein Team es mit einem Tipp — Gäste können es sofort nicht mehr bestellen.",
      "de-en":
        "When a dish runs out in the kitchen, staff toggle it off with one tap so guests can no longer order it.",
    },
    prerequisites: {
      "de-de": ["Personal-Sitzung für Verfügbarkeit oder Inhaber-Dashboard"],
      "de-en": ["Availability staff session or owner dashboard"],
    },
    steps: {
      "de-de": [
        "Öffne die Verfügbarkeitsansicht auf dem Tablet.",
        "Schalte den ausverkauften Artikel oder die einzelne Beilage auf Nicht verfügbar.",
      ],
      "de-en": [
        "Open the Availability view on the tablet.",
        "Toggle the sold-out item or individual modifier option to Unavailable.",
      ],
    },
    verification: {
      "de-de":
        "Der Artikel verschwindet sofort aus der aktiven Gäste-Speisekarte und wird auch serverseitig beim Checkout blockiert.",
      "de-en":
        "The item disappears immediately from the guest menu and is blocked server-side at checkout.",
    },
    relatedSlugs: ["pairing-staff-tablet"],
  },
  {
    slug: "end-of-day-pos-reconciliation",
    categorySlug: "orders-tablet",
    keywords: ["tagesabschluss", "z-bon", "kassenabgleich", "export", "steuerberater"],
    title: {
      "de-de": "Tagesabschluss & Kassenabgleich zwischen Zackisch und deiner Kasse",
      "de-en": "End-of-Day POS Reconciliation Between Zackisch and Your POS",
    },
    summary: {
      "de-de":
        "So prüfst du in 2 Minuten vor dem Kassenabschluss, ob alle bezahlten Zackisch-Bestellungen in der Kasse erfasst wurden.",
      "de-en":
        "How to verify in 2 minutes before closing your register that all paid Zackisch orders were recorded in your POS.",
    },
    prerequisites: {
      "de-de": ["Zugriff auf das Inhaber-Dashboard oder Bestellarchiv"],
      "de-en": ["Access to the owner dashboard or order archive"],
    },
    steps: {
      "de-de": [
        "Prüfe im Dashboard die Kachel Kassenabgleich offen.",
        "Falls dort noch Bestellungen gelistet sind, gleiche sie anhand von Uhrzeit, Tisch und Betrag mit deiner Kasse ab und markiere sie nach Erfassung als In Kasse erfasst.",
        "Vergleiche die Zackisch-Bruttosumme (getrennt nach 7 % / 19 % MwSt. und Trinkgeld) mit der Summe deiner unbaren Online-Zahlungen in der Kasse.",
      ],
      "de-en": [
        "Check the Open POS Reconciliation card in the dashboard.",
        "If any orders remain listed, match them by time, table, and amount against your POS and mark them Recorded in POS.",
        "Compare the Zackisch gross total (split by 7% / 19% VAT and tips) with your non-cash online payment tender total in your POS.",
      ],
    },
    verification: {
      "de-de": "Alle bezahlten Bestellungen des Tages tragen den Status In Kasse erfasst.",
      "de-en": "All paid orders of the day show the Recorded in POS status.",
    },
    relatedSlugs: ["pos-single-entry-workflow", "monthly-fee-statements-and-xrechnung"],
  },
  {
    slug: "handling-refunds-in-pos-and-zackisch",
    categorySlug: "orders-tablet",
    keywords: ["storno", "erstattung", "rückzahlung", "teilrückzahlung", "refund", "kasse"],
    title: {
      "de-de": "Voll- und Teilerstattungen in Zackisch und in deiner Kasse korrigieren",
      "de-en": "Handling Full and Partial Refunds in Zackisch and in Your POS",
    },
    summary: {
      "de-de":
        "Wie Rückzahlungen über Stripe Connect abgewickelt werden und warum Stornos auch in deiner Kasse nachgezogen werden müssen.",
      "de-en":
        "How refunds are processed via Stripe Connect and why cancellations must also be reflected in your POS.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang"],
      "de-en": ["Owner access"],
    },
    steps: {
      "de-de": [
        "Wähle im Bestellarchiv die betreffende Bestellung aus und führe eine Voll- oder Teilerstattung aus.",
        "Zackisch erstattet die 2-%-Plattformprovision automatisch anteilig auf den erstatteten Warenwert zurück.",
        "Erfasse den Storno- bzw. Korrekturvorgang entsprechend auch in deinem Kassensystem, damit Kassenbestand und Zahlungsfluss übereinstimmen.",
      ],
      "de-en": [
        "Select the order in the order archive and trigger a full or partial refund.",
        "Zackisch automatically reverses the 2% platform fee proportionally on the refunded goods amount.",
        "Record the corresponding cancellation or adjustment in your POS system so your POS totals match.",
      ],
    },
    verification: {
      "de-de": "Die Bestellung zeigt den Status Erstattet bzw. Teilweise erstattet.",
      "de-en": "The order displays Refunded or Partially Refunded status.",
    },
    relatedSlugs: ["pos-single-entry-workflow", "refunds-and-proportional-fee-reversal"],
  },
  {
    slug: "revoking-staff-tablet-sessions",
    categorySlug: "orders-tablet",
    keywords: ["sitzung", "widerrufen", "abmelden", "personalwechsel", "sicherheit"],
    title: {
      "de-de": "Personal-Tablet-Sitzungen bei Geräteverlust oder Personalwechsel widerrufen",
      "de-en": "Revoking Staff Tablet Sessions When Devices or Staff Change",
    },
    summary: {
      "de-de": "Beende gekoppelte Tablet-Zugänge jederzeit sofort aus der Ferne.",
      "de-en": "Terminate paired tablet sessions remotely at any time.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang"],
      "de-en": ["Owner access"],
    },
    steps: {
      "de-de": [
        "Öffne Einstellungen -> Personal-Ansichten & Sitzungen.",
        "Klicke neben der aktiven Sitzung auf Sitzung widerrufen.",
      ],
      "de-en": [
        "Open Settings -> Staff Views & Sessions.",
        "Click Revoke Session next to the active session.",
      ],
    },
    verification: {
      "de-de": "Das abgemeldete Tablet verliert innerhalb einer Sekunde den Zugriff.",
      "de-en": "The revoked tablet loses access within one second.",
    },
    relatedSlugs: ["pairing-staff-tablet"],
  },
  {
    slug: "audio-and-visual-order-alerts",
    categorySlug: "orders-tablet",
    keywords: ["ton", "signal", "benachrichtigung", "tablet", "display"],
    title: {
      "de-de": "Display-Bereitschaft auf dem Personal-Tablet im Schichtbetrieb",
      "de-en": "Keeping the Staff Tablet Display Active During Shifts",
    },
    summary: {
      "de-de": "Empfehlungen für Bildschirmsperre, Stromversorgung und WLAN-Stabilität an der Theke.",
      "de-en": "Recommendations for auto-lock settings, power supply, and Wi-Fi stability at the counter.",
    },
    prerequisites: {
      "de-de": ["Gekoppeltes Personal-Tablet"],
      "de-en": ["Paired staff tablet"],
    },
    steps: {
      "de-de": [
        "Schließe das Tablet während der Schicht dauerhaft an das Ladegerät an.",
        "Stelle die automatische Bildschirmsperre in den Systemeinstellungen des Tablets auf Nie.",
      ],
      "de-en": [
        "Keep the tablet plugged into power during service hours.",
        "Set Auto-Lock in the tablet's system settings to Never.",
      ],
    },
    verification: {
      "de-de": "Eingehende Bestellungen sind jederzeit sofort ohne Entsperren sichtbar.",
      "de-en": "Incoming orders are visible immediately without unlocking the screen.",
    },
    relatedSlugs: ["pairing-staff-tablet"],
  },
  {
    slug: "preventing-unpaid-confusion",
    categorySlug: "orders-tablet",
    keywords: ["bezahlt", "kennzeichnung", "bereits mit zackisch bezahlt", "kellner"],
    title: {
      "de-de": "Warum auf dem Tablet nur bereits bezahlte Bestellungen erscheinen",
      "de-en": "Why Only Paid Orders Appear on the Staff Tablet",
    },
    summary: {
      "de-de":
        "Zackisch legt Bestellungen erst nach bestätigter Stripe-Zahlung an — jede Bestellung auf dem Tablet trägt das Siegel Bereits mit Zackisch bezahlt.",
      "de-en":
        "Zackisch creates orders only after verified Stripe payment — every order on the tablet carries the badge Already paid with Zackisch.",
    },
    prerequisites: {
      "de-de": ["Aktives Stripe Connect Konto"],
      "de-en": ["Active Stripe Connect account"],
    },
    steps: {
      "de-de": [
        "Dein Servicepersonal muss bei Zackisch-Bestellungen am Tisch nicht mehr abkassieren.",
        "Das Team bringt lediglich die Speisen/Getränke zum Tisch und erfasst den Vorgang einmalig als unbare Zahlung in der Kasse.",
      ],
      "de-en": [
        "Your waitstaff never need to collect payment at the table for Zackisch orders.",
        "Staff simply serve the items and record the order once as a non-cash payment in your POS.",
      ],
    },
    verification: {
      "de-de": "Jede Bestellkarte zeigt die Zahlungsreferenz und das Badge Bereits mit Zackisch bezahlt.",
      "de-en": "Every order card shows the payment reference and the Already paid with Zackisch badge.",
    },
    relatedSlugs: ["pos-single-entry-workflow"],
  },

  // ============================================================================
  // CATEGORY 4: PAYMENTS, STRIPE CONNECT & FEES (10 articles)
  // ============================================================================
  {
    slug: "stripe-embedded-onboarding-guide",
    categorySlug: "payments-payouts",
    featured: true,
    keywords: ["stripe", "onboarding", "kyc", "verifizierung", "iban", "auszahlung"],
    title: {
      "de-de": "Stripe Connect Onboarding direkt in Zackisch abschließen",
      "de-en": "Completing Embedded Stripe Connect Onboarding Inside Zackisch",
    },
    summary: {
      "de-de":
        "So verknüpfst und verifizierst du dein eigenes Stripe-Händlerkonto direkt im Zackisch-Dashboard.",
      "de-en":
        "How to connect and verify your own Stripe merchant account directly inside the Zackisch dashboard.",
    },
    prerequisites: {
      "de-de": [
        "Vertretungsberechtigte Person (Geschäftsführer/Inhaber)",
        "Ausweisdokument, Steuernummer/USt-IdNr. und Geschäfts-IBAN",
      ],
      "de-en": [
        "Authorized representative (managing director / owner)",
        "ID document, tax/VAT ID, and business IBAN",
      ],
    },
    steps: {
      "de-de": [
        "Öffne im Dashboard Einstellungen -> Zahlungen & Stripe Connect oder den Setup-Assistenten.",
        "Starte das eingebettete Stripe-Onboarding und durchlaufe die Identitäts-, Unternehmens- und Bankdatenprüfung.",
        "Akzeptiere die Stripe Connected Account Bedingungen direkt im eingebetteten Formular.",
      ],
      "de-en": [
        "Open Settings -> Payments & Stripe Connect or the Setup Wizard.",
        "Start the embedded Stripe onboarding and complete identity, business, and bank account verification.",
        "Accept the Stripe Connected Account Agreement directly inside the embedded form.",
      ],
    },
    verification: {
      "de-de":
        "Der Status springt auf Zahlungen aktiv (charges_enabled) und Auszahlungen aktiv (payouts_enabled).",
      "de-en":
        "Status updates to Charges Enabled and Payouts Enabled.",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work", "stripe-kyc-requirements-and-restrictions"],
  },
  {
    slug: "how-direct-charges-and-2-percent-fee-work",
    categorySlug: "payments-payouts",
    featured: true,
    keywords: [
      "gebühren",
      "provision",
      "2%",
      "trinkgeld",
      "umsatzsteuer",
      "direct charge",
      "stripe gebühren",
    ],
    title: {
      "de-de": "Gebührenmodell erklärt: 2 % Zackisch-Provision (inkl. USt., 0 % auf Trinkgeld) + Stripe-Gebühren",
      "de-en": "Fee Model Explained: 2% Zackisch Fee (VAT-Inclusive, 0% on Tips) + Stripe Processing Fees",
    },
    summary: {
      "de-de":
        "Transparente Abrechnung per Direct Charge auf deinem Stripe-Konto: Wie sich die 2 % Zackisch-Provision und die separaten Stripe-Zahlungsgebühren berechnen.",
      "de-en":
        "Transparent billing via Direct Charges on your Stripe account: how the 2% Zackisch platform fee and separate Stripe processing fees are calculated.",
    },
    prerequisites: {
      "de-de": ["Verbundenes Stripe-Konto"],
      "de-en": ["Connected Stripe account"],
    },
    steps: {
      "de-de": [
        "Dein Gastronomiebetrieb ist Verkäufer (Seller of Record) und Inhaber der Direktzahlung (Direct Charge) auf deinem verbundenen Stripe-Konto.",
        "Zackisch berechnet 2 % Provision auf den erfolgreich bezahlten Bruttowarenwert nach Rabatten — inklusive der auf unsere eigene Leistung gegebenenfalls entfallenden Umsatzsteuer (niemals 2 % plus 19 % obendrauf).",
        "Freiwilliges Trinkgeld deiner Gäste ist zu 100 % provisionsfrei für Zackisch (0 % Zackisch-Gebühr auf Trinkgeld).",
        "Die regulären Stripe-Zahlungsgebühren werden von Stripe direkt auf deinem verbundenen Stripe-Konto gemäß deinem Stripe-Tarif belastet.",
      ],
      "de-en": [
        "Your restaurant is the Seller of Record and owner of the Direct Charge on your connected Stripe account.",
        "Zackisch charges a 2% platform fee on the captured gross goods/services value after discounts — inclusive of any VAT applicable to Zackisch's own service (never 2% plus 19% on top).",
        "Voluntary guest tips carry 0% Zackisch platform fee.",
        "Standard Stripe payment processing fees are charged directly by Stripe to your connected Stripe account.",
      ],
    },
    verification: {
      "de-de":
        "Beispiel: 10,00 € Speisen + 2,00 € Trinkgeld = 12,00 € Zahlung -> Zackisch-Provision beträgt exakt 0,20 € brutto (2 % von 10,00 €).",
      "de-en":
        "Example: EUR 10.00 food + EUR 2.00 tip = EUR 12.00 payment -> Zackisch platform fee is exactly EUR 0.20 gross (2% of EUR 10.00).",
    },
    relatedSlugs: ["refunds-and-proportional-fee-reversal", "monthly-fee-statements-and-xrechnung"],
  },
  {
    slug: "refunds-and-proportional-fee-reversal",
    categorySlug: "payments-payouts",
    keywords: ["erstattung", "refund", "teilrückzahlung", "provision", "rückbuchung"],
    title: {
      "de-de": "Erstattungen & anteilige Rückgabe der 2-%-Zackisch-Provision",
      "de-en": "Refunds & Proportional Reversal of the 2% Zackisch Platform Fee",
    },
    summary: {
      "de-de":
        "Bei Voll- oder Teilerstattungen gibt Zackisch die 2-%-Provision anteilig auf den erstatteten Warenwert zurück.",
      "de-en":
        "On full or partial refunds, Zackisch proportionally reverses the 2% platform fee on the refunded goods value.",
    },
    prerequisites: {
      "de-de": ["Bezahlte Bestellung"],
      "de-en": ["Paid order"],
    },
    steps: {
      "de-de": [
        "Löse die Erstattung im Zackisch-Dashboard aus.",
        "Zackisch berechnet automatisch den anteiligen Provisionsbetrag und gibt ihn über Stripe Application Fee Refund frei.",
      ],
      "de-en": [
        "Trigger the refund in the Zackisch dashboard.",
        "Zackisch automatically calculates the proportional fee amount and reverses it via Stripe Application Fee Refund.",
      ],
    },
    verification: {
      "de-de": "Im Bestelldetail und in deiner Monatsabrechnung ist die Erstattung centgenau ausgewiesen.",
      "de-en": "The refund and fee reversal appear to the cent in order details and your monthly statement.",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work", "handling-refunds-in-pos-and-zackisch"],
  },
  {
    slug: "monthly-fee-statements-and-xrechnung",
    categorySlug: "payments-payouts",
    keywords: ["abrechnung", "monatsabrechnung", "xrechnung", "zugferd", "en 16931", "buchhaltung"],
    title: {
      "de-de": "Monatliche Provisionsabrechnung & elektronische Rechnung (EN 16931 / XRechnung)",
      "de-en": "Monthly Fee Statements & Structured E-Invoice (EN 16931 / XRechnung)",
    },
    summary: {
      "de-de":
        "Lade deine monatliche B2B-Provisionsübersicht inklusive strukturierter XRechnung-XML für deine Buchhaltung herunter.",
      "de-en":
        "Download your monthly B2B platform fee statement including structured XRechnung XML for your accounting.",
    },
    prerequisites: {
      "de-de": ["Vollständiges Betriebsprofil mit Steuernummer/USt-IdNr."],
      "de-en": ["Completed business profile with tax/VAT ID"],
    },
    steps: {
      "de-de": [
        "Öffne im Dashboard Einstellungen -> Abrechnungen & Nachweise.",
        "Wähle den gewünschten Kalendermonat und klicke auf Monatsabrechnung erstellen / XML herunterladen.",
      ],
      "de-en": [
        "Open Settings -> Statements & Records in the dashboard.",
        "Select the calendar month and click Generate Monthly Statement / Download XML.",
      ],
    },
    verification: {
      "de-de": "Die XML-Datei entspricht dem Standard EN 16931 (XRechnung 3.0).",
      "de-en": "The XML file conforms to EN 16931 (XRechnung 3.0).",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work"],
  },
  {
    slug: "stripe-payout-schedule-and-iban",
    categorySlug: "payments-payouts",
    keywords: ["auszahlung", "bankkonto", "iban", "intervall", "stripe"],
    title: {
      "de-de": "Auszahlungsintervall und Geschäfts-IBAN in Stripe Connect verwalten",
      "de-en": "Managing Your Payout Schedule and Business IBAN in Stripe Connect",
    },
    summary: {
      "de-de": "So änderst du dein Bankkonto oder prüfst kommende Auszahlungen direkt in der eingebetteten Stripe-Ansicht.",
      "de-en": "How to update your bank account or check upcoming payouts directly in the embedded Stripe view.",
    },
    prerequisites: {
      "de-de": ["Verifiziertes Stripe-Konto"],
      "de-en": ["Verified Stripe account"],
    },
    steps: {
      "de-de": [
        "Öffne Einstellungen -> Zahlungen & Stripe Connect.",
        "Wechsle zur eingebetteten Kontoverwaltung oder Auszahlungsübersicht.",
      ],
      "de-en": [
        "Open Settings -> Payments & Stripe Connect.",
        "Switch to the embedded account management or payouts view.",
      ],
    },
    verification: {
      "de-de": "Deine hinterlegte IBAN und der nächste Auszahlungstermin werden angezeigt.",
      "de-en": "Your active IBAN and next payout date are displayed.",
    },
    relatedSlugs: ["stripe-embedded-onboarding-guide"],
  },
  {
    slug: "stripe-kyc-requirements-and-restrictions",
    categorySlug: "payments-payouts",
    keywords: ["kyc", "nachweise", "eingeschränkt", "restricted", "past_due", "dokumente"],
    title: {
      "de-de": "Offene Stripe-KYC-Anforderungen nachreichen, wenn Zahlungen pausiert wurden",
      "de-en": "Resolving Pending Stripe KYC Requirements When Payments Are Restricted",
    },
    summary: {
      "de-de":
        "Falls Stripe zusätzliche Dokumente anfordert, zeigt Zackisch dies sofort im Dashboard an und schützt deinen Betrieb vor fehlgeschlagenen Zahlungen.",
      "de-en":
        "If Stripe requests additional verification documents, Zackisch alerts you in the dashboard and protects your venue from failed charges.",
    },
    prerequisites: {
      "de-de": ["Angeforderte Nachweise (z. B. Ausweis oder Handelsregisterauszug)"],
      "de-en": ["Requested verification documents (e.g. ID or register extract)"],
    },
    steps: {
      "de-de": [
        "Klicke im Warnbanner auf Stripe-Anforderungen prüfen.",
        "Lade die angeforderten Dokumente direkt in der eingebetteten Stripe-Komponente hoch.",
      ],
      "de-en": [
        "Click Review Stripe Requirements in the alert banner.",
        "Upload the requested documents directly inside the embedded Stripe component.",
      ],
    },
    verification: {
      "de-de": "Nach Freigabe durch Stripe wird die Bestellannahme wieder freigeschaltet.",
      "de-en": "Once approved by Stripe, ordering readiness is restored automatically.",
    },
    relatedSlugs: ["stripe-embedded-onboarding-guide"],
  },
  {
    slug: "supported-payment-methods-apple-google-pay",
    categorySlug: "payments-payouts",
    keywords: ["zahlungsmethoden", "apple pay", "google pay", "kreditkarte", "karte"],
    title: {
      "de-de": "Unterstützte Zahlungsmethoden für deine Gäste (Apple Pay, Google Pay, Karten)",
      "de-en": "Supported Guest Payment Methods (Apple Pay, Google Pay, Cards)",
    },
    summary: {
      "de-de": "Welche Zahlungsarten Gästen im mobilen Browser automatisch angeboten werden.",
      "de-en": "Which payment methods are automatically offered to guests in their mobile browser.",
    },
    prerequisites: {
      "de-de": ["Aktive Karten-Zahlungsfähigkeit (card_payments) in Stripe"],
      "de-en": ["Active card_payments capability in Stripe"],
    },
    steps: {
      "de-de": [
        "Stripe Payment Elements blendet je nach Endgerät des Gastes automatisch Apple Pay, Google Pay, Debit- und Kreditkarten ein.",
      ],
      "de-en": [
        "Stripe Payment Elements automatically surfaces Apple Pay, Google Pay, debit, and credit cards based on the guest's device.",
      ],
    },
    verification: {
      "de-de": "Gäste bezahlen am Tisch in wenigen Sekunden ohne Kontoerstellung.",
      "de-en": "Guests pay at the table in seconds without creating an account.",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work"],
  },
  {
    slug: "handling-chargebacks-and-disputes",
    categorySlug: "payments-payouts",
    keywords: ["dispute", "chargeback", "rückbuchung", "konflikt", "belege"],
    title: {
      "de-de": "Umgang mit Zahlungsanfechtungen (Disputes / Chargebacks)",
      "de-en": "Handling Payment Disputes and Chargebacks",
    },
    summary: {
      "de-de":
        "Wie Zahlungsanfechtungen im Bestellarchiv markiert werden und welche Nachweise du in Stripe einreichen kannst.",
      "de-en":
        "How payment disputes are flagged in your order archive and what evidence you can submit in Stripe.",
    },
    prerequisites: {
      "de-de": ["Zugang zu Stripe Connect"],
      "de-en": ["Access to Stripe Connect"],
    },
    steps: {
      "de-de": [
        "Bei einer Anfechtung erhält die Bestellung in Zackisch den Zahlungsstatus Angefochten (Disputed).",
        "Reiche über deine Stripe-Verwaltung die Bestellprotokolle und den Kassennachweis fristgerecht ein.",
      ],
      "de-en": [
        "When a dispute occurs, the order is marked Disputed in Zackisch.",
        "Submit the order log and POS record within the deadline via your Stripe management view.",
      ],
    },
    verification: {
      "de-de": "Jede Statusänderung des Disputes wird im Audit-Protokoll dokumentiert.",
      "de-en": "Every dispute status change is recorded in the audit trail.",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work"],
  },
  {
    slug: "why-no-platform-fallback-exists",
    categorySlug: "payments-payouts",
    keywords: ["sicherheit", "fail-closed", "direktzahlung", "plattformkonto"],
    title: {
      "de-de": "Warum Zackisch niemals Zahlungen auf fremde Konten umleitet (Fail-Closed-Schutz)",
      "de-en": "Why Zackisch Never Reroutes Guest Payments to a Platform Account (Fail-Closed Guarantee)",
    },
    summary: {
      "de-de":
        "Ist dein Stripe-Konto noch nicht bereit, blockiert Zackisch den Checkout sauber, statt Gelder über ein Plattformkonto einzuziehen.",
      "de-en":
        "If your Stripe account is not ready, Zackisch blocks checkout cleanly rather than charging a platform account.",
    },
    prerequisites: {
      "de-de": ["Verbundenes Stripe-Konto"],
      "de-en": ["Connected Stripe account"],
    },
    steps: {
      "de-de": [
        "Prüfe im Setup-Assistenten jederzeit den Status deines verbundenen Stripe-Kontos.",
      ],
      "de-en": [
        "Check the status of your connected Stripe account anytime in the Setup Wizard.",
      ],
    },
    verification: {
      "de-de": "100 % deiner Gästezahlungen laufen als Direct Charge auf deiner eigenen Stripe-Account-ID.",
      "de-en": "100% of guest payments run as Direct Charges on your own Stripe Account ID.",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work"],
  },
  {
    slug: "voluntary-tips-accounting-and-payout",
    categorySlug: "payments-payouts",
    keywords: ["trinkgeld", "tip", "0%", "buchhaltung", "kasse"],
    title: {
      "de-de": "Freiwilliges Trinkgeld: 0 % Zackisch-Provision & getrennter Ausweis",
      "de-en": "Voluntary Tips: 0% Zackisch Fee & Separate Reporting",
    },
    summary: {
      "de-de":
        "Trinkgelder werden im Checkout separat erfasst, nicht mit der 2-%-Zackisch-Provision belastet und im Tagesabgleich getrennt ausgewiesen.",
      "de-en":
        "Tips are captured separately at checkout, excluded from the 2% Zackisch fee, and reported separately in daily reconciliation.",
    },
    prerequisites: {
      "de-de": ["Abstimmung der Trinkgeld-Buchung mit deinem Steuerberater"],
      "de-en": ["Alignment of tip accounting with your tax advisor"],
    },
    steps: {
      "de-de": [
        "Gäste können im Checkout optional ein Trinkgeld hinzufügen.",
        "Auf der Bestellbestätigung und im Kassenabgleich wird das Trinkgeld separat vom Warenwert ausgewiesen.",
      ],
      "de-en": [
        "Guests can optionally add a tip during checkout.",
        "The tip is shown separately from the goods subtotal on the confirmation and in POS reconciliation.",
      ],
    },
    verification: {
      "de-de": "Die 2-%-Provision berechnet sich ausschließlich aus dem Warenwert ohne Trinkgeld.",
      "de-en": "The 2% platform fee is calculated strictly on the goods subtotal excluding tips.",
    },
    relatedSlugs: ["how-direct-charges-and-2-percent-fee-work", "pos-single-entry-workflow"],
  },

  // ============================================================================
  // CATEGORY 5: ACCOUNT, LEGAL & DATA PROTECTION (7 articles)
  // ============================================================================
  {
    slug: "guest-confirmation-vs-pos-receipt",
    categorySlug: "account-legal",
    featured: true,
    keywords: [
      "bestellbestätigung",
      "zahlungsbestätigung",
      "kein kassenbeleg",
      "keine rechnung",
      "tse",
      "kassensichv",
      "beleg",
    ],
    title: {
      "de-de": "Bestell- und Zahlungsbestätigung vs. Kassenbeleg und Rechnung",
      "de-en": "Guest Order & Payment Confirmation vs. POS Receipt and Invoice",
    },
    summary: {
      "de-de":
        "Was Gäste digital von Zackisch erhalten (Bestell- und Zahlungsbestätigung mit dem Hinweis Kein Kassenbeleg und keine Rechnung) und wie dein Betrieb Kassenbelege bzw. Rechnungen bereitstellt.",
      "de-en":
        "What guests receive digitally from Zackisch (an Order & Payment Confirmation marked Neither a POS receipt nor an invoice) and how your venue provides official POS receipts or invoices.",
    },
    prerequisites: {
      "de-de": ["Vollständiges Betriebsprofil"],
      "de-en": ["Complete business profile"],
    },
    steps: {
      "de-de": [
        "Nach erfolgreicher Zahlung stellt Zackisch dem Gast eine herunterladbare Bestell- und Zahlungsbestätigung bereit.",
        "Dieses Dokument trägt ausdrücklich den Hinweis: Kein Kassenbeleg und keine Rechnung.",
        "Da dein Betrieb die bezahlte Bestellung in der vorhandenen Kasse erfasst, stellst du Gästen auf Wunsch den regulären Kassenbeleg bzw. eine Rechnung deines Betriebs zur Verfügung.",
      ],
      "de-en": [
        "After payment, Zackisch provides the guest with a downloadable Order and Payment Confirmation.",
        "This document explicitly states: Neither a fiscal POS receipt nor a tax invoice.",
        "Because your venue records the paid order in your existing POS, you provide guests with your venue's official POS receipt or invoice upon request.",
      ],
    },
    verification: {
      "de-de":
        "Keine fingierten Rechnungsnummern oder falschen TSE-Angaben auf der digitalen Bestellbestätigung.",
      "de-en":
        "No fabricated invoice numbers or fake fiscal TSE strings on the digital order confirmation.",
    },
    relatedSlugs: ["pos-single-entry-workflow", "business-profile-seller-of-record"],
  },
  {
    slug: "email-otp-sign-in-and-security",
    categorySlug: "account-legal",
    keywords: ["anmeldung", "login", "otp", "einmalcode", "e-mail", "passwortlos"],
    title: {
      "de-de": "Sichere Anmeldung per 6-stelligem E-Mail-Sicherheitscode (OTP)",
      "de-en": "Secure Sign-In via 6-Digit Email Verification Code (OTP)",
    },
    summary: {
      "de-de": "So meldest du dich im Gastronomen-Dashboard ohne unsichere Passwörter an.",
      "de-en": "How to sign into the merchant dashboard using one-time email verification codes.",
    },
    prerequisites: {
      "de-de": ["Zugriff auf dein geschäftliches E-Mail-Postfach"],
      "de-en": ["Access to your business email inbox"],
    },
    steps: {
      "de-de": [
        "Gib unter app.zackisch.com/sign-in deine geschäftliche E-Mail-Adresse ein.",
        "Trage den 6-stelligen Code aus der E-Mail von noreply@zackisch.com ein.",
      ],
      "de-en": [
        "Enter your business email at app.zackisch.com/sign-in.",
        "Enter the 6-digit code sent from noreply@zackisch.com.",
      ],
    },
    verification: {
      "de-de": "Sofortiger Zugang zu deinem Restaurant-Dashboard.",
      "de-en": "Immediate access to your restaurant dashboard.",
    },
    relatedSlugs: ["changing-owner-email-address"],
  },
  {
    slug: "changing-owner-email-address",
    categorySlug: "account-legal",
    keywords: ["e-mail ändern", "inhaber", "konto", "adresse"],
    title: {
      "de-de": "Inhaber-E-Mail-Adresse sicher ändern",
      "de-en": "Securely Changing Your Owner Email Address",
    },
    summary: {
      "de-de": "Verifiziere deine neue E-Mail-Adresse per Bestätigungscode in den Einstellungen.",
      "de-en": "Verify your new email address via confirmation code in Settings.",
    },
    prerequisites: {
      "de-de": ["Angemeldete Inhaber-Sitzung"],
      "de-en": ["Active owner session"],
    },
    steps: {
      "de-de": [
        "Öffne Einstellungen -> Konto.",
        "Gib die neue E-Mail-Adresse ein und bestätige sie mit dem zugesandten 6-stelligen Code.",
      ],
      "de-en": [
        "Open Settings -> Account.",
        "Enter the new email address and confirm it with the 6-digit code sent to the new inbox.",
      ],
    },
    verification: {
      "de-de": "Künftige Anmeldecodes werden an die neue Adresse gesendet.",
      "de-en": "Future sign-in codes are sent to the new address.",
    },
    relatedSlugs: ["email-otp-sign-in-and-security"],
  },
  {
    slug: "b2b-contracts-and-dpa-acceptance",
    categorySlug: "account-legal",
    keywords: ["agb", "avv", "auftragsverarbeitung", "vertrag", "dsgvo", "dokumentation"],
    title: {
      "de-de": "B2B-AGB, Auftragsverarbeitung (AVV nach Art. 28 DSGVO) & Vertragsnachweise",
      "de-en": "B2B Terms, Data Processing Agreement (Art. 28 GDPR), and Acceptance Records",
    },
    summary: {
      "de-de": "Wo du die aktuellen Vertragstexte und deine protokollierten Zustimmungen einsehen kannst.",
      "de-en": "Where to view current legal texts and your timestamped acceptance records.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang"],
      "de-en": ["Owner access"],
    },
    steps: {
      "de-de": [
        "Im Setup-Assistenten und unter zackisch.com/de-de/gtc sowie /data-processing findest du jederzeit die aktuellen Vertragstexte.",
        "Zeitpunkt und Dokumentversion deiner Zustimmung werden revisionssicher gespeichert.",
      ],
      "de-en": [
        "View the current legal documents anytime in the Setup Wizard and at zackisch.com/de-en/gtc and /data-processing.",
        "The timestamp and document version of your acceptance are stored in an immutable log.",
      ],
    },
    verification: {
      "de-de": "Im Setup-Assistenten wird die bestätigte Dokumentversion mit Zeitstempel angezeigt.",
      "de-en": "The Setup Wizard displays the accepted document version and timestamp.",
    },
    relatedSlugs: ["setup-checklist-15-minutes"],
  },
  {
    slug: "data-retention-and-account-deletion",
    categorySlug: "account-legal",
    keywords: ["löschen", "aufbewahrung", "dsgvo", "gobd", "147 ao", "datenlöschung"],
    title: {
      "de-de": "Kontolöschung & gesetzliche Aufbewahrungspflichten (§ 147 AO / HGB)",
      "de-en": "Account Deletion & Statutory Tax Retention (§ 147 AO / HGB)",
    },
    summary: {
      "de-de":
        "Was bei einer Kontolöschung sofort gelöscht wird und wie steuerrelevante Buchungsdaten anonymisiert für die gesetzliche Frist aufbewahrt werden.",
      "de-en":
        "What is deleted immediately upon account deletion and how tax-relevant accounting records are anonymized for statutory retention.",
    },
    prerequisites: {
      "de-de": ["Inhaber-Zugang"],
      "de-en": ["Owner access"],
    },
    steps: {
      "de-de": [
        "Speisekarten, Bilder und aktive Tablet-Sitzungen werden bei Kontolöschung sofort entfernt.",
        "Steuer- und abrechnungsrelevante Bestelldatensätze werden gemäß § 147 AO / § 257 HGB von personenbezogenen Gästedaten bereinigt und revisionssicher aufbewahrt.",
      ],
      "de-en": [
        "Menus, images, and active tablet sessions are removed immediately upon account deletion.",
        "Tax-relevant order accounting records have guest PII anonymized and are retained per § 147 AO / § 257 HGB.",
      ],
    },
    verification: {
      "de-de": "DSGVO-konforme Trennung zwischen operativen Daten und gesetzlicher Buchungshistorie.",
      "de-en": "GDPR-compliant separation between operational data and statutory accounting records.",
    },
    relatedSlugs: ["b2b-contracts-and-dpa-acceptance"],
  },
  {
    slug: "privacy-and-cookie-settings-tdddg",
    categorySlug: "account-legal",
    keywords: ["cookies", "tdddg", "datenschutz", "schriftarten", "lokal"],
    title: {
      "de-de": "Datenschutz & lokale Schriftarten ohne Drittanbieter-Tracking (§ 25 TDDDG)",
      "de-en": "Privacy & Self-Hosted Fonts Without Third-Party Tracking (§ 25 TDDDG)",
    },
    summary: {
      "de-de":
        "Warum Zackisch im Gäste-Menü ohne Werbe-Tracker arbeitet und Schriftarten (Poppins & Inter) lokal ausliefert.",
      "de-en":
        "Why Zackisch operates without ad trackers in the guest menu and serves fonts (Poppins & Inter) locally.",
    },
    prerequisites: {
      "de-de": ["Keine"],
      "de-en": ["None"],
    },
    steps: {
      "de-de": [
        "Alle Schriftarten werden lokal vom Server ausgeliefert — es findet keine IP-Übermittlung an Google Fonts statt.",
        "Für die Zahlungsabwicklung wird Stripe erst beim Aufruf des Checkouts geladen.",
      ],
      "de-en": [
        "All fonts are self-hosted — no guest IP addresses are transmitted to Google Fonts.",
        "Stripe is loaded strictly when the guest initiates checkout.",
      ],
    },
    verification: {
      "de-de": "Datenschutz-Einstellungen sind jederzeit im Footer jeder Zackisch-Seite aufrufbar.",
      "de-en": "Privacy settings are accessible anytime in the footer of every Zackisch page.",
    },
    relatedSlugs: ["b2b-contracts-and-dpa-acceptance"],
  },
  {
    slug: "opening-and-tracking-support-tickets",
    categorySlug: "account-legal",
    keywords: ["support", "ticket", "hilfe", "kontakt", "antwort"],
    title: {
      "de-de": "Support-Ticket eröffnen und Antworten im Support-Center verfolgen",
      "de-en": "Opening a Support Ticket and Tracking Replies in the Support Center",
    },
    summary: {
      "de-de":
        "So erreichst du das Zackisch-Team direkt aus deinem Dashboard oder unter support.zackisch.com.",
      "de-en":
        "How to reach the Zackisch support team directly from your dashboard or at support.zackisch.com.",
    },
    prerequisites: {
      "de-de": ["Geschäftliche E-Mail-Adresse oder verknüpfter Dashboard-Zugang"],
      "de-en": ["Business email address or linked dashboard session"],
    },
    steps: {
      "de-de": [
        "Klicke im Restaurant-Dashboard auf Hilfe & Support oder öffne support.zackisch.com/de-de/tickets.",
        "Wähle die passende Kategorie (z. B. Kasse/POS, Zahlungen, QR-Codes) und beschreibe dein Anliegen.",
        "Du erhältst eine Ticketnummer (z. B. ZCK-1001) und kannst jederzeit im Ticketverlauf antworten.",
      ],
      "de-en": [
        "Click Help & Support in your restaurant dashboard or open support.zackisch.com/de-en/tickets.",
        "Select the appropriate category (e.g. POS Recording, Payments, QR Codes) and describe your question.",
        "You receive a ticket number (e.g. ZCK-1001) and can reply anytime in the ticket thread.",
      ],
    },
    verification: {
      "de-de": "Alle Antworten des Zackisch-Teams erscheinen im Ticketverlauf und im E-Mail-Protokoll.",
      "de-en": "All replies from the Zackisch team appear in your ticket thread and email log.",
    },
    relatedSlugs: ["setup-checklist-15-minutes"],
  },
];

export function getCategoryBySlug(slug: string): SupportCategory | undefined {
  return SUPPORT_CATEGORIES.find((c) => c.slug === slug);
}

export function getArticlesByCategory(
  categorySlug: string
): SupportArticle[] {
  return SUPPORT_ARTICLES.filter((a) => a.categorySlug === categorySlug);
}

export function getArticleBySlug(slug: string): SupportArticle | undefined {
  return SUPPORT_ARTICLES.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): SupportArticle[] {
  return SUPPORT_ARTICLES.filter((a) => a.featured);
}

export function searchArticles(
  locale: SupportLocale,
  rawQuery: string
): SupportArticle[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return SUPPORT_ARTICLES;

  const tokens = q.split(/\s+/).filter(Boolean);
  const expandedTokens = new Set<string>(tokens);
  for (const token of tokens) {
    for (const [key, syns] of Object.entries(SYNONYM_MAP)) {
      if (token.includes(key) || key.includes(token)) {
        expandedTokens.add(key);
        for (const s of syns) expandedTokens.add(s);
      }
    }
  }

  return SUPPORT_ARTICLES.map((article) => {
    let score = 0;
    const title = article.title[locale].toLowerCase();
    const summary = article.summary[locale].toLowerCase();
    const stepsText = article.steps[locale].join(" ").toLowerCase();
    const keywords = article.keywords.join(" ").toLowerCase();

    for (const token of expandedTokens) {
      if (title.includes(token)) score += 10;
      if (keywords.includes(token)) score += 8;
      if (summary.includes(token)) score += 5;
      if (stepsText.includes(token)) score += 2;
    }
    return { article, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.article);
}
