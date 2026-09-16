# zakkig: Vision, Produkt & Systemarchitektur

Dieses Dokument ist die zentrale Source of Truth für die B2B Gastro Plattform **zakkig** (konsequent kleingeschrieben). Es vereint die fachliche Vision, das Geschäftsmodell, den detaillierten Anforderungskatalog, die rechtlichen und steuerlichen Vorgaben sowie die vollständige technische Implementierung als hochskalierbares, reaktives SaaS-System auf Basis von Convex & Next.js.

---

## TEIL 1: PRODUKTVISION & GESCHÄFTSMODELL

### 1.1 Was ist zakkig?

zakkig ist ein smartes Tool für die Gastronomie, das den Bestellvorgang und Bezahlvorgang radikal vereinfacht. Es fungiert als eigenständiger Kanal neben der bestehenden Kasse, absolut vergleichbar mit den Devices bekannter Lieferdienste. Das System fokussiert sich dabei konsequent auf zwei Hauptprinzipien: Dine-in (Bestellungen direkt am Tisch) und Takeaway (Ausser-Haus-Verkauf).

Der bewusste Fokus liegt auf maximaler Simplizität: zakkig ist ein reines Add-On-System für den Betrieb vor Ort, das ohne jegliche technische Vorkenntnisse oder langwierige Einarbeitung sofort genutzt werden kann.

### 1.2 Die Nutzererfahrung (UX) & Bring Your Own Device

- **Für den Gast (Bring Your Own Device):** zakkig setzt auf das absolute BYOD-Prinzip. Der Gast nutzt ausschließlich sein eigenes Smartphone. Er scannt lediglich einen QR-Code am Tisch oder am Tresen, wählt sein Essen aus der digitalen Speisekarte und bezahlt sofort. Niemand muss dafür eine App herunterladen oder sich registrieren.
- **Für den Wirt:** Kein Umstellungsstress, kein Risiko, keine teuren Sondergeräte. Fällt das WLAN vor Ort einmal aus, bestellen die Gäste klassisch beim Kellner. Da zakkig in stressigen Stoßzeiten lautlos rund ein Viertel aller Bestellungen übernimmt, hilft es perfekt gegen den heutigen Personalmangel. Zudem geht kein Umsatz verloren, weil Gäste nicht mehr lange auf das Bestellen eines zweiten Getränks warten müssen.
- **Für die Küche und den Service:** Die zentrale Drehscheibe ist das Kitchen Board. Hierfür wird keine teure Spezialhardware benötigt, ein simples und günstiges Standard-Tablet genügt völlig. Die Küche markiert Speisen per Fingertipp als fertig. Die Kellner sehen beim Vorbeigehen sofort, was zu welchem Tisch gebracht werden muss, und haken es nach dem Servieren dort direkt ab.

### 1.3 Geschäftsmodell, Payment & Zielgruppe

- **Die Zielgruppe:** zakkig richtet sich primär an Gastronomien, die ohnehin bereits klassische Kartenzahlung unterstützen.
- **Keine Grundgebühren:** zakkig verdient nur dann mit, wenn der Wirt auch wirklich echten Umsatz generiert.
- **Payment Infrastruktur (Stripe Connect Express & Checkout Sessions):** Wir nutzen Stripe Connect Express als Zahlungsabwickler, um rechtlich und sicherheitstechnisch auf dem höchsten Standard zu agieren und niemals sensible Bankdaten der Gastronomen zwischenspeichern zu müssen.
  - **Onboarding & KYC:** Beim Setup starten die Gastronomen über Stripe-gehostete Onboarding-Links (`accountLinks.create`) direkt in die Identitätsprüfung (KYC). Die komplette Legitimationsprüfung und Speicherung der Bank- und Auszahlungsdaten liegt zu 100 % bei Stripe. Nach Abschluss kehrt der Nutzer auf `/dashboard/{organizationId}/settings/stripe-return` zurück.
  - **Kostenstruktur & Split Payments (Pay-as-you-go):** Stripe arbeitet nach einem strikten Pay-as-you-go-Modell ohne monatliche Fixkosten. Die Zahlungsabwicklung läuft über die Stripe Checkout Sessions API (`ui_mode: "elements"`) mit dem eingebetteten Stripe Payment Element und Destination Charges. Bei jeder Transaktion behält Stripe seine regulären Transaktionskosten ein. Zusätzlich ziehen wir über die Stripe-API (`application_fee_amount`) vollautomatisch unsere **zakkig-Plattformgebühr (1 % vom Brutto-Umsatz)** ab. Der Wirt trägt diese Gebührenkombination (wie beim klassischen EC-Terminal) und erhält die Restsumme direkt auf sein Bankkonto ausgezahlt.
  - **Methoden:** Wir integrieren hochkonvertierende Methoden wie Apple Pay, Google Pay und Standard-Kartenzahlung. Teure Kreditkarten (wie American Express) können über die API gezielt ausgesperrt werden, um die Margen der Wirte zu schützen.
- **Finanzamt & TSE Konformität:** Jede digitale Bestellung wird vom Wirt als Gesamtsumme unter dem Namen zakkig in seine Hauptkasse eingetippt. Dadurch wird alles sofort vom gesetzlichen Sicherheitsbaustein (TSE) signiert. Am Monatsende reicht der Export einer Zusammenfassung für den Steuerberater.

---

## TEIL 2: ANFORDERUNGSKATALOG & FEATURES (Web-App: app.zakkig.com)

Das System ist extrem fokussiert und verzichtet bewusst auf unnötige Extras. Alles dreht sich um den perfekten digitalen Bestellablauf. Die App ist konsequent mehrsprachig (i18n) ausgelegt. Standardmäßig ist Deutsch aktiv, Englisch wird voll unterstützt. Ein modalbasierter Language- und Region-Switcher befindet sich in der Navigations-Sidebar bzw. im Header.

### 2.1 Routing & Zugriffskonzept

**Authentifizierung & Account (Offen bzw. Token-basiert)**

- `app.zakkig.com/sign-in` (Login via Passwort & 2FA E-Mail-OTP)
- `app.zakkig.com/sign-up` (Registrierung Restaurant & Inhaber)
- `app.zakkig.com/reset-password` (Passwort-Reset via E-Mail-Link)
- `app.zakkig.com/delete-account` (Zweistufige Account-Löschungsbestätigung via signiertem E-Mail-Token)

**Dashboard (Geschützt)**
Erfordert eine gültige Session (E-Mail, Passwort, HttpOnly Cookie).

- `app.zakkig.com/` (Automatischer Redirect zum primären Dashboard bzw. `/sign-in`)
- `app.zakkig.com/dashboard` (Automatischer Redirect zum primären Betrieb)
- `app.zakkig.com/dashboard/{organizationId}/overview`
- `app.zakkig.com/dashboard/{organizationId}/current-orders` (Aktuelle Bestellungen)
- `app.zakkig.com/dashboard/{organizationId}/all-orders` (Alle Bestellungen)
- `app.zakkig.com/dashboard/{organizationId}/menu`
- `app.zakkig.com/dashboard/{organizationId}/settings`
- `app.zakkig.com/dashboard/{organizationId}/settings/stripe-return` (Rückkehr von der Stripe Express Onboarding-Seite)

**Staff Devices (Geschützt)**
Einmaliges Pairing über das Dashboard erzeugt eine dauerhafte Personal-Sitzung. Keine Passwort-Eingabe im Arbeitsalltag.

- `app.zakkig.com/staff/{organizationId}` (Personal-Terminal: Kombinierte Ansicht mit Sidebar & mobiler Tab-Bar für Aktuelle Bestellungen, Alle Bestellungen ohne DATEV-Export und Verfügbarkeit)
- `app.zakkig.com/orders/{organizationId}` (Legacy-Redirect auf das Personal-Terminal)
- `app.zakkig.com/availability/{organizationId}` (Legacy-Redirect auf das Personal-Terminal mit aktivem Verfügbarkeits-Tab)

**Gast-Routen (Öffentlich, Keine Session)**
Zugriff ausschließlich über Parameter, ohne Registrierung.

- `app.zakkig.com/pickup/{organizationId}` (Abhol-Menü / Pickup)
- `app.zakkig.com/pickup/{organizationId}?order={orderId}` (Pickup Status-Tracker mit 3 Phasen & 10-Minuten-Countdown)
- `app.zakkig.com/pickup/{organizationId}/success?session_id={CHECKOUT_SESSION_ID}` (Checkout-Bestätigung & automatische Weiterleitung zum Live-Tracker)
- `app.zakkig.com/table/{organizationId}?table={tableNumber}` (Tisch-Menü / Table am Tisch, Tischnummer max. 4 Zeichen)
- `app.zakkig.com/table/{organizationId}/success?session_id={CHECKOUT_SESSION_ID}` (Checkout-Bestätigung am Tisch)

### 2.2 Core Features: Dashboard (SaaS Admin)

- **Overview (`/dashboard/{organizationId}/overview`):**
  - **Kopfbereich:** Anzeige von Betriebsdaten (Logo, Ladenname, Standort).
  - **Statistik-Kacheln:** Zwei Hauptkacheln (Anzahl der Bestellungen & Umsatz). Zeitraum umschaltbar (24 Stunden, 30 Tage, 90 Tage) inklusive Graphen.
  - **Quick-Links:** Navigation zu den weiteren Dashboard-Seiten.
  - **Personal-Sitzung Management:** Zentrale Vollbreiten-Kachel zum Erstellen, Verwalten, Kopieren und QR-Code-Pairing der kombinierten Personal-Sitzung (Staff Session), die Aktuelle Bestellungen, Alle Bestellungen und Verfügbarkeit in einem Terminal vereint.
  - **QR-Code Generator:** Erstellung von QR-Codes für To-Go und To-Stay (inkl. sichtbarer Tischnummer über dem Code, streng auf maximal 4 Zeichen limitiert). Generierte QR-Codes sind als PDF für den Druck herunterladbar.
- **Aktuelle Bestellungen (`/current-orders`):** Echtzeit-Ansicht der aktiven Bestellungen mit den Spalten "In Bearbeitung" und "Abholbereit". Eingehende Bestellungen starten in Bearbeitung (FIFO) und werden per "Bereitstellen"-Button nach "Abholbereit" verschoben. Bestellungen in "Abholbereit" können bei Bedarf per "Zurück in Bearbeitung"-Button wieder zurückverschoben werden (bewusst ohne Toast-Meldung, um redundantes Feedback bei untergeordneten Aktionen zu vermeiden). Der Klick auf "Abschließen" öffnet ein standardisiertes Apple-Sicherheits-Bestätigungsmodal ("Bestellung \"[Nummer]\" abschließen?"); nach Bestätigung verschwindet die Bestellung sofort aus den aktuellen Bestellungen und ist dauerhaft unter "Alle Bestellungen" archiviert. Das responsive Layout orientiert sich via CSS Container Queries (`@container`) exklusiv an der Inhaltsbreite ohne Sidebar.
- **Alle Bestellungen (`/all-orders`):** Detaillierte Historien-Tabelle aller Bestellungen (In Bearbeitung, Abholbereit, Abgeschlossen, Storniert) mit Status- und Typ-Filtern, Volltextsuche und dem DATEV CSV-Export für den Steuerberater. Die Tabelle verzichtet auf redundante Kopfzeilentitel für maximale vertikale Übersicht und Raumausnutzung. Aktive Bestellungen ("In Bearbeitung" & "Abholbereit") können über eine dedizierte Aktions-Spalte mit Bestätigungsmodal storniert werden; abgeschlossene Bestellungen sind unwiderruflich abgeschlossen und können nicht mehr storniert werden.
- **Menu (`/menu`):** Zentrale Verwaltung der Speisekarte, Getränke, Kategorien, Preise und Bilder (ohne redundante "KATEGORIEN"-Überschrift für einen sauberen, fokussierten Header).
- **Settings (`/settings`):** Verwaltung von Account- und Betriebsdaten (z. B. Logo- und Banner-Uploads im Full-Width Layout auf Desktop mit dauerhaft sichtbaren frosted Edit- und Lösch-Buttons) und Stripe-Details. Die Kontolöschung erfolgt über einen zweistufigen Verifizierungsprozess: Eine Server Action (`requestAccountDeletionAction`) generiert über Convex einen temporären Token (30 Minuten TTL) und sendet eine Bestätigungs-E-Mail über Microsoft 365 SMTP. Erst nach Klick auf den Bestätigungslink (`/delete-account?userId=...&token=...`) und erneuter Freigabe wird das gesamte Konto samt Betrieb, Menü, Bildern und Bestellungen kaskadierend restlos gelöscht.

### 2.3 Core Features: Personal-Terminal & Kitchen Board

- **Aufbau & Shell:** Dedizierte Terminal-Shell (`/staff/{organizationId}`) für Küchen- und Servicepersonal mit persistenter Session. Auf Desktop und Tablets steht eine einklappbare linke Sidebar zur Verfügung; auf mobilen Geräten schaltet das Terminal automatisch auf eine iOS-optimierte Bottom-Navigation-Leiste um.
- **Tabs:**
  - **Tab 1: Aktuelle Bestellungen:** Echzeit-Board mit "In Bearbeitung" und "Abholbereit", akustischer Benachrichtigung bei neuen Bestellungen und Live-Badge.
  - **Tab 2: Alle Bestellungen:** Detaillierte Bestellhistorie und Stornierungsmöglichkeiten für aktive Bestellungen, bewusst ohne DATEV-Export für das Servicepersonal.
  - **Tab 3: Verfügbarkeit:** Sekundenschnelles Ein- und Ausschalten von Speisen, Getränken und Kategorien (86-List).
- **Ablauf & Sicherheit:** Eingehende Bestellungen erscheinen in der Spalte "In Bearbeitung" (FIFO). "Bereitstellen" verschiebt nach "Abholbereit". Versehentlich bereitgestellte Bestellungen können per "Zurück in Bearbeitung" retourniert werden. "Abschließen" fordert eine explizite Bestätigung im Apple-Dialog an, bevor die Bestellung final archiviert wird.

### 2.4 Core Features: Gast-Frontend (To-Stay & To-Go)

- **Layout & Guest Flow (Lieferando-Style):**
  - **Initialzustand:** Sauberes Menü ohne störende Navigations-Tabs am unteren Bildschirmrand, wenn der Warenkorb leer ist.
  - **Schwebender Warenkorb-Banner:** Sobald Artikel in den Warenkorb gelegt werden, ploppt unten ein dezenter schwebender Pill-Banner auf (Artikelanzahl, Zwischensumme, "Zum Warenkorb"). Beim Leeren des Warenkorbs blendet sich der Banner automatisch wieder aus.
  - **Fokussierte Warenkorb-Seite:** Beim Klick auf den Banner wechselt die Ansicht in den Warenkorb – das Restaurant-Hero-Banner wird ausgeblendet und ein Zurück-Pfeil oben links führt jederzeit zurück zum Menü. Die Gesamtsumme wird in konsistenter Tracked-Uppercase-Typografie ("SUMME") inklusive genauer Steuerausweisung dargestellt.
- **Warenkorb (Client State):** Wird lokal via `Zustand` verwaltet. Mengenänderungen (+ / -) sind direkt möglich. Bei einem Page-Reload wird der Warenkorb resettet.
- **Checkout:** Abfrage der E-Mail-Adresse (Pflicht für digitalen Beleg) im Bezahl-Dialog mit klarer "SUMME"-Ausweisung, Integration über die Stripe Checkout Sessions API (`ui_mode: "elements"`) mit dem eingebetteten Stripe Payment Element (Apple Pay, Google Pay, Kartenzahlung) und serverseitiger Validierung der Artikelpreise und Verfügbarkeiten in Convex. Nach erfolgreicher Zahlung wird der digitale Bon per E-Mail gesendet.
- **Bestellnummern (Rolling 001 - 999):** Die für Gäste, Gastronomen und Küche sichtbare Bestellnummer rotiert fortlaufend streng aufsteigend im dreistelligen Format von `001` bis `999` und beginnt danach automatisch wieder bei `001` (abgesichert gegen historische Seed-Verschiebungen und Rollover). Intern wird jede Bestellung zusätzlich durch eine eindeutige Dokumenten-ID sowie die Stripe-Payment-ID identifiziert.
- **Nach der Bestellung:**
  - **Table:** Weiterleitung auf `/table/{organizationId}/success`, Anzeige der Bestellnummer auf dem Screen. Gast wartet am Tisch.
  - **Pickup:** Weiterleitung auf `/pickup/{organizationId}/success` und automatische Weiterleitung auf den Order-Tracker mit Live-Status und Anzeige der 3-stelligen Abholnummer. Der Link bleibt nach Bestellabschluss (Abholbereit) 10 Minuten lang mit einem Live-Restzeit-Countdown aktiv ("Tracking-Link aktiv für noch X:XX Min."), danach schaltet er auf den Ablauf-Screen um.

### 2.5 Lifecycle & Ablaufzeiten (Sicherheitsstandard & Auto-Cleanup)

Das Gesamtsystem erzwingt standardisierte Ablaufzeiten für maximale Datensparsamkeit, Sicherheit und konsistente Betriebsabläufe:

| Komponente / Vorgang | Gültigkeit / Timeout | Verhalten nach Ablauf | Sicherheitsfunktion |
| :--- | :--- | :--- | :--- |
| **Auth OTP (Login, Registrierung & E-Mail-Änderung)** | 30 Minuten | Dynamischer Live-Countdown (`<OtpValidityTimer />`: "Code noch für 30 Minuten gültig" bis "1 Minute gültig", Ziffern in Inter `tabular-nums`). Nach Ablauf erscheint ein destruktiver Inline-Hinweis ("Code abgelaufen. Bitte neuen Code anfordern.") und der Primärbutton wechselt vollflächig auf "Neuen Code anfordern". Serverseitig wird der abgelaufene Code endgültig abgewiesen. | Schutz vor Replay- und Brute-Force-Angriffen |
| **Brute-Force Lockout (OTP)** | 5 Fehlversuche | Sofortige Löschung des Codes | Verhindert systematisches Durchprobieren von Einmalcodes |
| **Unverifizierte Accounts** | 30 Minuten | Vollständige Bereinigung via Convex Scheduler | Gibt die E-Mail-Adresse wieder frei, verhindert Ghost-Accounts |
| **Passwort-Reset Link** | 30 Minuten | Token wird ungültig, Neuanforderung erforderlich | Schutz vor missbräuchlicher Passwortänderung über alte Links |
| **Küchen-Board & Bestell-Lifecycle** | Manuell / Direkt | Bestellungen werden nach Bereitstellung manuell abgeschlossen und sofort ins Archiv überführt | Verhindert unkontrolliertes Auto-Archivieren während des Betriebs |
| **Terminal & Personal-Sitzung Tokens** | Dauerhaft (Widerrufbar) | HttpOnly SameSite=lax Cookie (`staff_session_*`, `order_session_*`) | Sicherer Tablet- und Smartphone-Betrieb ohne XSS-Gefährdung |

### 2.6 Dateispeicher & Upload-Limits (Defense-in-Depth)

Für alle visuellen Medien (Restaurant-Logo, Restaurant-Banner, Speisen- und Getränkebilder) gilt ein einheitlicher, serverseitig geschützter Standard:
- **Maximale Dateigröße:** 10 MB pro Datei (`MAX_IMAGE_SIZE_MB = 10`).
- **Unterstützte Formate:** Exklusiv JPG und PNG (`image/jpeg`, `image/png`). Andere Formate werden sowohl im Browser mit einem Fehler-Toast als auch serverseitig strikt abgewiesen.
- **Clientseitige Validierung:** Sofortige Prüfung im Browser (Drag-and-Drop sowie Dateidialog) mit benutzerfreundlichen Hinweisen ("JPG, PNG bis 10 MB").
- **Serverseitige Enforcierung:** Prüfung von Dateigröße und MIME-Type in den Server Actions (`createMenuItemAction`, `updateMenuItemAction`, `updateBusinessAction`) sowie vor Übertragung in den Convex Storage (`uploadFileToConvex`).
- **Anti-IDOR Schutz:** Strikte Überprüfung der Organisationszugehörigkeit vor dem Speichern oder Überschreiben von Bildern.

## TEIL 3: RECHTLICHE & STEUERLICHE COMPLIANCE

Da zakkig Finanztransaktionen abwickelt, ist das System strikt nach deutschen Compliance-Vorgaben modelliert.

### 3.1 Das rechtliche Grundmodell

zakkig fungiert rechtlich als reiner **Bestell- und Zahlungsvermittler**. Der Kaufvertrag über Speisen und Getränke kommt ausschließlich zwischen dem Endkunden und dem Gastronomen zustande.

### 3.2 KassenSichV, Belegausgabe & Nacherfassung

- **TSE-Haftung:** zakkig ist kein elektronisches Kassensystem im Sinne der KassenSichV.
- **Wirt-Pflicht:** Der Gastronom muss jede Bestellung manuell als unbaren Umsatz in seine eigene, zertifizierte Ladenkasse eintippen. Diese Pflicht wird fest in den B2B-AGB der Plattform verankert.
- **Belegfluss:** Der Gast erhält bei Übergabe der Speisen seinen offiziellen TSE-Kassenbon vom Restaurant. Die automatisierte Stripe-E-Mail nach dem Checkout ist lediglich eine "Zahlungsbestätigung" und enthält einen entsprechenden rechtlichen Disclaimer.

### 3.3 Checkout-Pflichtangaben für Gäste

- **Verkäufer-Identität:** Klartext-Hinweis im Checkout: "Du kaufst bei: [Name des Restaurants]. Die technische Bestell- und Zahlungsabwicklung erfolgt über zakkig als Vermittler..."
- **Preise:** Anzeige als Bruttopreise inkl. der jeweiligen Umsatzsteuer (MwSt.).
- **Kauf-Button:** Zwingende Beschriftung mit "Zahlungspflichtig bestellen", direkt darunter die Bestätigung von AGB und Datenschutz.

### 3.4 B2B Abrechnung & DATEV

- **Die B2B-Rechnung:** Wirte erhalten monatlich eine PDF-Rechnung über die einbehaltene zakkig-Plattformgebühr (1 %). Da der Betrag durch Stripe Direct Charges bereits in Echtzeit einbehalten wurde, trägt die Rechnung den Pflicht-Vermerk: "Der Rechnungsbetrag wurde bereits im Rahmen der laufenden Online-Transaktionen einbehalten... Der offene Betrag ist ausgeglichen."
- **Der DATEV CSV-Export:** Die Dashboard-Tabelle exportiert eine Datei für den Steuerberater mit exakten Spalten für Belegdatum, Bestell-ID, Brutto-Umsatz, S_H-Kennzeichen, Währung, zakkig-Gebühr, Stripe-Gebühr und Netto-Geldeingang.

### 3.5 Sicherheit, KYC & Betrugsprävention

- **Onboarding (KYC):** Stripe übernimmt die komplette Geldwäscheprüfung (Handelsregister, Steuernummer, UBO-Identifikation).
- **PStTG-Meldepflicht:** zakkig meldet Gastronomen ab 30 Bestellungen oder 2.000 Euro Jahresumsatz an das Bundeszentralamt für Steuern.
- **Statement Descriptor:** Bankbuchungen der Gäste zeigen `APP* [Name des Restaurants]`, um unberechtigte Rückbuchungen (Chargebacks) zu verhindern.
- **Stripe Radar & 3D-Secure:** 3D-Secure (Zwei-Faktor) ist für Kreditkarten zwingend aktiviert (Haftungsübergang auf die Bank des Karteninhabers). Stripe Radar blockiert hochriskante Transaktionen automatisch.
- **Anti-Spam (QR-Code Fraud):** Limitierung von fehlerhaften Zahlungsversuchen im Checkout pro IP-Adresse, um Manipulationen an abfotografierten Tisch-QR-Codes zu verhindern.

---

## TEIL 4: DESIGN SYSTEM & BRANDING

### 4.1 Die Visuelle Identität

Das Branding von zakkig ist extrem edel, minimalistisch und unauffällig. Es nutzt ein weiches, modernes Designsystem mit starken Rundungen, das vom Feeling her stark an moderne Payment Provider erinnert, dabei jedoch strikt auf bunte Farben verzichtet (monochromes Schwarz/Weiß).

**Wichtig zur Theme-Strategie:** Wir lassen den Dark Mode prinzipiell raus und bieten keine weiteren Theme-Modes an. Die gesamte Plattform wird exklusiv im **Light Theme** betrieben. Dies sorgt dafür, dass sich zakkig mit einem klaren, seriösen und konsistenten Bild unaufdringlich in jede Gaststätte einfügt.

### 4.2 Das UI Theme (shadcn/ui)

Als technisches Fundament für das Interface nutzen wir **shadcn/ui** in Kombination mit Tailwind CSS v4. Wir setzen konsequent auf die Schriftart **Poppins** für perfekte Lesbarkeit.
**Zentrales Theme (`globals.css`):**

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.205 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 1.5rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* Typography */
  --font-sans: Poppins, ui-sans-serif, sans-serif, system-ui;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}


@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ...weitere Theme Zuweisungen... */
  --font-sans: var(--font-sans);
}
```

### 4.3 Numerische Typografie (Strikte Inter-Regel für Ziffern)

- **Poppins** ist die primäre Schriftart für das gesamte Interface: alle Titel, Zwischenüberschriften, Fließtexte, Buttons, Labels und Badges.
- **Inter (`font-inter`, `tabular-nums`):** Ausschließlich und strikt die numerischen Ziffern (`0-9`) und Dezimaltrennzeichen (`.` oder `,`) rendern in Inter mit Tabellenziffern für maximale Lesbarkeit.
- Währungssymbole (`€`), Preis-Präfixe (`ab`, `+`), Einheiten und Wörter verbleiben ausnahmslos in **Poppins**.
- Zur konsistenten Umsetzung im gesamten UI wird die dedizierte Komponente `<Price cents={...} from={...} prefix={...} />` verwendet.

### 4.4 Dialog-, Modal- & Action-Sheet-Architektur

Alle Dialoge und Modals (z. B. Region- & Sprachauswahl, Artikelbearbeitung, Tischverwaltung) folgen einer einheitlichen Apple-inspirierten Architektur:
- **Durchgezogene Trennlinien (Edge-to-Edge Dividers):** Die horizontalen Trennlinien (`border-b` unter dem Header und `border-t` über dem Footer) laufen zu 100 % von der linken bis zur rechten Außenkante durch – niemals eingerückt oder durch Inset-Padding abgeschnitten.
- **Standardisierter Dialog-Container:** `rounded-[24px] border border-border bg-card shadow-2xl overflow-hidden p-0 flex flex-col`.
- **Header & Typografie:** `px-6 py-4 sm:py-5 border-b border-border shrink-0 text-left flex flex-col gap-1` mit `DialogTitle` (`text-xl font-bold tracking-tight`) und `DialogDescription` (`text-xs text-muted-foreground mt-0.5`).
- **Footer & Responsive Buttons:** `px-6 py-4 border-t border-border shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full`. Sekundär-Button ("Abbrechen") in `variant="outline"` und Primär-Button in `bg-primary text-primary-foreground` mit voller responsiver Breite (`flex-1 w-full sm:w-auto`).
- **Modaler Language Switcher Standard:** Jeder Sprach- oder Regionswechsel (im Dashboard, auf der Landingpage oder in der Gast-Ansicht) öffnet einen modalen Dialog gemäß dieser Architektur.

### 4.5 Iconografie & Zero-Emoji-Doktrin

- **Zero Emojis:** Keinerlei Emojis im gesamten Projekt (weder im Quelltext, JSX, Commit-Messages noch in der Dokumentation).
- **Phosphor Icons:** Sämtliche Icons stammen einheitlich aus `@phosphor-icons/react` mit konsistentem Weight (`bold` bzw. `regular`).

### 4.6 Pill-Buttons & Controls-Standard

- Alle Aktions-Buttons, Select-Trigger (`SelectTrigger`), Dropdown-Trigger, Sidebar-Navigationslinks und Bestell-Tickets im Dashboard und Personal-Terminal folgen der Apple-Pill-Geometrie (`h-11 rounded-full font-semibold px-4` bzw. `px-5`, kompakt `h-9 rounded-full font-semibold px-3.5`).

### 4.7 Konzentrische Eckenradien (Concentric Radius Formula)

- Befindet sich ein Element in einem Container mit Innenabstand $P$, gilt strikt die konzentrische Formel:
  $$R_{\text{inner}} = \max(0, R_{\text{outer}} - P)$$
- Für alle Dropdown- und Select-Menüs:
  - Äußere Popup-Karte: strikt `rounded-[20px]` mit `p-2` (8px Padding)
  - Innere auswählbare Einträge: strikt `rounded-[12px]` ($20\text{px} - 8\text{px} = 12\text{px}$) mit `px-3.5 py-2.5 font-semibold`
  - Dies garantiert eine mathematisch exakte Rundung ohne verzerrte Ecken.

### 4.8 Uppercase Tracked Typography Standard

- Alle Abschnitts-Überschriften, Kachel-Kategorien, Spaltenköpfe und Metadaten-Labels (`BETRIEBSDATEN`, `LOGO & BANNER`, `ZAHLUNGSANBIETER`, `GEFAHRENZONE`, `IN BEARBEITUNG`, `ABHOLBEREIT`, `STATISTIK`, `QR-CODE VERWALTUNG`, `SITZUNGEN`, `ARTIKELDETAILS`, `BILD & VORSCHAU`, `PRESETS & ANPASSUNGEN`, `REGION`, `SPRACHE`, `SUMME`) rendern einheitlich mit `text-xs font-bold uppercase tracking-wider text-muted-foreground` (bzw. `text-foreground` auf hellen Dialogen und `text-destructive` in Gefahrenzonen).

---

## TEIL 5: TECHNISCHE IMPLEMENTIERUNG (Zero-Ops Architektur)

Das System setzt auf eine moderne, reaktive Architektur mit **Convex** als All-in-One Backend-Plattform, **Cloudflare** für Edge-Hosting & DNS, **Microsoft 365** für Enterprise-Mails sowie **GitHub** für das Code- und Repository-Management.

### 5.1 Architektur Übersicht & Repository (GitHub)

Das Projekt besteht aus zwei komplett unabhängigen Next.js-Applikationen in einem gemeinsamen GitHub-Repository (Monorepo-Ansatz):

- **Frontend Marketing (`website/`):** B2B Landingpage für den Vertrieb (`zakkig.com`), statisch exportiert (`output: "export"`) für Cloudflare Pages (0ms Cold Start, globale Edge CDN).
- **Frontend SaaS App (`webapp/`):** Admin Dashboard der Wirte, Bestell-UI der Gäste und das Echtzeit Kitchen Board (`app.zakkig.com`), optimiert für Cloudflare Workers via `vinext` (Next.js auf Vite/Workerd-Basis mit 95%+ nativer Kompatibilität).

### 5.2 Der Corporate Tech Stack & Systemarchitektur

- **Cloudflare:**
  - **Domain Registrar & DNS:** Autoritativer DNS-Server und Registrar für alle Apex- und Sub-Domains (`zakkig.com`, `app.zakkig.com`).
  - **Cloudflare Pages:** Hosting und globales Edge CDN für die statisch exportierte Marketing-Website (`website/`) mit 0ms Cold Start.
  - **Cloudflare Workers (`vinext`):** Serverlose Edge-Runtime für die dynamische Webapp (`webapp/`) mit serverlosem SSR und nativer `proxy.ts`-Unterstützung.
- **Microsoft 365:**
  - **Enterprise Email & Identity:** Offizielle Unternehmens-E-Mail-Domain (`selim@zakkig.com`) mit Microsoft 365 Business Basic.
  - **SMTP & Transactional Messaging:** Autoritativer E-Mail-Dienst für Auth-Einmalcodes (OTP), Token-Bestätigungen und Kundenbenachrichtigungen (`smtp.office365.com` über Port 587 STARTTLS).
  - **Absender-Identität:** `Selim von zakkig` (Deutsch) bzw. `Selim at zakkig` (Englisch) mit `selim@zakkig.com`.
  - **Standardisierte Betreffzeilen:** `Anmeldecode für zakkig`, `Passwort zurücksetzen für zakkig`, `Email-Adresse ändern für zakkig`.
  - **Responsives E-Mail-Design:** Der dunkle Code-Container passt sich responsiv an kleinere Bildschirmbreiten mobiler E-Mail-Clients an, sodass der Einmalcode auch auf Smartphones stets einzeilig bleibt.
- **Convex:**
  - **Reaktives All-in-One Backend:** Transaktionale Echtzeit-Datenbank, serverseitige Mutationen, Queries, Crons und Scheduler.
  - **Media & File Storage:** Nativer Dateispeicher für Restaurant-Logos, Hero-Banner und Speisekarten-Fotos.
  - **Backend Authority:** Alle externen Netzwerkaufrufe (Microsoft 365 SMTP, Stripe Connect API) sind in Convex Node Actions gekapselt.
- **GitHub:**
  - **Version Control & Repository:** Monorepo-Hosting, Versionskontrolle und CI/CD-Deployment-Trigger.
- **AI Development Architecture:**
  - Google AI & ChatGPT für agentenbasiertes Coding, Pair Programming und architektonische Systemgestaltung.
- **Frontend & UI:**
  - Next.js (App Router, Server Actions, Server Components, Turbopack) und Tailwind CSS v4.
  - **Design System:** Apple-inspirierte Ästhetik, Monochrom Light Theme, shadcn/ui, Phosphor Icons (`@phosphor-icons/react`), durchgezogene Trennlinien (Edge-to-Edge Dividers) bei Dialogen und Modals.
  - **Typografie:** Poppins als primäre UI-Schriftart, Ziffern und Beträge strikt in Inter (`font-inter`, `tabular-nums`) via `<Price />`.
- **Payment Infrastruktur:**
  - Stripe Connect (Destination Charges mit 1% Plattformgebühr, Checkout Sessions API mit Payment Element).
- **Lokalisierung & Regionen (Model B):**
  - Next-intl mit strikter URL-Lokalisierung (z. B. `/de-de`, `/de-en`, `/de-de/legal-notice`, `/de-de/privacy-policy`, `/de-de/gtc`).
  - Länder und Regionen werden im UI ausnahmslos in ihrer primären Landessprache (Endonym, z. B. "Deutschland") dargestellt.
- **Security:**
  - Enterprise-Grade DDoS-Protection, DNSSEC, TLS 1.3 und globales CDN über Cloudflare.

---

## TEIL 6: B2B LANDINGPAGE (zakkig.com)

Die Marketingseite wird als SEO-optimierter One-Pager gehostet, ergänzt durch separate rechtliche Unterseiten. Sie setzt auf das zukunftssichere Model B für Regionen und Sprachen.

### 6.1 Routing & Model B Lokalisierung

- **Standard (Deutschland - Deutsch):** `/de-de` (One-Pager), `/de-de/legal-notice` (Impressum), `/de-de/privacy-policy` (Datenschutzerklärung), `/de-de/gtc` (AGB).
- **Englisch (Deutschland - Englisch):** `/de-en` (One-Pager), `/de-en/legal-notice` (Legal Notice), `/de-en/privacy-policy` (Privacy Policy), `/de-en/gtc` (GTC).
- **Root-Redirect:** `/` leitet automatisch serverseitig auf `/de-de` weiter.
- **Navigation & Header:** Minimalistischer Header mit Firmen-Logo und weißem Globe-Button zur Region- und Sprachauswahl. Die Seite verzichtet bewusst auf störende Anchor-Links in der Kopfzeile und führt geradlinig vom Hero-Bereich über die Problemstellung und die interaktive QR-Code-Showcase bis zur Registrierung und den Footer-Rechtslinks.

### 6.2 Globale SEO Meta-Daten

- **Meta Title:** Lass Kunden selbst bestellen und bezahlen
- **Meta Description:** Egal ob zum Mitnehmen oder am Tisch, biete deinen Kunden eine digitale Möglichkeit zum Bestellen und Bezahlen. Sie scannen einfach einen QR-Code mit dem eigenen Handy, während dein Personal sich Wichtigerem widmen kann.

---

## TEIL 7: ENTWICKLER-SETUP & INFRASTRUKTUR

Dieser Abschnitt richtet sich an Entwickler und enthält technische Details zur Initialisierung, Architektur und zum Betrieb.

### 7.1 Umgebungsvariablen & Ports

Jedes Teilprojekt besitzt eine eigene `.env` und `.env.example` Datei im jeweiligen Verzeichnis (`webapp/` und `website/`).
- **Webapp (`webapp/.env`):** Enthält Konfigurationen für Convex (`NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`), Stripe Keys, SMTP Provider Einstellungen (`selim@zakkig.com`) und Session-Geheimnisse.
- **Port-Management:**
  - Im **Development-Modus** läuft die Webapp standardmäßig auf Port 3000 (`next dev`) und die Marketingseite auf Port 3001 (`next dev --port 3001`).
  - Im **Production-Modus** starten beide Anwendungen optimiert für Cloudflare Workers (`webapp/`) bzw. Cloudflare Pages (`website/`).

### 7.2 Datenbank-Schema & Convex Functions

Das gesamte Datenbank-Schema ist typsicher in `webapp/convex/schema.ts` definiert:
- **`users`, `authAccounts`, `authSessions`, `authVerificationCodes`:** Benutzerverwaltung und Sitzungen über `@convex-dev/auth`.
- **`organizations`:** Restaurant-Stammdaten, Branding (Logo & Banner), Stripe Connect Status, Tisch-Arrays (`tables`) sowie To-Go & To-Stay Aktivierungsschalter.
- **`menuCategories`:** Speisekarten-Kategorien mit automatischer Sortierung (`sortOrder`).
- **`menuItems`:** Gerichte & Getränke mit centgenauen Preisen, MwSt.-Sätzen (`taxRate`), Bild-Storage-IDs, Verfügbarkeits-Status und strukturierter `customizations`-Konfiguration.
- **`orders`:** Bestellungen mit fortlaufend rotierender dreistelliger Bestellnummer (`001`–`999`), Status (`in_progress`, `completed`, `cancelled`), Gebührenaufschlüsselung (`zakkigFee`, `stripeFee`, `netAmount`) und Tisch-/Abhol-Zuordnung.
- **`orderSessions`:** Pairing-Tokens für Kitchen Board Tablets (gespeichert in sicheren HttpOnly-Cookies).
- **`availabilitySessions`:** Pairing-Tokens für Kassen-/Staff-Terminals zur 86-Verfügbarkeitssteuerung.
- **`verificationCodes`:** Kryptografische Einmalcodes (OTPs) für Registrierung, Login, Passwort-Reset und Sicherheitsaktionen mit 30-Minuten-TTL und Brute-Force-Lockout nach 5 Versuchen.

Für die lokale Entwicklung läuft `npx convex dev` parallel zum Next.js Dev-Server.

### 7.3 Authentifizierung & Server-Side Rendering (SSR)

Für Next.js Server Components und Server Actions wird der serverseitige Convex-Client verwendet (`webapp/lib/convex/auth.ts`):
- `getUser()`: Liest das sichere `HttpOnly`-Session-Cookie (`zakkig_session`) aus und validiert die Session in Convex.
- `getAuthenticatedConvexClient()`: Instanziiert einen serverseitigen Client für Backend-Operationen.
- `requireOwner(organizationId)`: Erzwingt strikte Mandanten-Isolation (Anti-IDOR) auf Inhaberebene in jeder Server Action.
- `requireKitchenOrOwner(organizationId)` & `requireStaffOrOwner(organizationId)`: Autorisierung von Tablet-Terminals und Service-Endpoints.

### 7.4 E-Mail & SMTP
 
Der native SMTP-Service über Microsoft 365 (`smtp.office365.com`, Port 587 STARTTLS, `selim@zakkig.com`) versendet alle ausgehenden transaktionalen Mails (Zwei-Faktor Einmalcodes für Registrierung und Login, Kontolöschungs-Tokens und digitale Quittungen) abgesichert über Convex Node Actions.
