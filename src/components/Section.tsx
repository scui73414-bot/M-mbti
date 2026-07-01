import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm shadow-[#38463b]/5">
      <h2 className="mb-3 text-base font-bold text-[#202822]">{title}</h2>
      <div className="text-sm leading-7 text-[#58645d]">{children}</div>
    </section>
  );
}
