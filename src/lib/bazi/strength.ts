import type {
  BaziPillars,
  DayMaster,
  ElementBias,
  EnergyMode,
  TenGodGroup,
} from "@/lib/bazi/types";

export function inferEnergyMode(profile: {
  dayMaster: DayMaster;
  tenGodGroup: TenGodGroup;
  elementBias: ElementBias;
  pillars: BaziPillars;
}): EnergyMode {
  if (profile.tenGodGroup === "食伤") {
    return profile.elementBias === "水旺" ? "慢热" : "外放";
  }

  if (profile.tenGodGroup === "官杀") {
    return profile.elementBias === "金旺" ? "内收" : "高压";
  }

  if (profile.tenGodGroup === "印星") {
    return profile.elementBias === "木旺" || profile.elementBias === "水旺"
      ? "慢热"
      : "内收";
  }

  if (profile.tenGodGroup === "财星") {
    return profile.elementBias === "土旺" || profile.elementBias === "金旺"
      ? "低耗"
      : "外放";
  }

  if (profile.elementBias === "火旺") {
    return "外放";
  }

  if (profile.elementBias === "土旺") {
    return "高压";
  }

  return "低耗";
}
