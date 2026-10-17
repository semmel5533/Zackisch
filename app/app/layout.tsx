import { Poppins, Inter } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { BRAND_ASSETS, ToastProvider, resolveBrandAsset } from "@zackisch/design-system";

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
    icon: resolveBrandAsset("brandMark512", { site: "app" }),
    apple: resolveBrandAsset("appleTouchIcon", { site: "app" }),
  },
  openGraph: {
    title: "Zackisch",
    description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
    url: "https://app.zackisch.com",
    siteName: "Zackisch",
    images: [BRAND_ASSETS.ogImage],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zackisch",
    description: "Digitales Bestell- und Bezahlsystem für die Gastronomie.",
    images: [BRAND_ASSETS.ogImage],
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
        <ToastProvider>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          <Toaster position="bottom-right" closeButton />
        </ToastProvider>
      </body>
    </html>
  );
}
