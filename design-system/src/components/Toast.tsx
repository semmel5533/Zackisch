"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export type ToastTone = "neutral" | "success" | "warning" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Duration in ms. 0 or Infinity means persistent until manually dismissed. */
  durationMs?: number;
  action?: ToastAction;
}

export type ToastInput = Omit<ToastItem, "id"> & { id?: string };

interface ToastContextValue {
  toasts: ToastItem[];
  pushToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastListener = (action: { type: "push"; toast: ToastItem } | { type: "dismiss"; id?: string }) => void;
const listeners = new Set<ToastListener>();

let toastCounter = 0;
function nextToastId(): string {
  toastCounter += 1;
  return `zds-toast-${Date.now()}-${toastCounter}`;
}

/**
 * Default duration policy per Atlassian Flag & Modern Web Guidance (persistent-toast-notifications):
 * - Error / Warning toasts are persistent (0ms) by default so payment, POS, or onboarding errors
 *   never disappear before the user has read or acted on them.
 * - Info / Success / Neutral toasts auto-dismiss after 5000ms (pausing on hover/focus).
 */
export function getDefaultToastDuration(tone: ToastTone = "neutral"): number {
  if (tone === "error" || tone === "warning") {
    return 0;
  }
  return 5000;
}

function dispatchToast(input: ToastInput): string {
  const tone = input.tone ?? "neutral";
  const toast: ToastItem = {
    ...input,
    id: input.id ?? nextToastId(),
    tone,
    durationMs: input.durationMs ?? getDefaultToastDuration(tone),
  };
  listeners.forEach((listener) => listener({ type: "push", toast }));
  return toast.id;
}

/**
 * Imperative toast notification helper usable across root, app, support, and internal.
 */
export const notify = Object.assign(
  (input: ToastInput | string) => {
    if (typeof input === "string") {
      return dispatchToast({ title: input, tone: "neutral" });
    }
    return dispatchToast(input);
  },
  {
    success(title: string, options?: Omit<ToastInput, "title" | "tone">) {
      return dispatchToast({ ...options, title, tone: "success" });
    },
    error(title: string, options?: Omit<ToastInput, "title" | "tone">) {
      return dispatchToast({ ...options, title, tone: "error" });
    },
    warning(title: string, options?: Omit<ToastInput, "title" | "tone">) {
      return dispatchToast({ ...options, title, tone: "warning" });
    },
    info(title: string, options?: Omit<ToastInput, "title" | "tone">) {
      return dispatchToast({ ...options, title, tone: "info" });
    },
    dismiss(id?: string) {
      listeners.forEach((listener) => listener({ type: "dismiss", id }));
    },
  }
);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toasts: [],
      pushToast: (input) => dispatchToast(input),
      dismissToast: (id) => notify.dismiss(id),
      clearToasts: () => notify.dismiss(),
    };
  }
  return ctx;
}

function ToastCard({
  toast,
  onDismiss,
  closeLabel,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  closeLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  const tone = toast.tone ?? "neutral";
  const isUrgent = tone === "error" || tone === "warning";
  const duration = toast.durationMs ?? getDefaultToastDuration(tone);

  useEffect(() => {
    if (!duration || duration <= 0 || !Number.isFinite(duration) || paused) {
      return;
    }
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, paused, toast.id, onDismiss]);

  const toneStyles: Record<ToastTone, string> = {
    neutral: "border-(--zds-border-subtle) bg-(--zds-surface-card) text-(--zds-text-primary)",
    success: "border-(--zds-success-border) bg-(--zds-surface-card) text-(--zds-text-primary)",
    warning: "border-(--zds-warning-border) bg-(--zds-surface-card) text-(--zds-text-primary)",
    error: "border-(--zds-danger-border) bg-(--zds-surface-card) text-(--zds-text-primary)",
    info: "border-(--zds-info-border) bg-(--zds-surface-card) text-(--zds-text-primary)",
  };

  const indicatorStyles: Record<ToastTone, string> = {
    neutral: "bg-(--zds-neutral-900)",
    success: "bg-(--zds-success)",
    warning: "bg-(--zds-warning)",
    error: "bg-(--zds-danger)",
    info: "bg-(--zds-info)",
  };

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      aria-live={isUrgent ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg transition-all duration-150",
        toneStyles[tone]
      )}
    >
      <span
        aria-hidden="true"
        className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", indicatorStyles[tone])}
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold leading-snug text-(--zds-text-strong)">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-xs leading-relaxed text-(--zds-text-secondary)">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
              className="inline-flex min-h-8 items-center rounded-full border border-(--zds-border) bg-(--zds-surface-card) px-3 py-1 text-xs font-semibold text-(--zds-text-primary) hover:bg-(--zds-surface-muted) focus-visible:outline-2 focus-visible:outline-(--zds-focus)"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={closeLabel}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-(--zds-text-secondary) hover:bg-(--zds-surface-muted) hover:text-(--zds-text-strong) focus-visible:outline-2 focus-visible:outline-(--zds-focus)"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="size-4"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export interface ToastProviderProps {
  children?: React.ReactNode;
  locale?: "de" | "en";
  maxVisible?: number;
}

export function ToastProvider({
  children,
  locale = "de",
  maxVisible = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mountedRef = useRef(true);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const pushToast = useCallback(
    (input: ToastInput) => {
      const tone = input.tone ?? "neutral";
      const item: ToastItem = {
        ...input,
        id: input.id ?? nextToastId(),
        tone,
        durationMs: input.durationMs ?? getDefaultToastDuration(tone),
      };
      setToasts((prev) => [item, ...prev].slice(0, maxVisible));
      return item.id;
    },
    [maxVisible]
  );

  useEffect(() => {
    mountedRef.current = true;
    const listener: ToastListener = (event) => {
      if (!mountedRef.current) return;
      if (event.type === "push") {
        setToasts((prev) => [event.toast, ...prev].slice(0, maxVisible));
      } else if (event.type === "dismiss") {
        if (!event.id) {
          setToasts([]);
        } else {
          setToasts((prev) => prev.filter((t) => t.id !== event.id));
        }
      }
    };
    listeners.add(listener);
    return () => {
      mountedRef.current = false;
      listeners.delete(listener);
    };
  }, [maxVisible]);

  const closeLabel =
    locale === "en" ? "Close notification" : "Benachrichtigung schließen";
  const regionLabel =
    locale === "en" ? "System notifications" : "Systembenachrichtigungen";

  return (
    <ToastContext.Provider value={{ toasts, pushToast, dismissToast, clearToasts }}>
      {children}
      {toasts.length > 0 && (
        <section
          aria-label={regionLabel}
          className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2.5 p-2 sm:bottom-6 sm:right-6 print:hidden"
        >
          {toasts.map((t) => (
            <ToastCard
              key={t.id}
              toast={t}
              onDismiss={dismissToast}
              closeLabel={closeLabel}
            />
          ))}
        </section>
      )}
    </ToastContext.Provider>
  );
}
