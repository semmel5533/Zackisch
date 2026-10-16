import React from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = "Zurück",
  nextLabel = "Weiter",
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-4 py-3", className)}
      {...props}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {previousLabel}
      </Button>

      <div className="text-xs text-[#53665B] font-num">
        Seite <span className="font-bold text-[#1A2721]">{currentPage}</span> von{" "}
        <span className="font-bold text-[#1A2721]">{totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
