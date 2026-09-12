import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_LOCALES, parseLocale } from "@/lib/regions";
import {
  PrivacySection1 as PrivacySection1De,
  PrivacySection2 as PrivacySection2De,
  PrivacySection3 as PrivacySection3De,
} from "@/components/privacy/PrivacySectionsDe";
import {
  PrivacySection1 as PrivacySection1En,
  PrivacySection2 as PrivacySection2En,
  PrivacySection3 as PrivacySection3En,
} from "@/components/privacy/PrivacySectionsEn";

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!ALL_LOCALES.includes(locale)) return {};

  const { lang } = parseLocale(locale);
  const isEn = lang === "en";

  return {
    title: isEn ? "Privacy Policy" : "Datenschutzerklärung",
    description: isEn
      ? "Privacy Policy of zakkig."
      : "Datenschutzerklärung von zakkig.",
    robots: "noindex, follow",
    alternates: {
      canonical: `https://www.zakkig.com/${locale}/privacy-policy`,
    },
    openGraph: {
      locale: isEn ? "en_US" : "de_DE",
      title: isEn
        ? "zakkig: Privacy Policy"
        : "zakkig: Datenschutzerklärung",
      description: isEn
        ? "Privacy Policy of zakkig."
        : "Datenschutzerklärung von zakkig.",
      images: ["/full.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!ALL_LOCALES.includes(locale)) {
    notFound();
  }

  const { lang } = parseLocale(locale);
  const isEn = lang === "en";

  return (
    <div className="bg-black text-white min-h-screen pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="text-xs md:text-sm tracking-widest font-bold uppercase text-zinc-500 hover:text-white transition-colors duration-200"
          >
            {isEn ? "Back to home" : "Zurück zur Startseite"}
          </Link>
        </div>

        <article className="prose-sm prose-invert lg:prose-xl lg:prose-invert focus:outline-none">
          <h1>{isEn ? "Privacy Policy" : "Datenschutzerklärung"}</h1>
          <p>{isEn ? "As of: July 11, 2026" : "Stand: 11. Juli 2026"}</p>

          {isEn ? (
            <>
              <PrivacySection1En />
              <PrivacySection2En />
              <PrivacySection3En />
            </>
          ) : (
            <>
              <PrivacySection1De />
              <PrivacySection2De />
              <PrivacySection3De />
            </>
          )}
        </article>
      </div>
    </div>
  );
}
