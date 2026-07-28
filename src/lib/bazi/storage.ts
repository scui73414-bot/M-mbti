import { getElementBias, getElementCounts } from "@/lib/bazi/elements";
import { analyzeTenGodPatterns } from "@/lib/bazi/patterns";
import { calculateShenSha } from "@/lib/bazi/shenSha";
import { inferEnergyMode } from "@/lib/bazi/strength";
import { getMainTenGodGroup, getTenGod } from "@/lib/bazi/tenGods";
import { matchDestinyType } from "@/lib/matching/matchType";
import type {
  BaziPillars,
  BaziProfile,
  DayMaster,
  EarthlyBranch,
  HeavenlyStem,
} from "@/lib/bazi/types";

export const baziStorageKeys = {
  fingerprintMap: "mingge:v3:fingerprintResultMap",
  recentResults: "mingge:v3:recentResultIds",
  lastProfile: "mingge:v3:lastBaziProfile",
} as const;

const deprecatedBaziStorageKeys = [
  {
    fingerprintMap: "mingge:v2:fingerprintResultMap",
    recentResults: "mingge:v2:recentResultIds",
    lastProfile: "mingge:v2:lastBaziProfile",
  },
  {
    fingerprintMap: "mingge:fingerprintResultMap",
    recentResults: "mingge:recentResultIds",
    lastProfile: "mingge:lastBaziProfile",
  },
] as const;

type StoredProfileDebug = {
  engine: string;
};

export type StoredBaziProfile = Pick<
  BaziProfile,
  | "pillars"
  | "dayMaster"
  | "dayStem"
  | "tenGods"
  | "elements"
  | "energyMode"
  | "shenSha"
  | "tenGodPatterns"
  | "matchedTypeId"
> & {
  debug?: StoredProfileDebug;
};

const heavenlyStems = new Set<HeavenlyStem>([
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
]);

const earthlyBranches = new Set<EarthlyBranch>([
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
]);

const dayMasterByStem: Record<HeavenlyStem, DayMaster> = {
  甲: "甲木",
  乙: "乙木",
  丙: "丙火",
  丁: "丁火",
  戊: "戊土",
  己: "己土",
  庚: "庚金",
  辛: "辛金",
  壬: "壬水",
  癸: "癸水",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isHeavenlyStem(value: unknown): value is HeavenlyStem {
  return typeof value === "string" && heavenlyStems.has(value as HeavenlyStem);
}

function isEarthlyBranch(value: unknown): value is EarthlyBranch {
  return (
    typeof value === "string" &&
    earthlyBranches.has(value as EarthlyBranch)
  );
}

function normalizePillars(value: unknown): BaziPillars | undefined {
  if (!isRecord(value)) return undefined;

  const result = {} as BaziPillars;
  const positions: Array<keyof BaziPillars> = [
    "year",
    "month",
    "day",
    "hour",
  ];

  for (const position of positions) {
    const rawPillar = value[position];
    if (
      !isRecord(rawPillar) ||
      !isHeavenlyStem(rawPillar.stem) ||
      !isEarthlyBranch(rawPillar.branch)
    ) {
      return undefined;
    }

    result[position] = {
      stem: rawPillar.stem,
      branch: rawPillar.branch,
      text: `${rawPillar.stem}${rawPillar.branch}`,
    };
  }

  return result;
}

/**
 * Read paths always reconstruct the derived fields from the stored pillars.
 * This both migrates legacy profiles and prevents stale/extra JSON fields from
 * leaking into the result-page profile.
 */
function normalizeStoredProfile(
  value: unknown,
  rematch = false,
): StoredBaziProfile | undefined {
  if (!isRecord(value) || typeof value.matchedTypeId !== "string") {
    return undefined;
  }

  const pillars = normalizePillars(value.pillars);
  if (!pillars) return undefined;

  const savedDayStem = isHeavenlyStem(value.dayStem)
    ? value.dayStem
    : pillars.day.stem;
  if (savedDayStem !== pillars.day.stem) return undefined;

  const yearStem = getTenGod(savedDayStem, pillars.year.stem);
  const monthStem = getTenGod(savedDayStem, pillars.month.stem);
  const hourStem = getTenGod(savedDayStem, pillars.hour.stem);
  const mainGroup = getMainTenGodGroup([yearStem, monthStem, hourStem]);
  const counts = getElementCounts(pillars);
  const bias = getElementBias(counts);
  const dayMaster = dayMasterByStem[savedDayStem];
  const energyMode = inferEnergyMode({
    dayMaster,
    tenGodGroup: mainGroup,
    elementBias: bias,
    pillars,
  });
  const rawDebug = isRecord(value.debug) ? value.debug : undefined;
  const engine =
    rawDebug && typeof rawDebug.engine === "string"
      ? rawDebug.engine
      : undefined;

  const shenSha = calculateShenSha(pillars);
  const tenGodPatterns = analyzeTenGodPatterns(pillars, savedDayStem);
  const matchedTypeId = rematch
    ? matchDestinyType({
        dayMaster,
        tenGods: { mainGroup },
        elements: { bias },
        energyMode,
        shenSha,
        tenGodPatterns,
      }).matchedType.id
    : value.matchedTypeId;

  return {
    pillars,
    dayMaster,
    dayStem: savedDayStem,
    tenGods: {
      yearStem,
      monthStem,
      hourStem,
      mainGroup,
    },
    elements: {
      counts,
      bias,
    },
    energyMode,
    shenSha,
    tenGodPatterns,
    matchedTypeId,
    debug: engine ? { engine } : undefined,
  };
}

export function readStorageJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readStoredBaziProfile(typeId?: string) {
  const current = readStorageJson<unknown>(
    baziStorageKeys.lastProfile,
    undefined,
  );
  const currentProfile = normalizeStoredProfile(current);
  const migratedProfiles = deprecatedBaziStorageKeys
    .map((keys) =>
      normalizeStoredProfile(
        readStorageJson<unknown>(keys.lastProfile, undefined),
        true,
      ),
    )
    .filter((profile): profile is StoredBaziProfile => Boolean(profile));

  // Rewrite any pre-fix v2 payload through the strict whitelist, and remove
  // legacy keys that may still contain birth time, place or debug notes.
  try {
    if (currentProfile) {
      window.localStorage.setItem(
        baziStorageKeys.lastProfile,
        JSON.stringify(currentProfile),
      );
    }
    deprecatedBaziStorageKeys.forEach((keys) =>
      Object.values(keys).forEach((key) =>
        window.localStorage.removeItem(key),
      ),
    );
  } catch {
    // Storage can be unavailable in private browsing; the in-memory result
    // remains usable even when cleanup cannot be persisted.
  }

  // A v2 profile for another result must not mask a matching legacy profile.
  for (const profile of [currentProfile, ...migratedProfiles]) {
    if (profile && (!typeId || profile.matchedTypeId === typeId)) {
      if (profile !== currentProfile) {
        try {
          window.localStorage.setItem(
            baziStorageKeys.lastProfile,
            JSON.stringify(profile),
          );
        } catch {
          // Keep returning the sanitized in-memory migration.
        }
      }
      return profile;
    }
  }

  return undefined;
}

export function createStoredBaziProfile(profile: BaziProfile): StoredBaziProfile {
  return {
    pillars: profile.pillars,
    dayMaster: profile.dayMaster,
    dayStem: profile.dayStem,
    tenGods: profile.tenGods,
    elements: profile.elements,
    energyMode: profile.energyMode,
    shenSha: profile.shenSha,
    tenGodPatterns: profile.tenGodPatterns,
    matchedTypeId: profile.matchedTypeId,
    debug: profile.debug?.engine
      ? {
          engine: profile.debug.engine,
        }
      : undefined,
  };
}
