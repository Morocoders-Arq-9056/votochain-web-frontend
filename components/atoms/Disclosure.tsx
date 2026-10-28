import { cn } from "@/lib/utils";

type DisclosureProps = {
  summary: string;
  children: React.ReactNode;
  className?: string;
};

export function Disclosure({
  summary,
  children,
  className,
}: DisclosureProps) {
  return (
    <details
      className={cn(
        "rounded-md border border-border bg-bg p-3",
        className,
      )}
    >
      <summary className="cursor-pointer text-sm font-semibold text-text-primary">
        {summary}
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
