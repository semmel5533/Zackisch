import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { AdminProvider } from "@/lib/admin-context";
import { AdminShell } from "@/components/AdminShell";
import { ZackischToaster } from "@/components/common/toast";

export const metadata: Metadata = {
  title: { default: "Team Dashboard | Zackisch", template: "%s | Zackisch" },
  description:
    "Internes Team- und Verwaltungsdashboard für Zackisch Gastronomie (internal.zackisch.com)",
  icons: {
    icon: [
      { url: "https://zackisch.com/brand/logo/platform/signet--favicon.svg", type: "image/svg+xml" },
      { url: "https://zackisch.com/brand/logo/platform/signet--favicon--32.png", sizes: "32x32", type: "image/png" },
      { url: "https://zackisch.com/brand/logo/platform/signet--favicon--32.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "https://zackisch.com/brand/logo/platform/signet--apple-touch--180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
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
    <html lang="de">
      <body className="min-h-screen antialiased">
        <ConvexClientProvider>
          <AdminProvider>
            <AdminShell>{children}</AdminShell>
            <ZackischToaster />
          </AdminProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
