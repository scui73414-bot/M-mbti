import {
  getStructureDisplayName,
  type DestinyType,
} from "@/data/types";
import type { BaziProfile } from "@/lib/bazi/types";

type CardBasisProfile = Pick<
  BaziProfile,
  "dayMaster" | "elements" | "tenGodPatterns"
> & {
  debug?: {
    engine: string;
  };
};

export function formatSpiritSubLabel(type: DestinyType) {
  const archetype = type.spiritArchetype.endsWith("灵相")
    ? type.spiritArchetype
    : `${type.spiritArchetype}灵相`;

  return `${type.dominantTenGod} · ${archetype}`;
}

function replaceBasisToken(
  template: string,
  token: string,
  value: string,
) {
  return template.replaceAll(`{{${token}}}`, value);
}

export function formatCalculatedCardBasis(
  type: DestinyType,
  profile?: CardBasisProfile,
) {
  if (profile?.debug?.engine !== "lunar-typescript") {
    return "完成真实排盘后生成";
  }

  const eligiblePattern =
    profile.tenGodPatterns.primary &&
    profile.tenGodPatterns.primary.kind === "pattern" &&
    profile.tenGodPatterns.primary.confidence !== "low"
      ? profile.tenGodPatterns.primary
      : undefined;
  const dominantTenGod =
    profile.tenGodPatterns.weights[0]?.tenGod ??
    profile.tenGodPatterns.dominantTenGod;
  const structure = eligiblePattern
    ? `${eligiblePattern.name}倾向`
    : `${dominantTenGod}显影`;

  return [
    ["dayMaster", profile.dayMaster],
    ["dominantTenGod", dominantTenGod],
    ["structure", structure],
    ["elementBias", profile.elements.bias],
  ].reduce(
    (result, [token, value]) =>
      replaceBasisToken(result, token, value),
    type.basisTemplate,
  );
}

export function formatCatalogCardBasis(type: DestinyType) {
  return `匹配结构 · ${getStructureDisplayName(
    type.structureKey,
    type.dominantTenGod,
  )} · ${type.dominantTenGod}`;
}
