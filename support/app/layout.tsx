import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";

export const metadata: Metadata = {
  title: "Zackisch Hilfe & Support — Wissensdatenbank & Tickets",
  description:
    "Schritt-für-Schritt-Anleitungen zur Einrichtung, Kassen-Erfassung (POS), Stripe Connect Direktzahlungen und QR-Bestellungen bei Zackisch.",
  icons: {
    icon: "https://zackisch.com/brand/logo/platform/signet--pwa--512.png",
    apple: "https://zackisch.com/brand/logo/platform/signet--apple-touch--180.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="light antialiased font-sans">
      <body className="bg-canvas text-foreground min-h-screen antialiased">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
