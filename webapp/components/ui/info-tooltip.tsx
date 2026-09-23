"use client";

import * as React from "react";
import { Info } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  iconClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export function InfoTooltip({
  content,
  className,
  iconClassName,
  side = "top",
  align = "center",
}: InfoTooltipProps) {
  return (
    <TooltipProvider delay={150}>
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label="Information"
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-full text-muted-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer shrink-0",
            className,
          )}
        >
          <Info className={cn("size-3.5", iconClassName)} />
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          showArrow
          className="max-w-xs text-xs font-normal leading-relaxed"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
