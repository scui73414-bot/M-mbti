import Image from "next/image";
import {
  getPersonalityProfileById,
  type PersonalityProfile,
} from "@/data/personalityProfiles";
import type { CharacterFrameConfig } from "@/data/characterFrameConfigs";
import type { DestinyType } from "@/data/types";
import {
  getCardElementTheme,
  resolveCardImageSource,
} from "@/lib/cards/resolveCardVisual";

type CardImageProps = {
  type: DestinyType;
  profile?: PersonalityProfile;
  priority?: boolean;
  variant?: "full" | "thumb";
  fit?: "contain" | "cover";
  alt?: string;
  frameConfig?: CharacterFrameConfig;
};

function PendingCardArt({
  profile,
  type,
}: {
  profile?: PersonalityProfile;
  type: DestinyType;
}) {
  // Profile palettes are descriptive Chinese names, not CSS color values.
  // Use the resolved element theme for the geometric placeholder so invalid
  // SVG fills never collapse into an opaque black silhouette.
  const theme = getCardElementTheme(type.elementFamily);
  const primary = theme.primary;
  const secondary = theme.panel;
  const accent = theme.deep;

  return (
    <div
      aria-label={`${type.socialName} 人物图暂未生成`}
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit] border border-[#eadfca] bg-[#fbfaf5]"
      style={{
        background:
          `radial-gradient(circle at 50% 44%, ${secondary ?? "#efe8d6"} 0, transparent 40%), ` +
          "radial-gradient(circle at 50% 48%, rgba(123, 105, 77, 0.11) 0 31%, transparent 31.5%), " +
          `linear-gradient(145deg, #fbf8ef 0%, ${secondary ?? "#efe8d6"} 100%)`,
      }}
    >
      <div className="absolute inset-[5%] rounded-[0.8rem] border border-[#9b8d73]/45" />
      <div className="absolute inset-[7%] rounded-[0.65rem] border border-[#9b8d73]/25" />
      <div className="absolute left-[10%] top-[13%] h-[28%] w-[80%] rounded-full border border-[#a08d6f]/20" />
      <div className="absolute left-[18%] top-[20%] h-[14%] w-[64%] rounded-full border border-[#a08d6f]/15" />

      <svg
        aria-hidden="true"
        className="relative z-10 h-[72%] w-[70%]"
        viewBox="0 0 240 360"
      >
        <path
          d="M120 42c-25 0-42 18-42 47 0 31 18 49 42 49s42-18 42-49c0-29-17-47-42-47Z"
          fill={secondary ?? "#e8dfcf"}
          stroke={primary ?? "#6e746a"}
          strokeWidth="3"
        />
        <path
          d="M76 81c5-31 21-50 44-50 23 0 40 19 44 50-14-11-26-17-44-17-17 0-30 6-44 17Z"
          fill={primary ?? "#6e746a"}
          opacity=".88"
        />
        <path d="M96 88h16M128 88h16" stroke="#4d514b" strokeWidth="4" strokeLinecap="round" />
        <path d="M113 112h14" stroke="#6a5d4e" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M84 142 50 188l18 94 52 28 52-28 18-94-34-46-36 17Z"
          fill={primary ?? "#6e746a"}
          opacity=".9"
          stroke="#4d514b"
          strokeWidth="3"
        />
        <path d="m84 142 36 17 36-17-8 77-28 30-28-30Z" fill={secondary ?? "#e8dfcf"} opacity=".52" />
        <path d="m50 188 34-23 17 43-33 36Z" fill="#879080" opacity=".85" />
        <path d="m190 188-34-23-17 43 33 36Z" fill="#596158" opacity=".85" />
        <path d="M120 159v125M92 250h56" stroke={accent ?? "#9b7954"} strokeWidth="3" opacity=".7" />
        <path d="M187 205c25-4 35-17 31-39" fill="none" stroke={accent ?? "#9b7954"} strokeWidth="4" />
        <circle cx="218" cy="158" r="18" fill="none" stroke={accent ?? "#9b7954"} strokeWidth="4" opacity=".75" />
        <path d="M92 305 72 340M148 305l20 35" stroke="#4d514b" strokeWidth="8" strokeLinecap="round" />
      </svg>

      <span className="absolute right-[9%] top-[9%] rounded-sm border border-[#9b8d73]/55 bg-[#f6f0e4]/90 px-2 py-1 text-[9px] font-bold tracking-[0.08em] text-[#756b5b]">
        人物图暂未生成
      </span>
    </div>
  );
}

export function CardImage({
  type,
  profile = getPersonalityProfileById(type.id),
  priority = false,
  variant = "full",
  fit = "contain",
  alt,
  frameConfig,
}: CardImageProps) {
  const source = resolveCardImageSource({ type, profile, variant });

  if (source.kind === "missing" || !source.path) {
    return <PendingCardArt profile={profile} type={type} />;
  }

  const characterTransform =
    source.kind === "character" && frameConfig
      ? `translate3d(${frameConfig.offsetX}%, ${frameConfig.offsetY}%, 0) scale(${frameConfig.scale})`
      : undefined;

  return (
    <Image
      alt={alt ?? `${type.socialName} 十神灵相角色图`}
      className={fit === "cover" ? "object-cover" : "object-contain"}
      data-character-scale={
        source.kind === "character" ? frameConfig?.scale : undefined
      }
      fill
      priority={priority}
      sizes={
        variant === "thumb"
          ? "(min-width: 1280px) 22vw, (min-width: 640px) 44vw, 92vw"
          : "(min-width: 640px) 28rem, 92vw"
      }
      src={source.path}
      style={
        characterTransform
          ? {
              objectPosition: "center",
              transform: characterTransform,
              transformOrigin: "50% 50%",
            }
          : undefined
      }
    />
  );
}
