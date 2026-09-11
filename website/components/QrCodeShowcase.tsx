"use client";

import { useEffect, useRef, useState } from "react";
import { ReactQRCode } from "@lglab/react-qr-code";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DEMO_URL = "https://app.zakkig.de/";

/**
 * Flip showcase for the "QR-Codes auslegen" step. Front: takeout code,
 * back: table 1 code. The printed faces reproduce the webapp dashboard
 * print card 1:1 (see webapp/components/dashboard/overview-content.tsx):
 * "Menü & Bestellen / an TISCH 1 / MIT [QR]" — only the QR value differs
 * (demo link to app.zakkig.de).
 */

function getInkMetrics(text: string, font: string = "700 100px Inter, sans-serif") {
  if (typeof document === "undefined") {
    const estWidth = Math.max(text.length * 50, 200);
    return {
      viewBox: `0 -75 ${estWidth} 80`,
      ascent: 75,
      descent: 5,
      height: 80,
      width: estWidth,
      left: 0,
      right: estWidth,
    };
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const estWidth = Math.max(text.length * 50, 200);
    return {
      viewBox: `0 -75 ${estWidth} 80`,
      ascent: 75,
      descent: 5,
      height: 80,
      width: estWidth,
      left: 0,
      right: estWidth,
    };
  }
  ctx.font = font;
  const m = ctx.measureText(text);
  const ascent = m.actualBoundingBoxAscent || 75;
  const descent = m.actualBoundingBoxDescent || 5;
  const left = m.actualBoundingBoxLeft || 0;
  const right = m.actualBoundingBoxRight || m.width;
  const height = ascent + descent;
  const width = left + right;

  return {
    viewBox: `${-left} ${-ascent} ${width} ${height}`,
    ascent,
    descent,
    height,
    width,
    left,
    right,
  };
}

function InkScaledText({
  text,
  uppercase = true,
  className,
}: {
  text: string;
  uppercase?: boolean;
  className?: string;
}) {
  const displayText = uppercase ? text.toUpperCase() : text;
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState(() => {
    const estWidth = Math.max(displayText.length * 50, 200);
    return `0 -75 ${estWidth} 80`;
  });

  useEffect(() => {
    const update = () => {
      if (textRef.current) {
        try {
          const bbox = textRef.current.getBBox();
          const ink = getInkMetrics(displayText, "700 100px Inter, sans-serif");
          setViewBox(`${bbox.x} ${-ink.ascent} ${bbox.width} ${ink.height}`);
        } catch {}
      }
    };
    update();
    if (document.fonts?.ready) {
      document.fonts.ready.then(update);
    }
  }, [displayText]);

  return (
    <svg viewBox={viewBox} className={cn("w-full block overflow-visible", className)}>
      <text
        ref={textRef}
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="alphabetic"
        fill="currentColor"
        className="font-bold tracking-tighter font-inter tabular-nums"
        style={{ font: "700 100px Inter, sans-serif" }}
      >
        {displayText}
      </text>
    </svg>
  );
}

function InkConnectorText({
  text,
  fontSize = 20,
  align = "left",
  className,
}: {
  text: string;
  fontSize?: number;
  align?: "left" | "right";
  className?: string;
}) {
  const displayText = text.toLowerCase();
  const font = `700 ${fontSize}px Inter, sans-serif`;
  const [metrics, setMetrics] = useState(() => ({
    viewBox: `0 -${fontSize} ${displayText.length * fontSize} ${fontSize}`,
    height: fontSize,
    width: displayText.length * fontSize,
  }));

  useEffect(() => {
    const update = () => {
      const m = getInkMetrics(displayText, font);
      setMetrics({
        viewBox: m.viewBox,
        height: m.height,
        width: m.width,
      });
    };
    update();
    if (document.fonts?.ready) {
      document.fonts.ready.then(update);
    }
  }, [displayText, font]);

  return (
    <div className={cn("flex w-full leading-none", align === "right" ? "justify-end" : "justify-start")}>
      <svg
        viewBox={metrics.viewBox}
        style={{ height: `${metrics.height}px`, width: `${metrics.width}px` }}
        className={cn("block overflow-visible text-current", className)}
      >
        <text
          x="0"
          y="0"
          textAnchor="start"
          dominantBaseline="alphabetic"
          fill="currentColor"
          className="font-bold font-inter lowercase"
          style={{ font }}
        >
          {displayText}
        </text>
      </svg>
    </div>
  );
}

function QrFace({
  title1,
  title2,
  contextWord,
  contextValue,
  withWord,
}: {
  title1: string;
  title2: string;
  contextWord: string;
  contextValue: string;
  withWord: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-black">
      <div className="flex w-[78%] flex-col items-center gap-[10px]">
        <InkScaledText text={title1} />
        <InkScaledText text={title2} />
        <InkConnectorText text={contextWord} align="right" fontSize={20} />
        <InkScaledText text={contextValue} />
        <InkConnectorText text={withWord} align="left" fontSize={20} />

        <div className="w-full mt-[2px] [&_svg]:w-full [&_svg]:h-auto [&_svg]:block [&_svg]:[shape-rendering:crispEdges]">
          <ReactQRCode
            value={DEMO_URL}
            size={244}
            marginSize={0}
            level="H"
            background="#FFFFFF"
            dataModulesSettings={{ color: "#000000", style: "square-sm" }}
            finderPatternOuterSettings={{ color: "#000000", style: "square" }}
            finderPatternInnerSettings={{ color: "#000000", style: "square" }}
            imageSettings={{
              src: "https://www.zakkig.de/full_qr.png",
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

export function QrCodeShowcase() {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const cardClass =
    "absolute left-0 top-0 h-[480px] w-[312px] rounded-[16px] border border-black/10 bg-white p-4";

  const activeFace = showTable ? (
    <QrFace
      title1={t("qrPrintTitle1")}
      title2={t("qrPrintTitle2")}
      contextWord={t("qrPrintAt")}
      contextValue={t("qrPrintTable")}
      withWord={t("qrPrintWith")}
    />
  ) : (
    <QrFace
      title1={t("qrPrintTitle1")}
      title2={t("qrPrintTitle2")}
      contextWord={t("qrPrintFor")}
      contextValue={t("qrPrintPickup")}
      withWord={t("qrPrintWith")}
    />
  );

  return (
    <div className="flex flex-col items-start gap-5" aria-live="polite">
      <div className="relative h-[492px] w-[324px]">
        <div
          className={`${cardClass} z-0 translate-x-3 translate-y-3 border-zinc-300 bg-zinc-100 shadow-none`}
          aria-hidden="true"
        />
        <div
          className={`${cardClass} z-10 shadow-[0_18px_42px_-18px_rgba(0,0,0,0.65)]`}
        >
          <div
            key={showTable ? "table" : "pickup"}
            className="h-full w-full animate-in fade-in zoom-in-[0.985] duration-300"
          >
            {activeFace}
          </div>
        </div>
      </div>
      <nav
        aria-label={t("qrShowcaseToggleLabel")}
        className="flex w-[324px] justify-end items-center space-x-3 text-sm md:text-base font-bold tracking-widest uppercase text-white"
      >
        <button
          type="button"
          onClick={() => setShowTable(false)}
          aria-pressed={!showTable}
          className={`uppercase transition-opacity duration-200 ${
            !showTable
              ? "opacity-100 underline underline-offset-4 decoration-1 text-white"
              : "opacity-50 hover:opacity-100 text-white"
          }`}
        >
          {t("qrSwitchPickup")}
        </button>
        <span className="opacity-30 text-white" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          onClick={() => setShowTable(true)}
          aria-pressed={showTable}
          className={`uppercase transition-opacity duration-200 ${
            showTable
              ? "opacity-100 underline underline-offset-4 decoration-1 text-white"
              : "opacity-50 hover:opacity-100 text-white"
          }`}
        >
          {t("qrSwitchTable")}
        </button>
      </nav>
    </div>
  );
}
