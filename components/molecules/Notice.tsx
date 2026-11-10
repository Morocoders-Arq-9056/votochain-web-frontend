import { CircleAlert, CircleCheck, Info } from "lucide-react";

type NoticeProps = {
  tone: "info" | "success" | "warning" | "danger";
  title: string;
  detail: string;
};

const ICONS = { info: Info, success: CircleCheck, warning: CircleAlert, danger: CircleAlert } as const;

export function Notice({ tone, title, detail }: NoticeProps) {
  const Icon = ICONS[tone];
  const toneClass =
    tone === "success"
      ? "border-bg-success bg-bg-success"
      : tone === "warning"
        ? "border-bg-warning bg-bg-warning"
        : tone === "danger"
          ? "border-bg-danger bg-bg-danger"
          : "border-border bg-bg";
  return (
    <div className={`flex w-full flex-col gap-2 rounded-md border p-4 ${toneClass}`} role="status">
      <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
        <Icon aria-hidden className="size-5 shrink-0" />
        {title}
      </p>
      <p className="text-sm text-text-secondary">{detail}</p>
    </div>
  );
}
