# Zackisch Adminapp (Operative Zentrale)

Dieses Next.js-Projekt ist das interne Verwaltungs- und Kontrolldashboard für das operative Zackisch-Team (`https://admin.zackisch.com`).

## Funktionen

1. **Regionale Übersicht (`/`):** Echtzeit-Kennzahlen zu Bruttoumsatz (GMV), 2 % Zackisch-Plattformgebühr, 50 % Partner-Provisionen, aktiven Gastronomiebetrieben, Bestellungen und Double-Opt-In-Newsletter-Abonnenten.
2. **Gastronomie-Verwaltung (`/restaurants`):** Regionale Restaurantübersicht, Stripe-Connect-Status, Tischkontingente und direkte Menülinks.
3. **Bestellübersicht (`/orders`):** Echtzeit-Bestellansicht mit Filterung nach Status (in Bearbeitung, abholbereit, abgeschlossen, storniert) und Zahlungsreferenzen.
4. **Mitarbeiterverwaltung (`/staff`):** Granulare Einladung und Berechtigungssteuerung für Teammitglieder (Rechte: Restaurants, Bestellungen, Personal, Partner, Newsletter, E-Mails, Audit).
5. **Partnerverwaltung (`/partners`):** Provisionsabrechnung für regionale Vertriebspartner (50 % der Plattformgebühr = 1 % GMV), Partnercodes, vermittelte Betriebe und Auszahlungs-Buchung.
6. **No-Code-Newsletter-Editor & Kampagnen (`/newsletter`):** Visueller blockbasierter Newsletter-Editor mit Live-Master-Template-Vorschau, Abonnentenübersicht, Testversand und Kampagnenplanung.
7. **E-Mail-Protokoll (`/emails`):** Chronologische Übersicht aller über Google Workspace versendeten Transaktions- und Marketingnachrichten mit Zustellstatus und SMTP-Verbindungstest.
8. **Audit-Trail (`/audit`):** Manipulationsgeschütztes Protokoll aller relevanten Aktionen mit automatischer Schwärzung vertraulicher Daten.
9. **Einstellungen (`/settings`):** Regionale Konfiguration, Gebührensätze und Systemstatus.

## Lokale Entwicklung und Build

```sh
cd adminapp
npm ci
npm run dev        # Entwicklungsmodus auf Port 3002
npm run typecheck  # TypeScript-Validierung
npm run build      # Produktions-Build
```

Das Projekt greift auf das gemeinsame Convex-Backend unter `webapp/convex/` zu.
