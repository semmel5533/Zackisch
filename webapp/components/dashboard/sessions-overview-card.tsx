"use client";

import { useTransition, Fragment, useState } from "react";
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
import { generateAvailabilitySessionAction } from "@/actions/availability-actions";
import { generateOrderSessionAction } from "@/actions/order-actions";

export function SessionsOverviewCard({
  availabilityToken: initialAvailabilityToken,
  orderToken: initialOrderToken,
  organizationId,
  baseUrl,
}: {
  availabilityToken: string;
  orderToken: string;
  organizationId: string;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const [availabilityToken, setAvailabilityToken] = useState(
    initialAvailabilityToken,
  );
  const [orderToken, setOrderToken] = useState(initialOrderToken);

  const [availabilityQrOpen, setAvailabilityQrOpen] = useState(false);
  const [orderQrOpen, setOrderQrOpen] = useState(false);
  const [regenerateAvailabilityOpen, setRegenerateAvailabilityOpen] =
    useState(false);
  const [regenerateOrderOpen, setRegenerateOrderOpen] = useState(false);

  const getLink = (path: string, token: string) =>
    `${baseUrl}/${path}/${organizationId}?token=${token}`;

  function copyLinkText(path: string, token: string) {
    const link = getLink(path, token);
    navigator.clipboard.writeText(link);
    toast.success(t("linkCopied"));
  }

  function confirmRegenerateAvailability() {
    startTransition(async () => {
      const result = await generateAvailabilitySessionAction(organizationId);
      if (result.success && result.session) {
        setAvailabilityToken(result.session.token);
        toast.success(t("regeneratedAvailability"));
      } else if (result.error) {
        toast.error(result.error);
      }
      setRegenerateAvailabilityOpen(false);
    });
  }

  function confirmRegenerateOrder() {
    startTransition(async () => {
      const result = await generateOrderSessionAction(organizationId);
      if (result.success && result.session) {
        setOrderToken(result.session.token);
        toast.success(t("regeneratedOrder"));
      } else if (result.error) {
        toast.error(result.error);
      }
      setRegenerateOrderOpen(false);
    });
  }

  return (
    <Fragment>
      {/* Order Sessions Card */}
      <Card className="h-full flex flex-col @container">
        <CardHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-start justify-between gap-4 w-full">
            <h3 className="text-lg font-semibold leading-tight tracking-tight flex-1">
              {t("liveOrderSessions")}
            </h3>
            <Dialog open={orderQrOpen} onOpenChange={setOrderQrOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="default"
                    size="icon"
                    className="shrink-0 rounded-full h-8 w-8"
                  />
                }
              >
                <QrCode className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle>
                    {t("liveOrderSessions")}
                  </DialogTitle>
                  <DialogCloseButton />
                </DialogHeader>
                <DialogBody className="flex flex-col items-center gap-4">
                  <a
                    href={getLink("orders", orderToken)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full aspect-square flex items-center justify-center bg-white cursor-pointer group rounded-2xl p-6 border border-zinc-200"
                  >
                    <ReactQRCode
                      value={getLink("orders", orderToken)}
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
                  <div className="flex items-start gap-2.5 text-xs text-left text-zinc-600 font-medium bg-zinc-50 p-3.5 rounded-2xl w-full border border-zinc-200">
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
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {t("orderSessionsDesc")}
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end gap-3 pt-4">
          <div className="flex flex-col @min-[370px]:flex-row items-center gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => copyLinkText("orders", orderToken)}
              className="w-full @min-[370px]:flex-1 gap-2"
              disabled={isPending}
            >
              <Copy className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("copyLink")}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setRegenerateOrderOpen(true)}
              className="w-full @min-[370px]:flex-1 gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              disabled={isPending}
            >
              <ArrowsClockwise className="h-4 w-4" weight="bold" />
              <span>{t("createSession")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Availability Sessions Card */}
      <Card className="h-full flex flex-col @container">
        <CardHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-start justify-between gap-4 w-full">
            <h3 className="text-lg font-semibold leading-tight tracking-tight flex-1">
              {t("availabilitySessions")}
            </h3>
            <Dialog
              open={availabilityQrOpen}
              onOpenChange={setAvailabilityQrOpen}
            >
              <DialogTrigger
                render={
                  <Button
                    variant="default"
                    size="icon"
                    className="shrink-0 rounded-full h-8 w-8"
                  />
                }
              >
                <QrCode className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle>
                    {t("availabilitySessions")}
                  </DialogTitle>
                  <DialogCloseButton />
                </DialogHeader>
                <DialogBody className="flex flex-col items-center gap-4">
                  <a
                    href={getLink("availability", availabilityToken)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full aspect-square flex items-center justify-center bg-white cursor-pointer group rounded-2xl p-6 border border-zinc-200"
                  >
                    <ReactQRCode
                      value={getLink("availability", availabilityToken)}
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
                  <div className="flex items-start gap-2.5 text-xs text-left text-zinc-600 font-medium bg-zinc-50 p-3.5 rounded-2xl w-full border border-zinc-200">
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
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {t("availabilitySessionsDesc")}
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end gap-3 pt-4">
          <div className="flex flex-col @min-[370px]:flex-row items-center gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => copyLinkText("availability", availabilityToken)}
              className="w-full @min-[370px]:flex-1 gap-2"
              disabled={isPending}
            >
              <Copy className="h-4 w-4 shrink-0" weight="bold" />
              <span>{t("copyLink")}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setRegenerateAvailabilityOpen(true)}
              className="w-full @min-[370px]:flex-1 gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              disabled={isPending}
            >
              <ArrowsClockwise className="h-4 w-4" weight="bold" />
              <span>{t("createSession")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regenerate Availability Confirmation Dialog */}
      <Dialog
        open={regenerateAvailabilityOpen}
        onOpenChange={setRegenerateAvailabilityOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("regenerateAvailabilityTitle")}</DialogTitle>
            <DialogDescription>
              {t("regenerateAvailabilityDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegenerateAvailabilityOpen(false)}
              className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRegenerateAvailability}
              disabled={isPending}
              className="w-full sm:flex-1 rounded-full h-11 font-semibold cursor-pointer active:scale-[0.98] transition-all"
            >
              {t("regenerateConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Order Confirmation Dialog */}
      <Dialog open={regenerateOrderOpen} onOpenChange={setRegenerateOrderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("regenerateOrderTitle")}</DialogTitle>
            <DialogDescription>
              {t("regenerateOrderDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegenerateOrderOpen(false)}
              className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmRegenerateOrder}
              disabled={isPending}
              className="w-full sm:flex-1 rounded-full h-11 font-semibold cursor-pointer active:scale-[0.98] transition-all"
            >
              {t("regenerateConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
