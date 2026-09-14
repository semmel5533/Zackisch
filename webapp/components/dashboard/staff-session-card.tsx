"use client";

import { useTransition, useState } from "react";
import {
  Copy,
  ArrowsClockwise,
  QrCode,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
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
    <Card className="@min-[700px]:col-span-2 h-full flex flex-col @container bg-card border-border shadow-xs">
      <CardHeader className="flex flex-col gap-1 pb-2">
        <div className="flex items-center justify-between gap-4 w-full">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground leading-tight">
            {t("staffSession")}
          </h3>

          <Dialog open={staffQrOpen} onOpenChange={setStaffQrOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="default"
                  className="shrink-0 cursor-pointer active:scale-[0.98]"
                />
              }
            >
              <QrCode className="h-4 w-4" weight="bold" />
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
                  className="w-full aspect-square flex items-center justify-center bg-white cursor-pointer group rounded-2xl p-5 border border-zinc-200"
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
                <div className="flex items-start gap-2.5 text-xs text-left text-zinc-600 font-medium bg-zinc-50 py-2.5 px-3.5 rounded-2xl w-full border border-zinc-200">
                  <WarningCircle
                    className="w-4 h-4 shrink-0 mt-0.5 text-zinc-900"
                    weight="fill"
                  />
                  <span>{t("staffQrWarning")}</span>
                </div>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end gap-3 pt-4">
        <div className="flex flex-col @min-[370px]:flex-row items-center gap-2.5 w-full">
          <Button
            variant="outline"
            onClick={() => copyLinkText(staffToken)}
            className="w-full @min-[370px]:flex-1 h-11 rounded-full font-semibold gap-2 active:scale-[0.98] transition-all cursor-pointer"
            disabled={isPending}
          >
            <Copy className="h-4 w-4 shrink-0" weight="bold" />
            <span>{t("copyLink")}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setRegenerateStaffOpen(true)}
            className="w-full @min-[370px]:flex-1 h-11 rounded-full font-semibold gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:scale-[0.98] transition-all cursor-pointer"
            disabled={isPending}
          >
            <ArrowsClockwise className="h-4 w-4" weight="bold" />
            <span>{t("createSession")}</span>
          </Button>
        </div>
      </CardContent>

      {/* Regenerate Staff Session Confirmation Dialog */}
      <Dialog
        open={regenerateStaffOpen}
        onOpenChange={setRegenerateStaffOpen}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-zinc-200 bg-white text-zinc-900 shadow-2xl flex flex-col">
          <DialogHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 bg-white shrink-0 text-left flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">
              {t("regenerateStaffTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 font-normal leading-relaxed mt-0.5">
              {t("regenerateStaffDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-zinc-100 bg-white shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegenerateStaffOpen(false)}
              className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRegenerateStaff}
              disabled={isPending}
              className="w-full sm:flex-1 rounded-full h-11 font-semibold cursor-pointer active:scale-[0.98] transition-all"
            >
              {t("regenerateConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
