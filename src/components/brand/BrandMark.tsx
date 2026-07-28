import type { SVGProps } from "react";

export type BrandMarkProps = Omit<
  SVGProps<SVGSVGElement>,
  "children"
> & {
  title?: string;
};

/**
 * 命格印
 *
 * A single-colour seal mark: the clipped-corner frame references an old
 * bookplate, while the inner geometry reduces “命” to its most recognisable
 * strokes. The small ring is both the centre of the glyph and a命盘 datum.
 */
export function BrandMark({
  title,
  width = 32,
  height = 32,
  ...props
}: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={width}
      height={height}
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}

      <path
        d="M8 3.75h32L44.25 8v32L40 44.25H8L3.75 40V8L8 3.75Z"
        stroke="currentColor"
        strokeWidth="2.25"
      />
      <path
        d="M8.5 11V8.5H11M37 8.5h2.5V11M39.5 37v2.5H37M11 39.5H8.5V37"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="m11 16 11.5-9h3L37 16h-5l-8-6.1-8 6.1h-5Z"
        fill="currentColor"
      />
      <path d="M14 17h20v3H14z" fill="currentColor" />
      <path
        fillRule="evenodd"
        d="M12 22h15v13H12V22Zm3 3v7h9v-7h-9Z"
        fill="currentColor"
      />
      <path d="M29 22h9v3h-5v13h-4V22Z" fill="currentColor" />
      <path d="M32 32h6v3h-6z" fill="currentColor" />
      <circle
        cx="19.5"
        cy="28.5"
        r="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
