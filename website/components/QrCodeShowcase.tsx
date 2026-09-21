"use client";
import { ReactQRCode } from "@lglab/react-qr-code";
import { useTranslation } from "@/lib/i18n";

export function QrCodeShowcase() {
  const { t } = useTranslation();
  return (
    <div className="qr-paper" role="img" aria-label={t("qrDemoLabel")}>
      <div className="qr-print" aria-hidden="true">
        <div className="qr-print-title">
          {t("qrPrintTitle1")}
          <br />
          {t("qrPrintTitle2")}
        </div>
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
        <div className="qr-print-table">
          {t("qrPrintTable")
            .split(/(\d+)/)
            .map((part, i) => (
              <span
                key={i}
                className={
                  /^\d+$/.test(part) ? "font-inter tabular-nums" : undefined
                }
              >
                {part}
              </span>
            ))}
        </div>
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
