import type { ReactNode } from "react";

type ReceiptTemplateProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function ReceiptTemplate({ children, actions }: ReceiptTemplateProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface px-4 py-6">
      <div className="flex w-full flex-1 flex-col gap-4">{children}</div>
      <nav
        aria-label="Principal"
        className="bottom-bar mt-auto flex items-center justify-end gap-2"
      >
        {actions}
      </nav>
    </main>
  );
}
