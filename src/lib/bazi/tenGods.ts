import {
  elementControls,
  elementGenerates,
  stemElement,
  stemPolarity,
} from "@/lib/bazi/constants";
import type { HeavenlyStem, TenGod, TenGodGroup } from "@/lib/bazi/types";

export function getTenGod(dayStem: HeavenlyStem, targetStem: HeavenlyStem): TenGod {
  const dayElement = stemElement[dayStem];
  const targetElement = stemElement[targetStem];
  const samePolarity = stemPolarity[dayStem] === stemPolarity[targetStem];

  if (dayElement === targetElement) {
    return samePolarity ? "比肩" : "劫财";
  }

  if (elementGenerates[dayElement] === targetElement) {
    return samePolarity ? "食神" : "伤官";
  }

  if (elementControls[dayElement] === targetElement) {
    return samePolarity ? "偏财" : "正财";
  }

  if (elementControls[targetElement] === dayElement) {
    return samePolarity ? "七杀" : "正官";
  }

  return samePolarity ? "偏印" : "正印";
}

export function groupTenGod(tenGod: TenGod): TenGodGroup {
  if (tenGod === "比肩" || tenGod === "劫财") {
    return "比劫";
  }

  if (tenGod === "食神" || tenGod === "伤官") {
    return "食伤";
  }

  if (tenGod === "正财" || tenGod === "偏财") {
    return "财星";
  }

  if (tenGod === "正官" || tenGod === "七杀") {
    return "官杀";
  }

  return "印星";
}

export function getMainTenGodGroup(tenGods: TenGod[]) {
  const counts = tenGods.reduce(
    (result, tenGod) => {
      const group = groupTenGod(tenGod);
      result[group] += 1;
      return result;
    },
    {
      比劫: 0,
      食伤: 0,
      财星: 0,
      官杀: 0,
      印星: 0,
    } satisfies Record<TenGodGroup, number>,
  );

  return (Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] ??
    "比劫") as TenGodGroup;
}
