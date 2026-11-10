import type { ReactNode } from "react";

type ReceiptTemplateProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function ReceiptTemplate({ children, actions }: ReceiptTemplateProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface px-4 py-6 md:max-w-3xl lg:max-w-[var(--container-inner)] lg:px-0">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 md:max-w-2xl lg:max-w-[var(--container-inner)]">{children}</div>
      <nav
        aria-label="Principal"
        className="bottom-bar mt-auto flex items-center justify-end gap-2"
      >
        {actions}
      </nav>
    </main>
  );
}
