"use client";
import { useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { WaveLine } from "./WaveLine";
import { QrPrintText } from "./QrPrintText";
import { ReactQRCode } from "@lglab/react-qr-code";
import { useTranslation } from "@/lib/i18n";

export function QrCodeShowcase() {
  const { t } = useTranslation();
  const [isTable, setIsTable] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const handleToggle = () => {
    setIsFading(true);
    setIsRotated((prev) => !prev);
    setTimeout(() => {
      setIsTable((prev) => !prev);
      setIsFading(false);
    }, 150);
  };

  return (
    <div className="qr-showcase-box">
      <div className="qr-toggle-bar">
        <button
          type="button"
          className={`qr-toggle-button ${isRotated ? "is-flipped" : ""}`}
          onClick={handleToggle}
          aria-label={t(isTable ? "qrToggleTable" : "qrTogglePickup")}
          title={t(isTable ? "qrToggleTable" : "qrTogglePickup")}
        >
          <ArrowsClockwise size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
      <div className="qr-paper" role="img" aria-label={t("qrDemoLabel")}>
        <div className={`qr-print ${isFading ? "is-fading" : ""}`} aria-hidden="true">
          <QrPrintText text={t("qrPrintTitle1")} />
          <QrPrintText text={t("qrPrintTitle2")} />
          <div className="qr-print-connector">
            <WaveLine />
            {t(isTable ? "qrPrintAt" : "qrPrintFor")}
            <WaveLine />
          </div>
          <QrPrintText text={t(isTable ? "qrPrintTable" : "qrPrintPickup")} />
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
    </div>
  );
}
