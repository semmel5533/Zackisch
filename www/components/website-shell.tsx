import Image from "next/image";
import { WebsiteLink } from "./section-navigation";
import type { ReactNode } from "react";
import { content, loginUrl, type Locale } from "@/lib/content";
import {
  MobileNavigation,
  PrivacySettings,
  RegionLanguage,
} from "./website-controls";

export function WebsiteShell({
  locale,
  slug = "",
  children,
}: {
  locale: Locale;
  slug?: string;
  children: ReactNode;
}) {
  const c = content[locale];
  const help = `https://support.zackisch.com/${locale}`;
  const links = [
    { href: `/${locale}#how-it-works`, label: c.nav[0] },
    { href: `/${locale}#costs`, label: c.nav[1] },
    { href: `/${locale}#questions`, label: c.nav[2] },
    { href: `/${locale}#contact`, label: c.contact },
  ];
  return (
    <>
      <WebsiteLink className="skip-link" href="#main">
        {c.skip}
      </WebsiteLink>
      <div className="site-header-frame">
        <header className="site-header container">
          <WebsiteLink
            href={`/${locale}`}
            aria-label={c.home}
            className="brand"
            decoration={false}
          >
            <Image
              src="/brand/logo/lockups/wordmark--transparent--standard.svg"
              alt=""
              loading="eager"
              width="150"
              height="64"
            />
          </WebsiteLink>
          <nav className="desktop-navigation" aria-label={c.navLabel}>
            {links.map((link) => (
              <WebsiteLink key={link.href} href={link.href}>
                {link.label}
              </WebsiteLink>
            ))}
          </nav>
          <div className="header-actions">
            <WebsiteLink
              className="button button-ghost header-help"
              href={help}
            >
              {c.nav[3]}
            </WebsiteLink>
            <RegionLanguage copy={c} locale={locale} slug={slug} />
            <WebsiteLink
              className="header-login button button-primary"
              href={loginUrl}
            >
              {c.login}
            </WebsiteLink>
          </div>
          <MobileNavigation
            copy={c}
            locale={locale}
            slug={slug}
            links={links}
            helpHref={help}
            loginHref={loginUrl}
          />
        </header>
      </div>
      {children}
      <footer className="site-footer">
        <div className="footer-grid container">
          <div>
            <RegionLanguage copy={c} locale={locale} slug={slug} />
            <WebsiteLink
              className="button button-secondary footer-help"
              href={help}
            >
              {c.nav[3]}
            </WebsiteLink>
            <WebsiteLink href={`/${locale}#how-it-works`}>
              {c.nav[0]}
            </WebsiteLink>
            <WebsiteLink href={`/${locale}#costs`}>{c.nav[1]}</WebsiteLink>
            <WebsiteLink href={`/${locale}#questions`}>{c.nav[2]}</WebsiteLink>
            <WebsiteLink href={`/${locale}#contact`}>{c.contact}</WebsiteLink>
          </div>
          <div>
            <p className="footer-heading">{c.footerLegal}</p>
            <WebsiteLink href={`/${locale}/legal-notice`}>
              {c.imprint}
            </WebsiteLink>
            <WebsiteLink href={`/${locale}/privacy`}>{c.privacy}</WebsiteLink>
            <WebsiteLink href={`/${locale}/privacy-policy`}>
              {c.platformPrivacy}
            </WebsiteLink>
            <WebsiteLink href={`/${locale}/gtc`}>{c.terms}</WebsiteLink>
            <WebsiteLink href={`/${locale}/data-processing`}>
              {c.dataProcessing}
            </WebsiteLink>
            <WebsiteLink href={`/${locale}/guest-terms`}>
              {c.guestTerms}
            </WebsiteLink>
            <PrivacySettings copy={c} />
          </div>
        </div>
        <Image
          className="footer-mark"
          src="/brand/logo/original/wordmark.svg"
          alt="Zackisch"
          width="460"
          height="95"
          loading="lazy"
        />
      </footer>
    </>
  );
}
