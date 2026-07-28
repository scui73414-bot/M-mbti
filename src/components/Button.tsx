"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
};

const baseClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl border px-6 text-sm font-semibold tracking-[0.03em] outline-none transition duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:border-[var(--line)] disabled:bg-[var(--line)] disabled:text-[var(--muted)] disabled:shadow-none disabled:hover:translate-y-0 focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-background)]";

const variants = {
  primary:
    "border-[var(--black)] bg-[var(--black)] text-[var(--white)] hover:border-[var(--ink-soft)] hover:bg-[var(--ink-soft)]",
  secondary:
    "border-[var(--line-strong)] bg-[var(--surface-pure)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--surface)]",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${baseClass} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
