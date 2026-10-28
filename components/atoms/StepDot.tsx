import { Check, LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineVisual } from "@/lib/ui/visuals";

export function StepDot({
  status,
  className,
}: {
  status: TimelineVisual;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border",
        status === "done" && "border-bg-success bg-bg-success text-success",
        status === "current" && "border-brand-primary bg-bg text-brand-primary",
        status === "failed" && "border-bg-danger bg-bg-danger text-danger",
        className,
      )}
    >
      {status === "done" && <Check className="size-4" />}
      {status === "current" && <LoaderCircle className="size-4 animate-spin" />}
      {status === "failed" && <X className="size-4" />}
    </span>
  );
}
