import {
  destinyTypes,
  type DayMaster,
  type DestinyType,
  type ElementBias,
  type EnergyMode,
  type TenGod,
  type TenGodGroup,
} from "@/data/types";
import type { TenGodPatternResult } from "@/lib/bazi/patterns";
import type { ShenShaResult } from "@/lib/bazi/shenSha";
import { hashString } from "@/lib/matching/hash";

export type MatchableProfile = {
  dayMaster: DayMaster;
  tenGods: {
    mainGroup: TenGodGroup;
  };
  elements: {
    bias: ElementBias;
  };
  energyMode: EnergyMode;
  shenSha?: ShenShaResult;
  tenGodPatterns?: TenGodPatternResult;
};

export type MatchTypeOptions = {
  fingerprint?: string;
  avoidIds?: string[];
};

export type MatchTypeRankingItem = {
  type: DestinyType;
  score: number;
};

export type MatchTypeResult = {
  matchedType: DestinyType;
  score: number;
  ranking: MatchTypeRankingItem[];
};

const REQUIRED_SHEN_SHA_MISS_PENALTY = 10_000;

function getMissingRequiredShenSha(
  type: DestinyType,
  profile: MatchableProfile,
) {
  const required = type.requiredShenSha ?? [];
  if (required.length === 0) {
    return [];
  }

  const hitIds = new Set(profile.shenSha?.hits.map((item) => item.id) ?? []);
  return required.filter((id) => !hitIds.has(id));
}

function scoreStructure(
  structureKey: string,
  dominantTenGod: TenGod | undefined,
  patterns: TenGodPatternResult | undefined,
) {
  if (!patterns) {
    return 0;
  }

  if (structureKey.startsWith("ten-god:")) {
    const requiredTenGod = structureKey.slice("ten-god:".length);
    return requiredTenGod === dominantTenGod ? 10 : 0;
  }

  if (patterns.primary?.id === structureKey) {
    return 14;
  }

  return patterns.patterns.some((pattern) => pattern.id === structureKey)
    ? 9
    : 0;
}

export function scoreDestinyType(type: DestinyType, profile: MatchableProfile) {
  const missingRequiredShenSha = getMissingRequiredShenSha(type, profile);
  if (missingRequiredShenSha.length > 0) {
    return (
      -REQUIRED_SHEN_SHA_MISS_PENALTY -
      missingRequiredShenSha.length * 100
    );
  }

  let score = 0;
  const dominantTenGod = profile.tenGodPatterns?.dominantTenGod;

  if (type.dayMasters.includes(profile.dayMaster)) {
    score += 10;
  }

  if (dominantTenGod && type.dominantTenGod === dominantTenGod) {
    score += 12;
  }

  if (type.tenGodGroup === profile.tenGods.mainGroup) {
    score += 7;
  }

  if (type.matchProfile.dayMasters.includes(profile.dayMaster)) {
    score += 4;
  }

  if (type.matchProfile.tenGodGroups.includes(profile.tenGods.mainGroup)) {
    score += 4;
  }

  if (type.matchProfile.elementBiases.includes(profile.elements.bias)) {
    score += 3;
  }

  if (type.matchProfile.energyModes.includes(profile.energyMode)) {
    score += 3;
  }

  score += scoreStructure(
    type.structureKey,
    dominantTenGod,
    profile.tenGodPatterns,
  );

  if ((type.requiredShenSha?.length ?? 0) > 0) {
    score += 8;
  }

  return score;
}

function pickStable(
  candidates: MatchTypeRankingItem[],
  seed: string,
): MatchTypeRankingItem {
  return candidates[hashString(seed) % candidates.length];
}

export function getTypeRanking(profile: MatchableProfile) {
  return destinyTypes
    .map((type) => ({
      type,
      score: scoreDestinyType(type, profile),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.type.code.localeCompare(right.type.code);
    });
}

export function matchDestinyType(
  profile: MatchableProfile,
  options: MatchTypeOptions = {},
): MatchTypeResult {
  const ranking = getTypeRanking(profile);
  const bestScore = ranking[0]?.score ?? 0;
  const bestCandidates = ranking.filter((item) => item.score === bestScore);
  const avoidIds = new Set(options.avoidIds ?? []);
  const nonRecentCandidates = bestCandidates.filter(
    (item) => !avoidIds.has(item.type.id),
  );
  const pool =
    nonRecentCandidates.length > 0 ? nonRecentCandidates : bestCandidates;
  const seed =
    options.fingerprint ??
    [
      profile.dayMaster,
      profile.tenGodPatterns?.dominantTenGod ?? "",
      profile.tenGods.mainGroup,
      profile.tenGodPatterns?.primary?.id ?? "",
      profile.elements.bias,
      profile.energyMode,
      profile.shenSha?.prominent.map((item) => item.id).join(",") ?? "",
    ].join("|");
  const matched =
    pool.length > 0
      ? pickStable(pool, `${seed}:matched-type`)
      : pickStable(ranking, `${seed}:fallback-type`);

  return {
    matchedType: matched.type,
    score: matched.score,
    ranking,
  };
}
