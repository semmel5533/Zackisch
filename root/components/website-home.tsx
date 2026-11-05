import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { content, signupUrl, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing-content";
import { WebsiteShell } from "./website-shell";
import { Faq } from "./website-controls";

export function WebsiteHome({ locale }: { locale: Locale }) {
  const c = content[locale];
  const m = marketing[locale];
  return (
    <WebsiteShell locale={locale}>
      <main id="main" lang={c.lang} className="marketing">
        <section className="welcome container">
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
            <a className="quiet-link" href="#how-it-works">
              {m.explore}
              <ArrowDown aria-hidden size={18} />
            </a>
          </div>
          <div className="welcome-pictures">
            <figure className="welcome-main-photo">
              <Image
                src="/media/hospitality.webp"
                alt={c.heroAlt}
                width={2000}
                height={1164}
                sizes="(max-width: 700px) 100vw, 66vw"
                fetchPriority="high"
              />
              <figcaption>
                <a href="https://www.pexels.com/photo/delighted-friends-having-lunch-in-cafe-4349791/">
                  {c.photoCredit}
                </a>
              </figcaption>
            </figure>
            <figure className="welcome-side-photo">
              <Image
                src="/media/conversation.webp"
                alt={c.conversationAlt}
                width={1400}
                height={933}
                sizes="(max-width: 700px) 40vw, 30vw"
              />
              <figcaption>
                <a href="https://www.pexels.com/photo/happy-multiracial-friends-having-fun-together-in-cafe-4350223/">
                  {c.photoCredit}
                </a>
              </figcaption>
            </figure>
          </div>
          <ul className="promise-line">
            {m.promise.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        <section id="how-it-works" className="menu-chapters">
          <div className="chapter-introduction container">
            <h2>{m.menuTitle}</h2>
            <p>{m.menuIntro}</p>
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
