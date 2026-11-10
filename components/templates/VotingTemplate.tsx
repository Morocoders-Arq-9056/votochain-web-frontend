import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { ACCESS_BRAND } from "@/lib/ui/copy";

type VotingTemplateProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sidebarLabel: string;
  sidebarItems: { href: string; label: string; active?: boolean }[];
  actorLine: string;
  children: ReactNode;
};

export function VotingTemplate({
  eyebrow,
  title,
  subtitle,
  sidebarLabel,
  sidebarItems,
  actorLine,
  children,
}: VotingTemplateProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full flex-col bg-bg">
      <header className="flex h-18 w-full items-center justify-between bg-surface px-4 lg:px-8">
        <span className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-brand-primary text-white">
            <ShieldCheck aria-hidden className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold text-text-primary">
            {ACCESS_BRAND}
          </span>
        </span>
        <span className="hidden text-sm text-text-secondary md:block">{actorLine}</span>
      </header>
      <div className="flex w-full flex-1 flex-col lg:flex-row">
        <aside
          aria-label={sidebarLabel}
          className="hidden w-[240px] shrink-0 flex-col gap-1 bg-surface p-4 lg:flex"
        >
          <p className="px-2 py-2 text-xs font-semibold tracking-wide text-text-secondary uppercase">
            {sidebarLabel}
          </p>
          {sidebarItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={
                item.active
                  ? "rounded-md bg-bg px-3 py-3 text-sm font-semibold text-brand-primary"
                  : "rounded-md px-3 py-3 text-sm text-text-primary hover:bg-surface-hover"
              }
            >
              {item.label}
            </a>
          ))}
        </aside>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-6 md:max-w-3xl lg:mx-0 lg:max-w-[1200px] lg:px-8">
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-2xl text-text-primary">{title}</h1>
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
          <div className="mt-4 flex w-full flex-1 flex-col gap-4 pb-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
