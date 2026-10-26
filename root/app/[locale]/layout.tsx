import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Zackisch",
  icons: { icon: "/zackisch/brand-mark.svg" },
  robots: { index: true, follow: true },
  description: "Zackisch — Modernes Bestellen & Bezahlen in der Gastronomie",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale === "de-en" ? "en" : "de"}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
