import React from "react";
import { cn } from "../utils/cn";

export type StepStatus = "complete" | "current" | "available" | "needs_action" | "blocked";

export interface StepItem {
  id: string;
  title: string;
  detail?: string;
  status?: StepStatus;
  isCompleted?: boolean;
  isCurrent?: boolean;
  isBlocked?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepItem[];
  onStepClick?: (stepId: string) => void;
}

export function Stepper({ steps, onStepClick, className, ...props }: StepperProps) {
  const getStatus = (step: StepItem): StepStatus => {
    if (step.status) return step.status;
    if (step.isCompleted) return "complete";
    if (step.isCurrent) return "current";
    if (step.isBlocked) return "blocked";
    return "available";
  };

  const statusLabels: Record<StepStatus, string> = {
    complete: "Erledigt",
    current: "In Bearbeitung",
    needs_action: "Erforderlich",
    available: "Verfügbar",
    blocked: "Gesperrt",
  };

  return (
    <ol aria-label="Fortschrittsschritte" className={cn("space-y-3 w-full list-none p-0 m-0", className)} {...props}>
      {steps.map((step, idx) => {
        const stepStatus = getStatus(step);
        const isClickable = Boolean(onStepClick && stepStatus !== "blocked");

        const content = (
          <div
            className={cn(
              "flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-150 w-full text-left",
              stepStatus === "complete" && "bg-[#EAF7F0] border-[#A3D9BD]",
              stepStatus === "current" && "bg-white border-[#161616] shadow-xs",
              stepStatus === "needs_action" && "bg-[#FFF6E5] border-[#F5D699]",
              stepStatus === "available" && "bg-white border-[#E0E0E0]",
              stepStatus === "blocked" && "bg-[#F7F7F7] border-[#E0E0E0] opacity-60",
              isClickable && "hover:border-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2359CE]"
            )}
          >
            <div
              className={cn(
                "size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold tabular-nums font-numeric",
                stepStatus === "complete" && "bg-[#12744B] text-white",
                stepStatus === "current" && "bg-[#161616] text-white",
                stepStatus === "needs_action" && "bg-[#8B5D08] text-white",
                stepStatus === "available" && "bg-[#F2F2F2] text-[#525252] border border-[#C4C4C4]",
                stepStatus === "blocked" && "bg-[#E0E0E0] text-[#959595]"
              )}
              aria-hidden="true"
            >
              {stepStatus === "complete" ? (
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                idx + 1
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#161616]">{step.title}</span>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                    stepStatus === "complete" && "bg-white text-[#12744B] border-[#A3D9BD]",
                    stepStatus === "current" && "bg-[#161616] text-white border-[#161616]",
                    stepStatus === "needs_action" && "bg-white text-[#8B5D08] border-[#F5D699]",
                    stepStatus === "available" && "bg-[#F2F2F2] text-[#525252] border-[#E0E0E0]",
                    stepStatus === "blocked" && "bg-[#EAEAEA] text-[#6A6A6A] border-[#E0E0E0]"
                  )}
                >
                  {statusLabels[stepStatus]}
                </span>
              </div>
              {step.detail && (
                <p className="text-[11px] text-[#525252] leading-normal line-clamp-2">
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        );

        return (
          <li key={step.id}>
            {isClickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className="w-full text-left cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2359CE]"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
