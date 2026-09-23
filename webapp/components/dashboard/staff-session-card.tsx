"use client";

import { useTransition, useState } from "react";
import {
  Copy,
  ArrowsClockwise,
  QrCode,
  DeviceTablet,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function StaffSessionCard({
  staffToken: initialStaffToken,
  organizationId,
  baseUrl,
}: {
  staffToken: string;
  organizationId: string;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [staffToken, setStaffToken] = useState(initialStaffToken);
  const [staffQrOpen, setStaffQrOpen] = useState(false);
  const [regenerateStaffOpen, setRegenerateStaffOpen] = useState(false);

  const getLink = (token: string) =>
    `${baseUrl}/staff/${organizationId}?token=${token}`;

  function copyLinkText(token: string) {
    const link = getLink(token);
    navigator.clipboard.writeText(link);
    toast.success(t("linkCopied"));
  }

  function confirmRegenerateStaff() {
    startTransition(async () => {
      const result = await generateStaffSessionAction(organizationId);
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
    <Card className="@min-[700px]:col-span-2 h-full flex flex-col justify-between @container bg-card border-border">
      <CardHeader className="flex flex-col gap-2.5 pb-2">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-primary text-primary-foreground p-2.5 rounded-full shrink-0">
              <DeviceTablet className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-lg leading-none text-foreground truncate">
                {t("staffSession")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {t("staffTerminal")}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="font-semibold px-2.5 py-0.5 rounded-full text-foreground border-border text-xs shrink-0 flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            {t("staffSessionActive")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed text-balance">
          {t("staffSessionDesc")}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-3">
        <div className="flex flex-col @min-[420px]:flex-row items-center gap-2.5 w-full">
          <Dialog open={staffQrOpen} onOpenChange={setStaffQrOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="default"
                  className="w-full @min-[420px]:flex-1 h-11 rounded-full font-semibold cursor-pointer active:scale-[0.98]"
                />
              }
            >
              <QrCode className="h-4 w-4 mr-2" weight="bold" />
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
                      src: "https://www.zakkig.com/full_qr.png",
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

          <Button
            variant="outline"
            onClick={() => copyLinkText(staffToken)}
            className="w-full @min-[420px]:flex-1 h-11 rounded-full font-semibold cursor-pointer active:scale-[0.98]"
            disabled={isPending}
          >
            <Copy className="h-4 w-4 mr-2 shrink-0" weight="bold" />
            <span>{t("copyLink")}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setRegenerateStaffOpen(true)}
            className="w-full @min-[420px]:w-auto h-11 px-4 rounded-full font-semibold hover:border-destructive hover:text-destructive cursor-pointer active:scale-[0.98] shrink-0"
            disabled={isPending}
            title={t("createSession")}
          >
            <ArrowsClockwise className="h-4 w-4" weight="bold" />
            <span className="@min-[500px]:sr-only @min-[600px]:not-sr-only @min-[600px]:ml-2">{t("createSession")}</span>
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
              className="w-full sm:flex-1"
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
