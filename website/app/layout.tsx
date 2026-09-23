import { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { translations } from "@/lib/translations";

const t = translations.de;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zakkig.com"),
  title: {
    default: t.metaTitle,
    template: "zakkig: %s",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: t.metaTitle,
    description: t.metaDescription,
    url: "https://www.zakkig.com",
    siteName: "zakkig",
    images: ["/og_image.png"],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: t.metaTitle,
    description: t.metaDescription,
    images: ["/og_image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

import "./globals.css";
import { cn } from "@/lib/utils";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={cn(
        "light",
        "antialiased",
        "font-sans",
        poppins.variable,
        inter.variable,
      )}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
