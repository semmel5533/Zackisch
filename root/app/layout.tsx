import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ZackischThemeProvider } from "@/lib/zackisch-theme";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins-variable",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zackisch",
  description: "Zackisch — Digitales Bestell- und Bezahlsystem für die moderne Gastronomie.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const lang = headerList.get("x-locale") || "de-DE";

  return (
    <html lang={lang} className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-white text-[#111111]">
        <ZackischThemeProvider>{children}</ZackischThemeProvider>
      </body>
    </html>
  );
}
