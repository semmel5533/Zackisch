"use client";

import React, { useEffect } from "react";
import { ToastViewport, useToast as useAstryxToast } from "@astryxdesign/core/Toast";

type ToastOptions = {
  body: React.ReactNode;
  type?: "info" | "error";
  isAutoHide?: boolean;
  autoHideDuration?: number;
};

type ShowToastFn = (options: ToastOptions) => () => void;

let activeToastDispatcher: ShowToastFn | null = null;
const queuedToasts: ToastOptions[] = [];

/**
 * AstryxToaster: Native Astryx toast provider and viewport container.
 * Must be mounted once in the application root layout.
 */
export function AstryxToaster() {
  return (
    <ToastViewport position="bottomEnd" maxVisible={5}>
      <AstryxToastBridge />
    </ToastViewport>
  );
}

function AstryxToastBridge() {
  const showToast = useAstryxToast();

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

  return null;
}

/**
 * Unified toast API powered exclusively by Astryx @astryxdesign/core/Toast.
 */
export const toast = {
  success: (body: React.ReactNode, options?: { duration?: number }) => {
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
      type: "info",
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

export { useAstryxToast as useToast, ToastViewport };
