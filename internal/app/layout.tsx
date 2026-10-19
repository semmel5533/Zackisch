import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ZackischThemeProvider } from "@/lib/zackisch-theme";
import { ConvexClientProvider } from "@/lib/convex";
import { AdminProvider } from "@/lib/admin-context";
import { AdminShell } from "@/components/AdminShell";
import { AstryxToaster } from "@/components/common/toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins-variable",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zackisch Team Dashboard — Interne Team-Oberfläche",
  description: "Internes Team- und Verwaltungsdashboard für Zackisch Gastronomie (internal.zackisch.com)",
  icons: {
    icon: "/brand_mark_512.png",
    apple: "/apple-touch-icon.png",
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
    <html lang="de" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ZackischThemeProvider>
          <ConvexClientProvider>
            <AdminProvider>
              <AdminShell>{children}</AdminShell>
              <AstryxToaster />
            </AdminProvider>
          </ConvexClientProvider>
        </ZackischThemeProvider>
      </body>
    </html>
  );
}
