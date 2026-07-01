import type { EightChar } from "lunar-typescript";
import type {
  BaziPillars,
  EarthlyBranch,
  HeavenlyStem,
  Pillar,
} from "@/lib/bazi/types";

function toPillar(value: string): Pillar {
  return {
    stem: value.slice(0, 1) as HeavenlyStem,
    branch: value.slice(1, 2) as EarthlyBranch,
    text: value,
  };
}

export function getPillars(eightChar: EightChar): BaziPillars {
  return {
    year: toPillar(eightChar.getYear()),
    month: toPillar(eightChar.getMonth()),
    day: toPillar(eightChar.getDay()),
    hour: toPillar(eightChar.getTime()),
  };
}
