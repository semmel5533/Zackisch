import type { Metadata } from "next";
import "../globals.css";
import { SectionNavigationProvider } from "@/components/section-navigation";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata("de-de"),
  icons: {
    icon: [
      {
        url: "/brand/logo/platform/signet--favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/brand/logo/platform/signet--favicon--32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/brand/logo/platform/signet--apple-touch--180.png",
  },
};

export default function EntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        <SectionNavigationProvider>{children}</SectionNavigationProvider>
      </body>
    </html>
  );
}
