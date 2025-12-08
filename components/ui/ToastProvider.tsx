"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import React from "react";
import clsx from "clsx";

type ToastVariant = "success" | "error" | "info";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms, Infinity to persist
}

interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
  variant: ToastVariant;
  duration: number;
}

type ToastContextValue = {
  pushToast: (toast: ToastOptions) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const generateId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto && crypto.randomUUID()) ||
  Math.random().toString(36).slice(2);

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-emerald-500/15 border-emerald-500/30 text-emerald-100",
  error: "bg-red-500/15 border-red-500/30 text-red-100",
  info: "bg-white/5 border-white/10 text-white",
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4" />, 
  error: <AlertTriangle className="w-4 h-4" />, 
  info: <Info className="w-4 h-4" />,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={clsx(
        "w-full max-w-sm rounded-xl border shadow-2xl shadow-black/30 p-4 backdrop-blur-md flex gap-3 items-start", 
        variantStyles[toast.variant]
      )}
    >
      <div className="mt-0.5">{variantIcon[toast.variant]}</div>
      <div className="flex-1">
        <p className="font-semibold leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-white/70 mt-1 leading-snug">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timeouts = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const handle = timeouts.current[id];
    if (handle) {
      clearTimeout(handle);
      delete timeouts.current[id];
    }
  }, []);

  const pushToast = React.useCallback(
    ({ title, description, variant = "info", duration = 4500 }: ToastOptions) => {
      const toast: Toast = {
        id: generateId(),
        title,
        description,
        variant,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, toast]);

      if (duration !== Infinity) {
        const handle = setTimeout(() => dismissToast(toast.id), duration);
        timeouts.current[toast.id] = handle;
      }
    },
    [dismissToast]
  );

  React.useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  const value = React.useMemo(() => ({ pushToast, dismissToast }), [pushToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onDismiss={() => dismissToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
