import {
  ACCESS_CONTEXT_DETAIL,
  ACCESS_CONTEXT_EYEBROW,
  ACCESS_CONTEXT_TITLE,
  ACCESS_CONTEXT_USER,
} from "@/lib/ui/copy";

export function AccessContext() {
  return (
    <div className="flex w-full max-w-[var(--container-context)] flex-col gap-4 pt-12">
      <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">
        {ACCESS_CONTEXT_EYEBROW}
      </p>
      <p className="font-display text-4xl leading-tight text-brand-primary">
        {ACCESS_CONTEXT_TITLE}
      </p>
      <p className="text-base text-text-secondary">{ACCESS_CONTEXT_DETAIL}</p>
      <p className="text-sm text-text-secondary">{ACCESS_CONTEXT_USER}</p>
    </div>
  );
}
