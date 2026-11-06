import { content, localeConfigs, locales, websiteUrl, type Locale } from "./content";

export function websiteStructuredData(locale: Locale) {
  const copy = content[locale];
  const localeConfig = localeConfigs[locale];
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
        inLanguage: locales.map((candidate) => localeConfigs[candidate].hrefLang),
        publisher: { "@id": `${websiteUrl}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${websiteUrl}/${locale}#webpage`,
        url: `${websiteUrl}/${locale}`,
        name: copy.title.replace(/ [–—|] Zackisch$/, ""),
        description: copy.description,
        inLanguage: localeConfig.hrefLang,
        isPartOf: { "@id": `${websiteUrl}/#website` },
        about: { "@id": `${websiteUrl}/#organization` },
      },
    ],
  };
}
