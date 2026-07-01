import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#d7e0d4] bg-[#f4f8f1] px-3 py-1 text-xs font-medium text-[#425247]">
      {children}
    </span>
  );
}
