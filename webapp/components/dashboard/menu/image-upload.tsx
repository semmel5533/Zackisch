"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Trash, UploadSimple, PencilSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { toast } from "sonner";
import { MAX_IMAGE_SIZE_BYTES, isAllowedImageFile } from "@/lib/constants";

interface ImageUploadProps {
  existingImageId?: string;
  onFileSelect: (file: File | null) => void;
  onRemoveExisting?: () => void;
  className?: string;
}

export function ImageUpload({
  existingImageId,
  onFileSelect,
  onRemoveExisting,
  className,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [prevImageId, setPrevImageId] = useState(existingImageId);

  // Reset isRemoved if the incoming existingImageId prop changes (e.g. editing a different item)
  if (existingImageId !== prevImageId) {
    setPrevImageId(existingImageId);
    setIsRemoved(false);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }

  const showExisting = !!existingImageId && !isRemoved;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = useCallback(
    (file: File | null) => {
      if (preview) URL.revokeObjectURL(preview);
      if (file) {
        if (!isAllowedImageFile(file)) {
          toast.error(t("invalidImageFormat"));
          if (inputRef.current) inputRef.current.value = "";
          return;
        }
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          toast.error(t("imageTooLarge"));
          if (inputRef.current) inputRef.current.value = "";
          return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        setIsRemoved(false);
        onFileSelect(file);
      } else {
        setPreview(null);
        onFileSelect(null);
      }
    },
    [onFileSelect, preview, t],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setIsRemoved(true);
    onFileSelect(null);
    onRemoveExisting?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const existingUrl = existingImageId
    ? getImagePreviewUrl(existingImageId)
    : null;

  const hasImage = preview || (showExisting && existingUrl);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div
        className={cn(
          "relative rounded-2xl transition-all duration-200 overflow-hidden flex-1 flex flex-col group",
          hasImage
            ? "border border-border/70 shadow-xs"
            : isDragging
              ? "border-2 border-dashed border-primary bg-primary/5 scale-[1.01]"
              : "border border-dashed border-border/80 hover:border-foreground/30 bg-muted/30 hover:bg-muted/50 cursor-pointer",
        )}
        onClick={() => {
          if (!hasImage) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role={hasImage ? undefined : "button"}
        tabIndex={hasImage ? undefined : 0}
        onKeyDown={(e) => {
          if (!hasImage && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {hasImage ? (
          <div className="relative w-full h-full min-h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview || existingUrl!}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white transition-colors shadow-sm cursor-pointer active:scale-95"
                title={t("changeImage")}
              >
                <PencilSimple className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="pointer-events-auto p-1.5 rounded-full bg-black/60 backdrop-blur-sm hover:bg-destructive hover:text-white text-white transition-colors shadow-sm cursor-pointer active:scale-95"
                title={t("removeImage")}
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center min-h-[220px]">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center group-hover:bg-muted transition-colors">
              <UploadSimple
                className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
                weight={isDragging ? "bold" : "regular"}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                {t("dragOrClick")}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {t("itemImageRecommended")} • {t("maxFileSize")}
              </p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
