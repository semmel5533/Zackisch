"use client";
import { useTranslation } from "@/lib/i18n";
export function ProductDemo({
  screen,
}: {
  screen: "Scan" | "Pay" | "Kitchen";
}) {
  const { t, locale } = useTranslation();
  const tablet = screen === "Kitchen";
  return (
    <div className={`relative mx-auto overflow-hidden border-2 border-[#444] bg-[#111] p-[6px] shadow-[0_12px_24px_-18px_#0005] ${tablet ? "w-full max-w-[800px] rounded-[24px]" : "h-[480px] w-[230px] rounded-[34px] max-[600px]:h-[520px] max-[600px]:w-[250px]"}`}>
      <div className={`overflow-hidden bg-background ${tablet ? "h-auto rounded-[18px]" : "h-full rounded-[26px]"}`}>
        <img
          src={`/product/${locale}-${screen.toLowerCase()}.webp`}
          alt={t(`flow${screen}Text`)}
          width={tablet ? 1200 : 260}
          height={tablet ? 710 : 564}
          loading="lazy"
          className={`block w-full ${tablet ? "aspect-[1200/710] h-auto rounded-[18px] object-contain" : "h-full object-cover"}`}
        />
      </div>
    </div>
  );
}
