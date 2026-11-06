import { content, websiteUrl, type Locale } from "./content";

export function websiteStructuredData(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${websiteUrl}/#organization`,
        name: "Zackisch",
        legalName: "Selim Eser, handelnd unter Zackisch",
        url: websiteUrl,
        logo: `${websiteUrl}/brand/logo/lockups/wordmark--white--standard--1200w.png`,
        email: "selim@zackisch.com",
      },
      {
        "@type": "WebSite",
        "@id": `${websiteUrl}/#website`,
        name: "Zackisch",
        url: websiteUrl,
        inLanguage: ["de-DE", "en-DE"],
        publisher: { "@id": `${websiteUrl}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${websiteUrl}/${locale}#webpage`,
        url: `${websiteUrl}/${locale}`,
        name: content[locale].title.replace(/ [–—|] Zackisch$/, ""),
        description: content[locale].description,
        inLanguage: locale === "de-de" ? "de-DE" : "en-DE",
        isPartOf: { "@id": `${websiteUrl}/#website` },
        about: { "@id": `${websiteUrl}/#organization` },
      },
    ],
  };
}
