import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zackisch",
  description: "Zackisch — Modernes Bestellen & Bezahlen in der Gastronomie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
