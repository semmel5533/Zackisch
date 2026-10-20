export type Locale = "de-de" | "de-en";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavLink[];
}

export const SITE_NAVIGATION = {
  "de-de": {
    product: {
      label: "Produkt",
      items: [
        { label: "Produktübersicht", href: "/product", desc: "Digitales Menü, Kassenansicht & Ablauf" },
        { label: "Intelligentes Menü", href: "/product/smart-menu", desc: "Empfehlungen, Bestseller & Konfigurator" },
        { label: "Personal- & Küchenansicht", href: "/product/staff-dashboard", desc: "Tablet-Übersicht & Ausverkauft-Schalter" },
      ],
    },
    solutions: {
      label: "Lösungen",
      items: [
        { label: "Restaurants & Bars", href: "/solutions/restaurants-bars", desc: "Bestellen am Tisch & schnelle Nachbestellungen" },
        { label: "Cafés & Bäckereien", href: "/solutions/cafes-bakeries", desc: "Entlastung an der Theke zu Stoßzeiten" },
        { label: "Imbisse & Fast-Casual", href: "/solutions/quick-service", desc: "Schneller Bestellfluss ohne Gedränge" },
        { label: "Abholung & To-go", href: "/solutions/pickup", desc: "Vor Ort bestellen, bezahlen & am Counter abholen" },
      ],
    },
    pricing: { label: "Preise", href: "/pricing" },
    calculator: { label: "Potenzialrechner", href: "/potential-calculator" },
    more: {
      label: "Mehr",
      items: [
        { label: "Forschung & Studien", href: "/research", desc: "Wissenschaftliche Grundlagen & Evidenz" },
        { label: "Über uns", href: "/about", desc: "Gründerstory aus Mannheim" },
        { label: "Hilfe & Support", href: "https://support.zackisch.com", external: true, desc: "Anleitungen & Wissensdatenbank" },
        { label: "Kontakt", href: "/contact", desc: "Fragen & direkte Ansprechpartner" },
      ],
    },
    cta: {
      login: "Anmelden",
      signup: "Kostenlos registrieren",
      newsletter: "Newsletter",
      support: "Hilfe & Support",
    },
  },
  "de-en": {
    product: {
      label: "Product",
      items: [
        { label: "Product Overview", href: "/product", desc: "Digital menu, order dispatch & tablet view" },
        { label: "Smart Menu", href: "/product/smart-menu", desc: "Recommendations, bestsellers & customizer" },
        { label: "Staff & Kitchen View", href: "/product/staff-dashboard", desc: "Tablet view & instant 86/sold-out toggles" },
      ],
    },
    solutions: {
      label: "Solutions",
      items: [
        { label: "Restaurants & Bars", href: "/solutions/restaurants-bars", desc: "Table ordering & seamless reorders" },
        { label: "Cafés & Bakeries", href: "/solutions/cafes-bakeries", desc: "Counter relief during peak morning rushes" },
        { label: "Quick-Service & Fast-Casual", href: "/solutions/quick-service", desc: "High-volume ordering without bottleneck lines" },
        { label: "Pickup & Takeaway", href: "/solutions/pickup", desc: "On-site ordering, payment & counter collection" },
      ],
    },
    pricing: { label: "Pricing", href: "/pricing" },
    calculator: { label: "Revenue Calculator", href: "/potential-calculator" },
    more: {
      label: "More",
      items: [
        { label: "Research & Evidence", href: "/research", desc: "Scientific studies & methodology" },
        { label: "About Zackisch", href: "/about", desc: "Founder story from Mannheim" },
        { label: "Help & Support", href: "https://support.zackisch.com", external: true, desc: "Knowledge base & tutorials" },
        { label: "Contact", href: "/contact", desc: "Questions & direct communication" },
      ],
    },
    cta: {
      login: "Sign In",
      signup: "Sign up free",
      newsletter: "Newsletter",
      support: "Help & Support",
    },
  },
};

export const EXTERNAL_URLS = {
  signup: "https://app.zackisch.com/sign-up",
  signin: "https://app.zackisch.com/sign-in",
  newsletter: "https://app.zackisch.com/newsletter",
  support: "https://support.zackisch.com",
  email: "mailto:selim@zackisch.com",
  rawEmail: "selim@zackisch.com",
};

export const HOMEPAGE_CONTENT = {
  "de-de": {
    hero: {
      h1: "Bestellen & Bezahlen im Handumdrehen",
      subtitle:
        "Deine Kunden scannen den QR-Code und entdecken dein digitales Menü, unsere intelligente Plattform kümmert sich um den Rest.",
      primaryCta: "Kostenlos registrieren",
      secondaryCta: "Demo ansehen",
      qualifier: "Für Restaurants, Cafés, Bars, Imbisse und mehr.",
      pricingBadge:
        "Keine monatliche Zackisch-Lizenz. Kein neues Kassensystem. 2 % Plattformgebühr pro Bestellung zzgl. Zahlungsabwicklung.",
    },
    society: {
      badge: "Wartezeiten & Gästeerlebnis",
      h2: "Guter Service sollte nicht am Warten scheitern.",
      lead: "Ein kurzer Moment an der Kasse. Noch eine Runde Getränke. Schnell die Rechnung. Aus kleinen Wartezeiten kann ein echtes Problem werden.",
      statNumber: "27 %",
      statLabel:
        "der befragten deutschen Restaurantgäste haben ein Lokal wegen langer Wartezeiten schon vor der Bestellung verlassen.",
      source: "Lightspeed × Medallia, Verbraucherumfrage Deutschland 2025, rund 1.000 Befragte.",
      sourceNote:
        "Anteil Befragter mit entsprechendem bisherigen Erlebnis; keine generelle Abbruchquote je Restaurantbesuch.",
      conclusion:
        "Zackisch gibt deinen Gästen einen zusätzlichen, unkomplizierten Weg zu bestellen und direkt zu bezahlen.",
    },
    solutionsIntro: {
      badge: "Vielseitige Betriebsformen",
      h2: "Passt zu deinem Lokal. Nicht umgekehrt.",
      lead: "Am Tisch, an der Theke oder für die Abholung. Zackisch ergänzt den Ablauf, den dein Team schon kennt.",
      modes: [
        {
          id: "restaurants-bars",
          title: "Restaurant & Bar",
          tagline: "Am Tisch bestellen & spontan nachbestellen",
          description:
            "Deine Gäste bestellen vom Platz aus, können unkompliziert nachbestellen und auf Wunsch direkt bezahlen.",
          href: "/solutions/restaurants-bars",
          image: "/media/hero-hospitality.webp",
        },
        {
          id: "cafes-bakeries",
          title: "Café & Bäckerei",
          tagline: "Entlastung an der Theke",
          description:
            "Ein Kaffee, etwas Süßes, weiter geht’s. Zackisch eröffnet einen zusätzlichen Bestellweg neben der Theke.",
          href: "/solutions/cafes-bakeries",
          image: "/media/food-coffee.webp",
        },
        {
          id: "quick-service",
          title: "Imbiss & Fast-Casual",
          tagline: "Stoßzeiten ohne Bestellstau",
          description:
            "Weniger Bestellgedränge zur Stoßzeit. Bestellungen kommen nach erfolgreicher Zahlung direkt auf dem Personal-Tablet an.",
          href: "/solutions/quick-service",
          image: "/media/pos-counter.webp",
        },
        {
          id: "pickup",
          title: "Abholung & To-go",
          tagline: "Vor Ort bestellen & abholen",
          description:
            "Einfach vor Ort per QR-Code bestellen, bezahlen und am Counter abholen. Keine Lieferinfrastruktur erforderlich.",
          href: "/solutions/pickup",
          image: "/media/food-plated.webp",
        },
      ],
    },
    signatureDemo: {
      badge: "Interaktive Vorschau",
      h2: "So einfach geht zackisch.",
      subtitle: "Scannen, bestellen, bezahlen. Und dein Team weiß Bescheid.",
      instruction:
        "Erlebe den vollständigen Ablauf aus der Perspektive deiner Gäste, deines Service-Teams und deiner Buchhaltung.",
    },
    smartMenu: {
      badge: "Intelligentes System",
      h2: "Ein Menü, das mitdenkt.",
      lead: "Deine Gäste finden schneller, worauf sie Lust haben. Und entdecken, was dazu passt.",
      features: [
        {
          id: "popular",
          title: "Was gerade beliebt ist.",
          description:
            "Zackisch hebt automatisch Artikel hervor, die über die Plattform in deinem Lokal besonders häufig gewählt werden.",
          badge: "Bestseller",
        },
        {
          id: "companion",
          title: "Passt gut dazu.",
          description:
            "Im Warenkorb erscheinen passende Ergänzungen, die bei früheren Bestellungen im selben Lokal oft zusammen gewählt wurden.",
          badge: "Warenkorb-Empfehlung",
        },
        {
          id: "for-you",
          title: "Deine Favoriten zuerst.",
          description:
            "Mit freiwilliger Zustimmung finden wiederkehrende Gäste ihre persönlichen Lieblingsartikel schneller wieder.",
          badge: "Mit Zustimmung",
        },
        {
          id: "history",
          title: "Wie beim letzten Mal.",
          description:
            "Individuelle Produktzusammenstellungen lassen sich beim nächsten Besuch bequem mit einem Klick übernehmen oder anpassen.",
          badge: "Konfigurator-Gedächtnis",
        },
      ],
      legalNote:
        "Personalisierte Favoriten nur bei freiwilliger Zustimmung. Empfehlungen beruhen ausschließlich auf aggregierten Bestelldaten deines eigenen Betriebs.",
    },
    freedom: {
      badge: "Ergänzung statt Zwang",
      h2: "Persönlicher Service bleibt persönlich.",
      lead: "Nicht jeder Gast möchte sein Smartphone nutzen. Muss er auch nicht. Bestellungen beim Personal, die Kasse und Bargeld bleiben Teil deines Betriebs. Zackisch ist die zusätzliche Möglichkeit für alle, die selbst bestellen oder direkt bezahlen möchten.",
      factNumber: "45 %",
      factLabel: "aller erfassten Zahlungen in Deutschland wurden 2025 noch in bar abgewickelt.",
      factSource: "Deutsche Bundesbank, Zahlungsverhalten in Deutschland 2025.",
    },
    setup: {
      badge: "Niedrige Hürde",
      h2: "Du brauchst weniger, als du denkst.",
      lead: "Ein gewöhnliches Tablet für dein Team. Einen QR-Code für deine Gäste. Und einen Browser.",
      points: [
        { title: "Kein neues Kassensystem", desc: "Du behältst deine vorhandene Kasse. Bezahlte Bestellungen überträgt dein Team manuell mit einem Handgriff." },
        { title: "Keine teure Spezialhardware", desc: "Jedes handelsübliche Tablet mit aktuellem Browser genügt, um eingehende Bestellungen anzuzeigen." },
        { title: "QR-Codes selbst drucken", desc: "Erzeuge fertige Druckvorlagen im Dashboard und platziere sie an Tischen, Tresen oder Aufstellern." },
        { title: "Direkte Menükontrolle", desc: "Verwalte Preise, Speisen, Allergene und Optionen jederzeit selbst in wenigen Sekunden." },
      ],
    },
    pricing: {
      badge: "Faire Transparenz",
      h2: "Nur zahlen, wenn Bestellungen eingehen.",
      rate: "2 %",
      rateLabel: "Zackisch-Plattformgebühr pro bezahlter Bestellung (ohne Trinkgeld)",
      copy: "Keine monatliche Lizenzgebühr. Keine Einrichtungsgebühr. Keine Hardware-Miete. Hinzu kommen lediglich die Gebühren für die Zahlungsabwicklung über Stripe.",
      seasonNote: "Saisonpause? Wenn keine Bestellungen über Zackisch laufen, fällt auch kein Cent Plattformgebühr an.",
      detailsLink: "Preise im Detail ansehen",
    },
    calculator: {
      badge: "Interaktiver Potenzialrechner",
      h2: "Berechne, was mit Zackisch zusätzlich möglich sein könnte.",
      lead: "Intelligente Empfehlungen, einfachere Nachbestellungen und mehr Zeit für guten Service. Entdecke dein mögliches Umsatzpotenzial mit realistischen Modellannahmen.",
    },
    research: {
      badge: "Wissenschaftliche Basis",
      h2: "Unsere Idee hat gute Gründe.",
      lead: "Wartezeiten beeinflussen das Gästeverhalten. Bestelltechnologie verändert Abläufe. Empfehlungen erleichtern Entscheidungen. Wir legen die Primärstudien offen.",
      cta: "Forschungsbibliothek & Studien ansehen",
    },
    founder: {
      badge: "Gründerstory",
      h2: "Aus Mannheim. Aus einem ganz alltäglichen Frust.",
      quote:
        "Ich wollte einfach nur bestellen. Stattdessen habe ich gewartet. Und als ich später noch eine Kleinigkeit wollte, fing das Warten von vorn an. Daraus entstand Zackisch.",
      story:
        "Ich bin Selim Eser, Informatikstudent an der Technischen Hochschule Mannheim. Mit Zackisch möchte ich digitale Bestellwege für Gastronomiebetriebe zugänglich machen, ohne bewährten Service zu verdrängen. Gastfreundschaft und moderne Technik gehören zusammen.",
      institution: "Mit Unterstützung des MARS Center of Entrepreneurship der Hochschule Mannheim.",
    },
    faq: {
      badge: "Häufige Fragen",
      h2: "Kurz & verständlich erklärt.",
      questions: [
        {
          q: "Muss ich mein bestehendes Kassensystem ersetzen?",
          a: "Nein. Zackisch ersetzt deine Kasse nicht und erfordert keine komplexe Kassenanbindung. Eingehende, bereits digital bezahlte Bestellungen erscheinen auf dem Personal-Tablet und werden von deinem Team mit einem Handgriff manuell in die vorhandene Kasse übertragen. So bleibt dein gewohnter Kassen- und TSE-Ablauf vollständig erhalten.",
        },
        {
          q: "Welche Hardware wird im Lokal benötigt?",
          a: "Du benötigst lediglich ein gewöhnliches Tablet mit aktuellem Browser (z. B. ein iPad oder Android-Tablet), eine stabile Internetverbindung im Lokal sowie ausgedruckte QR-Codes für Tische oder Tresen. Es ist keine spezielle Zackisch-Hardware erforderlich.",
        },
        {
          q: "Wie setzen sich die Gebühren zusammen?",
          a: "Zackisch berechnet eine nutzungsabhängige Plattformgebühr von 2 % auf den erfolgreich abgewickelten Speisen- und Getränkewert. Auf freiwilliges Trinkgeld berechnen wir 0 % Plattformgebühr. Hinzu kommen die standardmäßigen Zahlungsabwicklungsgebühren von Stripe (z. B. 1,5 % + 0,25 € für europäische Standardkarten). Es gibt keine Monatsgebühr und keine Einrichtungsgebühr.",
        },
        {
          q: "Können Gäste weiterhin bar oder beim Kellner bestellen?",
          a: "Selbstverständlich. Zackisch ist ein zusätzliches, freiwilliges Angebot. Gäste, die lieber persönlich beim Personal bestellen oder bar bezahlen möchten, tun dies wie gewohnt.",
        },
        {
          q: "Kann mein Personal Speisen oder einzelne Zutaten kurzfristig deaktivieren?",
          a: "Ja. Auf dem Personal-Tablet können mit einem Fingertipp ganze Gerichte oder gezielt einzelne Zutaten (wie z. B. Hafermilch oder Burrata) als ausverkauft markiert werden. Die Gast-Speisekarte reagiert in Echtzeit und verhindert Fehlbestellungen.",
        },
        {
          q: "Was passiert mit Trinkgeldern?",
          a: "Trinkgelder werden im Bestellvorgang standardmäßig auf 0 % voreingestellt. Wenn Gäste freiwillig Trinkgeld geben, wird dieses im Betreiber-Dashboard centgenau separat ausgewiesen. Zackisch erhebt keine Plattformgebühr auf Trinkgelder.",
        },
        {
          q: "Wo erhalte ich Support bei Fragen?",
          a: "Unser Support-Center unter support.zackisch.com bietet ausführliche Schritt-für-Schritt-Anleitungen. Für persönliche Anfragen erreichst du uns direkt per E-Mail unter selim@zackisch.com.",
        },
      ],
    },
    closing: {
      h2: "Mach Bestellen einfacher. Auf deine Art.",
      lead: "Zackisch ergänzt dein Lokal um einen digitalen Bestellweg und lässt deinem Team die Freiheit, wie bisher zu arbeiten.",
      cta: "Kostenlos registrieren",
      secondary: "Keine Einrichtungsgebühr. Keine monatliche Zackisch-Lizenz.",
    },
  },
  "de-en": {
    hero: {
      h1: "Effortless Ordering & Payment in the Blink of an Eye",
      subtitle:
        "Your guests scan the QR code and discover your digital menu; our smart platform takes care of the rest.",
      primaryCta: "Sign up free",
      secondaryCta: "Watch interactive demo",
      qualifier: "For restaurants, cafés, bars, quick-service counters and takeaway.",
      pricingBadge:
        "No monthly Zackisch license. No POS replacement. 2% platform fee per paid order plus payment processing.",
    },
    society: {
      badge: "Wait Times & Hospitality",
      h2: "Great service shouldn't be held back by waiting.",
      lead: "A crowded counter. Another round of drinks. Waiting for the check. Small delays add up to real friction for guests and staff alike.",
      statNumber: "27%",
      statLabel:
        "of surveyed German dining guests reported having walked out of a restaurant before ordering due to long wait times.",
      source: "Lightspeed × Medallia, Consumer Survey Germany 2025 (~1,000 respondents).",
      sourceNote:
        "Reflects historical individual guest experiences; not a general daily abandonment rate per venue.",
      conclusion:
        "Zackisch provides your guests with an additional, effortless channel to order and pay on their own terms.",
    },
    solutionsIntro: {
      badge: "Hospitality Concepts",
      h2: "Built to fit your venue. Not the other way around.",
      lead: "At the table, at the counter, or for pickup. Zackisch complements the service workflow your team already knows.",
      modes: [
        {
          id: "restaurants-bars",
          title: "Restaurant & Bar",
          tagline: "Table ordering & instant reorders",
          description:
            "Guests order directly from their seats, reorder second rounds without friction, and pay whenever they are ready.",
          href: "/solutions/restaurants-bars",
          image: "/media/hero-hospitality.webp",
        },
        {
          id: "cafes-bakeries",
          title: "Café & Bakery",
          tagline: "Counter relief during peak hours",
          description:
            "A quick coffee, a pastry, and on their way. Zackisch opens a second checkout channel right beside the counter.",
          href: "/solutions/cafes-bakeries",
          image: "/media/food-coffee.webp",
        },
        {
          id: "quick-service",
          title: "Quick-Service & Casual",
          tagline: "Fast order flows without crowded lines",
          description:
            "Relieve bottleneck counters during lunchtime rushes. Paid orders arrive directly on the staff kitchen tablet.",
          href: "/solutions/quick-service",
          image: "/media/pos-counter.webp",
        },
        {
          id: "pickup",
          title: "Pickup & Takeaway",
          tagline: "Order on site & collect at the counter",
          description:
            "Guests order and pay digitally via QR code, then pick up their fresh order at the counter. Zero delivery fleet required.",
          href: "/solutions/pickup",
          image: "/media/food-plated.webp",
        },
      ],
    },
    signatureDemo: {
      badge: "Interactive Walkthrough",
      h2: "This is how Zackisch works.",
      subtitle: "Scan, order, pay. And your team is immediately in the loop.",
      instruction:
        "Experience the entire order flow across three synchronized perspectives: Guest mobile, staff tablet, and owner ledger.",
    },
    smartMenu: {
      badge: "Intelligent Architecture",
      h2: "A menu that thinks along.",
      lead: "Your guests discover what they crave faster — and find the perfect companion items.",
      features: [
        {
          id: "popular",
          title: "What's popular right now.",
          description:
            "Zackisch automatically highlights items frequently ordered through the platform in your specific venue.",
          badge: "Bestseller",
        },
        {
          id: "companion",
          title: "Pairs well together.",
          description:
            "The cart suggests relevant companion items that have proven popular together in past orders at your venue.",
          badge: "Smart Cart Add-on",
        },
        {
          id: "for-you",
          title: "Your favorites first.",
          description:
            "With voluntary consent, returning guests find their personal favorite dishes and drinks faster.",
          badge: "Consent-Based",
        },
        {
          id: "history",
          title: "Just like last time.",
          description:
            "Custom product configurations can be re-selected or tweaked with a single click during the next visit.",
          badge: "Config Memory",
        },
      ],
      legalNote:
        "Personalized favorites require voluntary guest consent. Recommendations are calculated strictly from aggregated in-house order data.",
    },
    freedom: {
      badge: "Choice over Coercion",
      h2: "Personal hospitality remains personal.",
      lead: "Not every guest wants to use a smartphone — and they don't have to. Traditional waiter service, cash, and regular POS checkouts remain fully intact. Zackisch is the convenient alternative for everyone who prefers self-service.",
      factNumber: "45%",
      factLabel: "of all recorded retail and dining payments in Germany in 2025 were made in cash.",
      factSource: "Deutsche Bundesbank, Payment Behavior in Germany 2025.",
    },
    setup: {
      badge: "Zero Friction Setup",
      h2: "You need less than you think.",
      lead: "A standard tablet for your team. Printable QR codes for your tables. And a web browser.",
      points: [
        { title: "Keep your existing POS", desc: "No expensive POS integration needed. Your team manually records paid orders in your regular register." },
        { title: "No proprietary hardware", desc: "Any modern tablet (iPad, Android) with an up-to-date browser can display incoming orders." },
        { title: "Print QR codes yourself", desc: "Generate print-ready table and counter codes directly in your merchant dashboard." },
        { title: "Direct menu management", desc: "Update items, prices, modifiers, and allergens in seconds whenever needed." },
      ],
    },
    pricing: {
      badge: "Transparent Pricing",
      h2: "Only pay when orders are fulfilled.",
      rate: "2%",
      rateLabel: "Zackisch platform fee per paid order (excluding voluntary tips)",
      copy: "No monthly license fees. No setup costs. No hardware leasing. You only pay the 2% Zackisch platform fee plus standard Stripe payment processing.",
      seasonNote: "Seasonal break? When zero orders are processed through Zackisch, zero platform fees are charged.",
      detailsLink: "Explore detailed pricing & fee calculator",
    },
    calculator: {
      badge: "Potential Calculator",
      h2: "Calculate what could be possible with Zackisch.",
      lead: "Smart recommendations, effortless reorders, and more time for hospitality. Explore your potential revenue growth under realistic model assumptions.",
    },
    research: {
      badge: "Scientific Evidence",
      h2: "Our product decisions have solid backing.",
      lead: "Wait times shape guest behavior. Ordering technology improves turnaround. Thoughtful recommendations ease decisions. We disclose our primary research.",
      cta: "Explore Research Library & Sources",
    },
    founder: {
      badge: "Founder Story",
      h2: "From Mannheim. Born out of everyday friction.",
      quote:
        "I just wanted to order a drink. Instead, I waited. And when I wanted something small later on, the waiting started all over. That was the spark for Zackisch.",
      story:
        "I am Selim Eser, a computer science student at Mannheim University of Applied Sciences. With Zackisch, my mission is to make intuitive digital ordering accessible to independent hospitality venues without stripping away genuine human service.",
      institution: "Supported by the MARS Center of Entrepreneurship at Hochschule Mannheim.",
    },
    faq: {
      badge: "Frequently Asked Questions",
      h2: "Straight answers to key questions.",
      questions: [
        {
          q: "Do I have to replace my existing POS register?",
          a: "No. Zackisch does not replace your POS cash register and requires no complex API integrations. Incoming orders that have already been paid online arrive on your staff tablet and are manually recorded into your existing POS by staff in one quick step. This ensures your legal fiscal and TSE compliance remains 100% intact.",
        },
        {
          q: "What hardware is required in my venue?",
          a: "All you need is a standard tablet with an up-to-date web browser (e.g. an iPad or Android tablet), a reliable internet connection, and printed QR codes for your tables or counter. No proprietary hardware from Zackisch is required.",
        },
        {
          q: "How does the pricing structure work?",
          a: "Zackisch charges a 2% platform fee on the successful food and beverage order value. Voluntary tips carry a 0% Zackisch fee. Standard payment processing fees from Stripe apply (e.g. 1.5% + 0.25 € for standard European cards). There are no monthly base fees and no setup fees.",
        },
        {
          q: "Can guests still pay with cash or order with a waiter?",
          a: "Absolutely. Zackisch is an optional digital channel. Guests who prefer traditional table service or cash payment can continue to do so exactly as before.",
        },
        {
          q: "Can staff quickly mark items or specific ingredients as sold out?",
          a: "Yes. From the staff tablet, staff can 86/disable entire menu items or specific ingredients (like oat milk or burrata) with a single tap. The digital guest menu updates immediately in real time.",
        },
        {
          q: "How are voluntary tips handled?",
          a: "Tip selection defaults to 0% in checkout. If a guest voluntarily adds a tip, it is recorded and displayed separately in the merchant dashboard. Zackisch never charges its 2% fee on tips.",
        },
        {
          q: "Where do I get support when needed?",
          a: "Our help center at support.zackisch.com provides detailed step-by-step guides. For direct assistance, email us anytime at selim@zackisch.com.",
        },
      ],
    },
    closing: {
      h2: "Make ordering easier. On your own terms.",
      lead: "Zackisch equips your venue with an intuitive digital ordering channel while preserving the service flow your team loves.",
      cta: "Sign up free",
      secondary: "No setup fees. No monthly Zackisch license.",
    },
  },
};
