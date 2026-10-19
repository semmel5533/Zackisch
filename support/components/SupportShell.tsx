"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SupportLocale } from "@/lib/knowledge-base";
import { AppShell } from "@astryxdesign/core/AppShell";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { BookOpen, Ticket, Globe } from "@phosphor-icons/react";

export function SupportShell({
  locale,
  children,
}: {
  locale: SupportLocale;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isDe = locale === "de-de";
  const alternateLocale: SupportLocale = isDe ? "de-en" : "de-de";
  const alternatePath = pathname
    ? pathname.replace(/^\/(de-de|de-en)/, `/${alternateLocale}`)
    : `/${alternateLocale}`;

  const isTicketsActive = Boolean(pathname?.includes("/tickets"));

  return (
    <AppShell
      variant="elevated"
      topNav={
        <TopNav
          label="Zackisch Support Navigation"
          heading={
            <TopNavHeading
              logo={
                <img
                  src="/icon.svg"
                  alt="Zackisch"
                  style={{ height: 26, width: 26, borderRadius: 4 }}
                />
              }
              heading="Zackisch Support"
              headingHref={`/${locale}`}
              subheading="support.zackisch.com"
              headerEndContent={
                <Badge
                  label={isDe ? "Hilfe & Support" : "Help & Support"}
                  variant="neutral"
                />
              }
            />
          }
          startContent={
            <HStack gap={1} vAlign="center">
              <TopNavItem
                label={isDe ? "Wissensdatenbank" : "Knowledge Base"}
                href={`/${locale}`}
                icon={<Icon icon={BookOpen} size="sm" />}
                isSelected={!isTicketsActive}
              />
              <TopNavItem
                label={isDe ? "Support-Tickets" : "Support Tickets"}
                href={`/${locale}/tickets`}
                icon={<Icon icon={Ticket} size="sm" />}
                isSelected={isTicketsActive}
              />
            </HStack>
          }
          endContent={
            <HStack gap={2} vAlign="center">
              <Button
                label={isDe ? "DE → EN" : "EN → DE"}
                variant="ghost"
                size="sm"
                href={alternatePath}
                icon={<Icon icon={Globe} size="sm" />}
              />
              <Button
                label={isDe ? "Ticket erstellen" : "Open Ticket"}
                variant="primary"
                size="sm"
                href={`/${locale}/tickets`}
                icon={<Icon icon={Ticket} size="sm" />}
              />
              <Button
                label="Dashboard"
                variant="ghost"
                size="sm"
                href="https://app.zackisch.com"
                endContent={<Icon icon="externalLink" size="xsm" />}
              />
            </HStack>
          }
        />
      }
    >
      <Layout>
        <LayoutContent>
          <VStack gap={8} width="100%">
            <VStack gap={6} width="100%">
              {children}
            </VStack>

            <VStack gap={4} padding={6}>
              <Divider />
              <HStack justify="between" vAlign="center" gap={4} wrap="wrap">
                <VStack gap={1}>
                  <Text weight="semibold">
                    Zackisch Support Center (support.zackisch.com)
                  </Text>
                  <Text color="secondary">
                    {isDe
                      ? "Selbstbedienungs-Hilfe und direkter Ticket-Support für Gastronomiebetriebe."
                      : "Self-service knowledge base and direct ticket support for hospitality venues."}
                  </Text>
                </VStack>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <Button
                    label={isDe ? "Impressum" : "Legal Notice"}
                    variant="ghost"
                    size="sm"
                    href={`https://zackisch.com/${locale}/legal-notice`}
                  />
                  <Button
                    label={isDe ? "Datenschutz" : "Privacy Policy"}
                    variant="ghost"
                    size="sm"
                    href={`https://zackisch.com/${locale}/privacy-policy`}
                  />
                  <Button
                    label={isDe ? "AGB" : "Terms"}
                    variant="ghost"
                    size="sm"
                    href={`https://zackisch.com/${locale}/gtc`}
                  />
                  <Button
                    label={
                      isDe ? "Auftragsverarbeitung (AVV)" : "Data Processing (DPA)"
                    }
                    variant="ghost"
                    size="sm"
                    href={`https://zackisch.com/${locale}/data-processing`}
                  />
                  <Button
                    label={isDe ? "Barrierefreiheit" : "Accessibility"}
                    variant="ghost"
                    size="sm"
                    href={`https://zackisch.com/${locale}/accessibility`}
                  />
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </LayoutContent>
      </Layout>
    </AppShell>
  );
}
