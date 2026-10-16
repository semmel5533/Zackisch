import React from "react";

export function AccessibilityDocument({ locale }: { locale: "de" | "en" }) {
  if (locale === "en") {
    return (
      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
        <p className="font-semibold text-base">
          Accessibility Statement pursuant to the German Accessibility Strengthening Act (BFSG) &amp; EN 301 549
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Commitment to Accessibility</h2>
          <p>
            Zackisch is committed to making its digital services accessible to everyone, including people with disabilities, in compliance with the German Accessibility Strengthening Act (Barrierefreiheitsstärkungsgesetz &ndash; BFSG) and the European standard EN 301 549 (WCAG 2.1 Level AA).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Measures Taken</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Responsive Mobile-First Architecture:</strong> Optimized for smartphone use with zoom up to 200% without loss of functionality.</li>
            <li><strong>Semantic HTML &amp; Screen Reader Support:</strong> Landmark elements, descriptive labels, and ARIA attributes for carts, dialogs, and forms.</li>
            <li><strong>Keyboard Navigation:</strong> All interactive elements, including menu selections, modifiers, and payment buttons, are accessible and operable using only a keyboard.</li>
            <li><strong>High-Contrast Aesthetics:</strong> High contrast ratios compliant with WCAG AA specifications across all core customer flows.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Known Limitations</h2>
          <p>
            Content and images uploaded directly by third-party restaurant operators (e.g. custom product photos or PDF flyers) may occasionally lack automated alternative text descriptions. We provide guidelines to merchants to ensure full accessibility.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Feedback and Contact</h2>
          <p>
            If you encounter accessibility barriers while using Zackisch, please notify us at:
          </p>
          <p>
            Email: <a href="mailto:selim@zackisch.com" className="underline font-semibold">selim@zackisch.com</a><br />
            Phone: <a href="tel:+4962186037315" className="underline font-semibold">+49-621 86037315</a>
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
      <p className="font-semibold text-base">
        Erklärung zur Barrierefreiheit gemäß dem Barrierefreiheitsstärkungsgesetz (BFSG) und EN 301 549
      </p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">1. Unser Anspruch</h2>
        <p>
          Zackisch setzt sich dafür ein, den digitalen Bestell- und Bezahlvorgang für alle Gäste und Gastronomen barrierefrei und einfach zugänglich zu gestalten. Diese Erklärung gilt für die unter <strong>zackisch.com</strong> und <strong>app.zackisch.com</strong> bereitgestellten Webanwendungen im Einklang mit den Anforderungen des Barrierefreiheitsstärkungsgesetzes (BFSG) sowie den Web Content Accessibility Guidelines (WCAG 2.1, Konformitätsstufe AA).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">2. Umgesetzte Maßnahmen</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Mobile-First und Skalierbarkeit:</strong> Vollständig responsives Design, das auch bei 200 % Textvergrößerung ohne horizontalen Scrollbalken bedienbar bleibt.</li>
          <li><strong>Semantisches HTML und Screenreader-Unterstützung:</strong> Klare Strukturierung durch Überschriften, semantische Listen, Formularbeschriftungen und ARIA-Attribute für Dialoge und Warenkörbe.</li>
          <li><strong>Vollständige Tastaturbedienbarkeit:</strong> Sämtliche Auswahl- und Bezahlprozesse sind ohne Maus oder Touchscreen über die Standard-Tastatursteuerungen erreichbar.</li>
          <li><strong>Ausreichende Kontraste:</strong> Schrift- und Hintergrundfarben erfüllen die Kontrastanforderungen der Stufe AA für eine optimale Lesbarkeit auch bei schwierigen Lichtverhältnissen.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">3. Bekannte Einschränkungen</h2>
        <p>
          Von einzelnen Gastronomiebetrieben individuell hochgeladene Produktbilder verfügen unter Umständen nicht durchgehend über beschreibende Alternativtexte. Wir unterstützen Betriebe im Hilfe-Center mit Leitfäden zur barrierefreien Pflege von Speisekarten.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-foreground">4. Feedback und Kontakt</h2>
        <p>
          Solltest du auf Barrieren bei der Nutzung von Zackisch stoßen oder Hinweise zur Verbesserung der Zugänglichkeit haben, kontaktiere uns bitte:
        </p>
        <p>
          E-Mail: <a href="mailto:selim@zackisch.com" className="underline font-semibold">selim@zackisch.com</a><br />
          Telefon: <a href="tel:+4962186037315" className="underline font-semibold">+49-621 86037315</a>
        </p>
      </section>
    </div>
  );
}
