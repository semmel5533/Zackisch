"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { searchArticles, type SupportLocale } from "@/lib/knowledge-base";
import { TextField, Button, Card } from "@/components/ui/primitives";
import { ArrowRight, Ticket, MagnifyingGlass } from "@phosphor-icons/react";

export function SupportSearch({ locale }: { locale: SupportLocale }) {
  const router = useRouter();
  const isDe = locale === "de-de";
  const [query, setQuery] = useState("");
  const searchResults = query.trim() ? searchArticles(locale, query) : [];

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <TextField
        label={isDe ? "Wissensdatenbank durchsuchen" : "Search knowledge base"}
        hideLabel
        value={query}
        onChange={(val) => setQuery(val)}
        placeholder={
          isDe
            ? "Suche nach Kasse, POS, TSE, Stripe, Trinkgeld, QR-Druck, Tablet..."
            : "Search for POS, receipt, Stripe, tips, QR printing, tablet..."
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          {isDe ? "Häufig gesucht:" : "Popular searches:"}
        </span>
        {[
          "Kasse erfassen",
          "Kein Kassenbeleg",
          "2 % Provision",
          "QR Ruhezone",
          "Tablet koppeln",
        ].map((term) => (
          <Button
            key={term}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setQuery(term)}
          >
            {term}
          </Button>
        ))}
      </div>

      {query.trim() !== "" && (
        <Card variant="default" padding={5}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-foreground">
                {isDe
                  ? `Suchergebnisse für „${query}“ (${searchResults.length})`
                  : `Search results for "${query}" (${searchResults.length})`}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
              >
                {isDe ? "Suche zurücksetzen" : "Clear search"}
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center text-center gap-3 py-6">
                <MagnifyingGlass className="size-8 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground">
                    {isDe
                      ? "Kein passender Artikel gefunden"
                      : "No matching article found"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isDe
                      ? "Unser Team hilft dir gerne direkt per Support-Ticket weiter."
                      : "Our team is happy to help you via a support ticket."}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  href={`/${locale}/tickets`}
                >
                  <Ticket className="size-4" />
                  <span>
                    {isDe ? "Support-Ticket erstellen" : "Create Support Ticket"}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {searchResults.map((article) => (
                  <Card
                    key={article.slug}
                    variant="muted"
                    padding={4}
                    onClick={() =>
                      router.push(`/${locale}/articles/${article.slug}`)
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm text-foreground">
                          {article.title[locale]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.summary[locale]}
                        </span>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
