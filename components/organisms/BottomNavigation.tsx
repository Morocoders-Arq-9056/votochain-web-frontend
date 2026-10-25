import Link from "next/link";
import { Home, ReceiptText, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavigationItem = {
  href: string;
  label: string;
  icon: "home" | "vote" | "receipt";
  active?: boolean;
};

const ICONS = { home: Home, vote: Vote, receipt: ReceiptText } as const;

export function BottomNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav
      aria-label="Principal"
      className="bottom-bar flex w-full items-stretch justify-around gap-2 bg-surface"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-1 rounded-md text-xs",
              item.active
                ? "font-semibold text-brand-primary"
                : "text-text-secondary",
            )}
          >
            <Icon className="size-5" aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
