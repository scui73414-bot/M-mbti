import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { brand } from "@/config/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] text-[var(--muted)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between md:py-10 lg:px-8">
        <div className="flex items-center gap-3">
          <BrandMark
            width={24}
            height={24}
            aria-hidden="true"
            className="shrink-0 text-[var(--ink)]"
          />
          <div>
            <p className="m-0 text-[13px] font-bold tracking-[0.14em] text-[var(--ink)]">
              {brand.nameCn}
            </p>
            <p className="mt-1 mb-0 text-[9px] font-semibold tracking-[0.2em]">
              {brand.nameEn}
            </p>
          </div>
        </div>

        <p className="m-0 max-w-lg text-[12px] leading-6 md:text-center">
          仅供娱乐与自我观察，结果在本地生成，不上传生日与出生地。
        </p>

        <nav aria-label="页脚导航" className="flex items-center gap-5 text-[12px]">
          <Link
            href="/about"
            className="underline-offset-4 transition-colors duration-200 hover:text-[var(--ink)] hover:underline focus-visible:text-[var(--ink)] focus-visible:outline-none focus-visible:underline"
          >
            测试说明
          </Link>
          <span aria-hidden="true" className="size-1 rotate-45 border border-current" />
          <Link
            href="/privacy"
            className="underline-offset-4 transition-colors duration-200 hover:text-[var(--ink)] hover:underline focus-visible:text-[var(--ink)] focus-visible:outline-none focus-visible:underline"
          >
            隐私说明
          </Link>
        </nav>
      </div>
    </footer>
  );
}
