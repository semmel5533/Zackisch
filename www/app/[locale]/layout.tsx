import type { Metadata } from "next";
import "../globals.css";
import { SectionNavigationProvider } from "@/components/section-navigation";
import { localeConfigs, resolveLocale } from "@/lib/content";
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
  return {
    ...pageMetadata(resolveLocale(locale)),
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
  const resolvedLocale = resolveLocale(locale);
  return (
    <html lang={localeConfigs[resolvedLocale].lang}>
      <body className="antialiased">
        <SectionNavigationProvider>{children}</SectionNavigationProvider>
      </body>
    </html>
  );
}
