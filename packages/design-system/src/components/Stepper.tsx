import React from "react";
import { cn } from "../utils/cn";

export interface StepItem {
  id: string;
  title: string;
  detail?: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  onStepClick?: (stepId: string) => void;
}

export function Stepper({ steps, onStepClick, className, ...props }: StepperProps) {
  return (
    <div className={cn("space-y-3 w-full", className)} {...props}>
      {steps.map((step, idx) => {
        const isClickable = Boolean(onStepClick);
        return (
          <div
            key={step.id}
            onClick={() => isClickable && onStepClick?.(step.id)}
            className={cn(
              "flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-150",
              step.isCompleted
                ? "bg-[#EBF7EE]/60 border-[#A6D5B8]"
                : step.isCurrent
                ? "bg-white border-[#173C2B] shadow-xs"
                : "bg-[#F7F5EF] border-[#D6DED7] opacity-80",
              isClickable && "cursor-pointer hover:border-[#173C2B]"
            )}
          >
            <div
              className={cn(
                "size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-num",
                step.isCompleted
                  ? "bg-[#17643B] text-white"
                  : step.isCurrent
                  ? "bg-[#173C2B] text-white"
                  : "bg-[#D6DED7] text-[#53665B]"
              )}
            >
              {step.isCompleted ? (
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                idx + 1
              )}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-[#1A2721] flex items-center gap-2">
                <span>{step.title}</span>
                {step.isCompleted && (
                  <span className="text-[10px] font-semibold text-[#17643B]">
                    Erledigt
                  </span>
                )}
              </div>
              {step.detail && (
                <p className="text-[11px] text-[#53665B] leading-normal truncate">
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
