import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { content, signupUrl, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing-content";
import { WebsiteShell } from "./website-shell";
import { DemoVenues } from "./demo-venues";
import { Faq } from "./website-controls";

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
              <p className="welcome-intro">{m.intro}</p>
              <div className="welcome-actions">
                <Link className="button button-primary" href={signupUrl}>
                  {c.start}
                  <ArrowUpRight aria-hidden size={20} />
                </Link>
                <a className="quiet-link" href="#problem">
                  {m.explore}
                  <ArrowDown aria-hidden size={18} />
                </a>
              </div>
            </div>
            <figure className="welcome-main-photo">
              <Image
                src="/media/phone-guests.webp"
                alt={m.phoneAlt}
                width={1800}
                height={1200}
                sizes="(max-width: 799px) 100vw, 60vw"
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
            <p>{m.problemText}</p>
            <p>{m.solutionText}</p>
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
          </div>
          <div className="chapter-stack container">
            {m.features.map((feature, i) => (
              <article
                className={`menu-chapter chapter-${i}`}
                key={feature.title}
              >
                <div className="chapter-copy">
                  <h3>{feature.title}</h3>
                  <p className="chapter-summary">{feature.text}</p>
                  <p className="chapter-detail">{feature.detail}</p>
                </div>
                <figure className="screenshot-placeholder">
                  <figcaption>{m.placeholder}</figcaption>
                  <p>{feature.image}</p>
                </figure>
              </article>
            ))}
          </div>
          <div className="venue-control container">
            <h3>{m.control}</h3>
            <p>{m.controlText}</p>
          </div>
        </section>
        <section className="service-section container">
          <figure className="story-photo service-photo">
            <Image
              src="/media/restaurant-service.webp"
              alt={m.serviceAlt}
              width={1400}
              height={2100}
              sizes="(max-width: 799px) 100vw, 50vw"
            />
          </figure>
          <div>
            <h2>{m.teamTitle}</h2>
            <p>{m.teamText}</p>
          </div>
          <figure className="screenshot-placeholder staff-placeholder">
            <figcaption>{m.placeholder}</figcaption>
            <p>{m.teamImage}</p>
          </figure>
        </section>
        <section className="cost-section">
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
              <p>{m.seasonal}</p>
              <p>{m.feeDetail}</p>
              <Link className="inline-link" href={`/${locale}/pricing`}>
                {c.priceLink}
                <ArrowUpRight aria-hidden size={18} />
              </Link>
            </div>
          </div>
        </section>
        <section className="start-section container">
          <h2>{m.setupTitle}</h2>
          <div>
            <p className="start-description">{m.setupText}</p>
            <p>{m.setupNote}</p>
            <a
              className="inline-link"
              href={`https://support.zackisch.com/${locale}`}
            >
              {c.setupHelp}
              <ArrowUpRight aria-hidden size={18} />
            </a>
          </div>
        </section>
        <section id="questions" className="questions container">
          <h2>{m.faq}</h2>
          <Faq items={c.faqs} />
        </section>
        <section className="personal-contact container">
          <h2>{m.personalTitle}</h2>
          <p>{m.personalText}</p>
          <a href="mailto:selim@zackisch.com">
            selim@zackisch.com
            <ArrowUpRight size={32} aria-hidden />
          </a>
        </section>
        <section className="last-invitation container">
          <h2>{m.close}</h2>
          <p>{m.closeText}</p>
          <Link className="button button-primary" href={signupUrl}>
            {c.start}
            <ArrowUpRight aria-hidden size={20} />
          </Link>
        </section>
      </main>
    </WebsiteShell>
  );
}
