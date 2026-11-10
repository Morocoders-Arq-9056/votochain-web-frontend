"use client";

import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
};

export function OtpInput({
  value,
  onChange,
  length = 6,
  className,
}: OtpInputProps) {
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  return (
    <span className={cn("inline-flex w-full gap-1", className)} aria-live="polite">
      {digits.map((digit, index) => (
        <input
          key={index}
          inputMode="numeric"
          maxLength={length}
          aria-label={`Dígito ${index + 1} de ${length}`}
          value={digit}
          onChange={(event) => {
            const next = (value + event.target.value.replace(/\D/g, "")).slice(0, length);
            if (next !== value) onChange(next);
          }}
          className="h-14 min-w-0 flex-1 rounded-field border border-border bg-surface text-center text-2xl font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary lg:h-[56px] lg:w-[64px] lg:flex-none"
        />
      ))}
    </span>
  );
}
