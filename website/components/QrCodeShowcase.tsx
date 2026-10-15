"use client";
import { useState, useEffect } from "react";
import { WaveLine } from "./WaveLine";
import { QrPrintText } from "./QrPrintText";
import { ReactQRCode } from "@lglab/react-qr-code";
import { useTranslation } from "@/lib/i18n";

export function QrCodeShowcase() {
  const { t } = useTranslation();
  const [isTable, setIsTable] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const tape = "pointer-events-none absolute z-10 h-7 w-24 rounded-[1px] border-x border-dashed border-[#d2cdb973] border-y border-white/50 bg-[linear-gradient(135deg,rgba(255,255,250,.55),rgba(246,242,228,.48)_50%,rgba(255,255,250,.52))] shadow-[0_1px_3px_rgba(0,0,0,.07),inset_0_1px_1px_rgba(255,255,255,.65)] backdrop-blur-[1.5px]";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const intervalId = setInterval(() => {
      setIsFading(true);
      timeoutId = setTimeout(() => {
        setIsTable((prev) => !prev);
        setIsFading(false);
      }, 400);
    }, 30000);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative flex w-[268px] flex-col items-center max-[600px]:w-[232px]">
      <div className="relative flex min-h-[430px] w-[268px] rotate-[-5deg] flex-col justify-center rounded-[2px] bg-background px-[27px] py-7 shadow-[0_1px_2px_rgba(0,0,0,.04),0_3px_8px_-2px_rgba(0,0,0,.04),0_14px_24px_-6px_rgba(0,0,0,.07),0_0_0_1px_rgba(0,0,0,.04)] max-[600px]:min-h-0 max-[600px]:w-[232px] max-[600px]:px-[22px] max-[600px]:py-6" role="img" aria-label={t("qrDemoLabel")}>
        <span className={`${tape} -top-3 -left-6 rotate-[-36deg]`} aria-hidden="true" />
        <span className={`${tape} -right-[22px] -bottom-2 rotate-[-33deg]`} aria-hidden="true" />
        <div className={`flex flex-col gap-2 text-center transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none ${isFading ? "scale-[.98] opacity-0" : ""}`} aria-hidden="true">
          <QrPrintText text={t("qrPrintTitle1")} />
          <QrPrintText text={t("qrPrintTitle2")} />
          <div className="flex items-center justify-center gap-3 text-lg font-semibold w-full">
            <WaveLine className="flex-1 min-w-[20px]" />
            {t(isTable ? "qrPrintAt" : "qrPrintFor")}
            <WaveLine className="flex-1 min-w-[20px]" />
          </div>
          <QrPrintText text={t(isTable ? "qrPrintTable" : "qrPrintPickup")} />
          <div className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
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
                src: "/combination_mark_qr.png",
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
