import React from "react";
import { StatusBadge } from "../components/StatusBadge";
import { cn } from "../utils/cn";

export interface PosReconciliationSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  paymentStatus: string;
  posStatus: string;
  isReconciled: boolean;
  orderNumber?: string;
  timestamp?: string;
  actor?: string;
}

/**
 * POS Reconciliation Summary
 * Clarifies independent POS status versus digital payment status per Zackisch business invariant.
 */
export function PosReconciliationSummary({
  paymentStatus,
  posStatus,
  isReconciled,
  orderNumber,
  timestamp,
  actor,
  className,
  ...props
}: PosReconciliationSummaryProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E0E0E0] bg-white p-5 space-y-3 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525252]">
          Kassenabgleich (POS)
        </h4>
        <StatusBadge tone={isReconciled ? "success" : "warning"}>
          {posStatus}
        </StatusBadge>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div>
          <dt className="text-[#525252]">Zahlungsstatus</dt>
          <dd className="font-semibold text-[#161616] mt-0.5">{paymentStatus}</dd>
        </div>
        <div>
          <dt className="text-[#525252]">Kassenerfassung</dt>
          <dd className="font-semibold text-[#161616] mt-0.5">{posStatus}</dd>
        </div>
        {orderNumber && (
          <div>
            <dt className="text-[#525252]">Bestellnummer</dt>
            <dd className="font-mono text-[#161616] mt-0.5">{orderNumber}</dd>
          </div>
        )}
        {timestamp && (
          <div>
            <dt className="text-[#525252]">Erfasst am</dt>
            <dd className="text-[#161616] mt-0.5">{timestamp}</dd>
          </div>
        )}
      </dl>

      {actor && (
        <p className="text-[11px] text-[#6A6A6A] pt-2 border-t border-[#E0E0E0]">
          Erfasst durch: {actor}
        </p>
      )}
    </div>
  );
}
