"use client";
import { WaveLine } from "./WaveLine";
import { QrPrintText } from "./QrPrintText";
import { ReactQRCode } from "@lglab/react-qr-code";
import { useTranslation } from "@/lib/i18n";

export function QrCodeShowcase() {
  const { t } = useTranslation();
  return (
    <div className="qr-paper" role="img" aria-label={t("qrDemoLabel")}>
      <div className="qr-print" aria-hidden="true">
        <QrPrintText text={t("qrPrintTitle1")} />
        <QrPrintText text={t("qrPrintTitle2")} />
        <div className="qr-print-connector">
          <WaveLine />
          {t("qrPrintAt")}
          <WaveLine />
        </div>
        <QrPrintText text={t("qrPrintTable")} />
        <div className="qr-print-code">
          <ReactQRCode
            value={t("qrDemoUrl")}
            size={244}
            marginSize={0}
            level="H"
            background="#FFFFFF"
            dataModulesSettings={{ color: "#000000", style: "square-sm" }}
            finderPatternOuterSettings={{ color: "#000000", style: "square" }}
            finderPatternInnerSettings={{ color: "#000000", style: "square" }}
            imageSettings={{
              src: "/full_qr.png",
              height: 42,
              width: 133,
              excavate: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
