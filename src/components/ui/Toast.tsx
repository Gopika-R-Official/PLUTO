"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

type ToastListener = (toast: ToastMessage) => void;

const listeners = new Set<ToastListener>();

export const toast = {
  success(message: string) {
    const item: ToastMessage = { id: `toast-${Date.now()}-${Math.random()}`, type: "success", message };
    listeners.forEach((fn) => fn(item));
  },
  error(message: string) {
    const item: ToastMessage = { id: `toast-${Date.now()}-${Math.random()}`, type: "error", message };
    listeners.forEach((fn) => fn(item));
  },
  info(message: string) {
    const item: ToastMessage = { id: `toast-${Date.now()}-${Math.random()}`, type: "info", message };
    listeners.forEach((fn) => fn(item));
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast: ToastListener = (newToast) => {
      setToasts((prev) => [...prev.slice(-4), newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3600);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-2 sm:px-0 sm:right-6"
    >
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl ${
              item.type === "success"
                ? "bg-neutral-900/90 text-white border-emerald-500/40 dark:bg-neutral-950/90"
                : item.type === "error"
                ? "bg-neutral-900/90 text-white border-rose-500/40 dark:bg-neutral-950/90"
                : "bg-neutral-900/90 text-white border-blue-500/40 dark:bg-neutral-950/90"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.type === "success" && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
              {item.type === "error" && (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              )}
              {item.type === "info" && (
                <Info className="h-4 w-4 shrink-0 text-blue-400" />
              )}
              <p className="text-xs font-medium leading-relaxed truncate">{item.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              aria-label="Dismiss notification"
              className="text-white/60 hover:text-white shrink-0 p-1 rounded-md transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
