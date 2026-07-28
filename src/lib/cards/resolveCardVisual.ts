import type { PersonalityProfile } from "@/data/personalityProfiles";
import {
  elementThemes,
  type DestinyType,
  type ElementFamily,
} from "@/data/types";

const LEGACY_BAKED_CARD_DIRECTORY = "/characters/destiny-card/cards/";

const WIDE_CARD_FILENAMES = new Set([
  "accept-card.png",
  "amplify-card.png",
  "ascetic-card.png",
  "battery-card.png",
  "boot-card.png",
  "bubble-card.png",
  "buffer-card.png",
  "check-card.png",
  "closer-card.png",
  "color-card.png",
  "data-card.png",
  "detail-card.png",
  "discipline-card.png",
  "energy-card.png",
  "engine-card.png",
  "freezer-card.png",
  "frostfire-card.png",
  "high-spec-card.png",
  "idea-card.png",
  "light-card.png",
  "load-card.png",
  "logic-card.png",
  "low-spec-card.png",
  "lowpower-card.png",
  "persona-card.png",
  "plan-card.png",
  "ppt-card.png",
  "premium-card.png",
  "presence-card.png",
  "purity-card.png",
  "quality-card.png",
  "realist-card.png",
  "result-card.png",
  "risk-card.png",
  "rough-card.png",
  "scan-card.png",
  "sprinter-card.png",
  "standard-card.png",
  "ux-card.png",
  "win-card.png",
]);

const MEDIUM_CARD_FILENAMES = new Set([
  "deduct-card.png",
  "dignity-card.png",
  "elegant-card.png",
  "exec-card.png",
  "face-card.png",
  "overtime-card.png",
  "polish-card.png",
  "risk-radar-card.png",
  "silent-card.png",
  "suit-card.png",
]);

const TALL_CARD_FILENAMES = new Set([
  "fine-card.png",
  "heat-card.png",
  "innergrind-card.png",
  "lowtemp-card.png",
]);

export const DEFAULT_LEGACY_BAKED_CROP_TOP = 0.245;

export type CardElementTheme = {
  element: ElementFamily;
  name: string;
  icon: string;
  motif: string;
  primary: string;
  deep: string;
  background: string;
  panel: string;
  glow: string;
  line: string;
  motifInk: string;
  note: string;
  softText: string;
};

const elementCardThemeDetails: Record<
  ElementFamily,
  Pick<
    CardElementTheme,
    "deep" | "panel" | "glow" | "line" | "motifInk" | "note" | "softText"
  >
> = {
  wood: {
    deep: "#304237",
    panel: "#fafbf5",
    glow: "rgba(126, 154, 112, 0.09)",
    line: "rgba(82, 107, 76, 0.34)",
    motifInk: "rgba(83, 112, 78, 0.075)",
    note: "rgba(232, 238, 226, 0.62)",
    softText: "#667268",
  },
  fire: {
    deep: "#5b352f",
    panel: "#fdf8f3",
    glow: "rgba(181, 103, 78, 0.085)",
    line: "rgba(145, 78, 64, 0.33)",
    motifInk: "rgba(150, 76, 61, 0.07)",
    note: "rgba(242, 226, 218, 0.56)",
    softText: "#796660",
  },
  earth: {
    deep: "#4c3d2f",
    panel: "#fcfaf4",
    glow: "rgba(167, 132, 84, 0.085)",
    line: "rgba(127, 99, 67, 0.34)",
    motifInk: "rgba(129, 101, 68, 0.07)",
    note: "rgba(238, 229, 210, 0.58)",
    softText: "#756a5e",
  },
  metal: {
    deep: "#3d423f",
    panel: "#fafaf6",
    glow: "rgba(151, 151, 139, 0.085)",
    line: "rgba(100, 103, 96, 0.33)",
    motifInk: "rgba(96, 101, 96, 0.07)",
    note: "rgba(231, 231, 223, 0.6)",
    softText: "#6c716d",
  },
  water: {
    deep: "#30454f",
    panel: "#f7fafb",
    glow: "rgba(101, 139, 155, 0.085)",
    line: "rgba(70, 101, 115, 0.33)",
    motifInk: "rgba(68, 103, 119, 0.07)",
    note: "rgba(221, 232, 236, 0.58)",
    softText: "#63727a",
  },
};

export function getCardElementTheme(
  element: ElementFamily,
): CardElementTheme {
  const base = elementThemes[element];
  const detail = elementCardThemeDetails[element];

  return {
    element,
    name: base.name,
    icon: base.icon,
    motif: base.motif,
    primary: base.primary,
    background: base.background,
    ...detail,
  };
}

export function isLegacyBakedCardPath(path: string | undefined) {
  return Boolean(path?.startsWith(LEGACY_BAKED_CARD_DIRECTORY));
}

export function getLegacyBakedCropTop(path: string | undefined) {
  const filename = path?.split("/").at(-1) ?? "";

  if (WIDE_CARD_FILENAMES.has(filename)) {
    return 0.215;
  }

  if (MEDIUM_CARD_FILENAMES.has(filename)) {
    return 0.26;
  }

  if (TALL_CARD_FILENAMES.has(filename)) {
    return 0.255;
  }

  return DEFAULT_LEGACY_BAKED_CROP_TOP;
}

export type ResolvedCardImageSource = {
  path?: string;
  kind: "character" | "legacy-baked" | "missing";
};

export function resolveCardImageSource({
  type,
  profile,
  variant,
}: {
  type: DestinyType;
  profile?: PersonalityProfile;
  variant: "full" | "thumb";
}): ResolvedCardImageSource {
  if (profile && profile.imageReview.status !== "image-ready") {
    return { kind: "missing" };
  }

  const explicitPath = type.characterImage.trim();

  if (explicitPath) {
    // The repository still carries old full-card/cartoon assets for migration
    // history, but the Eastern strange-tales direction must never display them
    // as finished artwork. They resolve to the explicit pending-art state.
    if (isLegacyBakedCardPath(explicitPath)) {
      return { kind: "missing" };
    }

    const path =
      variant === "thumb" &&
      explicitPath === profile?.imagePath &&
      profile.thumbnailPath
        ? profile.thumbnailPath
        : explicitPath;
    const matchesLegacyProfile =
      profile?.assetType === "full-card-with-baked-text" &&
      explicitPath === profile.imagePath;
    const isLegacyBaked =
      matchesLegacyProfile ||
      (!profile && isLegacyBakedCardPath(explicitPath));

    return {
      path,
      kind: isLegacyBaked ? "legacy-baked" : "character",
    };
  }

  const fallbackPath =
    variant === "thumb" ? profile?.thumbnailPath : profile?.imagePath;

  if (!fallbackPath) {
    return { kind: "missing" };
  }

  return {
    path: fallbackPath,
    kind:
      profile?.assetType === "full-card-with-baked-text"
        ? "legacy-baked"
        : "character",
  };
}
