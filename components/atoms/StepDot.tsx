import { Check, LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type EstadoPaso = "done" | "current" | "failed";

export function StepDot({
  estado,
  className,
}: {
  estado: EstadoPaso;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border",
        estado === "done" && "border-bg-success bg-bg-success text-success",
        estado === "current" && "border-brand-primary bg-bg text-brand-primary",
        estado === "failed" && "border-bg-danger bg-bg-danger text-danger",
        className,
      )}
    >
      {estado === "done" && <Check className="size-4" />}
      {estado === "current" && <LoaderCircle className="size-4 animate-spin" />}
      {estado === "failed" && <X className="size-4" />}
    </span>
  );
}
