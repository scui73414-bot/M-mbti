import type { CSSProperties } from "react";
import { brand } from "@/config/brand";
import { BrandMark } from "./BrandMark";

export type BrandLogoProps = {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  className?: string;
};

const dimensions = {
  sm: {
    mark: 24,
    gap: 8,
    nameCn: 14,
    nameEn: 7,
    letterSpacingCn: "0.12em",
    letterSpacingEn: "0.2em",
  },
  md: {
    mark: 32,
    gap: 10,
    nameCn: 17,
    nameEn: 8,
    letterSpacingCn: "0.13em",
    letterSpacingEn: "0.22em",
  },
  lg: {
    mark: 44,
    gap: 13,
    nameCn: 22,
    nameEn: 10,
    letterSpacingCn: "0.14em",
    letterSpacingEn: "0.24em",
  },
} as const;

export function BrandLogo({
  variant = "full",
  size = "md",
  inverted = false,
  className,
}: BrandLogoProps) {
  const scale = dimensions[size];
  const color = inverted ? "var(--white, #ffffff)" : "var(--ink, #171816)";

  if (variant === "mark") {
    return (
      <BrandMark
        title={brand.nameCn}
        width={scale.mark}
        height={scale.mark}
        className={className}
        style={{ color }}
      />
    );
  }

  return (
    <span
      className={className}
      role="img"
      aria-label={`${brand.nameCn}，${brand.nameEn}`}
      style={
        {
          display: "inline-flex",
          alignItems: "center",
          gap: scale.gap,
          color,
          flexShrink: 0,
        } satisfies CSSProperties
      }
    >
      <BrandMark
        width={scale.mark}
        height={scale.mark}
        aria-hidden="true"
        style={{ flex: "0 0 auto" }}
      />
      <span
        aria-hidden="true"
        style={{
          display: "flex",
          minWidth: 0,
          flexDirection: "column",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: scale.nameCn,
            fontWeight: 720,
            letterSpacing: scale.letterSpacingCn,
            whiteSpace: "nowrap",
          }}
        >
          {brand.nameCn}
        </span>
        <span
          style={{
            marginTop: Math.max(3, Math.round(scale.mark * 0.1)),
            color: "currentColor",
            fontSize: scale.nameEn,
            fontWeight: 600,
            letterSpacing: scale.letterSpacingEn,
            opacity: 0.58,
            whiteSpace: "nowrap",
          }}
        >
          {brand.nameEn}
        </span>
      </span>
    </span>
  );
}
