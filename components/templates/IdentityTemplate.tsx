import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { BottomNavigation, type NavigationItem } from "@/components/organisms/BottomNavigation";
import { ACCESS_BRAND } from "@/lib/ui/copy";

type IdentityTemplateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  nav: NavigationItem[];
};

export function IdentityTemplate({
  eyebrow,
  title,
  description,
  children,
  nav,
}: IdentityTemplateProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg md:max-w-3xl lg:max-w-none">
      <header className="flex h-18 w-full items-center bg-surface px-4 lg:px-0">
        <div className="mx-auto flex w-full max-w-md items-center justify-between md:max-w-2xl lg:max-w-[var(--container-inner)] lg:px-8 min-[1376px]:px-0">
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
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-4 md:max-w-2xl lg:max-w-[var(--container-inner)] lg:px-8 lg:pt-10 min-[1376px]:px-0">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-2xl text-text-primary">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
        <div className="mt-4 flex w-full flex-1 flex-col gap-4 pb-4">{children}</div>
      </div>
      <div className="lg:hidden">
        <BottomNavigation items={nav} />
      </div>
    </main>
  );
}
