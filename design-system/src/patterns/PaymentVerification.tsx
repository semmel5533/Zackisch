import React from "react";
import { StatusBadge } from "../components/StatusBadge";
import { cn } from "../utils/cn";

export type PaymentState = "pending" | "paid" | "failed" | "refunded";

export interface PaymentVerificationProps extends React.HTMLAttributes<HTMLElement> {
  state: PaymentState;
  description: string;
  orderNumber?: string;
  amount?: string;
}

/**
 * Visual Payment Verification Display.
 * Server/provider determines verified state; this is purely presentation with polite aria-live.
 */
export function PaymentVerification({
  state,
  description,
  orderNumber,
  amount,
  className,
  ...props
}: PaymentVerificationProps) {
  const tones = {
    pending: "warning",
    paid: "success",
    failed: "danger",
    refunded: "info",
  } as const;

  const labels = {
    pending: "Zahlung wird geprüft",
    paid: "Bezahlt",
    failed: "Zahlung fehlgeschlagen",
    refunded: "Erstattet",
  } as const;

  return (
    <section
      aria-label="Zahlungsstatus"
      aria-live="polite"
      className={cn(
        "rounded-2xl border border-[#E0E0E0] bg-white p-6 space-y-3 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <StatusBadge tone={tones[state]}>{labels[state]}</StatusBadge>
        {amount && (
          <span className="font-numeric font-semibold text-sm text-[#161616] tabular-nums">
            {amount}
          </span>
        )}
      </div>
      <p className="text-sm text-[#525252] leading-relaxed">{description}</p>
      {orderNumber && (
        <div className="pt-2 border-t border-[#E0E0E0] flex items-center justify-between text-xs text-[#525252]">
          <span>Bestellnummer</span>
          <span className="font-mono font-semibold text-[#161616]">{orderNumber}</span>
        </div>
      )}
    </section>
  );
}
