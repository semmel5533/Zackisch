import { type ReactNode } from "react";
import Image from "next/image";
import { WebsiteLink } from "./section-navigation";
import { content, signupUrl, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing-content";
import { WebsiteShell } from "./website-shell";
import { StaffPreview } from "./staff-preview";
import { DemoVenues } from "./demo-venues";
import { Faq } from "./website-controls";

const NOWRAP_PATTERN =
  /(zzgl\.\s+Zahlungsanbietergebühren\.?|plus payment provider fees\.?|\bQR codes?[\p{P}]*|\b\d+(?:[.,]\d+)?\s*(?:%|€)[\p{P}]*|\b[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+[\p{P}]*)/gu;

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
            </div>
            <figure className="welcome-main-photo">
              <Image
                src="/media/phone-guests.webp"
                alt={m.phoneAlt}
                width={1800}
                height={1200}
                sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1376px) calc(100vw - 96px), 1280px"
                loading="eager"
                fetchPriority="high"
              />
            </figure>
          </div>
        </section>
        <DemoVenues copy={m} />
        <section id="problem" className="problem-section container">
          <div className="problem-copy">
            <h2>{m.problemTitle}</h2>
            <p>{formatCopy(m.problemText)}</p>
            <p>{formatCopy(m.solutionText)}</p>
          </div>
          <figure className="story-photo">
            <Image
              src="/media/cafe-guest.webp"
              alt={m.cafeAlt}
              width={1200}
              height={1800}
              sizes="(max-width: 799px) 100vw, 50vw"
            />
          </figure>
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
