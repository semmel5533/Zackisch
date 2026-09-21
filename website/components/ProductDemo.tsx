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
    <div
      className={`product-device ${tablet ? "device-tablet" : "device-phone"}`}
    >
      <img
        src={`/product/${locale}-${screen.toLowerCase()}.webp`}
        alt={t(`flow${screen}Text`)}
        width={tablet ? 1200 : 390}
        height={tablet ? 800 : 844}
        loading="lazy"
      />
    </div>
  );
}
