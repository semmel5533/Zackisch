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
        "w-full max-w-sm mx-auto bg-white rounded-3xl border-2 border-[#192C25] p-6 text-center space-y-4 shadow-sm print:border-black print:shadow-none print:m-0",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h3 className="font-brand font-bold text-lg text-[#192C25] tracking-tight">
          {businessName}
        </h3>
        {tableNumber ? (
          <div className="inline-block px-3 py-1 rounded-full bg-[#173C2B] text-white font-bold text-xs font-num print:bg-black">
            {isDe ? `Tisch ${tableNumber}` : `Table ${tableNumber}`}
          </div>
        ) : (
          <div className="text-xs text-[#53665B] font-semibold">
            {isDe ? "Mitnahme / Abholung" : "Takeaway / Pickup"}
          </div>
        )}
      </div>

      {/* QR Code Container with guaranteed 4-module high-contrast quiet zone */}
      <div className="p-4 bg-white rounded-2xl border border-[#D6DED7] inline-block shadow-2xs print:border-black">
        {qrCodeSvgOrImage}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-bold text-[#192C25]">
          {instructions ||
            (isDe
              ? "Mit Smartphone-Kamera scannen zum Bestellen & Bezahlen"
              : "Scan with camera to order & pay")}
        </p>
        <p className="text-[11px] font-mono text-[#53665B] truncate max-w-xs mx-auto">
          {qrCodeUrl}
        </p>
      </div>
    </div>
  );
}
