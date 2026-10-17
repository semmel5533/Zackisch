import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { AdminProvider } from "@/lib/admin-context";
import { AdminShell } from "@/components/AdminShell";
import { Toaster } from "sonner";
import { ToastProvider, resolveBrandAsset } from "@zackisch/design-system";

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
    icon: resolveBrandAsset("brandMark512", { site: "internal" }),
    apple: resolveBrandAsset("appleTouchIcon", { site: "internal" }),
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
        <ToastProvider>
          <ConvexClientProvider>
            <AdminProvider>
              <AdminShell>{children}</AdminShell>
              <Toaster position="bottom-right" closeButton />
            </AdminProvider>
          </ConvexClientProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
