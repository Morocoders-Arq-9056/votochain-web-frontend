import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm",
  {
    variants: {
      tone: {
        success: "border-bg-success bg-bg-success text-text-primary",
        warning: "border-bg-warning bg-bg-warning text-text-primary",
        danger: "border-bg-danger bg-bg-danger text-text-primary",
      },
    },
    defaultVariants: { tone: "success" },
  },
);

type ToastProps = {
  message: string;
  tone?: "success" | "warning" | "danger";
  action?: { label: string; onAction: () => void };
  onDismiss?: () => void;
};

/**
 * Transient feedback with an optional action ("Ver recibo", "Reintentar").
 */
export function Toast({ message, tone, action, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(toastVariants({ tone }))}
    >
      <span className="flex-1">{message}</span>
      {action && (
        <button
          type="button"
          onClick={action.onAction}
          className="min-h-12 shrink-0 rounded-sm px-3 text-sm font-semibold text-brand-primary"
        >
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className="min-h-12 shrink-0 rounded-sm px-3 text-sm font-semibold text-text-secondary"
        >
          ×
        </button>
      )}
    </div>
  );
}
