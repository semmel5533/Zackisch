import { pageTitles } from "@/lib/page-titles";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: pageTitles.de["/staff"] };

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
