import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support-Tickets — Zackisch",
  description: "Geschützter Bereich für Support-Tickets und Anfragen.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
