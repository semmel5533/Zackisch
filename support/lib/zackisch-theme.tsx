"use client";

import React from "react";
import Link from "next/link";
import { Theme, defineTheme } from "@astryxdesign/core/theme";
import { LinkProvider } from "@astryxdesign/core/Link";
import { themes, defaultThemeSlug } from "@/astryx-themes";

export const zackischTheme = defineTheme({
  name: "zackisch",
  extends: themes[defaultThemeSlug],
  typography: {
    scale: { base: 14, ratio: 1.2 },
    body: {
      family: "Poppins",
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    heading: {
      family: "Poppins",
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      weights: { 3: "bold", 4: "bold" },
    },
    code: {
      family: "Inter",
      fallbacks:
        'ui-monospace, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  radius: {
    base: 4,
    multiplier: 1,
  },
  tokens: {
    "--color-accent": ["#111111", "#FAFAFA"],
    "--color-accent-muted": ["rgba(17, 17, 17, 0.06)", "rgba(250, 250, 250, 0.12)"],
    "--color-on-accent": ["#FFFFFF", "#111111"],
    "--color-text-accent": ["#111111", "#FAFAFA"],
    "--color-icon-accent": ["#111111", "#FAFAFA"],
    "--color-background-surface": ["#FFFFFF", "#161618"],
    "--color-background-body": ["#F7F7F8", "#0D0D0E"],
    "--color-background-card": ["#FFFFFF", "#161618"],
    "--color-text-primary": ["#0A0A0B", "#FAFAFA"],
    "--color-text-secondary": ["#52525B", "#A1A1AA"],
    "--radius-inner": "0.375rem",
    "--radius-element": "0.5rem",
    "--radius-container": "0.75rem",
  },
});

export function ZackischThemeProvider({
  children,
  mode = "light",
}: {
  children: React.ReactNode;
  mode?: "light" | "dark" | "system";
}) {
  return (
    <Theme theme={zackischTheme} mode={mode}>
      <LinkProvider component={Link as any}>{children}</LinkProvider>
    </Theme>
  );
}
