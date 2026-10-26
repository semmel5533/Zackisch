import { legalSources } from "@/lib/legal-content";
import { notFound } from "next/navigation";
import {
  content,
  isLocale,
  locales,
  pageSlugs,
  surveyUrl,
  type PageSlug,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { WebsiteShell } from "@/components/website-shell";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    pageSlugs.map((slug) => ({ locale, slug })),
  );
}
function resolvePage(locale: string, slug: string) {
  if (!isLocale(locale) || !pageSlugs.includes(slug as PageSlug)) notFound();
  return { locale, page: content[locale].pages[slug as PageSlug] };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { page } = resolvePage(locale, slug);
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale, slug, page.title, page.intro);
}
export default async function InformationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const paramsValue = await params;
  const { locale, page } = resolvePage(paramsValue.locale, paramsValue.slug);
  const c = content[locale];
  return (
    <WebsiteShell locale={locale} slug={paramsValue.slug}>
      <main id="main" className="article container section-space" lang={c.lang}>
        <h1>{page.title}</h1>
        <p className="lead">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {(paramsValue.slug === "legal-notice" ||
          paramsValue.slug === "privacy") && (
          <section>
            <h2>{c.legalSources}</h2>
            <ul>
              {legalSources[paramsValue.slug].map((source) => (
                <li key={source.url}>
                  <a className="inline-link" href={source.url}>
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        {paramsValue.slug === "research" && (
          <a className="inline-link" href={surveyUrl}>
            {c.researchLink} ↗
          </a>
        )}
        {paramsValue.slug === "contact" && (
          <a
            className="button button-primary"
            href={`https://support.zackisch.com/${locale}`}
          >
            {c.nav[3]} ↗
          </a>
        )}
      </main>
    </WebsiteShell>
  );
}
