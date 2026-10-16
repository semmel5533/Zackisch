import { describe, expect, it } from "vitest";
import {
  SUPPORT_ARTICLES,
  SUPPORT_CATEGORIES,
  getArticleBySlug,
  getArticlesByCategory,
  searchArticles,
} from "../lib/knowledge-base";

describe("support knowledge base", () => {
  it("contains all 5 mandatory categories and 43 bilingual articles", () => {
    expect(SUPPORT_CATEGORIES).toHaveLength(5);
    expect(SUPPORT_ARTICLES).toHaveLength(43);

    for (const article of SUPPORT_ARTICLES) {
      expect(article.title["de-de"].length).toBeGreaterThan(5);
      expect(article.title["de-en"].length).toBeGreaterThan(5);
      expect(article.steps["de-de"].length).toBeGreaterThan(0);
      expect(article.steps["de-en"].length).toBeGreaterThan(0);
    }
  });

  it("maps every category to its articles", () => {
    expect(getArticlesByCategory("onboarding")).toHaveLength(9);
    expect(getArticlesByCategory("qr-tables")).toHaveLength(8);
    expect(getArticlesByCategory("orders-tablet")).toHaveLength(9);
    expect(getArticlesByCategory("payments-payouts")).toHaveLength(10);
    expect(getArticlesByCategory("account-legal")).toHaveLength(7);
  });

  it("finds POS and non-fiscal confirmation guides via synonym search", () => {
    const posResults = searchArticles("de-de", "kasse buchen");
    expect(posResults.some((a) => a.slug === "pos-single-entry-workflow")).toBe(
      true
    );

    const receiptResults = searchArticles("de-de", "kein kassenbeleg");
    expect(
      receiptResults.some((a) => a.slug === "guest-confirmation-vs-pos-receipt")
    ).toBe(true);

    const feeResults = searchArticles("de-en", "tip 2%");
    expect(
      feeResults.some(
        (a) => a.slug === "how-direct-charges-and-2-percent-fee-work"
      )
    ).toBe(true);
  });

  it("resolves every relatedSlugs reference to a valid article", () => {
    for (const article of SUPPORT_ARTICLES) {
      for (const rel of article.relatedSlugs) {
        expect(getArticleBySlug(rel)).toBeDefined();
      }
    }
  });
});
