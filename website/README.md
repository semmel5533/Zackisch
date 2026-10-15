# Zackisch Marketing-Website

Dieses Projekt ist die statische, mehrsprachige Marketing- und Rechtswebsite von Zackisch (`https://zackisch.com`), optimiert für Gäste, Gastronomiebetriebe und interessierte Partner. Die Registrierung führt zur separaten Webanwendung ([`webapp/`](../webapp/README.md)).

Die Website wird über Next.js mit `output: "export"` vollständig als statisches HTML-Paket in das Verzeichnis `out/` generiert und über Cloudflare Pages ausgeliefert.

---

## 1. Routen und Lokalisierung

Die Navigation und Adressierung folgt dem Schema **Region zuerst, Sprache danach**:

| Route | Zweck | Sprache & Region |
|---|---|---|
| `/[locale]` (`/de-de`, `/de-en`) | Zentrale Marketing- und Landingpage | Deutschland (Deutsch / Englisch) |
| `/[locale]/legal-notice` | Impressum und gesetzliche Anbieterkennzeichnung | Deutschland (Deutsch / Englisch) |
| `/[locale]/privacy-policy` | Datenschutzerklärung gemäß DSGVO | Deutschland (Deutsch / Englisch) |
| `/[locale]/gtc` | Allgemeine Geschäftsbedingungen (AGB) | Deutschland (Deutsch / Englisch) |
| `/[locale]/newsletter/confirm` | Double-Opt-In-Bestätigungsseite für den Newsletter | Deutschland (Deutsch / Englisch) |
| `/[locale]/newsletter/unsubscribe` | Abmeldeseite für Marketing-E-Mails | Deutschland (Deutsch / Englisch) |

- **Sprach- und Regionsauswahl:** Der Einstiegspfad `/` ermittelt über [`app/page.tsx`](app/page.tsx) die bevorzugte Sprache und leitet standardmäßig auf `/de-de` oder `/de-en` weiter. Nutzer können Region und Sprache jederzeit über das native Dialogfenster ([`RegionLanguageModal.tsx`](components/RegionLanguageModal.tsx)) im Header oder Footer anpassen.
- **Saubere kanonische Pfade:** Es existieren keine veralteten Weiterleitungsrouten; alle internen Verweise zielen direkt auf die kanonischen Pfade.

---

## 2. Struktur und Inhalte der Startseite

Die Hauptseite ([`MainPage.tsx`](components/MainPage.tsx)) führt durch die Kernaspekte von Zackisch:

1. **Hero-Bereich:** Prägnante Botschaft mit taktilem QR-Code-Muster ([`QrCodeShowcase.tsx`](components/QrCodeShowcase.tsx)), das beispielhaft auf die Gästeansicht der Webapp verlinkt.
2. **Ablauf (So funktioniert's):** Dreistufiger Ablauf: Scannen im Browser, selbstständiges Bestellen & Bezahlen, direkte Anzeige auf dem Personal-Tablet in der Küche.
3. **Kosten & Gebührenmodell:** Transparente Aufschlüsselung der 2 % Zackisch-Plattformgebühr pro relevanter Bestellung bei 0 € Einrichtungsgebühr und 0 € monatlicher Grundgebühr (zzgl. variabler Zahlungsdienstleistergebühren).
4. **Häufig gestellte Fragen (FAQ):** Antworten zu Gerätevoraussetzungen (jedes Standard-Tablet genügt), Kassensystem-Ablauf, Auszahlungen über Stripe und Vertragslaufzeiten.
5. **Newsletter-Anmeldung:** Double-Opt-in-Formular im Footer zur Aufnahme in den regionalen Verteiler.
6. **Rechtliche Fußzeile:** Direkte Links zu Impressum, Datenschutz, AGB und Support-Kontakt (`selim@zackisch.com`).

---

## 3. Design und technische Umsetzung

- **Typografie:** Poppins für sämtliche Fließtexte, Überschriften und Aktionsbeschriftungen; Inter für Tabellenzahlen und Geldbeträge.
- **Farben und Formen:** Helle Arbeitsflächen mit neutralen grauen Begrenzungen (`site-line`), schwarzen Primäraktionen (Pill-Buttons) und weißen Sekundäraktionen mit Kontur.
- **Responsivität:** Vollständige Optimierung für Smartphones (ab 320 px Breite), Tablets und Desktop-Bildschirme.
- **Barrierefreiheit:** Tastaturbedienung für das Dialogfenster (inklusive Schließen mit der Escape-Taste und Fokusrückkehr) sowie reduziertes Bewegungsverhalten bei aktiver Systemeinstellung (`prefers-reduced-motion`).

---

## 4. Lokale Entwicklung und Build

### Befehle

```sh
# Abhängigkeiten installieren
npm ci

# Lokalen Entwicklungsserver auf Port 3000 starten
npm run dev

# TypeScript-Typen prüfen
npm run typecheck

# Statischen Produktions-Build erstellen (schreibt nach out/)
npm run build
```

Die Website liest keine geheimen Umgebungsvariablen ein; alle Texte und URLs werden zur Buildzeit über `next-intl` und [`lib/translations.ts`](lib/translations.ts) statisch kompiliert.

---

## 5. Weiterführende Dokumente

- [Gesamtübersicht des Repositories](../README.md)
- [Designsystem und Gestaltungsregeln](../DESIGN.md)
- [Technische Richtlinien und Commit-Konventionen](../AGENTS.md)
- [SEO- und Lokalisierungsdokumentation](../docs/seo.md)
