"use client";

import { useState, useEffect } from "react";
import { Clock } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface OtpValidityTimerProps {
  expiresAt: number;
  onExpired?: (isExpired: boolean) => void;
  className?: string;
}

export function OtpValidityTimer({
  expiresAt,
  onExpired,
  className,
}: OtpValidityTimerProps) {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const remainingSeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  const isExpired = remainingSeconds <= 0;

  useEffect(() => {
    onExpired?.(isExpired);
  }, [isExpired, onExpired]);

  if (isExpired) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-xs text-destructive font-medium -mt-1 mb-1 text-center w-full",
          className,
        )}
      >
        <span>{t("otpCodeExpired")}</span>
      </div>
    );
  }

  const renderContent = () => {
    if (remainingMinutes <= 1) {
      const parts = t("otpRemainingOneMinute").split("1");
      return (
        <span>
          {parts[0]}
          <span className="font-inter tabular-nums">1</span>
          {parts[1] || ""}
        </span>
      );
    }

    const template = t("otpRemainingMinutes", { minutes: "###NUM###" });
    const parts = template.split("###NUM###");
    return (
      <span>
        {parts[0]}
        <span className="font-inter tabular-nums">{remainingMinutes}</span>
        {parts[1] || ""}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium -mt-1 mb-1 text-center w-full",
        className,
      )}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      {renderContent()}
    </div>
  );
}
