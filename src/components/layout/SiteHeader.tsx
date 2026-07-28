"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { brand } from "@/config/brand";

const navigation = [
  { href: "/test", label: "开始测试" },
  { href: "/types", label: "命格图鉴" },
  { href: "/about", label: "测试说明" },
] as const;

function matchesPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-40 border-b border-[var(--line)] bg-[var(--page-background)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-4 sm:min-h-[4.5rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${brand.nameCn}首页`}
          className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4"
        >
          <span className="sm:hidden">
            <BrandLogo variant="mark" size="sm" />
          </span>
          <span className="hidden sm:inline-flex">
            <BrandLogo size="sm" />
          </span>
        </Link>

        <nav
          aria-label="主导航"
          className="ml-auto flex min-w-0 items-stretch gap-1 sm:gap-5"
        >
          {navigation.map((item) => {
            const active = matchesPath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative inline-flex min-h-12 items-center justify-center whitespace-nowrap px-2 text-[12px] font-semibold tracking-[0.04em] outline-none transition-colors duration-200 sm:px-1 sm:text-[13px]",
                  "after:absolute after:inset-x-2 after:bottom-1.5 after:h-px after:origin-center after:bg-current after:transition-transform after:duration-200 sm:after:inset-x-0",
                  "focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4",
                  active
                    ? "text-[var(--ink)] after:scale-x-100"
                    : "text-[var(--muted)] after:scale-x-0 hover:text-[var(--ink)]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
