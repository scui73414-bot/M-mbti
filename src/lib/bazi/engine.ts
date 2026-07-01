import type { Lunar } from "lunar-typescript";
import { birthInputToSolarParts, lunarFromSolarParts } from "@/lib/bazi/calendar";
import { getElementBias, getElementCounts } from "@/lib/bazi/elements";
import { getPillars } from "@/lib/bazi/pillars";
import {
  applyTrueSolarTime,
  formatDateTime,
  type DateTimeParts,
} from "@/lib/bazi/solarTime";
import { inferEnergyMode } from "@/lib/bazi/strength";
import {
  getMainTenGodGroup,
  getTenGod,
  groupTenGod,
} from "@/lib/bazi/tenGods";
import type {
  BaziProfile,
  BirthInput,
  DayMaster,
  EarthlyBranch,
  HeavenlyStem,
} from "@/lib/bazi/types";
import { hashString } from "@/lib/matching/hash";
import { matchDestinyType, type MatchTypeOptions } from "@/lib/matching/matchType";

const fallbackPillars = [
  { year: "辛巳", month: "辛卯", day: "丁酉", hour: "庚戌" },
  { year: "甲申", month: "乙亥", day: "庚辰", hour: "壬午" },
  { year: "丙子", month: "己丑", day: "乙未", hour: "辛巳" },
  { year: "戊寅", month: "癸酉", day: "壬午", hour: "甲辰" },
  { year: "庚午", month: "丁亥", day: "己卯", hour: "癸酉" },
];

const dayMasterMap: Record<HeavenlyStem, DayMaster> = {
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

function parsePillar(text: string) {
  return {
    stem: text.slice(0, 1) as HeavenlyStem,
    branch: text.slice(1, 2) as EarthlyBranch,
    text,
  };
}

function createFingerprint(input: BirthInput, dateTime?: DateTimeParts) {
  return [
    input.calendarType,
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.birthplace.trim(),
    input.useTrueSolarTime ? "true-solar" : "standard-time",
    input.longitude ?? "",
    input.latitude ?? "",
    dateTime ? formatDateTime(dateTime) : "",
  ].join("|");
}

function normalizeTenGod(value: string) {
  return value.replace("劫才", "劫财");
}

function buildProfileFromLunar(
  input: BirthInput,
  lunar: Lunar,
  solarDateTime: DateTimeParts,
  trueSolarDateTime: DateTimeParts | undefined,
  notes: string[],
  options: MatchTypeOptions,
): BaziProfile {
  const eightChar = lunar.getEightChar();
  const pillars = getPillars(eightChar);
  const dayStem = pillars.day.stem;
  const dayMaster = dayMasterMap[dayStem];
  const yearStemTenGod = getTenGod(dayStem, pillars.year.stem);
  const monthStemTenGod = getTenGod(dayStem, pillars.month.stem);
  const hourStemTenGod = getTenGod(dayStem, pillars.hour.stem);
  const libraryTenGods = [
    normalizeTenGod(eightChar.getYearShiShenGan()),
    normalizeTenGod(eightChar.getMonthShiShenGan()),
    normalizeTenGod(eightChar.getTimeShiShenGan()),
  ];

  if (
    libraryTenGods.join("|") !==
    [yearStemTenGod, monthStemTenGod, hourStemTenGod].join("|")
  ) {
    notes.push(
      `十神采用项目内五行生克计算；库返回天干十神为 ${libraryTenGods.join(" / ")}。`,
    );
  }

  const mainGroup = getMainTenGodGroup([
    yearStemTenGod,
    monthStemTenGod,
    hourStemTenGod,
  ]);
  const elementCounts = getElementCounts(pillars);
  const elementBias = getElementBias(elementCounts);
  const energyMode = inferEnergyMode({
    dayMaster,
    tenGodGroup: mainGroup,
    elementBias,
    pillars,
  });
  const fingerprint = options.fingerprint ?? createFingerprint(input, trueSolarDateTime);
  const matched = matchDestinyType(
    {
      dayMaster,
      tenGods: { mainGroup },
      elements: { bias: elementBias },
      energyMode,
    },
    {
      ...options,
      fingerprint,
    },
  );

  return {
    input,
    solarDateTime: formatDateTime(solarDateTime),
    trueSolarDateTime: trueSolarDateTime
      ? formatDateTime(trueSolarDateTime)
      : undefined,
    pillars,
    dayMaster,
    dayStem,
    tenGods: {
      yearStem: yearStemTenGod,
      monthStem: monthStemTenGod,
      hourStem: hourStemTenGod,
      mainGroup,
    },
    elements: {
      counts: elementCounts,
      bias: elementBias,
    },
    energyMode,
    matchedTypeId: matched.matchedType.id,
    debug: {
      engine: "lunar-typescript",
      notes,
      fingerprint,
      score: matched.score,
      ranking: matched.ranking.slice(0, 10).map((item) => ({
        id: item.type.id,
        nameCn: item.type.nameCn,
        code: item.type.code,
        score: item.score,
        rarity: item.type.rarity,
      })),
    },
  };
}

function buildFallbackProfile(input: BirthInput, error: unknown): BaziProfile {
  const fingerprint = createFingerprint(input);
  const pillarTexts = fallbackPillars[hashString(fingerprint) % fallbackPillars.length];
  const pillars = {
    year: parsePillar(pillarTexts.year),
    month: parsePillar(pillarTexts.month),
    day: parsePillar(pillarTexts.day),
    hour: parsePillar(pillarTexts.hour),
  };
  const dayStem = pillars.day.stem;
  const dayMaster = dayMasterMap[dayStem];
  const yearStem = getTenGod(dayStem, pillars.year.stem);
  const monthStem = getTenGod(dayStem, pillars.month.stem);
  const hourStem = getTenGod(dayStem, pillars.hour.stem);
  const mainGroup = getMainTenGodGroup([yearStem, monthStem, hourStem]);
  const counts = getElementCounts(pillars);
  const bias = getElementBias(counts);
  const energyMode = inferEnergyMode({
    dayMaster,
    tenGodGroup: mainGroup,
    elementBias: bias,
    pillars,
  });
  const matched = matchDestinyType(
    {
      dayMaster,
      tenGods: { mainGroup },
      elements: { bias },
      energyMode,
    },
    { fingerprint },
  );

  return {
    input,
    solarDateTime: `${input.year}-${input.month}-${input.day} ${input.hour}:${input.minute}:00`,
    pillars,
    dayMaster,
    dayStem,
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
    matchedTypeId: matched.matchedType.id,
    debug: {
      engine: "deterministic-fallback",
      notes: [
        `真实排盘失败，已使用演示 fallback。原因：${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
      fingerprint,
      score: matched.score,
      ranking: matched.ranking.slice(0, 10).map((item) => ({
        id: item.type.id,
        nameCn: item.type.nameCn,
        code: item.type.code,
        score: item.score,
        rarity: item.type.rarity,
      })),
    },
  };
}

export async function generateBaziProfile(
  input: BirthInput,
  options: MatchTypeOptions = {},
): Promise<BaziProfile> {
  try {
    const notes: string[] = [];
    const solarParts = birthInputToSolarParts(input);
    if (input.calendarType === "lunar") {
      notes.push("已将农历生日转换为阳历后排盘。");
    }

    const solarTime = applyTrueSolarTime(input, solarParts);
    const effectiveSolarParts = solarTime.dateTime;
    notes.push(...solarTime.notes);

    const lunar = lunarFromSolarParts(effectiveSolarParts);

    return buildProfileFromLunar(
      input,
      lunar,
      solarParts,
      input.useTrueSolarTime ? effectiveSolarParts : undefined,
      notes,
      {
        ...options,
        fingerprint: options.fingerprint ?? createFingerprint(input, effectiveSolarParts),
      },
    );
  } catch (error) {
    return buildFallbackProfile(input, error);
  }
}
