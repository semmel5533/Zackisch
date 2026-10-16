import React from "react";
import { cn } from "../utils/cn";

export interface PhotoFigureProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  aspectRatio?: "16/9" | "4/3" | "3/2" | "4/5" | "1/1";
  priority?: boolean;
}

/**
 * Editorial Photo Figure with authentic presentation, responsive crops, and verified alt caption.
 */
export function PhotoFigure({
  src,
  alt,
  caption,
  width,
  height,
  loading = "lazy",
  aspectRatio,
  className,
  ...props
}: PhotoFigureProps) {
  const aspectClasses = {
    "16/9": "aspect-video",
    "4/3": "aspect-4/3",
    "3/2": "aspect-3/2",
    "4/5": "aspect-4/5",
    "1/1": "aspect-square",
  };

  return (
    <figure className={cn("m-0 overflow-hidden", className)} {...props}>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-[#E0E0E0] bg-[#F7F7F7]",
          aspectRatio && aspectClasses[aspectRatio]
        )}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          className="w-full h-full object-cover block transition-transform duration-200"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs text-[#525252] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
