import type { TypeRarity } from "@/data/types";

export type CalendarType = "lunar" | "solar";

export type HeavenlyStem =
  | "甲"
  | "乙"
  | "丙"
  | "丁"
  | "戊"
  | "己"
  | "庚"
  | "辛"
  | "壬"
  | "癸";

export type EarthlyBranch =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

export type DayMaster =
  | "甲木"
  | "乙木"
  | "丙火"
  | "丁火"
  | "戊土"
  | "己土"
  | "庚金"
  | "辛金"
  | "壬水"
  | "癸水";

export type TenGod =
  | "比肩"
  | "劫财"
  | "食神"
  | "伤官"
  | "正财"
  | "偏财"
  | "正官"
  | "七杀"
  | "正印"
  | "偏印";

export type TenGodGroup = "比劫" | "食伤" | "财星" | "官杀" | "印星";

export type Element = "木" | "火" | "土" | "金" | "水";

export type ElementBias = "木旺" | "火旺" | "土旺" | "金旺" | "水旺" | "平衡";

export type EnergyMode = "外放" | "内收" | "慢热" | "高压" | "低耗";

export type BirthInput = {
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  birthplace: string;
  useTrueSolarTime: boolean;
  longitude?: number;
  latitude?: number;
};

export type Pillar = {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  text: string;
};

export type BaziPillars = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
};

export type BaziProfile = {
  input: BirthInput;
  solarDateTime: string;
  trueSolarDateTime?: string;
  pillars: BaziPillars;
  dayMaster: DayMaster;
  dayStem: HeavenlyStem;
  tenGods: {
    yearStem?: TenGod;
    monthStem?: TenGod;
    hourStem?: TenGod;
    mainGroup: TenGodGroup;
  };
  elements: {
    counts: Record<Element, number>;
    bias: ElementBias;
  };
  energyMode: EnergyMode;
  matchedTypeId: string;
  debug?: {
    engine: string;
    notes: string[];
    fingerprint?: string;
    score?: number;
    ranking?: Array<{
      id: string;
      nameCn: string;
      code: string;
      score: number;
      rarity?: TypeRarity;
    }>;
  };
};
