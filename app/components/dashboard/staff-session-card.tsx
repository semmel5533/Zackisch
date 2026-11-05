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
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/surfaces";
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
    <Card className="w-full flex flex-col justify-between gap-4 h-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-base text-[var(--zk-text)]">
            {t("staffSession")}
          </h4>
          <span
            title={t("staffSessionDesc")}
            className="inline-flex text-[var(--zk-text-secondary)] cursor-help"
          >
            <Info size={16} aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => setStaffQrOpen(true)}
        >
          <QrCode size={18} weight="bold" aria-hidden="true" />
          <span>{t("scan")}</span>
        </Button>

        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="secondary"
            size="md"
            disabled={isPending}
            onClick={() => copyLinkText(staffToken)}
          >
            <Copy size={16} weight="bold" aria-hidden="true" />
            <span>{t("copyLink")}</span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            disabled={isPending}
            onClick={() => setRegenerateStaffOpen(true)}
          >
            <ArrowsClockwise size={16} weight="bold" aria-hidden="true" />
            <span>{t("createSession")}</span>
          </Button>
        </div>
      </div>

      {/* Staff QR Modal */}
      <Modal
        open={staffQrOpen}
        onOpenChange={setStaffQrOpen}
        title={t("staffSession")}
        closeLabel={t("close")}
      >
        <div className="flex flex-col items-center gap-4 py-2">
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
                src: "https://zackisch.com/brand/logo/lockups/wordmark--transparent--standard--600w.png",
                height: (133 * 183) / 600,
                width: 133,
                excavate: true,
              }}
            />
          </a>
          <p className="text-xs text-[var(--zk-text-secondary)] text-center">
            {t("staffQrWarning")}
          </p>
        </div>
      </Modal>

      {/* Regenerate Staff Session Confirmation Modal */}
      <Modal
        open={regenerateStaffOpen}
        onOpenChange={setRegenerateStaffOpen}
        title={t("regenerateStaffTitle")}
        description={t("regenerateStaffDesc")}
        closeLabel={t("close")}
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setRegenerateStaffOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              size="md"
              loading={isPending}
              disabled={isPending}
              onClick={confirmRegenerateStaff}
            >
              {t("regenerateConfirm")}
            </Button>
          </>
        }
      >
        <div />
      </Modal>
    </Card>
  );
}
