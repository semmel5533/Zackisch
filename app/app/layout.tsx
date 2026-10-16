import { Poppins, Inter } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { BRAND_ASSETS } from "@zackisch/design-system";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins-variable",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter-variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zackisch: Digitales Bestell- und Bezahlsystem",
    template: "Zackisch: %s",
  },
  description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
  icons: {
    icon: BRAND_ASSETS.brandMark512,
    apple: BRAND_ASSETS.appleTouchIcon,
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

import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={cn("light antialiased overflow-x-clip font-sans", poppins.variable, inter.variable)}
    >
      <body className="bg-background text-foreground overflow-x-clip min-h-screen">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
