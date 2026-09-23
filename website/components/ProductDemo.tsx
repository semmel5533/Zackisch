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
    <div className={`relative mx-auto overflow-hidden border-2 border-[#333] bg-[#111] p-[7px] shadow-[0_16px_32px_-16px_rgba(0,0,0,0.3)] ${tablet ? "w-full max-w-[800px] rounded-[24px]" : "h-[590px] w-[285px] rounded-[42px] max-[600px]:h-[560px] max-[600px]:w-[270px]"}`}>
      <div className={`overflow-hidden bg-background ${tablet ? "h-auto rounded-[18px]" : "h-full rounded-[34px]"}`}>
        <img
          src={`/product/${locale}-${screen.toLowerCase()}.webp`}
          alt={t(`flow${screen}Text`)}
          width={tablet ? 1200 : 330}
          height={tablet ? 710 : 715}
          loading="lazy"
          className={`block w-full ${tablet ? "aspect-[1200/710] h-auto rounded-[18px] object-contain" : "h-full object-cover"}`}
        />
      </div>
    </div>
  );
}
