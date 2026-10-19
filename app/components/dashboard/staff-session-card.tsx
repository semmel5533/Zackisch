"use client";

import { useTransition, useState } from "react";
import {
  Copy,
  ArrowsClockwise,
  QrCode,
  Info,
} from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@astryxdesign/core/Card";
import { Button } from "@astryxdesign/core/Button";
import { Tooltip } from "@astryxdesign/core/Tooltip";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Layout, LayoutContent, LayoutFooter } from "@astryxdesign/core/Layout";
import { VStack, HStack } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { ReactQRCode } from "@lglab/react-qr-code";
import { generateStaffSessionAction } from "@/actions/staff-actions";

export function StaffSessionCard({
  staffToken: initialStaffToken,
  businessId,
  baseUrl,
}: {
  staffToken: string;
  businessId: string;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [staffToken, setStaffToken] = useState(initialStaffToken);
  const [staffQrOpen, setStaffQrOpen] = useState(false);
  const [regenerateStaffOpen, setRegenerateStaffOpen] = useState(false);

  const getLink = (token: string) =>
    `${baseUrl}/staff/${businessId}?token=${token}`;

  function copyLinkText(token: string) {
    const link = getLink(token);
    navigator.clipboard.writeText(link);
    toast.success(t("linkCopied"));
  }

  function confirmRegenerateStaff() {
    startTransition(async () => {
      const result = await generateStaffSessionAction(businessId);
      if (result.success && result.session) {
        setStaffToken(result.session.token);
        toast.success(t("regeneratedStaff"));
      } else if (result.error) {
        toast.error(result.error);
      }
      setRegenerateStaffOpen(false);
    });
  }

  return (
    <Card variant="default" padding={5} elevation="low" width="100%">
      <VStack gap={4} justify="between" height="100%">
        <HStack justify="between" vAlign="center">
          <HStack gap={2} vAlign="center">
            <Heading level={4}>{t("staffSession")}</Heading>
            <Tooltip content={t("staffSessionDesc")}>
              <span style={{ cursor: "pointer", display: "inline-flex" }}>
                <Icon icon={Info} size="sm" color="secondary" />
              </span>
            </Tooltip>
          </HStack>
        </HStack>

        <VStack gap={3} width="100%">
          <Button
            label={t("scan")}
            variant="primary"
            size="md"
            width="100%"
            onClick={() => setStaffQrOpen(true)}
            icon={<Icon icon={QrCode} size="sm" />}
          />

          <HStack gap={2} width="100%">
            <Button
              label={t("copyLink")}
              variant="secondary"
              size="md"
              width="50%"
              isDisabled={isPending}
              onClick={() => copyLinkText(staffToken)}
              icon={<Icon icon={Copy} size="sm" />}
            />
            <Button
              label={t("createSession")}
              variant="secondary"
              size="md"
              width="50%"
              isDisabled={isPending}
              onClick={() => setRegenerateStaffOpen(true)}
              icon={<Icon icon={ArrowsClockwise} size="sm" />}
            />
          </HStack>
        </VStack>
      </VStack>

      {/* Staff QR Dialog */}
      <Dialog
        isOpen={staffQrOpen}
        onOpenChange={setStaffQrOpen}
        width={400}
        purpose="info"
      >
        <Layout
          header={
            <DialogHeader
              title={t("staffSession")}
              onOpenChange={setStaffQrOpen}
            />
          }
          content={
            <LayoutContent>
              <VStack gap={4} hAlign="center" padding={4}>
                <a
                  href={getLink(staffToken)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                    padding: 20,
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.08)",
                    width: "100%",
                    maxWidth: 320,
                  }}
                >
                  <ReactQRCode
                    value={getLink(staffToken)}
                    size={280}
                    level="H"
                    background="#FFFFFF"
                    marginSize={0}
                    dataModulesSettings={{
                      color: "#000000",
                      style: "square-sm",
                    }}
                    finderPatternOuterSettings={{
                      color: "#000000",
                      style: "square",
                    }}
                    finderPatternInnerSettings={{
                      color: "#000000",
                      style: "square",
                    }}
                    imageSettings={{
                      src: "/combination_mark_qr.png",
                      height: 42,
                      width: 133,
                      excavate: true,
                    }}
                  />
                </a>
                <Text color="secondary" size="sm">
                  {t("staffQrWarning")}
                </Text>
              </VStack>
            </LayoutContent>
          }
        />
      </Dialog>

      {/* Regenerate Staff Session Confirmation Dialog */}
      <Dialog
        isOpen={regenerateStaffOpen}
        onOpenChange={setRegenerateStaffOpen}
        width={440}
        purpose="required"
      >
        <Layout
          header={
            <DialogHeader
              title={t("regenerateStaffTitle")}
              onOpenChange={setRegenerateStaffOpen}
            />
          }
          content={
            <LayoutContent>
              <VStack gap={3} padding={4}>
                <Text color="secondary">
                  {t("regenerateStaffDesc")}
                </Text>
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack gap={2} justify="end" padding={3}>
                <Button
                  label={t("cancel")}
                  variant="secondary"
                  size="lg"
                  onClick={() => setRegenerateStaffOpen(false)}
                />
                <Button
                  label={t("regenerateConfirm")}
                  variant="destructive"
                  size="lg"
                  isLoading={isPending}
                  isDisabled={isPending}
                  onClick={confirmRegenerateStaff}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </Dialog>
    </Card>
  );
}
