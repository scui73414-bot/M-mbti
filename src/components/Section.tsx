import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[var(--line)] py-6">
      <h2 className="mb-3 text-base font-bold tracking-[0.02em] text-[var(--ink)]">
        {title}
      </h2>
      <div className="max-w-prose text-[15px] leading-7 text-[var(--ink-soft)]">
        {children}
      </div>
    </section>
  );
}
