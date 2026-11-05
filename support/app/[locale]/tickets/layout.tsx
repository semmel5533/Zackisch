import type { Metadata } from "next";

const copy = {
  "de-de": { title: "Support-Tickets | Zackisch", description: "Geschützter Bereich für Support-Tickets und Anfragen." },
  "de-en": { title: "Support tickets | Zackisch", description: "Private support tickets and enquiries." },
};
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { ...copy[locale === "de-en" ? "de-en" : "de-de"], robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };
}

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
