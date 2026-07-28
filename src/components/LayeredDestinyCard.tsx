import { forwardRef, type CSSProperties } from "react";
import { CardImage } from "@/components/CardImage";
import { getCharacterFrameConfig } from "@/data/characterFrameConfigs";
import type { PersonalityProfile } from "@/data/personalityProfiles";
import type { DestinyType } from "@/data/types";
import {
  type CardElementTheme,
  getCardElementTheme,
  resolveCardImageSource,
} from "@/lib/cards/resolveCardVisual";
import { formatSpiritSubLabel } from "@/lib/cards/cardContent";

const TITLE_REGION_PERCENT = 18;
const FULL_CHARACTER_REGION_PERCENT = 62;
const FULL_INFO_REGION_PERCENT = 20;
const THUMB_CHARACTER_REGION_PERCENT = 68;
const THUMB_INFO_REGION_PERCENT = 14;

type LayeredDestinyCardProps = {
  type: DestinyType;
  profile?: PersonalityProfile;
  shareText?: string;
  keywords?: readonly string[];
  priority?: boolean;
  variant?: "full" | "thumb";
};

function getElementMotifStyle(theme: CardElementTheme): CSSProperties {
  const common: CSSProperties = {
    backgroundRepeat: "no-repeat",
  };

  switch (theme.element) {
    case "wood":
      return {
        ...common,
        backgroundImage: [
          `radial-gradient(ellipse 32% 42% at -5% 30%, transparent 69%, ${theme.motifInk} 70%, transparent 71%)`,
          `radial-gradient(ellipse 29% 38% at 105% 72%, transparent 69%, ${theme.motifInk} 70%, transparent 71%)`,
          `radial-gradient(ellipse 8% 3% at 8% 22%, ${theme.motifInk} 0 45%, transparent 48%)`,
          `radial-gradient(ellipse 8% 3% at 92% 80%, ${theme.motifInk} 0 45%, transparent 48%)`,
        ].join(", "),
      };
    case "fire":
      return {
        ...common,
        backgroundImage: [
          `radial-gradient(circle at 50% -4%, transparent 0 12%, ${theme.motifInk} 12.3% 12.8%, transparent 13.1%)`,
          `radial-gradient(circle at 50% -4%, transparent 0 20%, ${theme.motifInk} 20.3% 20.8%, transparent 21.1%)`,
          `radial-gradient(circle at 50% 104%, transparent 0 10%, ${theme.motifInk} 10.3% 10.8%, transparent 11.1%)`,
        ].join(", "),
      };
    case "earth":
      return {
        ...common,
        backgroundImage: [
          `linear-gradient(90deg, transparent 0 8.5%, ${theme.motifInk} 8.65% 8.85%, transparent 9% 91%, ${theme.motifInk} 91.15% 91.35%, transparent 91.5%)`,
          `linear-gradient(135deg, transparent 0 47.8%, ${theme.motifInk} 48% 48.3%, transparent 48.5% 51.5%, ${theme.motifInk} 51.7% 52%, transparent 52.2%)`,
        ].join(", "),
        backgroundPosition: "center, center 98%",
        backgroundSize: "100% 100%, 18% 9%",
      };
    case "metal":
      return {
        ...common,
        backgroundImage: [
          `radial-gradient(circle at 98% 18%, transparent 0 8%, ${theme.motifInk} 8.3% 8.8%, transparent 9.1% 12%, ${theme.motifInk} 12.3% 12.8%, transparent 13.1%)`,
          `radial-gradient(circle at 2% 82%, transparent 0 7%, ${theme.motifInk} 7.3% 7.8%, transparent 8.1% 11%, ${theme.motifInk} 11.3% 11.8%, transparent 12.1%)`,
        ].join(", "),
      };
    case "water":
      return {
        ...common,
        backgroundImage: [
          `radial-gradient(ellipse 34% 15% at 4% 93%, transparent 0 63%, ${theme.motifInk} 64% 65%, transparent 66%)`,
          `radial-gradient(ellipse 34% 15% at 50% 96%, transparent 0 63%, ${theme.motifInk} 64% 65%, transparent 66%)`,
          `radial-gradient(ellipse 34% 15% at 96% 93%, transparent 0 63%, ${theme.motifInk} 64% 65%, transparent 66%)`,
          `radial-gradient(ellipse 27% 12% at 50% 4%, transparent 0 63%, ${theme.motifInk} 64% 65%, transparent 66%)`,
        ].join(", "),
      };
  }
}

function FolioCorner({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 h-[5.4%] w-[5.4%] ${className}`}
      style={{ color }}
    >
      <span className="absolute inset-0 border-l border-t border-current" />
      <span className="absolute left-[24%] top-[24%] h-[34%] w-[34%] rotate-45 border border-current opacity-65" />
    </div>
  );
}

export const LayeredDestinyCard = forwardRef<
  HTMLDivElement,
  LayeredDestinyCardProps
>(function LayeredDestinyCard(
  {
    type,
    profile,
    shareText,
    keywords = type.keywords,
    priority = false,
    variant = "full",
  },
  ref,
) {
  const theme = getCardElementTheme(type.elementFamily);
  const imageSource = resolveCardImageSource({ type, profile, variant });
  const isThumbnail = variant === "thumb";
  const characterRegionPercent = isThumbnail
    ? THUMB_CHARACTER_REGION_PERCENT
    : FULL_CHARACTER_REGION_PERCENT;
  const infoRegionPercent = isThumbnail
    ? THUMB_INFO_REGION_PERCENT
    : FULL_INFO_REGION_PERCENT;
  const SocialNameTag = variant === "thumb" ? "p" : "h1";
  const socialName = type.socialName;
  const subLabel = formatSpiritSubLabel(type);
  const displayedKeywords = keywords.slice(0, 3);
  const resolvedShareText = shareText ?? type.oneLiner;
  const characterFrameConfig = getCharacterFrameConfig(type);

  return (
    <div
      ref={ref}
      className="destiny-card-display relative grid aspect-[3/4] w-full overflow-hidden rounded-[0.34rem] border text-center shadow-[0_12px_28px_rgba(72,58,39,0.12),0_2px_7px_rgba(72,58,39,0.06),inset_0_0_0_1px_rgba(255,255,255,0.62)]"
      data-element-family={type.elementFamily}
      data-image-kind={imageSource.kind}
      style={{
        backgroundColor: "#f4eee1",
        borderColor: "rgba(107, 93, 70, 0.52)",
        backgroundImage: [
          "radial-gradient(circle at 19% 24%, rgba(70, 59, 43, 0.06) 0 0.65px, transparent 0.9px)",
          "radial-gradient(circle at 73% 61%, rgba(70, 59, 43, 0.045) 0 0.55px, transparent 0.85px)",
          "radial-gradient(ellipse 42% 28% at 92% 14%, transparent 0 64%, rgba(109, 96, 72, 0.1) 65% 66%, transparent 67% 74%, rgba(109, 96, 72, 0.07) 75% 76%, transparent 77%)",
          "linear-gradient(180deg, #fbf7ed 0%, #f4eee1 54%, #eee5d5 100%)",
        ].join(", "),
        backgroundPosition: "0 0, 7px 11px, 0 0, 0 0",
        backgroundSize: "21px 27px, 31px 37px, auto, auto",
        containerType: "inline-size",
        gridTemplateRows: `${TITLE_REGION_PERCENT}% ${characterRegionPercent}% ${infoRegionPercent}%`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3.4%] z-0"
        style={getElementMotifStyle(theme)}
      />

      <header
        className="relative z-10 flex min-h-0 flex-col items-center justify-center overflow-hidden px-[10%] pb-[1%] pt-[3%]"
        style={{
          background: "linear-gradient(180deg, rgba(255, 252, 244, 0.72), transparent)",
          color: "#37372f",
        }}
      >
        <SocialNameTag className="relative line-clamp-2 max-w-full break-keep text-[clamp(1.18rem,7.8cqw,2.05rem)] font-extrabold leading-[1.08] tracking-[0.075em]">
          {socialName}
        </SocialNameTag>
        <p
          className="relative mt-[3.5%] max-w-full truncate text-[clamp(0.5rem,2.6cqw,0.76rem)] font-semibold tracking-[0.16em]"
          style={{ color: theme.primary }}
        >
          {subLabel}
        </p>
      </header>

      <section
        className="relative z-10 mx-[5.2%] my-[1.1%] min-h-0 overflow-hidden rounded-[0.48rem] border"
        style={{
          background: "radial-gradient(circle at 50% 44%, rgba(149, 126, 88, 0.10), transparent 43%), linear-gradient(160deg, #faf5e9 0%, #eee5d5 100%)",
          borderColor: "rgba(107, 93, 70, 0.42)",
        }}
        aria-label={`${type.dominantTenGod} ${type.spiritArchetype}人物舞台`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[1.35%] z-20 rounded-[0.34rem] border opacity-65"
          style={{ borderColor: theme.line }}
        />
        <div className="absolute inset-[5.5%]">
          <CardImage
            alt={`${socialName} · ${type.spiritArchetype}`}
            fit="contain"
            frameConfig={characterFrameConfig}
            priority={priority}
            profile={profile}
            type={type}
            variant={variant}
          />
        </div>
      </section>

      <footer
        className="relative z-10 flex min-h-0 flex-col justify-center overflow-hidden px-[8%] py-[2%]"
        style={{
          background: "linear-gradient(180deg, rgba(250, 245, 233, 0.2), rgba(247, 240, 225, 0.9))",
          color: "#37372f",
        }}
      >
        <p
          className="line-clamp-2 text-[clamp(0.52rem,2.5cqw,0.76rem)] font-medium leading-[1.55] tracking-[0.035em]"
          style={{ color: "#6d6658" }}
        >
          {resolvedShareText}
        </p>
        {!isThumbnail && displayedKeywords.length > 0 && (
          <div
            aria-label={`关键词：${displayedKeywords.join("、")}`}
            className="mt-[4%] grid grid-cols-3 gap-[2.2%]"
          >
            {displayedKeywords.map((keyword) => (
              <span
                className="truncate rounded-[0.22rem] border px-[3%] py-[4%] text-[clamp(0.47rem,2.08cqw,0.64rem)] font-semibold tracking-[0.05em]"
                key={keyword}
                style={{
                  backgroundColor: "rgba(255, 251, 240, 0.58)",
                  borderColor: "rgba(126, 108, 78, 0.36)",
                  color: "#5a5143",
                }}
                title={keyword}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        <div
          aria-hidden="true"
          className={[
            "mx-auto flex w-[86%] items-center gap-[4%]",
            isThumbnail ? "mb-[5%] mt-[3%]" : "mb-[2.8%] mt-[4%]",
          ].join(" ")}
        >
          <span
            className="h-px flex-1 opacity-65"
            style={{ backgroundColor: "rgba(126, 108, 78, 0.42)" }}
          />
          <span
            className="h-[0.32rem] w-[0.32rem] rotate-45 border opacity-70"
            style={{ borderColor: "rgba(126, 108, 78, 0.72)" }}
          />
          <span
            className="h-px flex-1 opacity-65"
            style={{ backgroundColor: "rgba(126, 108, 78, 0.42)" }}
          />
        </div>
      </footer>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2.2%] z-30 rounded-[0.62rem] border shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"
        style={{ borderColor: "rgba(107, 93, 70, 0.58)" }}
      />
      <FolioCorner
        className="left-[2.2%] top-[2.2%]"
        color={theme.primary}
      />
      <FolioCorner
        className="right-[2.2%] top-[2.2%] rotate-90"
        color={theme.primary}
      />
      <FolioCorner
        className="bottom-[2.2%] right-[2.2%] rotate-180"
        color={theme.primary}
      />
      <FolioCorner
        className="bottom-[2.2%] left-[2.2%] -rotate-90"
        color={theme.primary}
      />
    </div>
  );
});
