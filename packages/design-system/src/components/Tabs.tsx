import React from "react";
import { Tabs as BaseTabs } from "@base-ui/react";
import { cn } from "../utils/cn";

export const Tabs = {
  Root: BaseTabs.Root,
  List: function TabsList({
    className,
    ...props
  }: React.ComponentProps<typeof BaseTabs.List>) {
    return (
      <BaseTabs.List
        className={cn(
          "inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[#F0EFEA] border border-[#D6DED7]",
          className
        )}
        {...props}
      />
    );
  },
  Tab: function TabsTab({
    className,
    ...props
  }: React.ComponentProps<typeof BaseTabs.Tab>) {
    return (
      <BaseTabs.Tab
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-[#53665B] transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E66B5] data-[selected]:bg-white data-[selected]:text-[#1A2721] data-[selected]:shadow-xs",
          className
        )}
        {...props}
      />
    );
  },
  Panel: function TabsPanel({
    className,
    ...props
  }: React.ComponentProps<typeof BaseTabs.Panel>) {
    return (
      <BaseTabs.Panel
        className={cn("pt-4 focus-visible:outline-none", className)}
        {...props}
      />
    );
  },
};
