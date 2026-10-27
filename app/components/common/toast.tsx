"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";

export type ToastOptions = {
  body: React.ReactNode;
  type?: "info" | "error" | "success" | "warning";
  isAutoHide?: boolean;
  autoHideDuration?: number;
};

type ToastItem = ToastOptions & {
  id: string;
};

type ShowToastFn = (options: ToastOptions) => () => void;

let activeToastDispatcher: ShowToastFn | null = null;
const queuedToasts: ToastOptions[] = [];

export function ToastViewport({
  children,
}: {
  position?: string;
  maxVisible?: number;
  children?: React.ReactNode;
}) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast: ShowToastFn = useCallback(
    (options: ToastOptions) => {
      const id = `zk-toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = { ...options, id };
      setItems((prev) => [...prev.slice(-4), item]);
      if (options.isAutoHide !== false) {
        const duration = options.autoHideDuration ?? 4000;
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return () => removeToast(id);
    },
    [removeToast],
  );

  useEffect(() => {
    activeToastDispatcher = showToast;
    while (queuedToasts.length > 0) {
      const nextToast = queuedToasts.shift();
      if (nextToast) {
        showToast(nextToast);
      }
    }
    return () => {
      activeToastDispatcher = null;
    };
  }, [showToast]);

  return (
    <>
      {children}
      {items.length > 0 && (
        <div
          className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full pointer-events-none"
          role="region"
          aria-label="Notifications"
          aria-live="polite"
        >
          {items.map((item) => {
            const isError = item.type === "error";
            const isSuccess = item.type === "success";
            const isWarning = item.type === "warning";
            return (
              <div
                key={item.id}
                role={isError ? "alert" : "status"}
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg text-sm font-medium transition-all ${
                  isError
                    ? "bg-[var(--zk-error-bg)] border-[var(--zk-error-text)]/30 text-[var(--zk-error-text)]"
                    : isSuccess
                      ? "bg-[var(--zk-success-bg)] border-[var(--zk-success-text)]/30 text-[var(--zk-success-text)]"
                      : isWarning
                        ? "bg-[var(--zk-warning-bg)] border-[var(--zk-warning-text)]/30 text-[var(--zk-warning-text)]"
                        : "bg-[var(--zk-surface)] border-[var(--zk-border-strong)] text-[var(--zk-text)]"
                }`}
              >
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {isError ? (
                    <WarningCircle className="size-5" weight="bold" />
                  ) : isSuccess ? (
                    <CheckCircle className="size-5" weight="bold" />
                  ) : (
                    <Info className="size-5" weight="bold" />
                  )}
                </span>
                <div className="flex-1 min-w-0 leading-snug break-words">{item.body}</div>
                <button
                  type="button"
                  onClick={() => removeToast(item.id)}
                  className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--zk-focus)]"
                  aria-label="Close notification"
                >
                  <X className="size-4" weight="bold" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export function ZackischToaster() {
  return <ToastViewport />;
}

export const AstryxToaster = ZackischToaster;

export function useToast(): ShowToastFn {
  return (options: ToastOptions) => {
    if (activeToastDispatcher) {
      return activeToastDispatcher(options);
    }
    queuedToasts.push(options);
    return () => {};
  };
}

export const toast = {
  success: (body: React.ReactNode, options?: { duration?: number }) => {
    const item: ToastOptions = {
      body,
      type: "success",
      autoHideDuration: options?.duration ?? 4000,
      isAutoHide: true,
    };
    if (activeToastDispatcher) {
      return activeToastDispatcher(item);
    }
    queuedToasts.push(item);
    return () => {};
  },
  error: (body: React.ReactNode, options?: { duration?: number }) => {
    const item: ToastOptions = {
      body,
      type: "error",
      autoHideDuration: options?.duration ?? 6000,
      isAutoHide: true,
    };
    if (activeToastDispatcher) {
      return activeToastDispatcher(item);
    }
    queuedToasts.push(item);
    return () => {};
  },
  info: (body: React.ReactNode, options?: { duration?: number }) => {
    const item: ToastOptions = {
      body,
      type: "info",
      autoHideDuration: options?.duration ?? 4000,
      isAutoHide: true,
    };
    if (activeToastDispatcher) {
      return activeToastDispatcher(item);
    }
    queuedToasts.push(item);
    return () => {};
  },
  warning: (body: React.ReactNode, options?: { duration?: number }) => {
    const item: ToastOptions = {
      body,
      type: "warning",
      autoHideDuration: options?.duration ?? 5000,
      isAutoHide: true,
    };
    if (activeToastDispatcher) {
      return activeToastDispatcher(item);
    }
    queuedToasts.push(item);
    return () => {};
  },
};
