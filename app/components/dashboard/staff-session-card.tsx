"use client";

import { useTransition, useState } from "react";
import {
  Copy,
  ArrowsClockwise,
  QrCode,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { ReactQRCode } from "@lglab/react-qr-code";
import { generateStaffSessionAction } from "@/actions/staff-actions";
import { resolveBrandAsset } from "@zackisch/design-system";

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
    <Card className="h-full flex flex-col justify-between @container bg-card border-border">
      <CardHeader className="flex flex-col gap-2 pb-3">
        <div className="flex items-center gap-2 min-w-0 w-full">
          <span className="font-semibold text-base sm:text-lg leading-normal text-foreground truncate">
            {t("staffSession")}
          </span>
          <InfoTooltip content={t("staffSessionDesc")} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2.5 pt-0">
        <Dialog open={staffQrOpen} onOpenChange={setStaffQrOpen}>
          <DialogTrigger
            render={
              <Button
                variant="default"
                className="w-full h-11 rounded-full font-semibold cursor-pointer active:scale-[0.98]"
              />
            }
          >
            <QrCode className="h-4 w-4 mr-2 shrink-0" weight="bold" />
            <span>{t("scan")}</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[380px]">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>{t("staffSession")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody className="flex flex-col items-center gap-3.5 overflow-hidden py-4 px-5 sm:px-6">
              <a
                href={getLink(staffToken)}
                target="_blank"
                rel="noreferrer"
                className="w-full aspect-square flex items-center justify-center bg-white cursor-pointer group rounded-xl p-5 border border-border"
              >
                <ReactQRCode
                  value={getLink(staffToken)}
                  size={360}
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
                    src: resolveBrandAsset("combinationMarkQr", { site: "app" }),
                    height: 42,
                    width: 133,
                    excavate: true,
                  }}
                  svgProps={{
                    className: "w-full h-auto aspect-square block [shape-rendering:crispEdges]",
                  }}
                />
              </a>
              <p className="w-full text-left text-sm font-medium text-destructive">
                {t("staffQrWarning")}
              </p>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-2 gap-2.5 w-full">
          <Button
            variant="outline"
            onClick={() => copyLinkText(staffToken)}
            className="w-full border-border"
            disabled={isPending}
          >
            <Copy className="h-4 w-4 mr-2 shrink-0" weight="bold" />
            <span className="truncate">{t("copyLink")}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setRegenerateStaffOpen(true)}
            className="w-full border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            disabled={isPending}
            title={t("createSession")}
          >
            <ArrowsClockwise className="h-4 w-4 mr-2 shrink-0" weight="bold" />
            <span className="truncate">{t("createSession")}</span>
          </Button>
        </div>
      </CardContent>

      {/* Regenerate Staff Session Confirmation Dialog */}
      <Dialog
        open={regenerateStaffOpen}
        onOpenChange={setRegenerateStaffOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {t("regenerateStaffTitle")}
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t("regenerateStaffDesc")}
            </p>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegenerateStaffOpen(false)}
              className="w-full sm:flex-1 border-border"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRegenerateStaff}
              disabled={isPending}
              className="w-full sm:flex-1"
            >
              {t("regenerateConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
