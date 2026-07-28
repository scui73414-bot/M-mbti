import {
  destinyTypes,
  elementFamilyOptions,
  structureDisplayNames,
  tenGodOptions,
  type DestinyType,
  type ElementFamily,
  type TenGod,
  type TenGodGroup,
} from "@/data/types";
import { SHEN_SHA_CATALOG } from "@/lib/bazi/shenSha";

export type TypeValidationResult = {
  total: number;
  elementFamilyCounts: Record<ElementFamily, number>;
  dominantTenGodCounts: Record<TenGod, number>;
  emptyElementFamilies: ElementFamily[];
  emptyDominantTenGods: TenGod[];
  duplicateIds: string[];
  duplicateCodes: string[];
  duplicateSocialNames: string[];
  invalidElementFamilies: string[];
  invalidDominantTenGod: string[];
  tenGodGroupMismatches: string[];
  invalidStructureKeys: string[];
  invalidRequiredShenSha: Array<{
    id: string;
    shenShaIds: string[];
  }>;
  missingDayMasters: string[];
  missingMatchProfile: string[];
  missingCharacterImage: string[];
  missingSocialName: string[];
  missingCautions: string[];
  warnings: string[];
};

const tenGodGroupByTenGod: Record<TenGod, TenGodGroup> = {
  比肩: "比劫",
  劫财: "比劫",
  食神: "食伤",
  伤官: "食伤",
  正财: "财星",
  偏财: "财星",
  正官: "官杀",
  七杀: "官杀",
  正印: "印星",
  偏印: "印星",
};

const validElementFamilies = new Set<string>(elementFamilyOptions);
const validTenGods = new Set<string>(tenGodOptions);
const validPatternStructureKeys = new Set(Object.keys(structureDisplayNames));
const validShenShaIds = new Set(SHEN_SHA_CATALOG.map((item) => item.id));

function duplicates(items: string[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([item]) => item);
}

function countElementFamilies(types: DestinyType[]) {
  const counts: Record<ElementFamily, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  types.forEach((type) => {
    if (validElementFamilies.has(type.elementFamily)) {
      counts[type.elementFamily] += 1;
    }
  });

  return counts;
}

function countDominantTenGods(types: DestinyType[]) {
  const counts = Object.fromEntries(
    tenGodOptions.map((tenGod) => [tenGod, 0]),
  ) as Record<TenGod, number>;

  types.forEach((type) => {
    if (validTenGods.has(type.dominantTenGod)) {
      counts[type.dominantTenGod] += 1;
    }
  });

  return counts;
}

function hasValidStructureKey(type: DestinyType) {
  if (validPatternStructureKeys.has(type.structureKey)) {
    return true;
  }

  if (!type.structureKey.startsWith("ten-god:")) {
    return false;
  }

  const tenGod = type.structureKey.slice("ten-god:".length);
  return validTenGods.has(tenGod) && tenGod === type.dominantTenGod;
}

function hasCompleteMatchProfile(type: DestinyType) {
  return (
    Boolean(type.matchProfile) &&
    type.matchProfile.dayMasters.length > 0 &&
    type.matchProfile.tenGodGroups.length > 0 &&
    type.matchProfile.elementBiases.length > 0 &&
    type.matchProfile.energyModes.length > 0
  );
}

export function validateDestinyTypes(
  types: DestinyType[] = destinyTypes,
): TypeValidationResult {
  const elementFamilyCounts = countElementFamilies(types);
  const dominantTenGodCounts = countDominantTenGods(types);
  const emptyElementFamilies = elementFamilyOptions.filter(
    (element) => elementFamilyCounts[element] === 0,
  );
  const emptyDominantTenGods = tenGodOptions.filter(
    (tenGod) => dominantTenGodCounts[tenGod] === 0,
  );
  const warnings: string[] = [];

  emptyElementFamilies.forEach((element) => {
    warnings.push(`${element} 五行家族没有人格标签。`);
  });

  emptyDominantTenGods.forEach((tenGod) => {
    warnings.push(`${tenGod} 没有对应的主导十神标签。`);
  });

  if (types.length !== 84) {
    warnings.push(`人格标签数量应为 84，当前为 ${types.length}。`);
  }

  return {
    total: types.length,
    elementFamilyCounts,
    dominantTenGodCounts,
    emptyElementFamilies,
    emptyDominantTenGods,
    duplicateIds: duplicates(types.map((type) => type.id)),
    duplicateCodes: duplicates(types.map((type) => type.code)),
    duplicateSocialNames: duplicates(
      types.map((type) => type.socialName.trim()).filter(Boolean),
    ),
    invalidElementFamilies: types
      .filter((type) => !validElementFamilies.has(type.elementFamily))
      .map((type) => type.id),
    invalidDominantTenGod: types
      .filter((type) => !validTenGods.has(type.dominantTenGod))
      .map((type) => type.id),
    tenGodGroupMismatches: types
      .filter(
        (type) =>
          validTenGods.has(type.dominantTenGod) &&
          tenGodGroupByTenGod[type.dominantTenGod] !== type.tenGodGroup,
      )
      .map((type) => type.id),
    invalidStructureKeys: types
      .filter((type) => !hasValidStructureKey(type))
      .map((type) => type.id),
    invalidRequiredShenSha: types
      .map((type) => ({
        id: type.id,
        shenShaIds: (type.requiredShenSha ?? []).filter(
          (shenShaId) => !validShenShaIds.has(shenShaId),
        ),
      }))
      .filter((item) => item.shenShaIds.length > 0),
    missingDayMasters: types
      .filter((type) => type.dayMasters.length === 0)
      .map((type) => type.id),
    missingMatchProfile: types
      .filter((type) => !hasCompleteMatchProfile(type))
      .map((type) => type.id),
    missingCharacterImage: types
      .filter((type) => !type.characterImage.trim())
      .map((type) => type.id),
    missingSocialName: types
      .filter((type) => !type.socialName.trim())
      .map((type) => type.id),
    missingCautions: types
      .filter((type) => type.cautions.length === 0)
      .map((type) => type.id),
    warnings,
  };
}

export function assertValidDestinyTypes(
  types: DestinyType[] = destinyTypes,
) {
  const result = validateDestinyTypes(types);
  const failures = [
    ...result.duplicateIds,
    ...result.duplicateCodes,
    ...result.duplicateSocialNames,
    ...result.invalidElementFamilies,
    ...result.invalidDominantTenGod,
    ...result.emptyElementFamilies,
    ...result.emptyDominantTenGods,
    ...result.tenGodGroupMismatches,
    ...result.invalidStructureKeys,
    ...result.invalidRequiredShenSha.map((item) => item.id),
    ...result.missingDayMasters,
    ...result.missingMatchProfile,
    ...result.missingCharacterImage,
    ...result.missingSocialName,
    ...result.missingCautions,
  ];

  if (result.total !== 84 || failures.length > 0) {
    throw new Error(
      `DestinyType 数据校验失败：${JSON.stringify({
        total: result.total,
        failures,
      })}`,
    );
  }

  return result;
}
