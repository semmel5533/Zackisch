"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  maxLength,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive motion-reduce:transition-none",
        className,
      )}
      maxLength={maxLength ?? 1000}
      {...props}
    />
  );
}

export { Textarea };
