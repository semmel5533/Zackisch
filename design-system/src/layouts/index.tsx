import * as React from "react";
import { cn } from "../utils/cn";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Centered responsive page container with clamp padding
 */
export function PageContainer({
  children,
  className,
  ...props
}: LayoutProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Public marketing section with standardized block spacing
 */
export function PublicSection({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-12 sm:py-16 lg:py-24", className)}
      {...props}
    >
      <PageContainer>{children}</PageContainer>
    </section>
  );
}

/**
 * MKT-01: Editorial Hero Layout
 */
export function EditorialHero({
  title,
  description,
  action,
  visual,
  badge,
  className,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
  visual: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-12 sm:py-20 lg:py-28 bg-(--zds-surface-public)", className)}>
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            {badge && <div>{badge}</div>}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-(--zds-text-strong) leading-[1.08] font-brand">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-(--zds-text-secondary) leading-relaxed max-w-xl">
              {description}
            </p>
            {action && <div className="pt-2 flex items-center gap-4 flex-wrap">{action}</div>}
          </div>
          <div className="lg:col-span-6">{visual}</div>
        </div>
      </PageContainer>
    </section>
  );
}

/**
 * EDT-01: Reading Layout for legal and knowledge-base articles
 */
export function ReadingLayout({
  title,
  subtitle,
  toc,
  tocTitle,
  locale = "de",
  breadcrumbs,
  children,
  className,
}: React.PropsWithChildren<{
  title: string;
  subtitle?: string;
  toc?: React.ReactNode;
  tocTitle?: string;
  locale?: "de" | "en";
  breadcrumbs?: React.ReactNode;
  className?: string;
}>) {
  const resolvedTocTitle = tocTitle ?? (locale === "en" ? "Contents" : "Inhalt");
  return (
    <main id="main" className={cn("min-h-screen bg-(--zds-surface-public) py-10 sm:py-16", className)}>
      <PageContainer>
        {breadcrumbs && <div className="mb-8">{breadcrumbs}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {toc && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-(--zds-text-secondary)">
                {resolvedTocTitle}
              </h4>
              <nav aria-label={resolvedTocTitle} className="text-xs space-y-2">{toc}</nav>
            </aside>
          )}
          <article className={cn("prose prose-neutral max-w-none", toc ? "lg:col-span-9 max-w-[72ch]" : "max-w-[72ch] mx-auto")}>
            <header className="mb-10 pb-6 border-b border-(--zds-border-subtle)">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-(--zds-text-strong) font-brand">
                {title}
              </h1>
              {subtitle && <p className="mt-3 text-base text-(--zds-text-secondary)">{subtitle}</p>}
            </header>
            <div className="text-sm sm:text-base leading-relaxed text-(--zds-text-primary) space-y-6">
              {children}
            </div>
          </article>
        </div>
      </PageContainer>
    </main>
  );
}

/**
 * AUTH-01: Focused Login & Registration Layout
 */
export function AuthLayout({
  title,
  subtitle,
  logo,
  children,
  footer,
  className,
}: React.PropsWithChildren<{
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}>) {
  return (
    <main id="main" className={cn("min-h-screen flex items-center justify-center p-4 sm:p-6 bg-(--zds-surface-page)", className)}>
      <div className="w-full max-w-md bg-(--zds-surface-card) rounded-3xl border border-(--zds-border-subtle) shadow-sm p-6 sm:p-10 space-y-6">
        {logo && <div className="flex justify-center">{logo}</div>}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-(--zds-text-strong) font-brand">
            {title}
          </h1>
          {subtitle && <p className="text-xs sm:text-sm text-(--zds-text-secondary) leading-relaxed">{subtitle}</p>}
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="pt-4 border-t border-(--zds-border-subtle) text-center text-xs text-(--zds-text-secondary)">{footer}</div>}
      </div>
    </main>
  );
}

/**
 * ADM-01: Operational Workspace Layout
 */
export function WorkspaceLayout({
  navigation,
  navigationLabel,
  locale = "de",
  header,
  children,
  className,
}: {
  navigation: React.ReactNode;
  navigationLabel?: string;
  locale?: "de" | "en";
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const resolvedNavLabel =
    navigationLabel ?? (locale === "en" ? "Main navigation" : "Hauptnavigation");
  return (
    <div className={cn("min-h-screen bg-(--zds-surface-page) flex flex-col lg:flex-row", className)}>
      <aside aria-label={resolvedNavLabel} className="w-full lg:w-64 shrink-0 bg-(--zds-surface-card) border-r border-(--zds-border-subtle) z-20 print:hidden">
        {navigation}
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-(--zds-surface-card) border-b border-(--zds-border-subtle) px-4 sm:px-8 py-4">
          {header}
        </header>
        <main id="main" className="flex-1 p-4 sm:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * OPS-01: Live Staff Tablet Layout
 */
export function OpsLayout({
  header,
  statusBanner,
  children,
  className,
}: {
  header: React.ReactNode;
  statusBanner?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-(--zds-surface-page) flex flex-col font-sans select-none", className)}>
      <header className="sticky top-0 z-20 bg-(--zds-surface-inverse) text-(--zds-text-inverse) px-4 sm:px-6 py-3.5 shadow-md">
        {header}
      </header>
      {statusBanner && <div className="z-10">{statusBanner}</div>}
      <main id="main" className="flex-1 p-4 sm:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

/**
 * SHOP-01: Guest Ordering Layout
 */
export function ShopLayout({
  merchantHeader,
  categoryNav,
  cartDrawer,
  children,
  className,
}: {
  merchantHeader: React.ReactNode;
  categoryNav?: React.ReactNode;
  cartDrawer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-(--zds-surface-page) flex flex-col pb-24", className)}>
      <header className="bg-(--zds-surface-card) border-b border-(--zds-border-subtle) sticky top-0 z-10">
        {merchantHeader}
        {categoryNav}
      </header>
      <main id="main" className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {children}
      </main>
      {cartDrawer}
    </div>
  );
}

/**
 * SYS-01: System State Layout (404, 500, Offline, Maintenance)
 */
export function SystemLayout({
  title,
  description,
  icon,
  action,
  code,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  code?: string;
  className?: string;
}) {
  return (
    <main id="main" className={cn("min-h-screen flex items-center justify-center p-4 bg-(--zds-surface-page)", className)}>
      <div className="w-full max-w-md bg-(--zds-surface-card) rounded-3xl border border-(--zds-border-subtle) p-8 text-center space-y-5 shadow-xs">
        {code && <span className="font-mono text-xs font-semibold text-(--zds-text-secondary)">{code}</span>}
        {icon && <div className="flex justify-center text-(--zds-text-primary)">{icon}</div>}
        <h1 className="text-xl sm:text-2xl font-semibold text-(--zds-text-primary) font-brand tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-(--zds-text-secondary) leading-relaxed">{description}</p>
        {action && <div className="pt-2 flex justify-center">{action}</div>}
      </div>
    </main>
  );
}
