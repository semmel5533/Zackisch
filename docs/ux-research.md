# UX-Forschung und Design-Entscheidungen

Forschungsstand geprüft am 23. September 2026. Diese Referenz erläutert die empirische und arbeitspsychologische Evidenz hinter den Designregeln von Zackisch. [DESIGN.md](../DESIGN.md) definiert das Gesamtsystem; die [Komponenten-Referenz](design-system.md) beschreibt die technische Umsetzung.

## Interpretation von Evidenz

Barrierefreiheitsstandards definieren überprüfbare Mindestanforderungen. Usability-Studien identifizieren beobachtbare Hürden und bewährte Interaktionsmuster. Randomisierte A/B-Tests ermitteln relative Effekte für spezifische Nutzergruppen, Implementierungen und Zielmetriken. Diese Evidenztypen müssen methodisch sauber unterschieden werden.

Keine der nachfolgend aufgeführten Quellen postuliert einen universellen Konversionsvorteil für schwarze Buttons, Pill-Formen, Poppins, bestimmte Eckenradien oder ein 4-Pixel-Spacing-Raster. Dies sind bewusste Marken- und Wartungsentscheidungen von Zackisch. Eine konsistente Implementierung erhöht Wiedererkennung und Wiederverwendbarkeit; geschäftliche Auswirkungen werden lokal gemessen.

## Eindeutige Aktionen und vertraute Muster

Für die Hauptaufgabe einer Ansicht wird eine prominente primäre Aktion eingesetzt, für Alternativen eine umrandete Kontur-Aktion (Outline) und für begleitende Navigation eine dezente Geister-Aktion (Ghost). Deskriptive Beschriftungen vermitteln eindeutig, was beim Klick geschieht. Identische Operationen tragen über Website, Gäste-Bestellprozess und Betriebsfunktionen hinweg denselben Namen und dieselbe optische Behandlung. Dies folgt dem Wiedererkennungsprinzip (Recognition rather than Recall) und den W3C-Richtlinien für konsistente Identifikation: [NNGroup: Wiedererkennung und Erinnerung](https://www.nngroup.com/articles/recognition-and-recall/), [W3C: Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html).

Die Website hält den nächsten Schritt explizit und trennt Neuregistrierung klar von der Anmeldung bestehender Betriebe. GOV.UK empfiehlt, konkurrierende Primäraktionen zu vermeiden. Dies begründet jedoch keine Übernahme externer Markenfarben in Zackisch: [GOV.UK: Button-Muster](https://design-system.service.gov.uk/components/button/).

Häufige Operationen werden direkt angezeigt. Spezialisierte Einstellungen liegen hinter klar benannten Bedienelementen, wenn dies Ablenkungen minimiert. Erforderliche Auswahlen, Preise, Erfüllungsinformationen, Bestellstatus und relevante Fehler bleiben stets sichtbar. Progressive Disclosure dient der Aufgabenstrukturierung, nicht dem Verbergen notwendiger Informationen: [NNGroup: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/).

Zackisch verzichtet auf willkürliche Obergrenzen für Artikelanzahl oder Anpassungsoptionen. Eine Meta-Analyse über 63 experimentelle Bedingungen mit 5.036 Teilnehmern zeigte einen durchschnittlichen Choice-Overload-Effekt nahe null bei erheblicher Varianz. Visuelle Komplexität wird durch klare Strukturierung und Gruppierung reduziert, anstatt pauschal Optionen zu beschneiden: [Scheibehenne, Greifeneder und Todd: Choice-Overload-Metaanalyse](https://doi.org/10.1086/651235).

## Typografie: Groß-/Kleinschreibung, Lesbarkeit und physische Signalwirkung

Die Wahl der Groß- und Kleinschreibung beeinflusst Lesegeschwindigkeit, kognitive Last und visuelle Hierarchie maßgeblich:

- **Natürliche Groß-/Kleinschreibung (Sentence/Title Casing) in digitalen Arbeitsflächen:** Wahrnehmungspsychologische Studien zur Lesegeschwindigkeit (z. B. Tinker 1963, Dyson 2004, NNGroup) belegen, dass reiner Versalsatz (All-Caps) die Lesegeschwindigkeit um 10 bis 15 Prozent verlangsamt. Wörter in natürlicher Gemischt- bzw. Titelschreibweise erzeugen durch Oberlängen (`b`, `d`, `h`, `k`) und Unterlängen (`p`, `g`, `y`) charakteristische Wortumrisse (Bouma-Silhouetten). Diese Wortbilder ermöglichen das Erfassen in schnellen Sakkaden ohne sequenzielles Buchstabieren. In dichten Arbeitsbereichen wie Bestellwarteschlangen, Speisekarten, Tischrastern und Einstellungen senkt Gemischt- und Titelschreibung Ermüdung und erleichtert das schnelle Erfassen.
- **Spationierte Versalien für Orientierung in der Navigation:** Auf der Marketing-Website nutzen Navigationslinks in Kopf- und Fußzeile spationierte Großbuchstaben (`uppercase tracking-[0.08em]`). Da Navigationsbeschriftungen kurze, vertraute Ankerbegriffe sind (z. B. `FEATURES`, `PREISE`, `IMPRESSUM`), erfolgt die Erkennung primär über räumliche Verortung und kompakte horizontale Signalblöcke. Die einheitliche Versalhöhe grenzt das Navigationsgerüst architektonisch vom redaktionellen Fließtext ab.
- **Kontrastreiche Versalien für physische Signaletik:** Physische QR-Code-Tischaufsteller und Thekenkarten operieren unter wechselnden Blickwinkeln, schwankendem Umgebungslicht und Distanzen. Kräftige Versalien (`SCANNEN & BESTELLEN`, `ABHOLEN`) bieten maximale geometrische Fernwirkung und eine unmissverständliche physische Aufforderung, die am Tisch oder Tresen sofort erkannt wird.

## Formulare, Warenkorb und Fehlerbehebung

Formulare fordern nur aufgabenrelevante Daten an. Die kognitive Belastung hängt von der Feldkomplexität ab, nicht von einer krampfhaften Minimierung der Bildschirmseiten. Prüf- und Bezahlgrenzen bleiben gewahrt, wo sie Transaktionssicherheit bieten. Baymards Checkout-Studien (über 200 moderierte Tests) liefern qualitative Usability-Evidenz: [Baymard: Checkout-Forschung](https://baymard.com/research-articles/checkout-2024-launch), [Baymard: Formularfelder und Aufwand](https://baymard.com/research-articles/checkout-flow-average-form-fields).

Eingegebene Werte bleiben bei fehlgeschlagener Übermittlung erhalten. Fehler werden direkt den jeweiligen Feldern zugeordnet, enthalten klare Korrekturhinweise und setzen den Fokus bei Bedarf auf das betroffene Eingabefeld. Ein Toast-Banner dupliziert keine Fehlermeldung, die bereits im Formular sichtbar ist. Statusmeldungen gehören in den Kontext der Aktion; flüchtige Benachrichtigungen genügen nicht für geschäftskritische Prozessschritte: [GOV.UK: Error Summary](https://design-system.service.gov.uk/components/error-summary/), [GOV.UK: Notification Banner](https://design-system.service.gov.uk/components/notification-banner/).

Warenkorbmengen verfügen über klar beschriftete Plus- und Minus-Steuerungen. Gesamtsummen aktualisieren sich synchron, und das Reduzieren auf null leert den Artikel mit verständlichem Leerzustand. Gewählte Optionen bleiben im Warenkorb und in der Bestelldetailansicht lesbar: [Baymard: Mengenänderungen](https://baymard.com/research-articles/auto-update-users-quantity-changes).

Routinemäßige Statusänderungen erfordern keine redundanten Bestätigungsdialoge. Destruktive oder folgenschwere Aktionen erfordern eine präzise Beschreibung der Konsequenzen. Fehlgeschlagene Vorgänge stellen den vorherigen Zustand wieder her und geben niemals Erfolgsmeldungen aus. Widerruf (Undo) wird nur angeboten, wenn die Aktion technisch umkehrbar ist: [NNGroup: Bestätigungsdialoge](https://www.nngroup.com/articles/confirmation-dialog/).

## Barrierefreiheit und responsives Verhalten

Die Akzeptanzkriterien unterscheiden normative WCAG-Vorgaben von ergonomischen Zackisch-Maßen:

| Bereich | Anforderung und Zackisch-Umsetzung |
| --- | --- |
| Textkontrast | Mindestens 4,5:1 für Normaltext und 3:1 für großen Text. Gedämpfter Text und Platzhalter bleiben stets lesbar. |
| Bedienelementgrenzen | Informationen zur Identifikation von Steuerelementen und deren Status weisen mindestens 3:1 Kontrast zu Nachbarfarben auf. Dekorative Trennlinien treten dezent hinter Feldrändern zurück. |
| Zeigerziele | WCAG 2.2 AA verlangt 24x24 CSS-Pixel mit Abstandsregel. Zackisch bevorzugt 44px-Ziele für Touch-Aktionen; kompakte Desktop-Elemente vergrößern sich für grobe Zeiger. |
| Umbruch (Reflow) | Vollständige Funktionalität und Inhaltsintegrität bei 320 CSS-Pixeln Breite. Datentabellen scrollen in ihrer Region horizontal, übrige Inhalte brechen um. |
| Tastatur und Fokus | Alle Interaktionen sind uneingeschränkt per Tastatur bedienbar. Der Fokus bleibt in geöffneten Modals gefangen und kehrt beim Schließen zum Auslöser zurück. Fokusringe sind jederzeit sichtbar. |
| Zeigergesten | Für Zieh-Gesten (Drag & Drop) existiert immer eine einfache Zeiger-Alternative (Klick-Schaltflächen). Tastaturunterstützung allein genügt nicht. |
| Bewegung (Motion) | `prefers-reduced-motion` wird strikt respektiert. Unnötige dekorative Bewegungen unterbleiben; Lade- und Statusinformationen funktionieren auch ohne Animation. |

Grundlagen: [W3C: Textkontrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Nicht-Text-Kontrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [Zielgröße](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Tastaturbedienung](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [Sichtbarer Fokus](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [Ziehbewegungen](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) sowie [Interaktionsanimationen (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

## Erkenntnisse kontrollierter Studien und deren Grenzen

| Studie | Berichtetes Ergebnis | Anwendung und Grenzen für Zackisch |
| --- | --- | --- |
| [Morkes und Nielsen: Web-Texte](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/) | Prägnanter, scannbarer und sachlicher Text erzielte 124 % höhere Usability-Werte als werblicher Kontrolltext. | Konkrete Zwischenüberschriften und sachliche Texte. Es handelt sich um ein Usability-Maß, kein pauschales Verkaufsversprechen. |
| [GDS: Themenlinks-Experiment](https://www.gov.uk/government/case-studies/how-gds-used-data-to-improve-content-and-user-journeys-on-govuk) | Ein 50/50-A/B-Test reduzierte interne Suchanfragen potenziell um 20 bis 40 %. | Kontextuelle Verlinkung hilft Nutzern beim nächsten Schritt. Gilt für Informationsportale und rechtfertigt keine Empfehlungsalgorithmen im Bestellprozess. |
| [Vodafone: Performance-Test](https://web.dev/case-studies/vodafone) | Optimierte Ladezeiten (LCP um 31 % verbessert) korrelierten mit 8 % mehr Verkäufen. | Schnelles Rendering, feste Bilddimensionen und geringe Asset-Größen sind feste Designkriterien. Konkrete Steigerungen sind branchenspezifisch und nicht direkt übertragbar. |

## Lokale Erfolgsmessung

Für Experimente innerhalb von Zackisch werden Hypothese, Zielgruppe, Hauptmetrik, Schutzmetriken (Guardrails), Stichprobengröße und Testzeitraum vorab definiert. Vorzeitiges Abbrechen bei ersten positiven Werten oder Verwechseln von Navigationsklicks mit Transaktionserfolgen wird vermieden. Zuverlässige Vorgehensweisen dokumentiert Microsoft: [Microsoft: Fallstricke bei Metriken](https://www.microsoft.com/en-us/research/publication/a-dirty-dozen-twelve-common-metric-interpretation-pitfalls-in-online-controlled-experiments/), [Microsoft: Vorbereitung von Experimenten](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-pre-experiment-stage/).

Relevante Kernmetriken sind erfolgreich bezahlte Bestellungen und Fehlerraten bei Gästen, Aufgabengeschwindigkeit und fehlerfreie Statusübergänge im Betrieb sowie qualifizierte Registrierungen auf der Website. Barrierefreiheit, Zahlungsabbrüche und Ladezeiten werden als Schutzmetriken parallel überwacht. Bei geringem Datenvolumen haben beobachtete qualitative Nutzertests Vorrang vor statistisch unzureichenden A/B-Tests.
