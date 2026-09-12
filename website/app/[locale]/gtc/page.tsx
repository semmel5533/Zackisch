import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_LOCALES, parseLocale } from "@/lib/regions";

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
    title: isEn ? "Terms & Conditions" : "Allgemeine Geschäftsbedingungen (AGB)",
    description: isEn
      ? "Terms and Conditions of zakkig."
      : "Allgemeine Geschäftsbedingungen von zakkig.",
    robots: "noindex, follow",
    alternates: {
      canonical: `https://www.zakkig.com/${locale}/gtc`,
    },
    openGraph: {
      locale: isEn ? "en_US" : "de_DE",
      title: isEn ? "zakkig: Terms & Conditions" : "zakkig: AGB",
      description: isEn
        ? "Terms and Conditions of zakkig."
        : "Allgemeine Geschäftsbedingungen von zakkig.",
      images: ["/full.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function GtcPage({
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

        {isEn ? (
          <article className="prose-sm prose-invert lg:prose-xl lg:prose-invert focus:outline-none">
            <h1>General Terms & Conditions</h1>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">
              The General Terms & Conditions for zakkig are currently being finalized and will be published here shortly.
            </p>
            <div className="my-8 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <p className="text-sm text-zinc-400 mb-0">
                If you have any urgent legal questions or inquiries regarding merchant onboarding and terms, please contact us directly at{" "}
                <a href="mailto:selim@zakkig.com" className="text-white hover:underline">
                  selim@zakkig.com
                </a>.
              </p>
            </div>
            <p>
              Legal Notice:{" "}
              <Link href={`/${locale}/legal`} className="text-white hover:underline">
                https://www.zakkig.com/{locale}/legal
              </Link>
              <br />
              Privacy Policy:{" "}
              <Link href={`/${locale}/privacy`} className="text-white hover:underline">
                https://www.zakkig.com/{locale}/privacy
              </Link>
            </p>
          </article>
        ) : (
          <article className="prose-sm prose-invert lg:prose-xl lg:prose-invert focus:outline-none">
            <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">
              Die Allgemeinen Geschäftsbedingungen für die Nutzung von zakkig werden derzeit juristisch finalisiert und in Kürze an dieser Stelle bereitgestellt.
            </p>
            <div className="my-8 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <p className="text-sm text-zinc-400 mb-0">
                Bei dringenden Fragen zu unseren Nutzungs- und Geschäftsbedingungen für Gastronomen oder Gäste wenden Sie sich bitte jederzeit direkt an uns unter{" "}
                <a href="mailto:selim@zakkig.com" className="text-white hover:underline">
                  selim@zakkig.com
                </a>.
              </p>
            </div>
            <p>
              Impressum:{" "}
              <Link href={`/${locale}/legal`} className="text-white hover:underline">
                https://www.zakkig.com/{locale}/legal
              </Link>
              <br />
              Datenschutzerklärung:{" "}
              <Link href={`/${locale}/privacy`} className="text-white hover:underline">
                https://www.zakkig.com/{locale}/privacy
              </Link>
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
