import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { AccessContext } from "@/components/molecules/AccessContext";
import { ACCESS_BRAND, ACCESS_LEGAL, ACCESS_SUPPORT } from "@/lib/ui/copy";

type AuthTemplateProps = {
  title: string;
  description: string;
  children: ReactNode;
  minHeightClass?: string;
};

export function AuthTemplate({
  title,
  description,
  children,
  minHeightClass = "lg:min-h-[417px]",
}: AuthTemplateProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg md:max-w-3xl lg:max-w-none">
      <header className="flex h-18 w-full items-center bg-surface px-4 lg:px-0">
        <div className="mx-auto flex w-full max-w-md items-center justify-between md:max-w-xl lg:max-w-[var(--container-auth)] lg:px-8 min-[1355px]:px-0">
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-brand-primary text-white">
              <ShieldCheck aria-hidden className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold text-text-primary">
              {ACCESS_BRAND}
            </span>
          </span>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-md flex-col px-4 pt-4 md:max-w-xl lg:max-w-[var(--container-auth)] lg:flex-1 lg:flex-row lg:justify-center lg:gap-[var(--spacing-auth-gap)] lg:px-8 lg:pt-12 min-[1355px]:px-0">
        <div className="hidden lg:block lg:min-w-0 lg:flex-1 lg:max-w-[var(--container-context)]">
          <AccessContext />
        </div>
        <div className="flex w-full flex-col lg:min-w-0 lg:flex-1 lg:max-w-[var(--container-task)]">
          <div
            className={`flex w-full flex-col rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card ${minHeightClass}`}
          >
            <h1 className="font-display text-2xl text-text-primary">{title}</h1>
            <p className="mt-2 text-sm text-text-secondary">{description}</p>
            <div className="mt-8 flex w-full flex-col">{children}</div>
          </div>
        </div>
      </div>
      <footer className="mt-8 flex h-12 w-full items-center bg-surface px-4 lg:px-0">
        <div className="mx-auto flex w-full max-w-md items-center justify-between md:max-w-xl lg:max-w-[var(--container-auth)] lg:px-8 min-[1355px]:px-0">
          <span className="text-xs text-text-secondary">{ACCESS_LEGAL}</span>
          <span className="text-xs text-text-secondary">{ACCESS_SUPPORT}</span>
        </div>
      </footer>
    </main>
  );
}
