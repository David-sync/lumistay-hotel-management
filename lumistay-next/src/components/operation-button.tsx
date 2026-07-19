"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type OperationAction = "check-in" | "create-invoice" | "pay" | "checkout";

type Feedback = { type: "idle" | "error" | "success"; message?: string };

export function OperationButton({ action, identifier, bookingId, label, className }: { action: OperationAction; identifier: string; bookingId?: string; label: string; className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ type: "idle" });

  async function runOperation() {
    setPending(true);
    setFeedback({ type: "idle" });

    try {
      const isBookingAction = action === "check-in" || action === "create-invoice";
      const response = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          id: identifier,
          ...(isBookingAction ? { maSo: identifier } : { maHd: identifier, ...(bookingId ? { maSo: bookingId } : {}) }),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = typeof result.message === "string" ? result.message : typeof result.error === "string" ? result.error : "Không thể hoàn tất thao tác.";
        throw new Error(errorMessage);
      }

      setFeedback({ type: "success", message: typeof result.message === "string" ? result.message : "Đã cập nhật thành công." });
      router.refresh();
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-w-32" aria-live="polite">
      <button
        type="button"
        onClick={runOperation}
        disabled={pending || feedback.type === "success"}
        className={cn(
          "inline-flex min-h-8 items-center justify-center gap-1.5 rounded-[4px] bg-[#183B35] px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#102F2A] focus:outline-none focus:ring-2 focus:ring-[#183B35]/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-65",
          className,
        )}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : feedback.type === "success" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {pending ? "Đang xử lý…" : feedback.type === "success" ? "Hoàn tất" : label}
      </button>
      {feedback.type !== "idle" && feedback.message ? (
        <p className={cn("mt-1.5 flex max-w-52 items-start gap-1 text-[11px] leading-4", feedback.type === "error" ? "text-rose-600" : "text-emerald-700")} role={feedback.type === "error" ? "alert" : "status"}>
          {feedback.type === "error" ? <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" /> : null}
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
