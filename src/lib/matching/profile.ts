import type {
  DayMaster,
  ElementBias,
  EnergyMode,
  TenGodGroup,
} from "@/data/types";
import type { BirthInput } from "@/lib/bazi/types";
import { hashString } from "@/lib/matching/hash";

export type GeneratedProfile = {
  dayMaster: DayMaster;
  tenGodGroup: TenGodGroup;
  elementBias: ElementBias;
  energyMode: EnergyMode;
};

export const dayMasters: DayMaster[] = [
  "甲木",
  "乙木",
  "丙火",
  "丁火",
  "戊土",
  "己土",
  "庚金",
  "辛金",
  "壬水",
  "癸水",
];

export const tenGodGroups: TenGodGroup[] = [
  "比劫",
  "食伤",
  "财星",
  "官杀",
  "印星",
];

export const elementBiases: ElementBias[] = [
  "木旺",
  "火旺",
  "土旺",
  "金旺",
  "水旺",
  "平衡",
];

export const energyModes: EnergyMode[] = [
  "外放",
  "内收",
  "慢热",
  "高压",
  "低耗",
];

function pick<T>(items: T[], seed: string) {
  return items[hashString(seed) % items.length];
}

export function createBirthFingerprint(input: BirthInput) {
  return [
    input.calendarType,
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.birthplace.trim(),
    input.useTrueSolarTime ? "true-solar" : "standard-time",
  ].join("|");
}

export function generateProfileFromFingerprint(
  fingerprint: string,
): GeneratedProfile {
  const dayMaster = pick(dayMasters, `${fingerprint}:dayMaster`);
  const tenGodGroup = pick(tenGodGroups, `${fingerprint}:tenGod`);
  const elementBias = pick(elementBiases, `${fingerprint}:element`);
  const energyMode = pick(energyModes, `${fingerprint}:energy`);

  return {
    dayMaster,
    tenGodGroup,
    elementBias,
    energyMode,
  };
}

export function generateProfileFromInput(input: BirthInput) {
  const fingerprint = createBirthFingerprint(input);

  return {
    fingerprint,
    profile: generateProfileFromFingerprint(fingerprint),
  };
}
