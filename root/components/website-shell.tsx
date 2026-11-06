import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { content, loginUrl, signupUrl, type Locale } from "@/lib/content";
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
    { href: `/${locale}/pricing`, label: c.nav[1] },
    { href: `/${locale}#questions`, label: c.nav[2] },
    { href: help, label: c.nav[3] },
  ];
  return (
    <>
      <Link className="skip-link" href="#main">
        {c.skip}
      </Link>
      <header className="site-header container">
        <Link href={`/${locale}`} aria-label={c.home} className="brand">
          <Image
            src="/brand/logo/lockups/wordmark--transparent--standard.svg"
            alt=""
            loading="eager"
            width="150"
            height="64"
          />
        </Link>
        <nav className="desktop-navigation" aria-label={c.navLabel}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <RegionLanguage copy={c} locale={locale} slug={slug} />
          <Link className="header-login button button-secondary" href={loginUrl}>
            {c.login}
          </Link>
        </div>
        <MobileNavigation
          copy={c}
          links={[
            ...links,
            { href: loginUrl, label: c.login },
            { href: signupUrl, label: c.start },
          ]}
        />
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-grid container">
          <div>
            <RegionLanguage copy={c} locale={locale} slug={slug} />
            <Link href={`/${locale}/pricing`}>{c.nav[1]}</Link>
            <Link href={`/${locale}#how-it-works`}>{c.nav[0]}</Link>
            <Link href={`/${locale}/research`}>{c.research}</Link>
          </div>
          <div>
            <p className="footer-heading">{c.footerHelp}</p>
            <Link href={help}>{c.nav[3]}</Link>
            <Link href={`/${locale}/contact`}>{c.contact}</Link>
          </div>
          <div>
            <p className="footer-heading">{c.footerLegal}</p>
            <Link href={`/${locale}/legal-notice`}>{c.imprint}</Link>
            <Link href={`/${locale}/privacy`}>{c.privacy}</Link>
            <Link href={`/${locale}/privacy-policy`}>{c.platformPrivacy}</Link>
            <Link href={`/${locale}/gtc`}>{c.terms}</Link>
            <Link href={`/${locale}/data-processing`}>{c.dataProcessing}</Link>
            <Link href={`/${locale}/guest-terms`}>{c.guestTerms}</Link>
            <PrivacySettings copy={c} />
          </div>
        </div>
        <Image
          className="footer-mark"
          src="/brand/logo/original/wordmark.svg"
          alt="Zackisch"
          width="420"
          height="86"
          loading="lazy"
        />
      </footer>
    </>
  );
}
