import {
  destinyTypes,
  type DayMaster,
  type DestinyType,
  type ElementBias,
  type EnergyMode,
  type TenGodGroup,
} from "@/data/types";
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

export function scoreDestinyType(type: DestinyType, profile: MatchableProfile) {
  let score = 0;

  if (type.matchProfile.dayMasters.includes(profile.dayMaster)) {
    score += 5;
  }

  if (type.matchProfile.tenGodGroups.includes(profile.tenGods.mainGroup)) {
    score += 5;
  }

  if (type.matchProfile.elementBiases.includes(profile.elements.bias)) {
    score += 4;
  }

  if (type.matchProfile.energyModes.includes(profile.energyMode)) {
    score += 3;
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
    `${profile.dayMaster}|${profile.tenGods.mainGroup}|${profile.elements.bias}|${profile.energyMode}`;
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
