import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { AdminProvider } from "@/lib/admin-context";
import { AdminShell } from "@/components/AdminShell";
import { Toaster } from "sonner";

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
  title: "Zackisch Operations — Operative Zentrale",
  description: "Internes Operations- und Verwaltungsdashboard für Zackisch Gastronomie (ops.zackisch.com)",
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
        <ConvexClientProvider>
          <AdminProvider>
            <AdminShell>{children}</AdminShell>
            <Toaster position="top-right" richColors />
          </AdminProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
