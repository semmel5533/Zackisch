import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { Toaster } from "sonner";
import { resolveBrandAsset } from "@zackisch/design-system";

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
  title: "Zackisch Hilfe & Support — Wissensdatenbank & Tickets",
  description:
    "Schritt-für-Schritt-Anleitungen zur Einrichtung, Kassen-Erfassung (POS), Stripe Connect Direktzahlungen und QR-Bestellungen bei Zackisch.",
  icons: {
    icon: resolveBrandAsset("brandMark512", { site: "support" }),
    apple: resolveBrandAsset("appleTouchIcon", { site: "support" }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ConvexClientProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
