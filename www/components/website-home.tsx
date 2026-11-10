import Image from "next/image";
import { WebsiteLink } from "./section-navigation";
import { content, signupUrl, surveyUrl, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing-content";
import { WebsiteShell } from "./website-shell";
import { StaffPreview } from "./staff-preview";
import { TrialBanner } from "./trial-banner";
import { Faq } from "./website-controls";
import { formatCopy } from "@/lib/format-copy";
export { formatCopy };

export function WebsiteHome({ locale }: { locale: Locale }) {
  const c = content[locale];
  const m = marketing[locale];
  return (
    <WebsiteShell locale={locale} banner={<TrialBanner copy={m} />}>
      <main id="main" lang={c.lang} className="marketing">
        <section className="welcome container">
          <div className="welcome-composition">
            <div className="welcome-copy">
              <h1>
                {formatCopy(m.hero[0])}
                <br />
                <span>{formatCopy(m.hero[1])}</span>
              </h1>
              <p className="welcome-intro">{formatCopy(m.intro)}</p>
              <div className="welcome-actions">
                <WebsiteLink
                  className="button button-primary hero-primary"
                  href={signupUrl}
                >
                  {c.start}
                </WebsiteLink>
                <WebsiteLink className="quiet-link" href="#problem">
                  {m.explore}
                </WebsiteLink>
              </div>
            </div>
            <figure className="welcome-main-photo">
              <Image
                src="/media/phone-guests.webp"
                alt={m.phoneAlt}
                width={1800}
                height={1200}
                sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1696px) calc(100vw - 96px), 1600px"
                loading="eager"
                fetchPriority="high"
              />
            </figure>
          </div>
        </section>
        <section id="problem" className="problem-section container">
          <div className="problem-lead">
            <div className="problem-copy">
              <h2>{formatCopy(m.problemTitle)}</h2>
              <p>{formatCopy(m.problemText)}</p>
            </div>
            <div className="problem-photos">
              <figure className="story-photo">
                <Image
                  src="/media/counter-order.webp"
                  alt={m.counterAlt}
                  width={1200}
                  height={1500}
                  sizes="(max-width: 799px) 100vw, (max-width: 1696px) 50vw, 680px"
                />
              </figure>
            </div>
          </div>
          <div className="problem-study">
            <div className="study-figure">
              <p className="study-number">
                27<span>%</span>
              </p>
              <p className="study-caption">{formatCopy(m.studyCaption)}</p>
            </div>
            <div className="study-details">
              <h3>{m.studyTitle}</h3>
              <p>{formatCopy(m.studyText)}</p>
              <WebsiteLink className="inline-link" href={surveyUrl}>
                {c.researchLink}
              </WebsiteLink>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="menu-chapters">
          <div className="chapter-introduction container">
            <h2>{m.menuTitle}</h2>
            <p>{formatCopy(m.menuFlexibility)}</p>
          </div>
          <div className="chapter-stack container">
            {m.features.map((feature, i) => (
              <article
                className={`menu-chapter chapter-${i}`}
                key={feature.title}
              >
                <div className="chapter-copy">
                  <h3>{formatCopy(feature.title)}</h3>
                  <p className="chapter-summary">{formatCopy(feature.text)}</p>
                  <p className="chapter-detail">{formatCopy(feature.detail)}</p>
                </div>
                <figure className="screenshot-placeholder phone-placeholder">
                  <figcaption>{m.placeholder}</figcaption>
                  <p>{formatCopy(feature.image)}</p>
                </figure>
              </article>
            ))}
          </div>
        </section>
        <section className="service-section container">
          <div>
            <h2>{m.teamTitle}</h2>
            <p>{formatCopy(m.teamText)}</p>
          </div>
          <StaffPreview>
            <figure className="screenshot-placeholder staff-placeholder">
              <figcaption>{m.placeholder}</figcaption>
              <p>{formatCopy(m.teamImage)}</p>
            </figure>
          </StaffPreview>
        </section>
        <section id="costs" className="cost-section">
          <aside className="cost-banner" aria-label={m.heroTrial}>
            <div className="container cost-banner-inner">
              <p className="cost-banner-text">{formatCopy(m.heroTrial)}</p>
            </div>
          </aside>
          <div className="container cost-inner">
            <h2>{m.costTitle}</h2>
            <div className="cost-content">
              <div className="cost-figure">
                <p className="cost-number">
                  2<span>%</span>
                </p>
                <p className="cost-label">{m.feeLabel}</p>
              </div>
              <div className="cost-details">
                <h3>{m.zero}</h3>
                <p>{formatCopy(m.seasonal)}</p>
                <p>{formatCopy(m.feeDetail)}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="start-section container">
          <h2>{m.setupTitle}</h2>
          <div>
            <p className="start-description">{formatCopy(m.setupText)}</p>
            <p>{formatCopy(m.setupNote)}</p>
            <WebsiteLink
              className="inline-link"
              href={`https://support.zackisch.com/${locale}`}
            >
              {c.setupHelp}
            </WebsiteLink>
          </div>
        </section>
        <section id="questions" className="questions container">
          <h2>{m.faq}</h2>
          <Faq items={c.faqs} />
        </section>
        <section id="contact" className="personal-contact container">
          <h2>{m.personalTitle}</h2>
          <a href="mailto:selim@zackisch.com">selim@zackisch.com</a>
        </section>
        <section className="last-invitation container">
          <h2>{m.close}</h2>
          <p>{formatCopy(m.closeText)}</p>
          <WebsiteLink className="button button-primary" href={signupUrl}>
            {c.start}
          </WebsiteLink>
        </section>
      </main>
    </WebsiteShell>
  );
}
