import { Lunar, Solar } from "lunar-typescript";
import type { BirthInput } from "@/lib/bazi/types";
import type { DateTimeParts } from "@/lib/bazi/solarTime";

export function solarFromParts(parts: DateTimeParts) {
  return Solar.fromYmdHms(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second ?? 0,
  );
}

export function lunarFromParts(parts: DateTimeParts) {
  return Lunar.fromYmdHms(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second ?? 0,
  );
}

export function birthInputToSolarParts(input: BirthInput): DateTimeParts {
  const inputParts = {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
    second: 0,
  };

  if (input.calendarType === "solar") {
    return inputParts;
  }

  const lunar = lunarFromParts(inputParts);
  const solar = lunar.getSolar();

  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
    hour: solar.getHour(),
    minute: solar.getMinute(),
    second: solar.getSecond(),
  };
}

export function lunarFromSolarParts(parts: DateTimeParts) {
  return solarFromParts(parts).getLunar();
}
