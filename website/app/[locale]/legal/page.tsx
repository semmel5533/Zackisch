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
    title: isEn ? "Legal Notice" : "Impressum",
    description: isEn ? "Legal Notice of zakkig." : "Impressum von zakkig.",
    robots: "noindex, follow",
    alternates: {
      canonical: `https://www.zakkig.com/${locale}/legal`,
    },
    openGraph: {
      locale: isEn ? "en_US" : "de_DE",
      title: isEn ? "zakkig: Legal Notice" : "zakkig: Impressum",
      description: isEn ? "Legal Notice of zakkig." : "Impressum von zakkig.",
      images: ["/full.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LegalPage({
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
            <h1>Legal Notice</h1>
            <p>Information provided according to § 5 DDG</p>
            <p>
              Selim Eser
              <br />
              Dannstadter Straße 6-8
              <br />
              68199 Mannheim
              <br />
              Germany
            </p>
            <p>
              <strong>Represented by:</strong>
              <br />
              Selim Eser
            </p>
            <p>
              <strong>Contact:</strong>
              <br />
              Phone:{" "}
              <a href="tel:+4962186037315" className="text-white hover:underline">
                +49-621 86037315
              </a>
              <br />
              Email:{" "}
              <a href="mailto:selim@zakkig.com" className="text-white hover:underline">
                selim@zakkig.com
              </a>
            </p>
            <p>
              <strong>
                Consumer dispute resolution / Universal arbitration board
              </strong>
              <br />
              We do not participate in dispute resolution proceedings before a
              consumer arbitration board and are not obliged to do so.
            </p>
            <p>
              Privacy Policy:{" "}
              <a
                href={`https://www.zakkig.com/${locale}/privacy`}
                className="text-white hover:underline"
              >
                https://www.zakkig.com/{locale}/privacy
              </a>
            </p>
          </article>
        ) : (
          <article className="prose-sm prose-invert lg:prose-xl lg:prose-invert focus:outline-none">
            <h1>Impressum</h1>
            <p>Angaben gemäß § 5 DDG</p>
            <p>
              Selim Eser
              <br />
              Dannstadter Straße 6-8
              <br />
              68199 Mannheim
            </p>
            <p>
              <strong>Vertreten durch:</strong>
              <br />
              Selim Eser
            </p>
            <p>
              <strong>Kontakt:</strong>
              <br />
              Telefon:{" "}
              <a href="tel:+4962186037315" className="text-white hover:underline">
                +49-621 86037315
              </a>
              <br />
              E-Mail:{" "}
              <a href="mailto:selim@zakkig.com" className="text-white hover:underline">
                selim@zakkig.com
              </a>
            </p>
            <p>
              <strong>
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </strong>
              <br />
              Wir nehmen nicht an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teil und sind dazu auch nicht
              verpflichtet.
            </p>
            <p>
              Datenschutzerklärung:{" "}
              <a
                href={`https://www.zakkig.com/${locale}/privacy`}
                className="text-white hover:underline"
              >
                https://www.zakkig.com/{locale}/privacy
              </a>
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
