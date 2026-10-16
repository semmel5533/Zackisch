import React from "react";
import { cn } from "../utils/cn";
export { EmptyState, type EmptyStateProps } from "./EmptyState";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-2xl border border-[#E0E0E0] bg-white">
      <table
        className={cn("w-full caption-bottom text-xs text-[#161616]", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("bg-[#F7F7F7] border-b border-[#E0E0E0]", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0 bg-white", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-[#E0E0E0] transition-colors hover:bg-[#F7F7F7] data-[state=selected]:bg-[#F2F2F2]",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "h-11 px-4 text-left align-middle font-semibold text-[#525252] select-none",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-4 align-middle font-normal text-[#161616]", className)}
      {...props}
    />
  );
}
