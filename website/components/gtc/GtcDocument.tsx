import { numericText } from "@/lib/numeric-text";
import { createElement, type ReactNode } from "react";
import { createTranslator } from "next-intl";
import de from "@/lib/gtc-de.json";
import en from "@/lib/gtc-en.json";

type LinkConfig = {
  key: string;
  external?: boolean;
};

export function GtcDocument({ locale }: { locale: "de" | "en" }) {
  const document = { de, en }[locale];
  const t = createTranslator({
    locale,
    messages: document.messages as Record<string, string>,
  });
  const rich: Record<string, (children: ReactNode) => ReactNode> = {
    strong: (children) => <strong>{children}</strong>,
    br: () => <br />,
    li: (children) => <li>{children}</li>,
    p: (children) => <p>{children}</p>,
    ul: (children) => <ul>{children}</ul>,
  };
  const links = (document.links || {}) as Record<string, LinkConfig>;
  for (const [tag, link] of Object.entries(links)) {
    rich[tag] = (children) => (
      <a
        href={t(link.key)}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return document.blocks.map((block) =>
    createElement(
      block.tag,
      { key: block.key, id: block.id },
      numericText(t.rich(block.key, rich)),
    ),
  );
}
