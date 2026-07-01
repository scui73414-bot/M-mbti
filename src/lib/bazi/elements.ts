import {
  branchHiddenStems,
  branchMainElement,
  stemElement,
} from "@/lib/bazi/constants";
import type {
  BaziPillars,
  Element,
  ElementBias,
} from "@/lib/bazi/types";

export function createEmptyElementCounts(): Record<Element, number> {
  return {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  };
}

export function getElementCounts(pillars: BaziPillars): Record<Element, number> {
  const counts = createEmptyElementCounts();

  Object.values(pillars).forEach((pillar) => {
    counts[stemElement[pillar.stem]] += 1;
    counts[branchMainElement[pillar.branch]] += 1;

    branchHiddenStems[pillar.branch].forEach((hiddenStem) => {
      counts[stemElement[hiddenStem]] += 0.5;
    });
  });

  return counts;
}

export function getElementBias(counts: Record<Element, number>): ElementBias {
  const sorted = Object.entries(counts).sort((left, right) => right[1] - left[1]);
  const [topElement, topValue] = sorted[0] as [Element, number];
  const [, secondValue] = sorted[1] as [Element, number];

  if (topValue - secondValue >= 1.5) {
    return `${topElement}旺` as ElementBias;
  }

  return "平衡";
}
