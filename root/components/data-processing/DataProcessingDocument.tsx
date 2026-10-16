import React from "react";

export function DataProcessingDocument({ locale }: { locale: "de" | "en" }) {
  if (locale === "en") {
    return (
      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
        <p className="font-semibold text-base">
          Data Processing Agreement (DPA) pursuant to Article 28 of the EU General Data Protection Regulation (GDPR)
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Contracting Parties and Scope</h2>
          <p>
            This agreement applies to the processing of personal data by <strong>Zackisch (Selim Eser)</strong>, Dannstadter Straße 6-8, 68199 Mannheim, Germany (&ldquo;Processor&rdquo; or &ldquo;Zackisch&rdquo;) on behalf of the registered hospitality merchant (&ldquo;Controller&rdquo; or &ldquo;Merchant&rdquo;) in connection with the Zackisch online QR ordering and payment software.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Purpose, Duration and Categories of Processing</h2>
          <p>
            <strong>Subject Matter:</strong> Provision of a web-based QR-code menu, guest ordering interface, staff dashboard, and payment facilitation software.
          </p>
          <p>
            <strong>Duration:</strong> The duration of this DPA corresponds to the active use of the Zackisch platform by the Merchant.
          </p>
          <p>
            <strong>Categories of Data Subjects:</strong> Restaurant guests placing digital orders; merchant staff members accessing the order and staff terminals.
          </p>
          <p>
            <strong>Types of Personal Data:</strong> Order items and customizations, table/pickup identifiers, total amount and timestamp, pseudonymized transaction IDs, and optionally guest email addresses exclusively when digital confirmation delivery is requested by the guest.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Technical and Organizational Measures (TOMs)</h2>
          <p>
            Zackisch implements state-of-the-art technical and organizational measures according to Art. 32 GDPR, including end-to-end TLS encryption in transit, strict tenant isolation in database queries, cryptographic token-based staff session management, role-based access control, and continuous monitoring.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Subprocessors</h2>
          <p>
            The Merchant grants general authorization for the following essential infrastructure subprocessors:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cloudflare, Inc.</strong> (USA/EU) &ndash; Edge hosting, DNS, DDoS mitigation, and global CDN.</li>
            <li><strong>Convex, Inc.</strong> (USA/EU) &ndash; Real-time database engine and application backend (Frankfurt region).</li>
            <li><strong>Stripe Payments Europe, Ltd.</strong> (Ireland) &ndash; Payment processing and connected financial infrastructure (operating as an independent controller/processor as agreed in Stripe terms).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">5. Rights of Data Subjects and Audit Rights</h2>
          <p>
            Zackisch assists the Merchant in fulfilling requests under Chapter III GDPR (access, rectification, erasure, restriction). Upon termination of the service, personal data is deleted or returned, subject to statutory statutory retention obligations (e.g. 8-year commercial and tax retention under &sect;&nbsp;147 AO).
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
      <p className="font-semibold text-base">
        Vereinbarung über die Auftragsverarbeitung (AVV) gemäß Art. 28 Datenschutz-Grundverordnung (DSGVO)
      </p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">1. Vertragsparteien und Geltungsbereich</h2>
        <p>
          Dieser Vertrag regelt die Rechte und Pflichten von <strong>Zackisch (Selim Eser)</strong>, Dannstadter Straße 6-8, 68199 Mannheim (&bdquo;Auftragsverarbeiter&ldquo;) und dem registrierten Gastronomiebetrieb (&bdquo;Verantwortlicher&ldquo; bzw. &bdquo;Gastronom&ldquo;) bei der Verarbeitung personenbezogener Daten im Rahmen der Bereitstellung des Zackisch QR-Bestell- und Bezahlsystems.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">2. Gegenstand, Dauer und Umfang der Datenverarbeitung</h2>
        <p>
          <strong>Gegenstand des Auftrags:</strong> Technische Bereitstellung der Softwareplattform zur digitalen Erfassung von Speisekarten, Entgegennahme von Vor-Ort- und Abhol-Bestellungen der Gäste via Smartphone-Browser, Weiterleitung an das Personal-Terminal sowie Übermittlung der Zahlungsdaten an den Zahlungsdienstleister.
        </p>
        <p>
          <strong>Dauer:</strong> Entspricht der Laufzeit der Registrierung und Nutzung der Zackisch-Plattform.
        </p>
        <p>
          <strong>Kategorien betroffener Personen:</strong> Gäste des Gastronomiebetriebs; Mitarbeiter und Inhaber des Betriebs.
        </p>
        <p>
          <strong>Arten personenbezogener Daten:</strong> Bestelldaten (bestellte Artikel, Notizen, Zeitstempel, Gesamtbetrag), Tisch- bzw. Abholkennzeichnung, pseudonymisierte Zahlungs- und Transaktionsreferenzen sowie optional die E-Mail-Adresse des Gastes bei ausdrücklicher Anforderung einer digitalen Bestell- und Zahlungsbestätigung.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">3. Technische und organisatorische Maßnahmen (TOM)</h2>
        <p>
          Der Auftragsverarbeiter trifft alle erforderlichen Maßnahmen nach Art. 32 DSGVO zur Gewährleistung eines dem Risiko angemessenen Schutzniveaus:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Vollständige Transportverschlüsselung sämtlicher Datenströme via TLS 1.3 / HTTPS.</li>
          <li>Mandantenisolation auf Datenbank- und Abfrageebene zur Verhinderung unberechtigter Datenzugriffe zwischen verschiedenen Gastronomiebetrieben.</li>
          <li>Kryptografisch gesicherte Sitzungstoken für Personal- und Bestellterminals ohne Speicherung von Klartext-Passwörtern.</li>
          <li>Rollenbasierte Berechtigungsprüfung (RBAC) für Inhaber-, Personal- und interne Dashboard-Funktionen.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">4. Genehmigte Unterauftragsverarbeiter</h2>
        <p>
          Der Verantwortliche genehmigt die Hinzuziehung folgender Unterauftragsverarbeiter für die Bereitstellung der Plattform:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Cloudflare, Inc.</strong> &ndash; Edge-Hosting, Web Application Firewall, CDN und DDoS-Schutz.</li>
          <li><strong>Convex, Inc.</strong> &ndash; Bereitstellung der Echtzeit-Datenbank und Backend-Infrastruktur (Rechenzentrum Region Frankfurt, Deutschland).</li>
          <li><strong>Stripe Payments Europe, Ltd.</strong> &ndash; Bereitstellung der Zahlungs- und Connect-Infrastruktur (Zahlungsabwicklung unter separater lizenzierter Verantwortlichkeit von Stripe).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">5. Betroffenenrechte, Datenlöschung und Aufbewahrung</h2>
        <p>
          Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der Erfüllung von Anfragen betroffener Personen nach Kapitel III DSGVO. Nach Beendigung des Vertragsverhältnisses werden die Daten nach Wahl des Verantwortlichen gelöscht oder zurückgegeben, soweit keine gesetzlichen Pflichten (insb. steuerliche und handelsrechtliche Aufbewahrungsfristen von 8 Jahren nach &sect;&nbsp;147 AO / GoBD) einer sofortigen Löschung entgegenstehen.
        </p>
      </section>
    </div>
  );
}
