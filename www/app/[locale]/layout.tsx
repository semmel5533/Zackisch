import type { Metadata } from "next";
import "../globals.css";
import { SectionNavigationProvider } from "@/components/section-navigation";
import { isLocale } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const icons: Metadata["icons"] = {
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
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = locale && isLocale(locale) ? locale : "de-de";
  return {
    ...pageMetadata(resolvedLocale),
    icons,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale === "de-en" ? "en" : "de"}>
      <body className="antialiased">
        <SectionNavigationProvider>{children}</SectionNavigationProvider>
      </body>
    </html>
  );
}
