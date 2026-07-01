import {
  destinyTypes,
  type DestinyType,
  type VisualFamily,
} from "@/data/types";

export type TypeValidationResult = {
  total: number;
  familyCounts: Record<VisualFamily, number>;
  duplicateIds: string[];
  duplicateCodes: string[];
  duplicateNames: string[];
  duplicateOneLiners: string[];
  repeatedTypeCodes: Array<{ typeCode: string; count: number }>;
  missingMatchProfile: string[];
  missingCardImage: string[];
  warnings: string[];
};

function duplicates(items: string[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([item]) => item);
}

function countByFamily(types: DestinyType[]) {
  return types.reduce(
    (counts, type) => ({
      ...counts,
      [type.visualFamily]: (counts[type.visualFamily] ?? 0) + 1,
    }),
    {
      treasure: 0,
      spark: 0,
      quality: 0,
      elegant: 0,
      frostfire: 0,
    } as Record<VisualFamily, number>,
  );
}

export function validateDestinyTypes(
  types: DestinyType[] = destinyTypes,
): TypeValidationResult {
  const typeCodeCounts = new Map<string, number>();
  types.forEach((type) => {
    typeCodeCounts.set(type.typeCode, (typeCodeCounts.get(type.typeCode) ?? 0) + 1);
  });

  const familyCounts = countByFamily(types);
  const warnings: string[] = [];

  Object.entries(familyCounts).forEach(([family, count]) => {
    if (count < 14) {
      warnings.push(`${family} 标签数量偏少：${count}`);
    }
  });

  return {
    total: types.length,
    familyCounts,
    duplicateIds: duplicates(types.map((type) => type.id)),
    duplicateCodes: duplicates(types.map((type) => type.code)),
    duplicateNames: duplicates(types.map((type) => type.nameCn)),
    duplicateOneLiners: duplicates(types.map((type) => type.oneLiner)),
    repeatedTypeCodes: Array.from(typeCodeCounts.entries())
      .filter(([, count]) => count > 3)
      .map(([typeCode, count]) => ({ typeCode, count })),
    missingMatchProfile: types
      .filter(
        (type) =>
          !type.matchProfile ||
          type.matchProfile.dayMasters.length === 0 ||
          type.matchProfile.tenGodGroups.length === 0 ||
          type.matchProfile.elementBiases.length === 0 ||
          type.matchProfile.energyModes.length === 0,
      )
      .map((type) => type.id),
    missingCardImage: types
      .filter((type) => !type.cardImage)
      .map((type) => type.id),
    warnings,
  };
}
