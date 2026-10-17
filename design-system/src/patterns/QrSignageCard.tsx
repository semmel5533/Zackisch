import React from "react";
import { cn } from "../utils/cn";

export interface QrSignageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  businessName: string;
  tableNumber?: string;
  qrCodeUrl: string;
  qrCodeSvgOrImage: React.ReactNode;
  instructions?: string;
  locale?: string;
}

export function QrSignageCard({
  businessName,
  tableNumber,
  qrCodeUrl,
  qrCodeSvgOrImage,
  instructions,
  locale = "de",
  className,
  ...props
}: QrSignageCardProps) {
  const isDe = locale.startsWith("de");

  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto bg-white rounded-3xl border-2 border-[#161616] p-6 text-center space-y-4 shadow-sm print:border-black print:shadow-none print:m-0",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h3 className="font-brand font-semibold text-lg text-[#161616] tracking-tight">
          {businessName}
        </h3>
        {tableNumber ? (
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#161616] text-white font-semibold text-xs font-numeric print:bg-black">
            {isDe ? `Tisch ${tableNumber}` : `Table ${tableNumber}`}
          </div>
        ) : (
          <div className="text-xs text-[#525252] font-semibold">
            {isDe ? "Mitnahme / Abholung" : "Takeaway / Pickup"}
          </div>
        )}
      </div>

      {/* QR Code Container with guaranteed 4-module high-contrast quiet zone */}
      <div className="p-4 bg-white rounded-2xl border border-[#E0E0E0] inline-block shadow-2xs print:border-black">
        {qrCodeSvgOrImage}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-[#161616]">
          {instructions ||
            (isDe
              ? "Mit Smartphone-Kamera scannen zum Bestellen & Bezahlen"
              : "Scan with camera to order & pay")}
        </p>
        <p className="text-[11px] font-mono text-[#525252] truncate max-w-xs mx-auto">
          {qrCodeUrl}
        </p>
      </div>
    </div>
  );
}
