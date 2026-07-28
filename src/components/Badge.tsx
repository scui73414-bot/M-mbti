import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-xs font-medium tracking-[0.03em] text-[var(--ink-soft)]">
      {children}
    </span>
  );
}
