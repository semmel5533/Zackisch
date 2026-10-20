import type { Locale } from "./site-data";

export interface SubpageContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    h1: string;
    lead: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  sections: Array<{
    id: string;
    title: string;
    subtitle?: string;
    content: string;
    points?: Array<{ title: string; desc: string }>;
    image?: string;
    quote?: string;
    author?: string;
  }>;
  faq?: Array<{ q: string; a: string }>;
}

export const PAGES_CONTENT: Record<Locale, Record<string, SubpageContent>> = {
  "de-de": {
    product: {
      title: "Produktübersicht",
      metaTitle: "Produkt & Funktionen - Zackisch",
      metaDescription:
        "Digitales QR-Code Menü, Bestellannahme am Personal-Tablet und transparentes Dashboard. Ohne neues Kassensystem und ohne App-Download.",
      hero: {
        badge: "Das Zackisch System",
        h1: "Alles für einen einfacheren Bestellweg.",
        lead: "Zackisch verbindet dein digitales Menü, Zahlungen und die Bestellansicht deines Teams. Ohne neue Kasse und ohne App-Download für deine Gäste.",
        ctaPrimary: "Kostenlos registrieren",
        ctaSecondary: "Demo ausprobieren",
      },
      sections: [
        {
          id: "guest",
          title: "1. Für deine Gäste: Schnell am Smartphone",
          content:
            "Kein App-Download, keine Registrierung. Gäste scannen den QR-Code am Tisch oder Tresen und sehen sofort deine Speisekarte mit tagesaktuellen Preisen, Allergenen und smarten Empfehlungen. Bestellen und Bezahlen in unter einer Minute.",
          points: [
            { title: "Browserbasiert", desc: "Funktioniert auf jedem Smartphone direkt in Safari oder Chrome." },
            { title: "Individuelle Konfiguration", desc: "Zutaten, Größen und Extras schrittweise und transparent zusammenstellen." },
            { title: "Moderne Zahlarten", desc: "Apple Pay, Google Pay und Kartenzahlung über die sichere Stripe-Infrastruktur." },
          ],
          image: "/media/guest-phone-table.webp",
        },
        {
          id: "staff",
          title: "2. Für dein Team: Übersicht am Küchen- und Servicetablet",
          content:
            "Jede bezahlte Bestellung trifft mit Signalton und klarer Tischnummer auf dem vorhandenen Tablet ein. Das Team bestätigt den Eingang, bereitet die Speisen vor und überträgt den Vorgang mit einem Handgriff in die bestehende Kasse.",
          points: [
            { title: "Sofortige Ausverkauft-Schalter", desc: "Artikel oder einzelne Zutaten mit einem Fingertipp deaktivieren." },
            { title: "Status in Echtzeit", desc: "Vom Bestelleingang über die Zubereitung bis zur fertigen Ausgabe." },
            { title: "Keine Kassenumstellung", desc: "Bestehende Kassen- und TSE-Prozesse bleiben 100 % unverändert." },
          ],
          image: "/media/staff-service.webp",
        },
        {
          id: "owner",
          title: "3. Für dich als Betreiber: Menü, Auswertungen & getrenntes Trinkgeld",
          content:
            "Volle Kontrolle im übersichtlichen Betreiber-Dashboard. Passe Preise und Beschreibungen in Sekunden an, verfolge deine Umsätze und erhalte getrennte Berichte über erhaltene Trinkgelder.",
          points: [
            { title: "Trinkgeld-Transparenz", desc: "Trinkgelder werden separat und gebührenfrei ausgewiesen." },
            { title: "Verkaufsstatistiken", desc: "Erkenne, welche Gerichte über Zackisch besonders gerne bestellt werden." },
            { title: "Keine Monatsbindung", desc: "Du zahlst nur 2 % Plattformgebühr, wenn tatsächlich Bestellungen fließen." },
          ],
          image: "/media/restaurant-interior.webp",
        },
      ],
    },
    smartMenu: {
      title: "Intelligentes Menü",
      metaTitle: "Intelligentes Menü & Empfehlungen - Zackisch",
      metaDescription:
        "Automatische Bestseller, passende Warenkorbergänzungen und intelligenter Stufen-Konfigurator. Gäste finden schneller, was sie suchen.",
      hero: {
        badge: "Smart Menu Technologie",
        h1: "Dein Menü kann mehr als Artikel auflisten.",
        lead: "Zackisch erkennt häufige Kombinationen innerhalb deines Lokals und schlägt Gästen passende Ergänzungen vor. Stammgäste finden mit freiwilliger Zustimmung ihre Favoriten sofort wieder.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [
        {
          id: "bestsellers",
          title: "Beliebt bei deinen Gästen",
          content:
            "Gerichte, die über Zackisch in deinem Lokal besonders häufig gewählt werden, erhalten automatisch eine unaufdringliche 'Beliebt'-Kennzeichnung. Das erleichtert unentschlossenen Gästen die Auswahl und lenkt den Blick auf deine Spezialitäten.",
          points: [
            { title: "Rein betriebsbezogen", desc: "Kein globales Ranking, sondern die echte Nachfrage in deinem eigenen Lokal." },
            { title: "Mindestdatenbasis erforderlich", desc: "Wird erst aktiviert, wenn ausreichend Bestellungen vorliegen." },
          ],
          image: "/media/food-plated.webp",
        },
        {
          id: "companion",
          title: "Wird oft zusammen bestellt",
          content:
            "Zur Pinsa das passende Kaltgetränk, zum Espresso das passende Croissant: Im Warenkorb erscheinen 1 bis 2 passende Ergänzungen, die andere Gäste im selben Betrieb oft gemeinsam gewählt haben. Kein aufdringliches Werbe-Pop-up, sondern relevanter Mehrwert.",
          points: [
            { title: "Preistransparenz", desc: "Der Aufpreis ist jederzeit vor dem Hinzufügen glasklar sichtbar." },
            { title: "Ausverkauf-Schutz", desc: "Deaktivierte Artikel oder Zutaten werden niemals empfohlen." },
          ],
          image: "/media/food-coffee.webp",
        },
        {
          id: "configurator",
          title: "Intelligenter Stufen-Konfigurator",
          content:
            "Ob Teigauswahl, Extras oder pflanzliche Milchalternativen: Der Konfigurator führt Gäste Schritt für Schritt durch Pflicht- und Wahloptionen. Ändert sich der Preis, aktualisiert sich die Summe in Echtzeit.",
          points: [
            { title: "Optionen-Sicherheit", desc: "Wird eine Zutat in der Küche ausverkauft gemeldet, sperrt der Konfigurator diese Option sofort." },
            { title: "Letzte Auswahl wiederholen", desc: "Mit Zustimmung können Stammgäste ihre bevorzugte Zusammenstellung beim nächsten Mal direkt wieder aufrufen." },
          ],
        },
      ],
    },
    staffDashboard: {
      title: "Personal- & Küchenansicht",
      metaTitle: "Personal-Tablet & Küchenansicht - Zackisch",
      metaDescription:
        "Eingehende bezahlte Bestellungen sofort auf dem Tablet im Blick. Artikel und Zutaten in Sekundenschnelle als ausverkauft schalten.",
      hero: {
        badge: "Betrieb & Service",
        h1: "Volle Kontrolle im Service. In Echtzeit.",
        lead: "Eingehende Bestellungen treffen sofort ein. Und wenn eine Zutat ausgeht, deaktiviere sie mit einem Klick, bevor Gäste sie bestellen können.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [
        {
          id: "order-queue",
          title: "Klare Übersicht für Küche und Bar",
          content:
            "Jede bezahlte Bestellung erscheint mit Ticket-Nummer, Zeitstempel, Tischnummer oder Abhol-Kennzeichnung. Das Personal sieht exakt, welche Sonderwünsche gewählt wurden, und setzt den Status auf 'In Bearbeitung' oder 'Abholbereit'.",
          points: [
            { title: "Akustisches & optisches Signal", desc: "Kein Bon geht in hektischen Stoßzeiten unter." },
            { title: "Manuelle Kassenübernahme", desc: "Der Vorgang wird in einem kurzen Handgriff in die bestehende TSE-Kasse gebucht." },
          ],
          image: "/media/pos-counter.webp",
        },
        {
          id: "availability",
          title: "Zutaten- und Artikel-Verfügbarkeit ('86 List')",
          content:
            "Die Hafermilch ist leer? Das Tiramisu ist für heute ausverkauft? Ein Fingertipp genügt: Schalte das Produkt oder gezielt eine einzelne Zutat aus. Das digitale Menü der Gäste blendet die Option sofort aus oder markiert sie als 'Ausverkauft'.",
          points: [
            { title: "Keine Enttäuschungen am Tisch", desc: "Gäste können nicht bestellen, was die Küche nicht mehr vorrätig hat." },
            { title: "Sofortige Reaktivierung", desc: "Sobald neue Ware da ist, ist die Option mit einem Klick wieder live." },
          ],
          image: "/media/staff-service.webp",
        },
      ],
    },
    restaurantsBars: {
      title: "Restaurants & Bars",
      metaTitle: "Zackisch für Restaurants & Bars - Zackisch",
      metaDescription:
        "Bestellungen und Zwischenrunden direkt am Tisch aufgeben. Entlastet das Serviceteam und lässt Gästen die Wahl.",
      hero: {
        badge: "Full-Service Gastronomie",
        h1: "Der nächste Drink muss nicht warten.",
        lead: "Bestellungen, kleine Nachbestellungen und spontanes Bezahlen direkt am Platz ermöglichen – ohne den persönlichen Service abzuschaffen.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [
        {
          id: "reorders",
          title: "Einfache Nachbestellungen ohne Kellner-Suche",
          content:
            "Gäste möchten noch ein Glas Wein, eine Karaffe Wasser oder ein Dessert? Statt minutenlang den Blickkontakt zum Service zu suchen, geben sie die Nachbestellung in 30 Sekunden per QR-Code auf. Das Personal serviert, ohne lange Bestellwege laufen zu müssen.",
          points: [
            { title: "Höhere Spontanverkäufe", desc: "Zusätzliche Getränkerunden kommen ohne Reibung zustande." },
            { title: "Servicezeit für Beratung", desc: "Mitarbeitende haben mehr Ruhe für Menüberatung und Gastfreundschaft." },
          ],
          image: "/media/hero-hospitality.webp",
        },
        {
          id: "split-payment",
          title: "Direkt am Platz bezahlen",
          content:
            "Am Ende des Abends direkt am Smartphone zahlen, Beleg digital erhalten und auf Wunsch freiwilliges Trinkgeld hinzufügen. Kein Warten auf das EC-Gerät in der Feierabend-Stoßzeit.",
        },
      ],
    },
    cafesBakeries: {
      title: "Cafés & Bäckereien",
      metaTitle: "Zackisch für Cafés & Bäckereien - Zackisch",
      metaDescription:
        "Ein zweiter Bestellweg neben der Theke. Schneller Kaffeegenuss ohne langes Schlangestehen zur morgendlichen Stoßzeit.",
      hero: {
        badge: "Thekengastronomie",
        h1: "Kaffee bestellen, ohne den Moment zu verlieren.",
        lead: "Ein zusätzlicher Bestellweg für die Theke, für Gäste mit wenig Zeit und für wiederkehrende Lieblingsbestellungen.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [
        {
          id: "rush-hour",
          title: "Kürzere Schlangen am Morgen",
          content:
            "Gäste scannen den Aufsteller am Eingang oder Tisch, wählen ihren Flat White mit Hafermilch und ein Croissant und zahlen sofort. Der Barista sieht die Bestellung auf dem Zubereitungs-Tablet und ruft die Nummer zur Abholung auf.",
          points: [
            { title: "Entlastung des Counter-Teams", desc: "Weniger Kassierstress während der morgendlichen Rushhour." },
            { title: "Wiederkehrende Favoriten", desc: "Stammgäste bestellen ihren Lieblingskaffee mit nur zwei Klicks." },
          ],
          image: "/media/food-coffee.webp",
        },
      ],
    },
    quickService: {
      title: "Imbisse & Fast-Casual",
      metaTitle: "Zackisch für Imbiss & Quick-Service - Zackisch",
      metaDescription:
        "Bestellgedränge an der Kasse reduzieren. Gäste stellen ihre Mahlzeit am Smartphone zusammen und holen sie frisch zubereitet ab.",
      hero: {
        badge: "Fast-Casual & Imbiss",
        h1: "Weniger Bestellstau. Mehr Überblick.",
        lead: "Deine Gäste stellen ihre Bestellung am Smartphone zusammen. Dein Team sieht bezahlte Aufträge auf dem Tablet und arbeitet mit der vorhandenen Kasse weiter.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [
        {
          id: "order-flow",
          title: "Strukturierte Bestellungen statt Zettelsalat",
          content:
            "Gerade bei Gerichten mit vielen Individualisierungen (Saucen, Toppings, Schärfegrade) vermeidet die digitale Auswahl am Smartphone Hörfehler und Missverständnisse an der lauten Theke.",
          points: [
            { title: "Präzise Kundenwünsche", desc: "Extras und Allergenausschlüsse werden exakt übermittelt." },
            { title: "Bezahlung vor Zubereitung", desc: "Jede Bestellung ist bereits bezahlt, bevor die Zubereitung beginnt." },
          ],
          image: "/media/pos-counter.webp",
        },
      ],
    },
    pickup: {
      title: "Abholung & To-go",
      metaTitle: "Zackisch für Abholung & Takeaway - Zackisch",
      metaDescription:
        "Bestellen und bezahlen vor Ort per QR-Code, anschließend frisch am Counter abholen. Keine teure Lieferplattform nötig.",
      hero: {
        badge: "Takeaway & To-go",
        h1: "Einfach vor Ort bestellen. Am Counter abholen.",
        lead: "Für alle Gäste, die ihre Bestellung digital aufgeben und bezahlen möchten, um sie anschließend frisch am Counter mitzunehmen.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [
        {
          id: "takeaway-flow",
          title: "Digital bestellen, vor Ort abholen",
          content:
            "Ein QR-Aufsteller im Schaufenster oder im Wartebereich ermöglicht es Gästen, kontaktlos zu stöbern, auszuwählen und per Apple Pay oder Karte zu zahlen. Dein Küchenteam bereitet alles to-go vor.",
          points: [
            { title: "Keine 15–30 % Lieferprovision", desc: "Zackisch kostet nur 2 % Plattformgebühr, ganz ohne Lieferdienst-Aufschläge." },
            { title: "Volle Kundenbeziehung", desc: "Die Gäste gehören dir, nicht einem Drittanbieter-Marktplatz." },
          ],
          image: "/media/food-plated.webp",
        },
      ],
    },
    pricing: {
      title: "Preise & Gebühren",
      metaTitle: "Preise & Konditionen - Zackisch",
      metaDescription:
        "0 € monatliche Lizenz. 0 € Einrichtungsgebühr. Nur 2 % Zackisch-Plattformgebühr pro bezahlter Bestellung zzgl. Stripe-Zahlungsabwicklung.",
      hero: {
        badge: "Preismodell",
        h1: "Einfaches Pricing. Ohne Monatsgebühr.",
        lead: "Keine Fixkosten, keine vertragliche Mindestlaufzeit. Du zahlst nur, wenn Gäste tatsächlich über Zackisch bestellen und bezahlen.",
        ctaPrimary: "Kostenlos registrieren",
        ctaSecondary: "Zum Potenzialrechner",
      },
      sections: [
        {
          id: "table",
          title: "Die Gebührenstruktur auf einen Blick",
          content:
            "Transparenz ist unser oberstes Gebot. Bei Zackisch gibt es kein verstecktes Kleingedrucktes und keine Mindestumsatz-Klauseln.",
          points: [
            { title: "Registrierung & Setup", desc: "0,00 € Einrichtungsgebühr. Du richtest deinen Betrieb kostenfrei selbst ein." },
            { title: "Monatliche Zackisch-Lizenz", desc: "0,00 € Grundgebühr. Keine fixen Software-Kosten jeden Monat." },
            { title: "Zackisch-Plattformgebühr", desc: "2,0 % des Speisen- und Getränkebestellwerts. 0,0 % auf freiwilliges Trinkgeld." },
            { title: "Stripe-Zahlungsabwicklung", desc: "1,5 % + 0,25 € für Standard EWR-Karten (je nach Karte/Zahlungsart via Stripe Connect)." },
            { title: "Hardware & QR-Codes", desc: "0,00 € Gerätemiete. Du nutzt dein eigenes Tablet und druckst QR-Codes selbst aus." },
          ],
        },
      ],
      faq: [
        {
          q: "Was wird als Basis für die 2 % Zackisch-Gebühr herangezogen?",
          a: "Die Plattformgebühr von 2 % wird ausschließlich auf den tatsächlich bezahlten Warenwert von Speisen und Getränken berechnet. Freiwilliges Trinkgeld wird centgenau herausgerechnet – darauf erhebt Zackisch 0 % Gebühr.",
        },
        {
          q: "Was passiert, wenn mein Lokal für Betriebsferien schließt?",
          a: "Wenn dein Lokal geschlossen ist und keine Bestellungen über Zackisch laufen, zahlst du exakt 0,00 € Plattformgebühr an Zackisch. Es gibt keine Mindestgebühren.",
        },
        {
          q: "Wann und wie wird das Geld ausgezahlt?",
          a: "Die Zahlungen der Gäste laufen direkt über dein eigenes, mit Zackisch verbundenes Stripe-Konto. Die Auszahlung auf dein Bankkonto erfolgt nach dem regulären, von Stripe festgelegten Auszahlungsplan.",
        },
      ],
    },
    calculator: {
      title: "Potenzialrechner",
      metaTitle: "Umsatz- & Potenzialrechner - Zackisch",
      metaDescription:
        "Berechne dein mögliches Umsatzpotenzial mit realistischen Modellannahmen. 0 € Personalkosteneinsparung, 4 % Upselling auf digitale Körbe.",
      hero: {
        badge: "Wirtschaftlichkeit",
        h1: "Berechne, was in deinem Lokal möglich sein könnte.",
        lead: "Entdecke das rechnerische Mehrumsatzpotenzial durch einen zusätzlichen Bestellweg und passende Empfehlungen. Basierend auf transparenten Annahmen.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [],
    },
    research: {
      title: "Forschung & Studien",
      metaTitle: "Forschungsbibliothek & Quellen - Zackisch",
      metaDescription:
        "Wissenschaftliche Primärquellen zu Wartezeiten, Konsumverhalten, Empfehlungssystemen und Zahlungsverhalten in Deutschland.",
      hero: {
        badge: "Wissenschaftliche Transparenz",
        h1: "Die Forschung hinter Zackisch.",
        lead: "Wir zeigen offen, welche Erkenntnisse unsere Produktentscheidungen inspirieren – und was die Studien nicht beweisen.",
        ctaPrimary: "Kostenlos registrieren",
      },
      sections: [],
    },
    about: {
      title: "Über Zackisch",
      metaTitle: "Über uns & Gründerstory - Zackisch",
      metaDescription:
        "Entstanden aus dem studentischen Alltag in Mannheim: Warum Selim Eser Zackisch gegründet hat und wie Gastfreundschaft digital ergänzt wird.",
      hero: {
        badge: "Über das Unternehmen",
        h1: "Warum Zackisch ausgerechnet in Mannheim entstanden ist.",
        lead: "Einfach nur bestellen wollen, statt ewig auf die Bedienung zu warten. Aus einem alltäglichen Frust wurde die Idee für Zackisch.",
        ctaPrimary: "Kostenlos registrieren",
        ctaSecondary: "Kontakt aufnehmen",
      },
      sections: [
        {
          id: "story",
          title: "Vom Studenten-Café zum eigenen Startup",
          content:
            "Mein Name ist Selim Eser, ich studiere Informatik an der Technischen Hochschule Mannheim. Wie so viele Gäste habe ich mich immer wieder darüber geärgert, wie viel Zeit in der Gastronomie mit Warten vergeht: Warten auf die Karte, Warten auf die Bestellung, Warten auf den zweiten Kaffee, Warten auf die Rechnung.\n\nMir war schnell klar: Die Lösung darf nicht sein, Personal wegzurationalisieren oder die herzliche menschliche Gastfreundschaft durch kalte Roboter zu ersetzen. Die Lösung muss sein, Gästen und Teams ein Werkzeug an die Hand zu geben, das Routineabläufe beschleunigt.",
          points: [
            { title: "Bodenständig aus Mannheim", desc: "Der Name 'Zackisch' leitet sich aus dem kurpfälzischen Dialekt für zackig ab." },
            { title: "Ergänzung statt Verdrängung", desc: "Persönlicher Service und Bargeld bleiben immer willkommen." },
            { title: "Faire Konditionen", desc: "Nur 2 % bei Erfolg, damit kleine und mittlere Betriebe ohne Risiko starten können." },
          ],
          image: "/founder/selim_full.png",
        },
        {
          id: "mars",
          title: "Unterstützung durch das MARS Center",
          content:
            "Zackisch wird vom MARS Center of Entrepreneurship der Hochschule Mannheim auf dem Weg zur Unternehmensgründung begleitet und gefördert.",
        },
      ],
    },
    contact: {
      title: "Kontakt",
      metaTitle: "Kontakt & Ansprechpartner - Zackisch",
      metaDescription:
        "Fragen zu Zackisch? Schreibe uns direkt an selim@zackisch.com oder nutze unsere Wissensdatenbank auf support.zackisch.com.",
      hero: {
        badge: "Kontakt & Hilfe",
        h1: "Fragen? Sprich direkt mit uns.",
        lead: "Wir stehen dir bei der Einrichtung und allen Fragen persönlich zur Seite.",
        ctaPrimary: "E-Mail an selim@zackisch.com",
      },
      sections: [
        {
          id: "direct",
          title: "Direkter Gründerkontakt",
          content:
            "Da wir uns in der Aufbauphase befinden, sprichst du direkt mit mir als Gründer. Sende mir einfach eine kurze Nachricht mit deinen Fragen oder deinem Lokal-Konzept:",
          points: [
            { title: "E-Mail-Adresse", desc: "selim@zackisch.com" },
            { title: "Standort", desc: "Mannheim, Baden-Württemberg, Deutschland" },
            { title: "Support-Portal", desc: "support.zackisch.com (ausführliche Anleitungen)" },
          ],
        },
      ],
    },
  },
  "de-en": {
    product: {
      title: "Product Overview",
      metaTitle: "Product & Features - Zackisch",
      metaDescription:
        "Digital QR code ordering, staff tablet dispatch, and owner reporting. No POS register replacement and no app download required for guests.",
      hero: {
        badge: "The Zackisch System",
        h1: "Everything you need for an effortless ordering flow.",
        lead: "Zackisch connects your digital menu, guest payments, and kitchen tablet order view. Zero register disruption, zero app download.",
        ctaPrimary: "Sign up free",
        ctaSecondary: "Try the demo",
      },
      sections: [
        {
          id: "guest",
          title: "1. For Guests: Instant mobile ordering",
          content:
            "No download, no account required. Guests simply scan the QR code at their table or counter and immediately explore your visual menu with real-time availability, modifiers, and smart recommendations. Order and pay in under a minute.",
          points: [
            { title: "Browser-native", desc: "Works seamlessly on any iOS or Android phone directly in Safari or Chrome." },
            { title: "Step-by-step customizer", desc: "Configure modifiers, toppings, and sizes with live price feedback." },
            { title: "Modern payment methods", desc: "Apple Pay, Google Pay, and credit cards handled securely by Stripe." },
          ],
          image: "/media/guest-phone-table.webp",
        },
        {
          id: "staff",
          title: "2. For Staff: Live kitchen & counter tablet",
          content:
            "Every paid order arrives on the staff tablet with a clear acoustic cue, table number, and modifier breakdown. Your team prepares the items and transfers the paid order to your existing POS with one quick manual keystroke.",
          points: [
            { title: "Instant 86/sold-out toggle", desc: "Disable unavailable dishes or specific ingredients with a single tap." },
            { title: "Real-time order statuses", desc: "From 'Received' to 'Preparing' to 'Ready for collection'." },
            { title: "Zero register disruption", desc: "Your legal fiscal POS setup and cash routines remain 100% untouched." },
          ],
          image: "/media/staff-service.webp",
        },
        {
          id: "owner",
          title: "3. For Owners: Menu management, analytics & separated tips",
          content:
            "Keep complete operational control in your merchant dashboard. Update prices, manage allergens, review sales analytics, and inspect clean tip reporting.",
          points: [
            { title: "Tip transparency", desc: "Tips are tracked separately with zero platform fee deduction." },
            { title: "Popular item tracking", desc: "Identify which items perform best across digital orders." },
            { title: "Pay-as-you-grow", desc: "You only pay the 2% fee when guests actually place and pay for orders." },
          ],
          image: "/media/restaurant-interior.webp",
        },
      ],
    },
    smartMenu: {
      title: "Smart Menu",
      metaTitle: "Smart Menu & Recommendations - Zackisch",
      metaDescription:
        "Automated bestsellers, relevant cart recommendations, and an intelligent modifier step builder that boosts average order values.",
      hero: {
        badge: "Smart Menu Architecture",
        h1: "A menu that does more than list items.",
        lead: "Zackisch identifies frequent item pairings within your venue and suggests relevant companion products. Returning guests discover their favorites faster.",
        ctaPrimary: "Sign up free",
      },
      sections: [
        {
          id: "bestsellers",
          title: "Popular with your guests",
          content:
            "Dishes and drinks frequently ordered through Zackisch in your specific venue automatically receive a subtle 'Bestseller' badge. This speeds up guest decision-making and showcases your signature dishes.",
          points: [
            { title: "Strictly venue-specific", desc: "Reflects actual in-house demand, not arbitrary global trends." },
            { title: "Minimum order threshold", desc: "Activates only after a solid local data baseline has been established." },
          ],
          image: "/media/food-plated.webp",
        },
        {
          id: "companion",
          title: "Frequently ordered together",
          content:
            "A beverage to pair with pinsa, a fresh croissant with coffee: The checkout sheet surfaces 1 to 2 relevant companion items frequently co-purchased in past orders. Never an intrusive pop-up; always helpful context.",
          points: [
            { title: "Clear price tags", desc: "Additional costs are clearly visible before adding." },
            { title: "Sold-out protection", desc: "Disabled ingredients or items are never recommended." },
          ],
          image: "/media/food-coffee.webp",
        },
        {
          id: "configurator",
          title: "Step-by-step modifier builder",
          content:
            "From crust selection to plant-based milk choices: The customizer guides guests through required and optional choices. Prices update dynamically.",
          points: [
            { title: "Real-time kitchen safeguards", desc: "If the kitchen 86es an ingredient, the modifier builder locks it immediately." },
            { title: "Repeat last choice", desc: "With voluntary consent, returning guests can restore their previous custom bowl or coffee." },
          ],
        },
      ],
    },
    staffDashboard: {
      title: "Staff & Kitchen View",
      metaTitle: "Staff Tablet & Kitchen View - Zackisch",
      metaDescription:
        "Live order queue for bar and kitchen. 86 menu items and modifiers in seconds before guests can order them.",
      hero: {
        badge: "Service & Operations",
        h1: "Complete service control. In real time.",
        lead: "Paid orders arrive instantly on your staff tablet. And if an ingredient runs out, disable it in seconds before any guest can select it.",
        ctaPrimary: "Sign up free",
      },
      sections: [
        {
          id: "order-queue",
          title: "Clarity for kitchen and bar teams",
          content:
            "Every paid order is displayed with an order number, timestamp, table identifier, and full customization notes. Staff can update order status and easily verify items.",
          points: [
            { title: "Acoustic & visual alerts", desc: "Never miss a ticket during peak service hours." },
            { title: "Manual register entry", desc: "Record the paid order into your existing fiscal cash register in one swift step." },
          ],
          image: "/media/pos-counter.webp",
        },
        {
          id: "availability",
          title: "Instant item & ingredient availability ('86 List')",
          content:
            "Oat milk ran out? Tiramisu sold out for the day? Tap once on the tablet: The digital guest menu immediately hides the choice or marks it as sold out, preventing frustrating order cancellations.",
          points: [
            { title: "Zero table disappointment", desc: "Guests can only order what your team is ready to prepare." },
            { title: "Instant reactivation", desc: "Re-enable items with a single tap as soon as fresh stock arrives." },
          ],
          image: "/media/staff-service.webp",
        },
      ],
    },
    restaurantsBars: {
      title: "Restaurants & Bars",
      metaTitle: "Zackisch for Restaurants & Bars - Zackisch",
      metaDescription:
        "Seamless table ordering and spontaneous reorders. Relieves service teams while preserving genuine human hospitality.",
      hero: {
        badge: "Full-Service Dining",
        h1: "The next drink shouldn't have to wait.",
        lead: "Enable guests to order, reorder, and pay directly from their table — without replacing personal hospitality.",
        ctaPrimary: "Sign up free",
      },
      sections: [
        {
          id: "reorders",
          title: "Effortless reorders without flagging down a waiter",
          content:
            "Guests want another glass of wine, water, or dessert? Instead of scanning the room for staff during rushes, they place their second round in 30 seconds via QR code. Staff delivers orders with a smile, freed from ticket-writing friction.",
          points: [
            { title: "Higher spontaneous spend", desc: "Second drinks and desserts are ordered naturally without delays." },
            { title: "More time for hospitality", desc: "Staff focus on menu recommendations and welcoming guests." },
          ],
          image: "/media/hero-hospitality.webp",
        },
      ],
    },
    cafesBakeries: {
      title: "Cafés & Bakeries",
      metaTitle: "Zackisch for Cafés & Bakeries - Zackisch",
      metaDescription:
        "An express ordering lane right beside the counter. Fast coffee enjoyment without crowded morning lines.",
      hero: {
        badge: "Counter Service",
        h1: "Order your coffee without losing the moment.",
        lead: "A second checkout channel for busy counters, time-sensitive customers, and quick morning regulars.",
        ctaPrimary: "Sign up free",
      },
      sections: [
        {
          id: "rush-hour",
          title: "Shorter morning queues",
          content:
            "Guests scan the counter code, select their flat white and pastry, and pay on the spot. The barista receives the order on the prep tablet and calls out the ticket number for collection.",
          points: [
            { title: "Relieve counter bottlenecks", desc: "Minimize cashier stress during peak morning rushes." },
            { title: "Returning regular favorites", desc: "Regulars can reorder their personalized morning drink in two taps." },
          ],
          image: "/media/food-coffee.webp",
        },
      ],
    },
    quickService: {
      title: "Quick-Service & Casual",
      metaTitle: "Zackisch for Quick-Service & Fast-Casual - Zackisch",
      metaDescription:
        "Reduce bottleneck lines. Customers configure their meals on their smartphones and collect fresh orders at the counter.",
      hero: {
        badge: "Fast-Casual",
        h1: "Less bottleneck friction. Greater overview.",
        lead: "Your guests customize and pay for their orders on their smartphone. Your team fulfills paid tickets on the prep tablet.",
        ctaPrimary: "Sign up free",
      },
      sections: [
        {
          id: "order-flow",
          title: "Structured tickets instead of acoustic mishears",
          content:
            "For menus with multiple custom toppings and sauces, digital smartphone configuration eliminates miscommunications at noisy counters.",
          points: [
            { title: "Accurate modifier choices", desc: "Special requests and allergen exclusions are recorded unambiguously." },
            { title: "Pre-paid orders", desc: "Every order is verified and paid before kitchen preparation begins." },
          ],
          image: "/media/pos-counter.webp",
        },
      ],
    },
    pickup: {
      title: "Pickup & Takeaway",
      metaTitle: "Zackisch for Pickup & Takeaway - Zackisch",
      metaDescription:
        "Order and pay on site via QR code, then collect fresh food at the counter. Zero 15-30% delivery marketplace fees.",
      hero: {
        badge: "Takeaway & Pickup",
        h1: "Order on site. Collect at the counter.",
        lead: "For all guests who prefer digital ordering and payment on premise, taking their freshly prepared order to-go.",
        ctaPrimary: "Sign up free",
      },
      sections: [
        {
          id: "takeaway-flow",
          title: "Digital ordering, direct counter pickup",
          content:
            "A QR stand in your waiting area or window allows guests to browse, order, and pay with Apple Pay or card. Your kitchen prepares everything to-go.",
          points: [
            { title: "No 15–30% marketplace commission", desc: "Zackisch costs only 2% platform fee, with zero third-party delivery markups." },
            { title: "Direct guest relationship", desc: "Guests stay your customers, not users of a logistics conglomerate." },
          ],
          image: "/media/food-plated.webp",
        },
      ],
    },
    pricing: {
      title: "Pricing & Fees",
      metaTitle: "Pricing & Fees - Zackisch",
      metaDescription:
        "0 € monthly license. 0 € setup fee. Only 2% Zackisch platform fee per paid order plus standard Stripe processing.",
      hero: {
        badge: "Pricing Model",
        h1: "Simple pricing. Zero monthly fee.",
        lead: "No fixed monthly software subscriptions. You only pay when guests successfully order and pay through Zackisch.",
        ctaPrimary: "Sign up free",
        ctaSecondary: "Open potential calculator",
      },
      sections: [
        {
          id: "table",
          title: "The fee structure at a glance",
          content:
            "Total transparency is our core principle. Zackisch carries zero hidden setup fees or minimum sales quotas.",
          points: [
            { title: "Registration & Setup", desc: "0.00 € setup fee. You configure your venue independently at zero upfront cost." },
            { title: "Monthly Zackisch License", desc: "0.00 € monthly base fee. Zero recurring fixed software charges." },
            { title: "Zackisch Platform Fee", desc: "2.0% on fulfilled food & beverage order value. 0.0% on voluntary tips." },
            { title: "Stripe Processing Fees", desc: "1.5% + 0.25 € for standard European cards (billed directly through Stripe Connect)." },
            { title: "Hardware & QR Codes", desc: "0.00 € device leasing. Use your existing tablet and print QR codes yourself." },
          ],
        },
      ],
      faq: [
        {
          q: "What is the calculation base for the 2% Zackisch fee?",
          a: "The 2% platform fee is calculated strictly on the net fulfilled food and beverage order value. Voluntary tips are completely excluded — Zackisch charges 0% fee on tips.",
        },
        {
          q: "What happens during seasonal venue closures?",
          a: "If your venue is closed and zero orders are processed through Zackisch, you pay exactly 0.00 € in platform fees. There are no minimum monthly retainer fees.",
        },
        {
          q: "When and how are payouts transferred?",
          a: "Guest payments are processed directly into your venue's connected Stripe account. Payouts to your business bank account follow Stripe's regular rolling payout schedule.",
        },
      ],
    },
    calculator: {
      title: "Revenue Calculator",
      metaTitle: "Revenue & Potential Calculator - Zackisch",
      metaDescription:
        "Estimate your revenue potential under realistic model assumptions. 0 € labor savings, 4% digital basket upselling.",
      hero: {
        badge: "Economics & Uplift",
        h1: "Calculate what could be possible in your venue.",
        lead: "Explore the revenue growth potential from an additional ordering channel and relevant recommendations. Powered by transparent assumptions.",
        ctaPrimary: "Sign up free",
      },
      sections: [],
    },
    research: {
      title: "Research & Sources",
      metaTitle: "Research Library & Sources - Zackisch",
      metaDescription:
        "Scientific primary sources on waiting times, consumer behavior, recommendation algorithms, and cash payment preferences in Germany.",
      hero: {
        badge: "Scientific Evidence",
        h1: "The research behind Zackisch.",
        lead: "We openly disclose the research that inspires our product decisions — and what these studies do not prove.",
        ctaPrimary: "Sign up free",
      },
      sections: [],
    },
    about: {
      title: "About Zackisch",
      metaTitle: "About Us & Founder Story - Zackisch",
      metaDescription:
        "Born from everyday hospitality friction in Mannheim: Why Selim Eser founded Zackisch and how digital workflows enhance human service.",
      hero: {
        badge: "Company Background",
        h1: "Why Zackisch was founded right here in Mannheim.",
        lead: "Just wanting to order a coffee, instead of waiting endless minutes for service. A common frustration sparked the idea for Zackisch.",
        ctaPrimary: "Sign up free",
        ctaSecondary: "Get in touch",
      },
      sections: [
        {
          id: "story",
          title: "From university café frustration to startup",
          content:
            "My name is Selim Eser, and I study computer science at Mannheim University of Applied Sciences. Like so many guests, I repeatedly experienced how much time in hospitality is spent simply waiting: waiting for the menu, waiting for an order, waiting for a refill, waiting for the bill.\n\nIt was clear to me: The solution cannot be replacing warmth and personal service with sterile screens. The solution must be providing guests and teams with an intuitive tool that removes routine bottlenecks.",
          points: [
            { title: "Rooted in Mannheim", desc: "The name 'Zackisch' comes from the local dialect word for fast and prompt." },
            { title: "Enhancing, not replacing", desc: "Personal waiter service and cash remain fully supported." },
            { title: "Fair pay-per-use", desc: "Only 2% on successful orders, allowing small venues to start risk-free." },
          ],
          image: "/founder/selim_full.png",
        },
        {
          id: "mars",
          title: "Supported by MARS Center of Entrepreneurship",
          content:
            "Zackisch is accompanied and supported by the MARS Center of Entrepreneurship at Mannheim University of Applied Sciences.",
        },
      ],
    },
    contact: {
      title: "Contact",
      metaTitle: "Contact & Communication - Zackisch",
      metaDescription:
        "Questions about Zackisch? Contact us directly at selim@zackisch.com or visit our support documentation at support.zackisch.com.",
      hero: {
        badge: "Get in Touch",
        h1: "Questions? Talk directly with us.",
        lead: "We are here to support your setup and answer any questions personally.",
        ctaPrimary: "Email selim@zackisch.com",
      },
      sections: [
        {
          id: "direct",
          title: "Direct Founder Contact",
          content:
            "During our current launch phase, you communicate directly with me as the founder. Send an email with your venue details or questions:",
          points: [
            { title: "Email", desc: "selim@zackisch.com" },
            { title: "Location", desc: "Mannheim, Baden-Württemberg, Germany" },
            { title: "Help Center", desc: "support.zackisch.com (comprehensive guides & tutorials)" },
          ],
        },
      ],
    },
  },
};
