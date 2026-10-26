import type { Metadata } from "next";

import "./globals.css";
import { AstryxToaster } from "@/components/common/toast";
import { ZackischThemeProvider } from "@/lib/zackisch-theme";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

export const metadata: Metadata = {
  title: {
    default: "Zackisch: Digitales Bestell- und Bezahlsystem",
    template: "Zackisch: %s",
  },
  description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
  icons: {
    icon: "/brand_mark_512.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Zackisch",
    description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
    url: "https://app.zackisch.com",
    siteName: "Zackisch",
    images: ["https://zackisch.com/og_image.png"],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zackisch",
    description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
    images: ["https://zackisch.com/og_image.png"],
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
      <body className="bg-background text-foreground overflow-x-clip min-h-screen">
        <ZackischThemeProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <AstryxToaster />
        </ZackischThemeProvider>
      </body>
    </html>
  );
}
