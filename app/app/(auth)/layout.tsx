import type { Metadata } from "next";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";
import { Center } from "@astryxdesign/core/Center";
import { VStack } from "@astryxdesign/core/VStack";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  const isEn = locale === "en";
  return {
    title: {
      default: dict.authentication,
      template: "Zackisch: %s",
    },
    description: isEn
      ? "Sign in, register or reset your password."
      : "Anmelden, registrieren oder Passwort zurücksetzen.",
  };
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Center
      axis="both"
      minHeight="100vh"
      padding={4}
      style={{ backgroundColor: "var(--color-background-body, #F7F7F8)" }}
    >
      <VStack gap={4} hAlign="center" width="100%" maxWidth={460}>
        {children}
      </VStack>
    </Center>
  );
}
