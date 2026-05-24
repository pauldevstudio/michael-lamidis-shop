"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error";
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  dismiss: (id: string) => void;
}

export default function Toast({ toasts, dismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  dismiss,
}: {
  toast: ToastMessage;
  dismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  const isSuccess = toast.type === "success";
  return (
    <div
      className="pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl border text-sm font-medium max-w-xs"
      style={{
        background: isSuccess ? "#F0FDF4" : "#FEF2F2",
        borderColor: isSuccess ? "#BBF7D0" : "#FECACA",
        color: isSuccess ? "#166534" : "#991B1B",
      }}
    >
      {isSuccess ? (
        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="w-4 h-4 shrink-0 text-red-500" />
      )}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => dismiss(toast.id)}
        className="opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
