import type { Metadata } from "next";

import "./globals.css";
import { ZackischToaster } from "@/components/common/toast";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

export const metadata: Metadata = {
  title: {
    default: "Zackisch: Digitales Bestell- und Bezahlsystem",
    template: "Zackisch: %s",
  },
  description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
  icons: {
    icon: "https://zackisch.com/brand/logo/platform/signet--pwa--512.png",
    apple: "https://zackisch.com/brand/logo/platform/signet--apple-touch--180.png",
  },
  openGraph: {
    title: "Zackisch",
    description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
    url: "https://app.zackisch.com",
    siteName: "Zackisch",
    images: ["https://zackisch.com/brand/logo/social/wordmark--og--citron--1200x630.png"],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zackisch",
    description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
    images: ["https://zackisch.com/brand/logo/social/wordmark--og--citron--1200x630.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="light antialiased overflow-x-clip font-sans">
      <body className="bg-canvas text-foreground overflow-x-clip min-h-screen">
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <ZackischToaster />
      </body>
    </html>
  );
}
