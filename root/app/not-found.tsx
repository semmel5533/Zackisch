import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { buttonVariants } from "@/components/ui/button-variants";
import { translations } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: {
    index: false,
    follow: false,
  },
};

const t = translations.de;

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height,104px))] justify-between">
      <main id="content" className="mx-auto flex w-[calc(100%-2*var(--site-gutter))] max-w-[1200px] flex-1 flex-col items-start justify-center py-24">
        <h1 className="max-w-[720px] text-[clamp(32px,5vw,52px)] font-semibold leading-[1.2] tracking-[-.035em]">{t.notFoundTitle}</h1>
        <p className="my-6 text-muted-foreground">{t.notFoundText}</p>
        <Link
          className={buttonVariants()}
          href={t.homeUrl}
        >
          <span>{t.backHome}</span>
        </Link>
      </main>
      <SiteFooter variant="minimal" />
    </div>
  );
}
