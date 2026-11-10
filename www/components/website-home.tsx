import { type ReactNode } from "react";
import Image from "next/image";
import { WebsiteLink } from "./section-navigation";
import { content, signupUrl, surveyUrl, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing-content";
import { WebsiteShell } from "./website-shell";
import { StaffPreview } from "./staff-preview";
import { DemoVenues } from "./demo-venues";
import { Faq } from "./website-controls";

const NOWRAP_PATTERN =
  /(zzgl\.\s+Zahlungsanbietergebühren\.?|plus payment provider fees\.?|Schlange am Tresen|queues at the counter|\bQR codes?[\p{P}]*|\b\d+(?:[.,]\d+)?\s*(?:%|€)[\p{P}]*|\b[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+[\p{P}]*)/gu;

export function formatCopy(text: string): ReactNode {
  const parts = text.split(NOWRAP_PATTERN);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function WebsiteHome({ locale }: { locale: Locale }) {
  const c = content[locale];
  const m = marketing[locale];
  return (
    <WebsiteShell locale={locale}>
      <main id="main" lang={c.lang} className="marketing">
        <section className="welcome container">
          <div className="welcome-composition">
            <div className="welcome-copy">
              <h1>
                {m.hero[0]}
                <br />
                <span>{m.hero[1]}</span>
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
              <p className="welcome-trial">{formatCopy(m.heroTrial)}</p>
            </div>
            <div className="welcome-stage">
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
              <DemoVenues copy={m} />
            </div>
          </div>
        </section>
        <section id="problem" className="problem-section container">
          <div className="problem-lead">
            <div className="problem-copy">
              <h2>{formatCopy(m.problemTitle)}</h2>
              <p>{formatCopy(m.problemText)}</p>
              <p>{formatCopy(m.solutionText)}</p>
            </div>
            <div className="problem-photos">
              <figure className="story-photo">
                <Image
                  src="/media/counter-order.webp"
                  alt={m.counterAlt}
                  width={1600}
                  height={1067}
                  sizes="(max-width: 799px) 100vw, (max-width: 1696px) 56vw, 880px"
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
          <div className="venue-control container">
            <h3>{m.control}</h3>
            <p>{formatCopy(m.controlText)}</p>
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
          <div className="container cost-inner">
            <h2>{m.costTitle}</h2>
            <div className="cost-card-primary">
              <div className="cost-figure">
                <p className="cost-number">
                  2<span>%</span>
                </p>
                <p>{m.feeLabel}</p>
              </div>
              <div className="cost-details">
                <h3>{m.zero}</h3>
                <p>{formatCopy(m.seasonal)}</p>
                <p>{formatCopy(m.feeDetail)}</p>
              </div>
            </div>
            <div className="cost-trial">
              <div className="trial-figure">
                <p className="trial-number">
                  0<span>%</span>
                </p>
                <p>{m.trialLabel}</p>
              </div>
              <div className="trial-details">
                <h3>{m.trialTitle}</h3>
                <p>{formatCopy(m.trialText)}</p>
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
        <section id="about" className="founder-section container">
          <div className="founder-header">
            <h2>{m.founderTitle}</h2>
            <div className="founder-support">
              <Image
                className="mars-logo"
                src="/media/mars-logo.webp"
                alt={m.marsAlt}
                width={184}
                height={59}
              />
              <div className="founder-support-copy">
                <p className="founder-support-label">{m.founderSupportLabel}</p>
                <p className="founder-support-name">{m.founderSupportText}</p>
              </div>
            </div>
          </div>
          <div className="founder-copy">
            <p className="founder-lead">{formatCopy(m.founderLead)}</p>
            <p>{formatCopy(m.founderText)}</p>
            <p className="founder-signature">{m.founderSignature}</p>
          </div>
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
