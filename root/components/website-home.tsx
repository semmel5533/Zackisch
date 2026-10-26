import Image from "next/image";
import Link from "next/link";
import { content, signupUrl, type Locale } from "@/lib/content";
import { WebsiteShell } from "./website-shell";
import { Faq } from "./website-controls";

export function WebsiteHome({ locale }: { locale: Locale }) {
  const c = content[locale];
  return (
    <WebsiteShell locale={locale}>
      <main id="main" lang={c.lang}>
        <section className="hero container">
          <div className="hero-copy">
            <h1>{c.hero}</h1>
            <p className="lead">{c.intro}</p>
            <Link className="button button-primary" href={signupUrl}>
              {c.start}
              <span aria-hidden="true">↗</span>
            </Link>
            <p className="hero-note">{c.heroNote}</p>
          </div>
          <figure className="hero-photo">
            <Image
              src="/media/barista.webp"
              alt={c.heroAlt}
              width="1280"
              height="853"
              fetchPriority="high"
            />
            <figcaption>
              <Link href="https://commons.wikimedia.org/wiki/File:Barista_prepares_espresso_at_coffee_shop.jpg">
                {c.photoCredit}
              </Link>{" "}
              ·{" "}
              <Link href="https://creativecommons.org/licenses/by/2.0/">
                CC BY 2.0
              </Link>
            </figcaption>
          </figure>
        </section>
        <section className="problem container section-space">
          <div>
            <h2>{c.problemTitle}</h2>
            <p className="lead">{c.problemText}</p>
          </div>
          <aside className="research-fact">
            <p className="statistic">{c.statistic}</p>
            <p className="fact-text">{c.statisticText}</p>
            <p className="source">{c.source}</p>
            <p className="source">{c.caveat}</p>
            <Link className="inline-link" href={`/${locale}/research`}>
              {c.researchLink}
              <span aria-hidden="true"> ↗</span>
            </Link>
          </aside>
        </section>
        <section
          id="how-it-works"
          className="product-story section-space container"
        >
          <div className="section-heading">
            <h2>{c.storyTitle}</h2>
            <p className="lead">{c.storyIntro}</p>
          </div>
          <ol className="story-steps">
            {c.steps.map((step, index) => (
              <li key={step.title}>
                <div className="step-copy">
                  <span className="step-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <figure className="product-placeholder">
                  <div>
                    <p>{step.placeholder}</p>
                    <span>{c.placeholderNote}</span>
                  </div>
                  <figcaption>{step.detail}</figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </section>
        <section className="hybrid section-space">
          <div className="container hybrid-inner">
            <Image
              src="/zackisch/curious.svg"
              alt=""
              width="120"
              height="120"
              loading="lazy"
            />
            <h2>{c.hybridTitle}</h2>
            <p className="lead">{c.hybridText}</p>
          </div>
        </section>
        <section className="setup container section-space">
          <div>
            <h2>{c.setupTitle}</h2>
            <p className="lead">{c.setupIntro}</p>
            <Link
              className="inline-link"
              href={`https://support.zackisch.com/${locale}`}
            >
              {c.setupHelp}
              <span aria-hidden="true"> ↗</span>
            </Link>
          </div>
          <ol className="setup-steps">
            {c.setup.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section className="pricing container section-space">
          <h2>{c.priceTitle}</h2>
          <div className="price-grid">
            <div>
              <p className="fee">{c.fee}</p>
              <p className="fee-label">{c.feeLabel}</p>
            </div>
            <div>
              <h3>{c.free}</h3>
              <p>{c.feeText}</p>
              <p>{c.requirements}</p>
              <Link className="inline-link" href={`/${locale}/pricing`}>
                {c.priceLink}
                <span aria-hidden="true"> ↗</span>
              </Link>
            </div>
          </div>
        </section>
        <section id="questions" className="questions container section-space">
          <h2>{c.faqTitle}</h2>
          <Faq items={c.faqs} />
        </section>
        <section className="closing container section-space">
          <h2>{c.endTitle}</h2>
          <p className="lead">{c.endText}</p>
          <Link className="button button-primary" href={signupUrl}>
            {c.start}
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </WebsiteShell>
  );
}
