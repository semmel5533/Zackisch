import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "QR-Bestellung | Zackisch",
  icons: { icon: [{ url: "/brand/logo/platform/signet--favicon.svg", type: "image/svg+xml" }, { url: "/brand/logo/platform/signet--favicon--32.png", sizes: "32x32", type: "image/png" }], apple: "/brand/logo/platform/signet--apple-touch--180.png" },
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
