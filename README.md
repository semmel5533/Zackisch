# Zackisch

**Zentrales Produkt-, Projekt- und Technikhandbuch** · Stand: 27. Oktober 2026 · Zielpfad: `/README.md`

> **Dokumentenvertrag:** Diese Datei ist der Einstiegspunkt für **Was ist Zackisch? Für wen? Warum? Welche Funktionen, fachlichen Grenzen und technischen Kontexte gibt es?** Die direkt danebenliegende [`DESIGN.md`](./DESIGN.md) ist die einzige verbindliche Quelle für **Branding, Farben, Typografie, Mascot, Bildsprache, Komponenten, UX, Marketing-Art-Direction, Motion und das visuelle QR-Karten-Layout**. Die technischen Detailverträge liegen in den vier Projekt-READMEs/AGENTS und in `docs/`. Keine separaten Website- oder QR-*Design*-Dokumente als konkurrierende Styleguides anlegen.
>
> **Status der Angaben:** „Produktregel“ bezeichnet die dokumentierte Absicht bzw. den fachlichen Vertrag; „Ist im Repo“ bezeichnet auffindbaren Code/Route; „Zielzustand“ bezeichnet noch umzusetzendes Verhalten. Das Vorhandensein einer Datei oder eines Schemas beweist **nicht**, dass ein Ablauf produktiv vollständig funktioniert. Externe Texte, Preisbedingungen, rechtliche Aussagen und Studien müssen vor Veröffentlichung auf Aktualität und tatsächliche Implementierung geprüft werden. Ein Design-Redesign ist keine Genehmigung für ungetestete Änderungen an Zahlungs-, Rechte- oder Kassenabläufen.

## 1. Produkt in einem Absatz

Zackisch ergänzt bestehende **Lokale** um browserbasierte QR-Bestellung und digitale Bezahlung. Gäste scannen einen Tisch- oder Abhol-QR-Code, öffnen das Menü des Lokals ohne Installation und ohne Zackisch-Konto, wählen Artikel samt verfügbaren Optionen aus und bezahlen über den angebundenen Zahlungsanbieter. Bezahlte Bestellungen erscheinen im dafür gekoppelten Personal-Tablet. Das Lokal führt seinen persönlichen Service und sein vorhandenes Kassensystem **weiter**; die im eigenen Kassensystem nötige Erfassung und Belegausgabe bleiben Teil des Betriebsablaufs. Zackisch ist **kein Ersatz-Kassensystem**, keine Garantie gegen Wartezeiten und kein Modell zum Abbau von Personal.

**Markenversprechen:** Deine Kasse bleibt. Deine Gäste bestellen selbst.

### Einheitliche Begriffe

| Wir schreiben | Bedeutung | Vermeiden |
|---|---|---|
| **Lokal** | Oberbegriff für Restaurant, Café, Bar, Bäckerei, Imbiss, Bistro, Abholbetrieb usw. | „Restaurant“ als universelle Bezeichnung |
| **Betreiber:in / Betrieb** | Verantwortliche Person / geschäftliche Einheit hinter einem oder mehreren Lokalen | unklare Mischung aus Gast und Verkäufer |
| **Gast** | Person, die am Tisch oder für Abholung bestellt | Zackisch-Kunde, wenn Endgast gemeint ist |
| **Menü** | Kategorien, Artikel, Varianten, Preise, Verfügbarkeit, Allergene | „Speisekarte“ als allgemeiner UI-Begriff |
| **Tischbestellung / Abholung** | Zwei unterschiedliche Bestellkontexte | Beide zu einer unklaren Tischlogik vermischen |
| **Personal-Tablet** | Autorisierte Arbeitsansicht für eingehende Aufträge | „Kasse“, „POS-Integration“ |
| **Combination Mark** | Offizielles Zackisch-Logo: Schriftzug + Katzenkopf | „Full Logo“ |
| **Brand Mark / Mascot** | Eigenständiger Katzenkopf bzw. dessen Emotionen/Posen | Restaurant-Logo-Ersatz |
| **Bestell- und Zahlungsbestätigung** | Zackisch-Dokument nach verifizierter Zahlung | „Kassenbeleg“ oder „Rechnung“ für dasselbe Dokument |

Technische Bezeichner wie `restaurant`, `menuItems` oder alte Pfade werden nicht allein für diese Sprachentscheidung umbenannt. Die Umstellung betrifft **produktseitige Terminologie, UX-Texte und neue Dokumentation**.

## 2. Kundengruppe und konkrete Jobs to be done

**Primäre zahlende Zielgruppe:** unabhängig geführte Lokale in Deutschland – kleine Teams, Gastronom:innen mit und ohne IT-Erfahrung, Konzepte vom Tischservice bis zur Abholung. Sie müssen sich selbst einrichten können, dürfen dafür weder eine neue Kasse noch Zackisch-Spezialhardware benötigen und brauchen während des Betriebs einen klaren, belastbaren Arbeitsablauf.

**Weitere Nutzergruppen:** Gäste am Tisch (spontan, oft nur Smartphone, teils wenig Akku/Netz/Sprachkenntnisse), Abholgäste (Zeitdruck), Service- und Küchenpersonal (laute Umgebung, schnelle Statusentscheidungen), Support-Team (betriebsgebundene Tickets), autorisiertes internes Zackisch-Team (regionale Verwaltung, Audit, Partner, Kommunikation).

**Das Produkt muss folgende Fragen beantworten:**

1. Gast: „Bin ich im richtigen Lokal und am richtigen Tisch? Was kann ich bestellen, was kostet es vollständig, wann ist bezahlt und wo bleibt meine Bestellung?“
2. Betreiber:in: „Was benötige ich, wie richte ich es sicher ein, sind Zahlungen möglich, was passiert im Service und was muss ich in der Kasse erfassen?“
3. Personal: „Welche Bestellung ist neu, bereits bezahlt, für welchen Tisch bzw. welche Abholung, was ist vorzubereiten, was wurde in der Kasse erfasst?“
4. Support: „Welcher Betrieb hat welches Problem; was ist für Gäste öffentlich und was ist interne Information?“
5. Team: „Welche Betriebe und Aufträge darf ich in welcher Region sehen oder bearbeiten, und was lässt sich nachvollziehen?“

## Asset-Bundle im Repository-Root

Diese Root-Dokumentation setzt folgende gemeinsam gepflegte Design-Assets voraus:

- `assets/zackisch/tokens.css` — kanonische Design-Tokens (`--zk-*` und Systemvariablen)
- `assets/zackisch/brand/combination_mark.svg` — offizielle Combination Mark / Wordmark
- `assets/zackisch/brand/brand_mark.svg` — offizielle Brand Mark
- `assets/zackisch/mascot/*.svg` — finale Mascot-Varianten für Website, Produkt, Support und leere Zustände
- `assets/zackisch/icons/*.svg` — handgezeichnetes Zackisch-Doodle-Iconset
- `assets/zackisch/font/inter/*` — selbst gehostete Inter-Schriftdateien und `inter.css`
- `assets/zackisch/font/zackisch.ttf`, `assets/zackisch/font/zackisch.woff2`, `assets/zackisch/font/zackisch.css` — dekorative Zackisch-Display-Schrift

Die genaue visuelle Verwendung und die semantische Einsatzlogik dieser Assets sind in [`DESIGN.md`](./DESIGN.md) festgelegt. Diese `README.md` beschreibt den Produkt- und Projektkontext dazu, nicht die Detailoptik.

## 3. Produktprinzipien und Grenzen

- **Hybrid-Service statt Digitalzwang:** Persönliches Bestellen beim Personal und Barzahlung über das gewohnte Kassensystem bleiben Optionen des Lokals. Digital bestellen ist ein zusätzlicher Kanal.
- **Kein App-Download, kein Gast-Account** als Voraussetzung für Tisch-/Abholbestellungen.
- **White Label im Gäste-Frontend:** Logo/Name des Lokals im Mittelpunkt; nicht die Zackisch Combination Mark. Brand Mark/Mascot nur situativ und dezent (siehe `DESIGN.md`).
- **QR-Druck darf Zackisch subtil zeigen:** Auf QR-Karte/Aufsteller genau eine kleine Combination Mark; **kein Lokalname und kein Lokallogo**. Ein Tisch-QR enthält deutlich die Tischnummer, ein Abhol-QR den Abholkontext. Der Hinweis auf persönliche Bestellung gehört auf die Karte.
- **Keine Spezialhardwarepflicht:** normales geeignetes Personal-Tablet, Internet und druckbarer QR genügen dem angestrebten Modell. Eignung/Kompatibilität und echte Zahlungsfreigabe bleiben zu prüfen.
- **Die Kasse bleibt:** Kein ungeprüftes Werbeversprechen einer POS-Integration oder automatisierten Fiskalisierung. Personal überträgt erforderliche Informationen nach dem geprüften betrieblichen Prozess; keine doppelte Kassierung.
- **Datenbasierte Empfehlungen nur, wenn real implementiert:** Daten aus Zackisch-Bestellungen des jeweiligen Lokals; keine globalen oder erfundenen „KI“-Funktionen behaupten.
- **Nachvollziehbarer Status:** „Bezahlt“ ausschließlich nach serverseitiger Bestätigung, nicht nach Browser-Redirect oder einem animierten Häkchen.

## 4. Geschäftsmodell und rechtlich relevante Produktgrenzen

**Dokumentiertes kommerzielles Modell:** keine Zackisch-Einrichtungsgebühr, keine monatliche Zackisch-Grundgebühr, keine verpflichtende Zackisch-Hardware. Zackisch berechnet **2 % des erfolgreich bezahlten Brutto-Bestellwerts ohne freiwilliges Trinkgeld** als Plattformgebühr, **inklusive der gegebenenfalls auf die Zackisch-Leistung entfallenden Umsatzsteuer**. Gebühren des Zahlungsdienstleisters fallen zusätzlich gemäß tatsächlicher Stripe-/Händlerkonfiguration an. Ohne abgewickelte Zackisch-Bestellungen keine prozentuale Zackisch-Transaktionsgebühr. Eigene Geräte, Internet, Druck und optionale Fremdleistungen bleiben mögliche separate Kosten.

- Der **Gastronomiebetrieb ist Verkäufer** von Speisen/Getränken an seine Gäste und verarbeitet Zahlungen über sein angebundenes Stripe-Konto, soweit dieses Modell tatsächlich verifiziert ist. Zackisch bietet Software und erhebt seine eigene Gebühr. Keine Behauptung über eine bestimmte Auszahlungsdauer.
- **Trinkgeld** getrennt behandeln; keine Vorauswahl über 0 % ohne freiwillige bewusste Auswahl. Kein Trinkgeld als Betriebsumsatz oder als Basis der Zackisch-Provision ausgeben.
- **Zackisch-Gastbestätigung ≠ Kassenbeleg ≠ Steuerrechnung.** Der Betrieb bleibt für sein rechtlich zulässiges Kassen-/Belegverfahren verantwortlich; Zackisch stellt keine Lokalrechnung in eigenem Namen aus. Die genaue Einordnung von On-site-QR-Zahlungen, TSE-Pflicht, Erfassungstiming, Kassenbeleg und steuerlicher Behandlung bedarf der fachlichen Prüfung vor Echtgeldfreigabe.
- **Erstattungen, Teilerstattungen, Chargebacks und Auszahlungen** müssen den tatsächlichen Server-/Providerzustand und die Verantwortlichkeiten abbilden, nicht eine kosmetische UI-Simulation.
- Für die Veröffentlichungsfreigabe gelten die freigegebenen Vertrags-/Rechtsdokumente und die tatsächlich getestete Produktkonfiguration, nicht allein diese README.

Vertiefung: [`docs/payments-and-stripe.md`](docs/payments-and-stripe.md), [`docs/guest-confirmation-and-pos.md`](docs/guest-confirmation-and-pos.md), [`docs/germany-legal-and-regulatory.md`](docs/germany-legal-and-regulatory.md), [`docs/tax-invoicing-and-fiscalization.md`](docs/tax-invoicing-and-fiscalization.md), [`docs/legal-pages-consents-and-contracts.md`](docs/legal-pages-consents-and-contracts.md).

## 5. Anwendungen und Verantwortlichkeiten

| Bereich | Projekt | Öffentlicher Zielkontext | Wichtigste Aufgaben |
|---|---|---|---|
| Marketingwebsite | [`root/`](root/README.md) | `https://zackisch.com/de-de` und `…/de-en` | Positionierung, Funktionen, wissenschaftlich eingeordnetes Problem, Preise, Voraussetzungen, Einstieg, Kontakt, Rechtliches |
| Betreiber-/Gäste-App | [`app/`](app/README.md) | `https://app.zackisch.com` | Registrierung, Einrichtung, Betriebsverwaltung, Menü, Tisch/QR, Live-Aufträge, Checkout, Bezahlung, Bestätigung |
| Hilfe-Center | [`support/`](support/README.md) | `https://support.zackisch.com/de-de` | Suchbare Hilfeartikel, Einrichtungsanleitungen, authentifizierte Tickets |
| Internes Team-Dashboard | [`internal/`](internal/README.md) | `https://internal.zackisch.com` | Regionale Organisation, Betriebe, Aufträge, Partner, E-Mails, Newsletter, Audit, Rollen, Support |

Alle vier Frontends sind technisch getrennte Next.js-Projekte. Übergreifende Geschäftsdaten laufen über die gemeinsame Convex-Quelle in `app/convex/`. **Website und Hilfe-Center müssen öffentlich lesbar bleiben, soweit Inhalte nicht zugangsbeschränkt sind; dynamische Funktionalität nutzt nur hierfür freigegebene Endpunkte.** Die Marketingwebsite ist kein Checkout- oder Gastportal.

### Funktionsinventar (Design-Pflichtabdeckung)

| Domäne | Relevante Aufgaben, die visuell abgedeckt sein müssen | Projekt |
|---|---|---|
| Anmeldung/Konto | Registrierung, Anmeldung, Passwortzurücksetzung, E-Mail-Änderung, OTP, Accountlöschung | `app/` |
| Einrichtung | Voraussetzungen, Geschäftsdaten, Kassenablauf, Stripe-Freigabe, erstes Menü, Tische/Abholung, Tablet-Kopplung, Testbestellung, Aktivierung | `app/` |
| Lokale | Profil, Logo/Banner, Kontakt, Modus an/aus, Pausierung, Mitarbeitertablets, Bereitschaft | `app/` |
| Menü | Kategorien, Artikel, Bilder, Preise, Verfügbarkeit, Allergene/Zusatzstoffe, Varianten/Extras, Mengen-/Sortierlogik | `app/` |
| QR & Print | Tischzuordnung, Abholcodes, Vorlagen, Druckvorschau, A4-Vierfachdruck, Duplex, Scanprüfung | `app/` |
| Gast | Lokalidentität, Tisch/Abholung, Menü, Artikeldetails, Optionen, Warenkorb, freiwilliges Trinkgeld, Checkout (`/table/[businessId]/checkout`, `/pickup/[businessId]/checkout`), Zahlungsstatus, Bestätigung, Statusverfolgung | `app/` |
| Personal | Gekoppeltes Tablet, neue bezahlte Bestellungen, aktive/abgeschlossene Aufträge, Verfügbarkeit, Kassenerfassungsstatus, Verbindung/Fehler | `app/` |
| Betreiber | Übersicht, Aufträge, Filter, Kennzahlen aus verifizierten Daten, Auszahlungen/Gebühren, Erstattungen, POS-Abgleich, Einstellungen | `app/` |
| Hilfe | Suche, Kategorien, Artikel, aktuelle Screenshots, Problembehebung, Tickets, Anhänge, Kundenkommunikation | `support/` |
| Team | Übersicht, Regionalfilter, Betriebe, Aufträge, Tickets, private Notizen, Personal/Rechte, Partner, Newsletter, E-Mail-Logs, Audit | `internal/` |
| Website | Hero, Problem/Forschungsbeleg, QR-/Menü-/Personalproduktdarstellung, Hybrid-Service, Setup, Preise, FAQ, optional Gründerstory, Kontakt/Recht | `root/` |

Die Tabelle ist **kein Beweis für aktuellen Release-Reifegrad**. Sie beschreibt abzudeckende Aufgaben und Referenzen; Details stehen in Projekt-README und Code.

## 6. End-to-End-Journeys und fachliche Wahrheiten

### 6.1 Lokaleinrichtung

1. Betreiber:in meldet sich an und legt ein korrekt zugeordnetes Lokal an.
2. Prüft Voraussetzungen und persönlichen Kassenablauf; akzeptiert nur tatsächlich erforderliche freigegebene Dokumente.
3. Bindet eigene Zahlungsverarbeitung an; Status kann ausstehend, eingeschränkt oder aktiviert sein.
4. Pflegt Menü-Kategorien, Artikel, Fotos, Preise, Optionen, Allergene und Verfügbarkeit.
5. Konfiguriert Tisch- und/oder Abholangebot; erzeugt neutrale, schwarz-weiße QR-Karten und prüft Scans.
6. Verbindet geeignetes Personal-Tablet mit begrenzten Personalrechten.
7. Führt einen kontrollierten Testdurchlauf aus; aktiviert erst nach wirklich erfüllten Pflichtvoraussetzungen.
8. Kann den digitalen Kanal pausieren, ohne die vorhandene Kasse abzuschalten.

**Design-Konsequenz:** Schritte nach menschlichen Aufgaben und nicht nach Datenbanktabellen gliedern. Welche Felder zwingend sind und wie Schrittzustände technisch berechnet werden, steht in `app/` bzw. `docs/`, nicht in `DESIGN.md`.

### 6.2 Tisch / Abholung / Bezahlung

1. Gast scannt den **zum Tisch oder zur Abholung passenden** Code; QR enthält keine Admin-/Kopplungsgeheimnisse.
2. Browseransicht zeigt erkennbar **Logo/Name des Lokals** und den Kontext Tisch oder Abholung.
3. Menü bietet Artikel mit realen Preisen, verfügbaren Optionen und erforderlichen Produktinformationen.
4. Artikelwahl aktualisiert Warenkorb verständlich; Optionen/Zusatzkosten sind vor Kauf sichtbar.
5. Vor Bezahlung: vollständige Zusammenfassung, freiwilliges Trinkgeld (auch 0), tatsächlicher Gesamtpreis und klarer rechtskonformer Bestellbutton (`Zahlungspflichtig bestellen`).
6. Checkout/Provider bearbeitet Zahlung; Zwischenzustand „wird geprüft“ ist **nicht** „bezahlt“.
7. Erst nach verifizierter Zahlung erscheinen Bestell- und Zahlungsbestätigung und bezahlter Arbeitsauftrag. Anzeige von Bestellnummer, Zeitpunkt, Lokal, Tisch/Abholung, Positionen, Summe und nächstem sinnvollen Schritt.
8. Das Personal führt den Auftrag aus und erfasst den Umsatz **einmal** im vorhandenen Kassenablauf; Gäste erhalten die dafür rechtlich nötigen Lokalbelege separat.

### 6.3 Service und Unterbrechungen

- Bei Verbindungsverlust: sichtbare Statusmeldung mit Wiederverbindungs-/Nachprüfpfad; keine vorgetäuschte Offline-Zahlung oder Löschung bereits bezahlter Aufträge.
- Pausierter/deaktivierter Tisch-QR: sichere Aufklärung im Browser, kein Sprung in ein anderes Lokal.
- Doppelt eintreffende Zahlungsereignisse: kein doppelter bezahlter Auftrag.
- Bereits bezahlter Auftrag am Personal-Tablet: niemals „noch kassieren“ suggerieren.
- Kassenerfassung und Zubereitungsstatus sind getrennte Bedeutungen; die tatsächliche zulässige Reihenfolge ist fachlich festzulegen.
- Ticketkommunikation trennt öffentlich sichtbare Antworten von ausschließlich internen Notizen.

## 7. Daten, Rollen und technische Grenzen (Übersicht)

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next-intl`, Base UI (`@base-ui/react`) als einzige interaktive Primitive-Basis; Hosting/Runtime gemäß Projektkonfiguration mit Cloudflare Workers und `vinext`. **Verbindliche Designvorgaben:** selbst gehostete Inter-Schrift, dekorative Zackisch-Schrift nur für seltene Display-Akzente und zentrale Zackisch-Tokens in [`DESIGN.md`](DESIGN.md) und `assets/zackisch/tokens.css`. Jede Anwendung besitzt eigene `package.json` / Version.

**Backend:** gemeinsame Convex-Bereitstellung unter `app/convex/` für Berechtigungen, Daten, Echtzeit und Dateizugriff; keine zweite improvisierte Datenspeicherung für Support oder Team. **Stripe Connect** verarbeitet die für das Lokal unterstützten Zahlungen. Geschäftskritische Beträge und Status nicht clientseitig zur Wahrheit erklären. E-Mails über den vorgesehenen Unternehmensdienst und serverseitige freigegebene Aktionen.

**Fachliche Datenbereiche laut Repo-Schema** (als Navigation, nicht als Vorgabe zur Umstrukturierung): `regions`, `businesses`, `menuCategories`, `menuItems`, `orders`, Sitzungen, Medien, `supportTickets`, Team-/Partnerdaten, Zahlungs-/Gebührennachweise, Consent-/Rechtsversionen, Newsletter-/E-Mail-Logs, Auditkontext. Änderungen an Speichermodell oder Backend gehören **nicht** in `DESIGN.md`; sie benötigen Architekturprüfung, Datenmigration und Regressionstests.

**Rechte:** Gast nur freigegebene eigene Bestell-/Statusdaten; Betreiber:in nur autorisierte Lokale; Personal-Tablet nur gekoppelte Arbeitsfunktionen; Supportticket-Absender nur eigene Vorgänge; internes Team nur verifizierte Region/Rolle/Einzelrechte. UI-Verbergen allein ist **kein** Zugriffsschutz.

**Sprachen/Regionen:** Deutschland Startregion `de`, deutsch `/de-de` und englisch `/de-en`; Sprache ist nicht die rechtliche Geschäftsregion. Date-, Currency-, Number-Formate lokalisiert; Übersetzungsfähigkeit auch für Fehler, QR-Beschriftung, E-Mails und Screenreader-Texte. Weitere Regionen nur nach tatsächlicher fachlicher Vorbereitung.

**Betrieb/Sicherheit:** Session- und Rollenprüfung, sichere Webhooks, Idempotenz, personenbezogene Daten und Anhänge, Rate Limits, private Supportnotizen, Konfiguration/Secrets, Audits, Backups und Wiederherstellung werden in den zugehörigen Fachdokumenten spezifiziert, niemals aus Gestaltungselementen abgeleitet.

## 8. Website `root/`: inhaltliche und technische Produktspezifikation

### 8.1 Primäres Ziel

Eine **seriöse, merkfähige, reduzierte Marketingwebsite für Betreiber:innen**, die in wenigen Augenblicken erklärt: Was ist Zackisch? Welches Gastproblem zeigt die Forschung? Warum beschäftigt es das Lokal? Wie funktioniert die zusätzliche Bestellmöglichkeit? Was braucht das Lokal? Was kostet die Nutzung? Wie startet man?

**Conversion-Ziel:** informierter Einstieg in die Selbstregistrierung. **Kein Potenzial-/Umsatzrechner**, keine erfundenen Modellwerte, keine versprochenen Mehrumsätze, keine Pseudo-Live-Kennzahlen, kein B2C-Login auf der Marketingseite.

### 8.2 Komprimierter, redaktionell begründeter Inhalt

Dies sind Inhaltsprioritäten, keine Pflichtzahl an Sections. **Reihenfolge und visuelle Inszenierung ausschließlich in `DESIGN.md`.**

- Produkt: QR öffnen, Lokal-Menü entdecken, Optionen auswählen, digital bezahlen; bezahlter Auftrag auf Personal-Tablet; persönliche Betreuung und bestehende Kasse bleiben.
- Problem: Warten vor Erstbestellung, bei Nachbestellung und Bezahlung kann Gäste frustrieren. Nicht daraus eine garantierte Umsatzeinbuße oder Zackisch-Rettungsquote ableiten.
- Hybrid: Digitaler Kanal **optional**; wer persönlich bestellen oder bar zahlen möchte, kann sich an das Personal wenden. Keine Behauptung, dass Personal ersetzt wird.
- Einrichtung: Betrieb, Zahlungskonto, Menü, Tische/Abholung, QR-Druck, Personal-Tablet, Test. Kein proprietäres Gerät erforderlich.
- Gebühren: 0 € Zackisch-Setup, 0 € monatliche Zackisch-Grundgebühr, vertragliches 2-%-Modell zzgl. tatsächlicher Zahlungsabwicklungsgebühren; klare Einschränkungen, keine fingierte Vergleichstabelle mit Wettbewerbern.
- Differenzierende Funktionen: anwendbare Extras/Varianten, Verfügbarkeiten und ggf. tatsächlich verfügbare, datengestützte Empfehlungen. **Keine KI-Versprechen, keine Software-Screens, die nicht existieren.**
- Vertrauen: überprüfbare Forschung und Quellen, ehrliche Grenzen, echte Menschenbilder statt Fantasie-Kundenstimmen; rechtliche Dokumente, Support, reale Kontaktdaten.
- Gründerstory **optional** als glaubwürdiger menschlicher Einblick; keine künstlich erfundene Teamgröße oder Partnergarantie.

### 8.3 Routen und Inhaltszuordnung

Region/Sprache vor den öffentlichen Unterseiten, **englische Slugs in beiden Sprachfassungen**.

| Pfad je Sprachfassung `/{locale}` | Aufgabe |
|---|---|
| `/` | Homepage mit vollständigem Grundverständnis, Call to Action |
| `/pricing` | Klarer Preis-/Voraussetzungskontext ohne Rechner |
| `/research` | Studien, Methode, Kernaussage, Grenzen der Übertragung |
| `/contact` | Echte Kontaktmöglichkeit und Support-Einstieg |
| `/legal-notice` | Impressum und Anbieterkennzeichnung |
| `/privacy`, `/privacy-policy` | Datenschutzerklärung für Website und Plattform |
| `/gtc` | Allgemeine Geschäftsbedingungen für Betreiber:innen (B2B-Vorlage) |
| `/guest-terms` | Nutzungs- und Bestellhinweise für Gäste |
| `/data-processing` | Auftragsverarbeitungsvereinbarung (AVV / Art. 28 DSGVO) inkl. technischer und organisatorischer Maßnahmen |
| nicht gefundene Route | lokalisierte echte 404, keine willkürliche Homepage-Weiterleitung |

`/{locale}` steht anfangs für `de-de` und `de-en`. Externe Ziele werden vor Launch auf Erreichbarkeit, echte Route und Datenschutz geprüft: `app.zackisch.com` (Registrierung/Login), `support.zackisch.com` (Hilfe), `mailto:selim@zackisch.com` (Kontakt), sofern als offizieller Kontakt freigegeben. Newsletter-Einstieg nur verlinken/anzeigen, wenn er im Produkt wirklich existiert und die Einwilligungen stimmen. Auf reine Informationsseite keine App-/Checkout-/Supportdaten ohne zulässigen Zweck laden.

### 8.4 Inhalte, Beweise und Medien-Fallback

- **Originalprodukt-Aufnahmen fehlen / sind unvollständig:** Auf Homepage und Produktseite je ein bewusst neutraler **grauer Platzhalter** mit konkreter Beschriftung anstelle erfundener Screens: `Hier kommt: QR-Aufsteller`, `Hier kommt: Gäste-Menü`, `Hier kommt: Personaltablet – neue bezahlte Bestellungen`. Platzhalter sind ein Entwicklungs-/Prelaunch-Zustand, keine fertigen öffentlichen Testimonials. Ersetzt werden sie **erst durch echte freigegebene Screens, QR-Druckvorlage oder eindeutig als Simulation gekennzeichnete illustrative Demo**.
- Personenfotos: reale, passend kommerziell lizenzierte und dokumentierte Fotos aus Gastronomie-Kontexten; **keine KI-generierten Bilder von angeblich echten Gästen/Teams**.
- Videos: optional und nur, wenn sie den tatsächlichen Ablauf erklären. Ohne echtes Material ein nichtautomatisch spielendes Poster/Platzhalter; keine generierte Interface-Aufnahme als tatsächliches Produkt.
- Studien: originale Ergebnisse, Link, Methode/Bezugsgruppe, Übertragbarkeit, Datum; keine Übernahme fremder Prozentzahlen als Zackisch-Leistungswerte.

**Visuelle Platzierung, Ratio, Motion, Typo und CTA-Regeln stehen allein in `DESIGN.md`.**

### 8.5 Funktionaler Website-Rahmen

Die Website in `root/` ist ein eigenständiges Next.js-Projekt und öffentlich vorwiegend statisch. Lokalisierte Inhalte, Canonical-/Hreflang-Metadaten, Crawlability, aussagekräftige Texte, Sitemap/Robots, rechtliche Seiten und Consent sind ausschließlich entsprechend real eingesetzten Diensten auszuführen. Keine Fake-Sterne, Bewertungen, Kundenlogos, Fallstudien oder „Live“-Produktdaten. Keine reale Bestellung, Zahlung oder Lokal-Session über Marketingdemos.

Es ist **kein komplexes interaktives Kalkulations-Tool** vorgesehen. Eine visuelle Produktsequenz ist nur dann interaktiv, wenn sie als Demonstration erkennbar und ohne Backend sicher nutzbar ist; reduzierte Bewegung und statische Variante müssen denselben Sachverhalt erklären. Marketingseiten dürfen keine produktive Stripe-/Convex-Zahlung auslösen.

## 9. Founder- und Markenherkunft (redaktioneller Quellkontext)

**Vom Projektbriefing bereitgestellte Informationen, vor Veröffentlichung freigeben:**

- **Gründer:** Selim Eser, im Briefing als Informatikstudent der Technischen Hochschule Mannheim beschrieben. Aktuellen Status und Namensnennung vor Veröffentlichung bestätigen.
- **Ausgangspunkt:** persönlicher Frust über Wartezeiten vor der ersten Bestellung und bei kleineren Nachbestellungen im Lokal. Daraus entstand die Idee eines ergänzenden QR-Bestellwegs.
- **Name:** „zackisch“ wird im Briefing als mannheimerischer/kurpfälzischer Ausdruck im Sinn von „zackig“ beschrieben. Als persönliche Markenherkunft darstellen, nicht als ungeprüfte sprachwissenschaftliche Tatsache.
- **Standortbezug:** Mannheim und das lokale Gründungsumfeld.
- **MARS Center of Entrepreneurship / TH Mannheim:** Im Briefing wird Unterstützung durch das MARS Center genannt. Art der Unterstützung und zulässige Logo-Nutzung mit dem Center verifizieren; **kein offizielles Produktsiegel oder Hochschulzertifikat** suggerieren.
- **Assets:** Echtes freigegebenes Gründerfoto und freigegebenes MARS-Logo können in einer optionalen About-Section erscheinen. Liegen sie nicht vor, keine künstliche Person oder Hochschulmarke erfinden; den Block entweder textlich halten oder vorerst weglassen.

**Content-Entscheidung:** Founder-Story ist **optional**, nicht das Zentrum der Homepage. Sie kann als kurzer glaubwürdiger Abschluss, About-Seite oder Redaktionselement wirken. Kein Pflicht-Werbeslogan, keine erfundenen biografischen Stationen.

## 10. Wissenschaftliche Grundlage, die kommuniziert werden darf

**Regel:** Forschung liefert Hinweise auf Problemmuster oder Wirkmechanismen. Sie belegt **nicht**, dass Zackisch mit seinen Funktionen die jeweiligen Effekte kausal erzielt, eine bestimmte Umsatzsteigerung erzeugt oder Personalkosten senkt.

| Quelle | Belastbare Aussage | Grenze / Website-Nutzung |
|---|---|---|
| [Lightspeed × Medallia, Deutschland-Umfrage (2025)](https://www.presseportal.de/pm/165632/6151909) | In der Befragung von rund 1.000 Erwachsenen in Deutschland gaben **27 %** an, wegen Wartezeiten schon einmal **vor der Bestellung ein Lokal verlassen** zu haben. | **Keine** Abbruchquote von 27 % pro Besuch und keine Zackisch-Wirkungskennzahl. Methodik: Selbstauskunft, Mai 2025, Auftraggeber/Interesse nennen. |
| [De Vries et al., *Worth the wait?* (2018)](https://doi.org/10.1016/j.jom.2018.05.001) | Analysiert Wartezeit und Verhalten von über 94.000 Gästen eines indischen Lokals; beobachtet Zusammenhänge u. a. mit Abbruch/Rückkehr. | Nicht auf alle deutschen Lokale oder QR-Bestellungen übertragen; kein Zackisch-Experiment. |
| [Li, Grahl & Hinz, *How Do Recommender Systems Lead to Consumer Purchases?* (2021/2022)](https://doi.org/10.1287/isre.2021.1074) | Randomisiertes Experiment **bei einem Online-Buchhändler**: Empfehlungen beeinflussten Kaufneigung und Warenkorbwert. | **Kein Gastronomie-Nachweis**; Zahlen nicht als Zackisch-Uplift vermarkten. |
| [Deutsche Bundesbank, Zahlungsverhalten 2025; publiziert 17.06.2026](https://www.bundesbank.de/de/presse/pressemitteilungen/zahlungsverhalten-in-deutschland-2025-964736) | 45 % der erfassten Zahlungen mit Bargeld, 55 % bargeldlos; **80 %** der Befragten halten fortgesetzte Barzahlmöglichkeit für wichtig. | Begründet Wahlfreiheit als gesellschaftlich relevantes Thema, nicht die Wirkung von Zackisch; Stichprobe/Methodik beachten. |
| [David Maister, *The Psychology of Waiting Lines*](https://davidmaister.com/articles/1/52/) | Klassisches konzeptionelles Modell subjektiv erlebter Wartezeit. | Kein aktueller randomisierter Zackisch- oder Gastro-Effekt. |

**Bevorzugter Website-Erzählweg:** „Gäste erleben Warten als Problem“ → „Das erzeugt Druck auf Serviceerlebnis und Abläufe im Lokal“ → „Zackisch bietet eine weitere, selbstbestimmte Art zu bestellen/bezahlen“. **Keine** Zahl zum angeblichen zusätzlichen Umsatz, zur Produktivität oder Kundenzufriedenheit **durch Zackisch** aus fremden Studien ableiten. Eine Research-Unterseite dokumentiert Studiendesign, Stichprobe, Datum, Ergebnis und Grenzen transparent. Erst danach darf eine einzelne präzise Zahl auf der Homepage hervorgehoben werden.

## 11. Bekannte A/B-Tests: Erkenntnisse und strikte Übertragungsgrenzen

A/B-Tests sind **keine allgemeinen Designgesetze**. Sie ermitteln lokale Effekte für eine bestimmte Zielgruppe, einen bestimmten Funnel und Zeitraum. Für Zackisch werden sie zur Formulierung von **Hypothesen**, nicht zur Übernahme fremder Gewinnerfarben oder fester Conversion-Prozente verwendet.

| Experiment | Öffentlich dokumentierter Befund | Übertragbare Hypothese, **kein Beweis für Zackisch** |
|---|---|---|
| [Obama-Kampagnen-Landingpage, Dan Siroker (2008)](https://optommy.wordpress.com/2010/11/29/how-obama-raised-60-million-by-running-a-simple-experiment/) | In dem beschriebenen Test schnitt das **Familienfoto + „Learn More“** gegenüber dem Ursprungsstand um **40,6 %** besser bei E-Mail-Anmeldungen ab; Videos verloren dort gegen Standbilder. | Nicht automatisch Video statt Foto oder einen aggressiven CTA bevorzugen. Bei Zackisch: **klarer, verständlicher Hero mit echter menschlicher Aufnahme** zuerst; Produktfilm nur, wenn er zusätzliche Erklärung bringt. |
| [Microsoft/Bing, Online-Experiment (2012), beschrieben in HBR 2017](https://hbr.org/2017/09/the-surprising-power-of-online-experiments) | Kleine Änderung an der Darstellung von Anzeigenüberschriften erhöhte in diesem Bing-Test Umsatz um **12 %** ohne gemeldeten Schaden für wichtige Nutzerkennzahlen. | Verständliche Headline-/CTA-Varianten testen; nicht annehmen, dass „mehr Design“ besser ist. **Keine** erwartete 12-%-Verbesserung für Zackisch. |

**Verwandte UX-Evidenz, aber keine einzelnen Zackisch-A/B-Tests:** [Baymard, Checkout UX 2025](https://baymard.com/research-articles/current-state-of-checkout-ux) zeigt bei E-Commerce-Tests unnötige Abbrüche durch Konto-Zwang und schlecht erkennbare Gastbestellung; dies unterstützt den absichtlich accountlosen Gast-Flow. [NN/g, Auto-Forwarding Carousels](https://www.nngroup.com/articles/auto-forwarding/) zeigt Probleme automatisch wechselnder Hero-Inhalte; Zackisch nutzt stattdessen einen kontrollierbaren statischen Hero. Kein Vergleich mit echten Gastro-Gästen.

### Vorschlag für eigene Experimente nach Freigabe

1. **Website-Hero:** realer Gastro-Alltag + unmittelbar verständlicher Produktbezug **versus** ruhigere statische Produktillustration. Primärmaß: qualifizierte Registrierungsstarts, Guardrails: Verständnis, Supportfragen, Qualität der Registrierungen.
2. **CTA-Wording:** aufgabenorientiert `Kostenlos registrieren` versus `Zackisch einrichten`; nicht übertrieben, beide mit identischem tatsächlichem Ziel. Primär: qualifizierte Registrierungsstarts; Guardrails: Fehlklicks/Abbrüche.
3. **Produktdarstellung:** statischer QR→Gast→Tablet-Ablauf versus steuerbare gestufte Demo. Primär: Produktverständnis und Startentscheidung; Guardrails: Ladezeit, Reduced Motion, Fehldeutung als Live-Produkt.
4. **Gast:** Position des Warenkorb-CTA oder Menü-Kategoriestruktur nur mit ausreichend Daten und ohne Bezahl-, Datenschutz- oder Accessibility-Verschlechterung testen. **Nie** unnötige Reibung, Trinkgeld-Voreinstellung >0 oder manipulative Zahlungsexperimente.

**Methodik:** Vorab Hypothese, primäre Metrik, Guardrails, Stichprobenschätzung und Laufzeit festlegen; A/A- und Tracking-Validierung; Randomisierung pro geeigneter stabiler Einheit; Segmentierung nach Mobile/Desktop und Lokal nur bei ausreichender Teststärke; keine vielen unkontrollierten Varianten / vorschnelle Testabbrüche. Bei geringem Website-Traffic eher moderierte Zielgruppen-Tests (5–8 echte Betreiber:innen je Runde) und Aufgabenstudien statt vorgeblich „signifikanter“ A/B-Statistiken. Vorherige Evidenz ist eine Designbegründung, **kein Performanceversprechen**.

## 12. Markt- und Wettbewerbsbeobachtung (Inspiration, keine Funktionsübernahme)

- [me&u: Order & Pay](https://help.meandu.com/hc/en-us/articles/6539840287759-Introduction-to-Order-Pay-Pick-up-Delivery) bietet als Referenz für Produktauswahl, visuelles Menü und QR-Entry eine nützliche Beobachtungsfläche. Aussagen zu Umsatzanstieg auf Anbieterseiten **nicht** als allgemeine Evidenz oder Zackisch-Ziel übernehmen.
- [SO’USE: Order & Pay](https://www.so-use.de/de/order-pay) zeigt verschiedene Service-/Zahlungsmodelle und starke Lokalorientierung. Beworbene Kassenintegrationen/Services sind nicht automatisch Teil von Zackisch.
- [PayPal Deutschland](https://www.paypal.com/de/home) und [Stripe](https://stripe.com/de) als Qualitätsreferenz für verständliche Produkt-/Vertrauenskommunikation, **nicht** als Copy-/Layoutvorlage.
- [Base UI](https://base-ui.com/react/overview/about), [GOV.UK Design System](https://design-system.service.gov.uk/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/) als technische und ergonomische Referenz. Wie diese Quellen **visuell** umgesetzt werden, bestimmt `DESIGN.md`.

## 13. Technische Website-Anforderungen: `root/`

**Soll-Routen:** Deutsch `/{country}-{language}` mit `de-de` und `de-en`; englische URL-Slugs für beide Sprachen. Root `/` darf kontrolliert zu einer Locale führen. Lokalisierte, echte 404-Seiten statt Home-Fallback; Canonical und hreflang passend, Sitemaps nur für freigegebene indexierbare Seiten. Empfohlene Informationsziele: Homepage, Preise, Forschung/Quellen, Kontakt/FAQ, rechtliche Seiten. **Keinen künstlichen Seitenkatalog anlegen, wenn die Homepage oder Support-Seite die Information besser enthält.**

**Technik:** Next.js App Router, TypeScript, `next-intl`, Tailwind-Tokenlayer, Base UI; vorwiegend statische Inhalte für Cloudflare Workers/vinext. Keine Backend-Einführung nur für Marketing-Illustrationen. Consent nur für tatsächlich verwendete tracking-/einwilligungsrelevante Dienste. Newsletter nur bei vorhandener funktionierender Einwilligungs- und Versandstrecke. Hero-Demo kann lokal/statisch sein; niemals Stripe/Convex-Live-Vorgänge vortäuschen. Offizielle Linkziele nach tatsächlicher Erreichbarkeit festlegen.

**SEO/Inhalte:** verständliche einzigartige Meta-Titel (`Seitentitel – Zackisch`), Beschreibungen, semantische HTML-Struktur, strukturierte Daten nur für reale Sachverhalte, gute Crawlability, `robots`/Sitemap je public/private, echte Alt-Texte, funktionierende Locale-Verknüpfungen, reproduzierbarer Link-Check. Nur freigegebene Rechtstexte veröffentlichen; fiktive Impressums-/Registerdaten sind unzulässig.

**Performance:** Bilder optimieren und responsive laden; Schriftladeverhalten stabil; keine Core Web Vitals garantieren, sondern auf echten Geräten messen. Scroll-Story darf die Seite weder blockieren noch benötigte Elemente für Screenreader verstecken; reduziert bewegte Alternative. Bilder-/Motion-Regeln und konkrete visuelle Story stehen in `DESIGN.md`.

## 14. QR-Aufsteller und Export: technische Anforderung, Design in `DESIGN.md`

**Physische Zielkarte:** 92 × 135 mm, Hochkant, vier Karten auf A4 (2 × 2). Bei 4 mm Zwischenraum bleiben 11 mm Seitenrand und 11,5 mm oberer/unterer Rand. Standard: 1-seitig, Schwarz auf Weiß, echter scannbarer QR mit mindestens 4 Modulen Ruhezonen-Abstand. QR-Link verweist eindeutig auf **das richtige Lokal und den richtigen Tisch bzw. Abholmodus**; keine Staff-Tokens, Sessiongeheimnisse, Kundendaten oder Zahlungstoken im Code. Code-Vektorqualität/Scanprüfung nötig.

**Karteninhalt:** einmal kleine **Zackisch Combination Mark**, kurze Ablaufzeile `Scannen · Bestellen · Bezahlen`, große QR-Matrix, **Tisch 04** bzw. **Abholung**, optionale kurze funktionale Kamera-/URL-Hilfe und gut lesbarer Hinweis auf persönliche Bestellung/Service. **Kein Name und kein Logo des Lokals**, keine künstlich dekorierten QR-Module, keine Fotos. Das Gäste-Frontend dahinter zeigt jedoch Lokalname und -logo.

**Duplexdruck:** Nutzer:in wählt einseitig/zweiseitig und (für gängige A4-Hochkantdrucker) **an langer Kante wenden**. Zuordnung bei Frontseite `A B / C D`: Rückseite im Druckseitenlayout `B A / D C` (horizontale Spiegelung der **Kartenpositionen**, nicht Spiegeln von Text/QR). Der Druck-Wizard muss eine Preview für beide Seiten, Duplex-Testblatt, Platzhalter für weniger als 4 Karten und klare 100-%-Druckmaß-Anleitung anbieten. Bei anderer Druckerwendekante kann eine andere Permutation nötig sein; **physisch prüfen**, nicht als universelles Druckergesetz ausgeben.

**Tests:** QR nach finalem Druck unabhängig decodieren und exakten Zielpfad vergleichen, 1/2/3/4/8+ Karten, Tisch↔Abholung, lange Labels, Graustufendruck, Lichtreflexe, Laminierung, unterschiedliche Kamera-Apps, tatsächliche Duplex-Ausrichtung und Schneidkanten. Details siehe [`docs/qr-and-print.md`](docs/qr-and-print.md); UI-Anatomie, Schrift-/Freiraumregeln und Kartenvarianten stehen in `DESIGN.md`.

## 15. Hilfe-Center und Team: Funktionsanforderungen

### Hilfe-Center `support/`

Öffentliche Suche, verständliche Kategorien, Tutorials zu Voraussetzungen, Einrichtung, Stripe, Menüpflege, Varianten, QR-Druck, Tablet-Kopplung, Test, Gebühr/Kassenabgleich und Störungen. Artikel zeigen echte aktuelle UI-Schritte, Voraussetzungen, konkrete Erfolgskontrolle und Troubleshooting. Login nur für persönliche Ticket-Threads/Anhänge. Tickets mit Status, Chronologie, öffentlichen Antworten, internem Verantwortlichen und strikt getrennten internen Notizen; ein Kunde darf interne Notizen niemals sehen. Verbindliche Artikel-/Workflow-Liste: [`docs/support-content.md`](docs/support-content.md).

### Team-Dashboard `internal/`

Regionale Rollen mit 2FA, explizite Einzelrechte, übersichtliche Geschäfts-/Bestell-/Ticketdaten, Partner/Provisionen, Newsletter und E-Mail-Logs, Audit. Internes Ticket mit Kundenantwort **oder** privater Notiz sind unterschiedliche erlaubnispflichtige Aktionen; öffentliche Ticketantwort ist keine private Notiz. Aktivitäten und sensible Änderungen werden nach tatsächlichen Policies protokolliert; Screens dürfen nicht nur optisch Zugriff „einschränken“. Visuelle Tabellen-/Filter-/Detailpatterns stehen in `DESIGN.md`.

## 16. Dokumentationshierarchie und Arbeitsweise für Entwicklungsagenten

1. `/README.md` (**diese Datei**): zentrale Produktidee, Stakeholder, fachliche Regeln, Forschung, Gründerkontext, Technologielandschaft und vollständige Funktionsinventur.
2. `/DESIGN.md`: **einzige** normative visuelle Quelle für alle vier Projekte, UI-Semantik, Komponenten, White Label, Mascot, QR-Print-Layout und Marketing-Art-Direction.
3. `root/README.md`, `app/README.md`, `support/README.md`, `internal/README.md`: **projektspezifische** Start-/Build-/Integrationsinfos, technische Routen, Grenzen und Feature-Reife.
4. `AGENTS.md` im Root und in Projekten: lokale Agent- und Entwicklungsregeln; nicht zur Ablage konkurrierender Brand-Tokens verwenden.
5. `docs/*`: verbindliche Architektur-/Security-/Payment-/POS-/Steuer-/Rechts-/QR-/Support-/Testverträge. Bei technischem Konflikt ist die aktuelle verifizierte Implementierung/Fachfreigabe ausschlaggebend, nicht eine durch Design eingeführte Fantasieannahme.

**Agent-Ablauf:** README und DESIGN lesen → zuständiges Projekt-README/AGENTS sowie Fachdocs öffnen → vorhandene Ist-Funktionen und tatsächliche Rechte/Providerzustände prüfen → Oberfläche im gemeinsamen Paper-Projekt `Zackisch` entwerfen/prüfen und **visuell** nach DESIGN mit Base UI bauen → semantisch passende zugängliche Primitive verwenden → Übersetzungen, echte Daten und Zustandsgrenzen korrekt anbinden → Tastatur-/Mobil-/Tablet-/Print-/Screenreader-Tests → dokumentierte Abweichungen und offene Rechts-/Produktfragen markieren. Keine Legacy-Farben, -Fonts, -Radien oder -Komponentenoptik übernehmen; **nicht** ohne gesonderten Auftrag Datenmodell/Zahlungsmodell umbauen.

### Repo-Entwicklung, Versionen und Qualitätsgrenzen

- Projekte besitzen unabhängige Manifest-/Lockfile-Versionen; aktuelle Kommandos **in den jeweiligen Projekt-READMEs und `package.json` nachsehen**, nicht hier veraltete Skripte fixieren.
- Tests je betroffenem Projekt: Build, Typecheck, Komponenten-/Interaktions-Tests, Lokalisierung, Accessibility, E2E; bei Zahlung/Bestellung zusätzlich Berechtigungs-, Idempotenz-, POS-/Gebühren- und Ausfalltests gemäß `docs/testing-and-release.md`.
- Geheimnisse nie einchecken; getrennte Entwicklungs-/Preview-/Produktivumgebungen und Nachweis tatsächlicher getesteter Konfiguration.
- Es gelten die im Repository dokumentierten Commit-/SemVer-Regeln (`Selim Eser <semmel5533@gmail.com>`, englische kleingeschriebene Vergangenheitsform ohne `feat:`-Präfix und ohne Punkt). Bestehende besondere Freigaben für einen Major Release (`1.0.0`) sowie Produktivaktionen nicht durch ein Design-Refactoring umgehen.
- **Vor Freigabe** von Preis-, Werbe-, Gründer-, Datenschutz-, Steuer- und Providerangaben: aktuelle Quellen und verantwortliche Prüfer:innen einbeziehen. README ist kein Rechtsgutachten.

### Quellenregister (ergänzend zu den direkt verlinkten Studien)

- [Repository](https://github.com/semmel5533/Zackisch) · [`docs/architecture.md`](docs/architecture.md) · [`docs/security.md`](docs/security.md) · [`docs/testing-and-release.md`](docs/testing-and-release.md) · [`docs/operations.md`](docs/operations.md)
- [`docs/privacy-and-data-governance.md`](docs/privacy-and-data-governance.md) · [`docs/localization-and-compliance.md`](docs/localization-and-compliance.md) · [`docs/backups-and-recovery.md`](docs/backups-and-recovery.md)
- [`docs/germany-legal-and-regulatory.md`](docs/germany-legal-and-regulatory.md) · [`docs/payments-and-stripe.md`](docs/payments-and-stripe.md) · [`docs/tax-invoicing-and-fiscalization.md`](docs/tax-invoicing-and-fiscalization.md) · [`docs/legal-pages-consents-and-contracts.md`](docs/legal-pages-consents-and-contracts.md)
- [Base UI](https://base-ui.com/react/overview/about) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [GOV.UK Fehlerverhalten](https://design-system.service.gov.uk/components/error-summary/) · [Baymard Checkout-UX](https://baymard.com/research-articles/current-state-of-checkout-ux)

## 17. Technische Architekturprinzipien (alle vier Projekte)

**Ist-Bestand zum Abgleich:** vier Next.js-16-/React-Frontends (`root/`, `app/`, `support/`, `internal/`) auf Cloudflare Workers/vinext, gemeinsames Convex-Backend ausschließlich unter `app/convex/`, Stripe Connect, E-Mail-/Workspace-Dienste. Die genaue installierte Version und reale Produktivkonfiguration sind jeweils gegen die aktuellen Projekt-`package.json`, `wrangler`-Konfigurationen, Umgebungsvariablen und Deployments zu prüfen. Öffentliche Marketingseiten bleiben vorzugsweise vorgerendert und cachebar. Dies ist eine **Soll-/Ist-Architekturübersicht**, keine Zusage über den Produktivstatus aller Funktionen. Details: [`docs/architecture.md`](docs/architecture.md).

**Zentrale Architekturregeln:**

1. **Ein Backend, vier klar begrenzte Frontends.** Keine zweite Convex-Datenbasis und kein neues universelles Metaframework. Domain-Logik serverseitig, UI-Primitives im Browser. UI kennt keine Secrets.
2. **Vertrauensgrenzen sind wichtiger als die Route.** Browser → validierte Server Action / vertrauenswürdiger Next-Boundary → authz-geprüfte Domänenoperation → Convex oder signierter Provider-Call. Bei jeder privaten Operation Actor, Rolle, Lokal/Betrieb, Region, Ressource und Aktion serverseitig prüfen. Client-IDs, Preise oder Filter sind keine Autorität.
3. **Serverautoritative Zahlungen.** Preise aus kanonischem Menü neu bestimmen; Stripe-Webhook-Signatur prüfen; idempotente Zahlungen/Orders/Refunds; gastseitige Redirects allein beweisen keine Zahlung. Personaltablet zeigt nur verifiziert bezahlte Bestellungen, manueller Kasseneintrag wird gesondert bestätigt. Keine Kartendaten in Convex.
4. **Lokal- und Regionsgrenzen.** Öffentliche Menü-DTOs per Allowlist, kein ungefiltertes Lesen anderer Lokale. Support-Tickets trennen öffentliche Nachrichten und interne Notizen **in der Datenzugriffsschicht**, nicht nur per unsichtbarem UI. Team-Dashboard mit eigenen Rollen, 2FA und Regionen; nicht die gewöhnliche Betreiber-Session übernehmen.
5. **Zustandsmaschinen statt lose Flags.** Account-Einrichtung, QR-Pairing, Bestellung, Zahlung, Erstattung, Ticket und E-Mail-Zustellung haben explizite Übergänge/Fehler-/Retry-Fälle; externe Nebenwirkungen idempotent und nachvollziehbar.
6. **Modulgrenzen:** `domain` (fachliche Verträge), `actions` (auth, validation, vertrauenswürdiger Eintritt), `components` (Präsentation), `lib` (schmale Adapter/Utilities); gemeinsame Tokens/Interfaces nur dort auslagern, wo reale Drift reduziert wird. Server-only-Code nicht in Browser-Bundles ziehen. Keine riesigen Allzweckmodule und keine Wrapper ohne echte Verantwortung.
7. **Versionierte Infrastruktur ohne Geheimnisse.** Konfiguration/Deploy-Skripte in Git; Secrets ausschließlich beim Provider. Production/Staging/Preview strikt getrennt. Cloudflare/vinext-Runtime und aktuell installierte Next.js-Docs prüfen – Node-API-Verfügbarkeit nicht voraussetzen. Keine Produktiv-Restores, echten Zahlungen oder Mail-Broadcasts ohne Zustimmung.
8. **Fehlertoleranz:** Weder erfundene Offline-Bestellungen noch falsche „erfolgreich bezahlt“-Meldungen; bestehender Service/Kassenablauf muss auch bei Plattformausfall fortbestehen. Zahlungsprovider bleibt Quelle finanzieller Wahrheit, nicht Client-Caches.

### Domänenspezifische Verantwortung

| Projekt | Zuständig | Nicht zuständig |
|---|---|---|
| `root/` | SEO, öffentliche Inhalte, belegte Website-Story, Preise, Impressum/Datenschutz/Rechtsseiten, CTAs zu Signup und Support | Gastbestellung oder Zahlungsledger |
| `app/` | Betreiber-Setup, Lokale, Menü, Artikel, Preise, QR-/Druckverwaltung, Gäste-Checkout, Personal-Tablet, Convex-Domäne | Ersatz des existierenden Kassensystems |
| `support/` | öffentliche, lokalisierte Hilfeseiten; private Tickets, Anhänge und sichere Antwortwege | globale Admin-Ansicht oder Ticket-Notizen für Kunden |
| `internal/` | autorisierte Team-/Regionsrollen, Betriebs-/Bestellübersicht, Tickets, Partner, Newsletter, Audit, E-Mail-Logs | ungescopter globaler Zugriff oder Gästefrontend |

### Pflichtprüfungen bei Querschnittsänderungen

- API-/Contract-Kompatibilität auf allen beteiligten Projekten; allfällige Backend-Änderungen dürfen keine stillen UI-Behauptungen erzeugen.
- `npm`-Build, Typecheck/Lint soweit konfiguriert, Domain-Unit-Tests, Convex- und Permission-Negativtests, Provider-Event-Retry-Tests, E2E der Gastzahlung, QR-Druck-Tests, Screenreader-/Mobile-/Tablet-Reflow.
- Observability mit datensparsamer strukturierter Protokollierung; keine Zahlungstoken, OTP, Anhänge oder Kunden-PII in Logs.
- Keine Aussage „sicher“, „DSGVO-konform“, „GoBD-konform“, „BFSG-konform“ oder „TSE-frei“ ohne unabhängige Prüf- und Freigabegrundlage.

## 18. Datenhaltung: Zwecke, Aufbewahrung, Löschung und Wiederherstellung

**Verantwortung:** Die fachlichen Daten und gesetzlichen Pflichten sind nicht identisch. Zackisch ist für eigene Kunden-, Vertrags-, Support- und Betriebsvorgänge typischerweise eigenständig verantwortlich; für lokalseitige Gästebestell- und Menüinformationen können Auftragsverarbeitung und eigene Plattformzwecke nebeneinander vorliegen. Für jede Verarbeitung muss die Rolle samt Rechtsgrundlage, AVV/DPA, Empfängern, Region, Löschfrist und Löschverantwortung dokumentiert und freigegeben werden. Vor dem produktiven Umgang mit Echtgeld und realen personenbezogenen Daten: [`docs/privacy-and-data-governance.md`](docs/privacy-and-data-governance.md) vollständig gegen Datenbank, Uploads, Logs, Stripe, Cloudflare, Workspace und Backups inventarisieren.

**Quellenstand (23.10.2026):** [DSGVO Art. 5, 6, 17, 28, 30, 32–34](https://eur-lex.europa.eu/eli/reg/2016/679/oj) fordert u. a. Zweckbindung, Datenminimierung, Speicherbegrenzung und angemessene Sicherheit. [§ 14b UStG](https://www.gesetze-im-internet.de/ustg_1980/__14b.html) bestimmt grundsätzlich **8 Jahre für Rechnungen**; [§ 147 AO](https://www.gesetze-im-internet.de/ao_1977/__147.html) und [§ 257 HGB](https://www.gesetze-im-internet.de/hgb/__257.html) unterscheiden je nach Dokumententyp **10/8/6 Jahre**. Fristbeginn häufig Schluss des Kalenderjahres des maßgeblichen Ereignisses; gesetzliche Sonderregeln, laufende Verfahren und Legal Holds prüfen. **Ein Bestelldatensatz ist nicht automatisch in sämtlichen Feldern ein acht Jahre zu speichernder Rechnungsbeleg.**

### Kategorienbasierte Retention-Entscheidung (Sollkonzept, vor Produktion zu genehmigen)

| Datenkategorie | Aufbewahrungslogik / vorgeschlagene technische Voreinstellung | Lösch-/Archivierungsgrenze |
|---|---|---|
| Offene Gast-Warenkörbe, anonyme Sitzungen | nach Inaktivität kurz halten; **Vorschlag: 24 Stunden** | Ablauf automatisch löschen; nicht in Steuerarchiv mischen |
| Begonnener/abgebrochener Checkout, temporäre Checkout-Session | kurze Fraud-/Retry-Frist; **Vorschlag: 72 Stunden** für nicht gebuchte Sessions | bezahlte Transaktion wechselt in eigenständige finanzielle Kategorie |
| OTP, Pairing-Codes, Einmallinks | nur wenige Minuten nutzbar; **Vorschlag: 10 Minuten**, wenige Wiederholungen | nach Einlösung/TTL ungültig, Hash/Token sicher entfernen; Sicherheitsereignis ggf. separat |
| Nicht bestätigte Registrierung | **Vorschlag: 14 Tage** mit rechtmäßiger Löschinformation | kein dauerhafter Profilfriedhof |
| Betreiberkonto, lokale Stammdaten, Einstellungen | während aktiver Vertrags- und Betriebsbeziehung | bei Kündigung/Antrag aktive Daten löschen oder anonymisieren, soweit keine Sonderpflicht |
| Artikel, Menüs, Fotos, Branding des Lokals | solange für aktives Angebot erforderlich | nach Entfernung und festgelegtem kurzen Wiederherstellungsfenster löschen; auch Medienkopien/CDN beachten |
| Bestell- und Zahlungssnapshots | kauf-/steuer-/streitrelevant **nur in erforderlichen Feldern**; gesetzliche Kategorie und Rollenabgrenzung pro Datensatz bestimmen | buchungsbelegrelevante Daten bei einschlägiger Pflicht 8 Jahre, ggf. 10 Jahre für andere Aufzeichnungen; keine unnötigen Gastfelder mitschleppen |
| Zackisch-eigene B2B-Rechnungen und Buchungsbelege | achtjährige Rechnungspflicht bzw. ggf. zehnjähriges Buch je Art | revisionssicher, maschinell lesbar, nach Frist/Legal Hold löschbar |
| Erstattungen, Chargebacks, Gebühren-, Steuer- und POS-Abgleich | rechtliche Belegklasse und Streitlaufzeit zuordnen | Ledger-/Snapshot-Historie geschützt; keine unbegrenzten Roh-Webhook-Payloads |
| Support-Tickets und Anhänge | zweckgebunden; **Vorschlag: 24 Monate nach Abschluss** ohne Rechts-/Finanzsperre | personenbezogene Bilder/Anhänge ggf. früher löschen oder schwärzen; interne Notizen privat |
| Sicherheitslogs / technische Requestlogs | kurz und streng bereinigt; **Vorschlag: 30 Tage**, vorbehaltlich dokumentierter Abuse-Zwecke | keine Auth-Secrets, Checkout-Daten oder vollständigen Payloads protokollieren |
| Privilegierte Admin-/Audit-Events | verlässliche Nachvollziehbarkeit; **Vorschlag: 12 Monate**, bei Rechts-/Finanzbezug längerer klassifizierter Hold | Rollenbezug und Details minimieren; Retentionsprüfung dokumentieren |
| Newsletter-Abo, Double-Opt-In-Proof, Sperrliste | solange Einwilligung/Abo wirksam bzw. Nachweis-/Abwehrzweck belegt | sofort vom Versand abmelden; nötige minimale Suppression-Proofs getrennt halten, nicht Vollprofil unbegrenzt archivieren |
| Analyse-/Marketingdaten | optional erst bei gültiger Einwilligung, anonymisiert bevorzugen | eigene, freigegebene Fristen; Third-Party-Tracking in Gastbestellung grundsätzlich vermeiden |
| Backups | nach providerseitig verifizierter Rolling-Retention, Verschlüsselung und Zugriffsbeschränkung | Löschlisten nach Wiederherstellung erneut anwenden; nicht als Schatten-Dauerarchiv verwenden |
| Datenschutzanfragen und Sicherheitsvorfälle | minimale Bearbeitungs-/Nachweisdaten nur für konkreten Zweck und Rechtsrahmen | Rechtsanfragen, Legal Hold, Audit und tatsächliche Löschbestätigung revisionsfähig dokumentieren |

**Wichtig:** Die kursiv beschriebenen Fristen als „Vorschlag“ sind **keine automatisch gesetzlich erlaubte Höchstspeicherzeit**. Datenschutzbeauftragte/Fachjurist:in und Verantwortliche müssen sie genehmigen. Eine Löschfrist wird pro Zweck, Rechtsrolle und Dokumenttyp festgelegt, nicht per globalem `deletedAt + 8y`. Sensible / erforderliche Finanzsnapshots werden im prüfbaren Archiv von operativen Order-Ansichten getrennt. Zwecklose personenbezogene Felder lieber gar nicht erfassen.

### Privacy-by-Design und Rechte der Betroffenen

- Dateninventar auf **Feldebene**: Kategorie, verantwortlicher Akteur, Zweck, Rechtsgrundlage, Nutzende, Provider, Speicher-/Transferregion, Retention-Auslöser und zuständiger Löschjob.
- Personenbezogene Informationen beim Gast minimal: kein verpflichtendes Konto, keine ungefragten Allergieprofile, keine Telefonnummer/Adresse ohne klaren Bestellkontext, optionale Beleg-E-Mail keine Newsletter-Anmeldung.
- DSAR-/Löschanfrage-Workflow mit Identitätsprüfung, Auffinden verbundener Daten bei Convex/Stripe/Cloudflare/Workspace, Trennung von rechtlich gebundenen Unterlagen und frei löschbarem Nutzerprofil; Rückmeldungen grundsätzlich innerhalb DSGVO-Fristen, Ausnahmen dokumentieren.
- AVV/Auftragsverarbeitung und Auslandsübermittlung/DPF/SCC nicht aus Produktname „Convex/Cloudflare/Stripe“ ableiten: konkrete Deploymentregion, Vertragsversion und Subprozessoren prüfen.
- Reproduzierbares Löschen in aktiven Tabellen, Dateispeicher, Indizes, CDN, Event-Outbox und technischen Kopien. Aufbewahrungssperre nur bei echter begründeter Verpflichtung; Zugriff auf archivierte Daten auf notwendige Personen beschränken.
- Cookies: erforderliche Auth-Cookies mit engen Domain-Scope- und Sicherheitsattributen; freiwilliges Tracking erst nach entsprechender Rechtsbewertung und gültiger Auswahl. Kein pauschaler Cookie-Sharing-Scope über alle vier Subdomains.

### Backup und Wiederherstellbarkeit

Der Provider unterstützt Convex-Snapshots und ggf. automatisierte Backups; die im Repo dokumentierte Fähigkeit (täglich/wöchentlich) ist **nicht** gleichbedeutend mit tatsächlich geprüftem Produktivschutz. Verifizieren und datiert protokollieren: Deployment, Tarif, Zeitpunkt letzter erfolgreicher Sicherung, Kopie der Filestorage, Rollen, verschlüsselten Zugriff, Aufbewahrung, Restore-Funktion und Lösch-Wiederanwendung. Restore-Drills nur in **isolierter Testumgebung** mit synthetischen/anonymisierten Daten; nie zum Testen ungefragt Produktion überschreiben. Stripe bleibt für Zahlungen Quelle der Wahrheit; Restore darf Webhooks/Mailbenachrichtigungen nicht duplizieren. Details: [`docs/backups-and-recovery.md`](docs/backups-and-recovery.md).

## 19. Sicherheitsarchitektur und Cloudflare-Schutzkette

**Vertrauenszonen:** Browser/Gast; eingeloggte Betreiber:innen; gekoppelte Personalgeräte; autorisierte Zackisch-Teamrollen; externe Provider. Für jede Zone andere Session, Gültigkeit und Rechte. Mögliche Angriffe: IDOR/tenant leakage, regionale Querzugriffe, CSRF, XSS bei Menüs/Tickets, Upload-Missbrauch, Stripe-Replay/Doppelausführung, Token-/OTP-Abgriff, SSRF, Request-Flooding sowie Datenabfluss durch Logs und Drittanbieter.

**Cloudflare** ist der Runtime-/Netzwerk-Rand für alle vier Projekte, ersetzt aber nicht autorisierte Entscheidungen im Backend. Konkrete Schutzkette: TLS + geeignete Edge-/Rate-Limit-/Bot-Regeln → origin-/CSRF-/Cookie-Prüfung → Session und Authorisierung → schema-/ownership-geprüfte Server Action → Convex-Regeln → Stripe-signierte, idempotente Providerverarbeitung. Security Headers/CSP je Seite und Asset konkret testen. Edge-WAF, Firewall-Regeln und Datenregion gelten nur als aktiviert, wenn die aktuelle Cloudflare-Konfiguration es belegt.

**Pflichtmaßnahmen:** Least Privilege, getrennte Cloudflare-/Convex-/Stripe-Schlüssel je Umgebung, 2FA für Team, zeitlich beschränkte gekoppelte Tablet-Sessions, sichere Passwort-/E-Mail-Wechsel, file upload allowlist/mime/malware policy, sanitisiertes Rich-Text-Rendering, öffentliche/private DTO-Trennung und redactete strukturierte Logs. Keine Secret-/OTP-/PII-Inhalte in QR, PDF, Frontend-Prop, E-Mail-Template oder Source. Incident-Plan mit Risikoprüfung; DSGVO Art. 33 ggf. Meldung innerhalb 72 Stunden ab Kenntnis, Art. 34 bei hohem Risiko betroffene Personen informieren. Details: [`docs/security.md`](docs/security.md), [`docs/operations.md`](docs/operations.md).

## 20. Design-first-Entwicklungsworkflow und Toolverantwortung

Die UI-Designphase wird im **einzigen Paper-Projekt `Zackisch`** durchgeführt. Alle vier Projekte befinden sich darin: `00-system`, `10-root-marketing` (`root/`), `20-app-guest`, `21-app-merchant`, `22-app-staff` (`app/`), `30-support` (`support/`), `40-internal` (`internal/`) und `90-reviews`. Ein Paper-Projekt, gemeinsame Tokens, logisch getrennte Frame-Gruppen. Erst Aufgabe/Bestand verstehen, dann in Paper gestalten, `design-taste-frontend` als **kontrollierte Anti-Slop-Kritik** unter Zackisch-Vorrang anwenden, anschließend Base-UI-Code erstellen oder anpassen und in laufenden Browser-/E2E-Tests gegen den Paper-Frame prüfen.

**Normative Quellen:** `DESIGN.md` = Brand, Gestaltung, UX. `assets/zackisch/tokens.css` = implementierte Token-Werte. `README.md` + `docs/` = fachliche/technische Realität. Paper (`Zackisch`) = nachvollziehbarer visueller Entwurfs-/Freigabestand, kein separater Styleguide. `AGENTS.md` = Agenten-Sicherheits-/Prozessregeln. Bei Widerspruch fachliche Änderungen nicht aus Design ableiten.

**Tools, MCPs und Skills:** Paper Desktop MCP (Design lesen/schreiben und Design→Code-Handoff), `design-taste-frontend` aus `Leonxlnx/taste-skill` (Kritik unter Zackisch-Vorrang, gepinnt in `skills-lock.json`), Base UI (`@base-ui/react`, keine Design-Themes), Cloudflare `security-audit`, Convex Auth/AuthZ/Backup/Review/Test/Deploy-Guards, Stripe Docs/Best Practices, `e2e`, `react-doctor`, lokale Next.js-16-Dokumentation und vinext/Cloudflare-Worker-Testtools.

Taste ist kein Marken- oder Komponenten-Generator: Keine Taste-Defaultfarben, keine erzwungene dunkle Variante, keine Material-/Fluent-/Shadcn-Theme-Übernahme, keine generische Hero-Schablone. `#FAFAF9`, `#000000`, Inter, Zackisch-Illustrationen und die dezente Farbpalette gelten unverändert.

## 21. Architektur-, Datenschutz- und Freigabegrenzen

Ein einziges Convex-Backend `app/convex/` für die vier Oberflächen. Browser → validierte Next.js Server Action → rollen- und tenant-beschränkter Convex-Zugriff / Providerintegration. Keine Datenbankschemaänderung allein wegen eines Paper-Mockups. Sicherheits-, Bezahl-, Lösch- und Legal-Änderungen nur separat begründet, mit Tests und erforderlichen Freigaben.

Die Docs `docs/architecture.md`, `docs/security.md`, `docs/payments-and-stripe.md`, `docs/germany-legal-and-regulatory.md`, `docs/legal-pages-consents-and-contracts.md`, `docs/privacy-and-data-governance.md`, `docs/backups-and-recovery.md`, `docs/qr-and-print.md`, `docs/testing-and-release.md` und weitere Fachdokumente bleiben aktuell verbindlich. Die im Repository gepflegten Legal-Texte und Tests sind **Vorlagen/Implementierungen**; die nötigen juristischen/steuerlichen Freigaben werden nicht durch das Vorhandensein von Quellen oder Tests ersetzt. Löschfristen sind datenkategorie- und zweckgebunden; nicht alles pauschal 8 Jahre speichern.
