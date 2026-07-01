"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
};

const baseClass =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

const variants = {
  primary: "bg-[#2f4a3c] text-white shadow-lg shadow-[#2f4a3c]/20 hover:bg-[#263c31]",
  secondary: "border border-[#d5ddd2] bg-white text-[#26302a] hover:bg-[#f7faf5]",
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
