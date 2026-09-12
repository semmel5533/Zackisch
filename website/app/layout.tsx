import { Metadata } from "next";
import { Geist_Mono, Poppins, Geist, Inter } from "next/font/google";
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

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-variable",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={cn(
        "light",
        "antialiased",
        fontMono.variable,
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
