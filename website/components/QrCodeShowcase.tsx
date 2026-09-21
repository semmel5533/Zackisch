"use client";
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
          <svg viewBox="0 0 72 8">
            <path
              d="M0 4Q3 0 6 4T12 4T18 4T24 4T30 4T36 4T42 4T48 4T54 4T60 4T66 4T72 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          {t("qrPrintAt")}
          <svg viewBox="0 0 72 8">
            <path
              d="M0 4Q3 0 6 4T12 4T18 4T24 4T30 4T36 4T42 4T48 4T54 4T60 4T66 4T72 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
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
