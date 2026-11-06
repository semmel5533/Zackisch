import { content, locales, type Locale } from "@/lib/content";
import { WebsiteShell } from "./website-shell";
import { WebsiteLink } from "./section-navigation";
import { LocalizedNotFound } from "./localized-not-found";

function ErrorPage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return (
    <WebsiteShell locale={locale}>
      <main className="not-found container" id="main" lang={copy.lang}>
        <div className="not-found-copy">
          <h1>{copy.notFound}</h1>
          <p>{copy.notFoundText}</p>
          <WebsiteLink className="button button-primary" href={`/${locale}`}>
            {copy.back}
          </WebsiteLink>
        </div>
      </main>
    </WebsiteShell>
  );
}

export default function NotFoundContent() {
  const pages = Object.fromEntries(
    locales.map((locale) => [locale, <ErrorPage key={locale} locale={locale} />]),
  ) as Record<Locale, React.ReactNode>;
  return <LocalizedNotFound pages={pages} />;
}
