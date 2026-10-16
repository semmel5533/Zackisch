import React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react";
import { cn } from "../utils/cn";

export const Accordion = {
  Root: BaseAccordion.Root,
  Item: function AccordionItem({
    className,
    ...props
  }: React.ComponentProps<typeof BaseAccordion.Item>) {
    return (
      <BaseAccordion.Item
        className={cn(
          "border-b border-[#E0E0E0] last:border-b-0 py-3",
          className
        )}
        {...props}
      />
    );
  },
  Header: BaseAccordion.Header,
  Trigger: function AccordionTrigger({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof BaseAccordion.Trigger>) {
    return (
      <BaseAccordion.Header className="flex">
        <BaseAccordion.Trigger
          className={cn(
            "flex flex-1 items-center justify-between py-2 text-sm font-semibold text-[#161616] text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2359CE] rounded-lg group",
            className
          )}
          {...props}
        >
          {children}
          <svg
            className="w-4 h-4 shrink-0 text-[#525252] transition-transform duration-200 group-data-[panel-open]:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
    );
  },
  Panel: function AccordionPanel({
    className,
    ...props
  }: React.ComponentProps<typeof BaseAccordion.Panel>) {
    return (
      <BaseAccordion.Panel
        className={cn(
          "text-xs sm:text-sm text-[#525252] leading-relaxed pt-1 pb-3 overflow-hidden transition-all duration-200",
          className
        )}
        {...props}
      />
    );
  },
};
