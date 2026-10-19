"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { searchArticles, type SupportLocale } from "@/lib/knowledge-base";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { ArrowRight, Ticket } from "@phosphor-icons/react";

export function SupportSearch({ locale }: { locale: SupportLocale }) {
  const router = useRouter();
  const isDe = locale === "de-de";
  const [query, setQuery] = useState("");
  const searchResults = query.trim() ? searchArticles(locale, query) : [];

  return (
    <VStack gap={4} width="100%">
      <TextInput
        label={isDe ? "Wissensdatenbank durchsuchen" : "Search knowledge base"}
        isLabelHidden
        value={query}
        onChange={(val) => setQuery(val)}
        placeholder={
          isDe
            ? "Suche nach Kasse, POS, TSE, Stripe, Trinkgeld, QR-Druck, Tablet..."
            : "Search for POS, receipt, Stripe, tips, QR printing, tablet..."
        }
        startIcon="search"
      />

      <HStack gap={2} vAlign="center" wrap="wrap">
        <Text color="secondary">
          {isDe ? "Häufig gesucht:" : "Popular searches:"}
        </Text>
        {[
          "Kasse erfassen",
          "Kein Kassenbeleg",
          "2 % Provision",
          "QR Ruhezone",
          "Tablet koppeln",
        ].map((term) => (
          <Button
            key={term}
            label={term}
            variant="secondary"
            size="sm"
            onClick={() => setQuery(term)}
          />
        ))}
      </HStack>

      {query.trim() !== "" && (
        <Card variant="default" padding={5}>
          <VStack gap={4}>
            <HStack justify="between" vAlign="center">
              <Heading level={3}>
                {isDe
                  ? `Suchergebnisse für „${query}“ (${searchResults.length})`
                  : `Search results for "${query}" (${searchResults.length})`}
              </Heading>
              <Button
                label={isDe ? "Suche zurücksetzen" : "Clear search"}
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
              />
            </HStack>

            {searchResults.length === 0 ? (
              <EmptyState
                title={
                  isDe
                    ? "Kein passender Artikel gefunden"
                    : "No matching article found"
                }
                description={
                  isDe
                    ? "Unser Team hilft dir gerne direkt per Support-Ticket weiter."
                    : "Our team is happy to help you via a support ticket."
                }
                icon={<Icon icon="search" size="lg" />}
                actions={
                  <Button
                    label={
                      isDe
                        ? "Support-Ticket erstellen"
                        : "Create Support Ticket"
                    }
                    variant="primary"
                    size="sm"
                    href={`/${locale}/tickets`}
                    icon={<Icon icon={Ticket} size="sm" />}
                  />
                }
              />
            ) : (
              <VStack gap={2}>
                {searchResults.map((article) => (
                  <Card
                    key={article.slug}
                    variant="muted"
                    padding={4}
                    onClick={() =>
                      router.push(`/${locale}/articles/${article.slug}`)
                    }
                  >
                    <HStack justify="between" vAlign="center" gap={4}>
                      <VStack gap={1}>
                        <Text weight="semibold">
                          {article.title[locale]}
                        </Text>
                        <Text color="secondary">
                          {article.summary[locale]}
                        </Text>
                      </VStack>
                      <Icon icon={ArrowRight} size="sm" />
                    </HStack>
                  </Card>
                ))}
              </VStack>
            )}
          </VStack>
        </Card>
      )}
    </VStack>
  );
}
