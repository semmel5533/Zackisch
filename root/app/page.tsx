import { AppShell } from "@astryxdesign/core/AppShell";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";

export default function Home() {
  return (
    <AppShell height="fill" variant="surface">
      <Layout height="fill">
        <LayoutContent>
          <VStack gap={2} hAlign="center" vAlign="center" height="100%">
            <Heading level={1}>Zackisch</Heading>
            <Text type="supporting">Next.js + Astryx Design System Starter</Text>
          </VStack>
        </LayoutContent>
      </Layout>
    </AppShell>
  );
}
