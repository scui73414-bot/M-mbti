import type { BirthInput } from "@/lib/bazi/types";
import { findLocation } from "@/lib/bazi/locations";

export type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
};

export type SolarTimeResult = {
  dateTime: DateTimeParts;
  longitude?: number;
  latitude?: number;
  offsetMinutes: number;
  notes: string[];
};

function toDate(parts: DateTimeParts) {
  return new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second ?? 0,
    ),
  );
}

function fromDate(date: Date): DateTimeParts {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  };
}

export function formatDateTime(parts: DateTimeParts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(
    parts.day,
  ).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(
    parts.minute,
  ).padStart(2, "0")}:${String(parts.second ?? 0).padStart(2, "0")}`;
}

export function applyTrueSolarTime(
  input: BirthInput,
  solarDateTime: DateTimeParts,
): SolarTimeResult {
  const notes: string[] = [];

  if (!input.useTrueSolarTime) {
    notes.push("未启用真太阳时，按北京时间排盘。");
    return {
      dateTime: solarDateTime,
      longitude: input.longitude,
      latitude: input.latitude,
      offsetMinutes: 0,
      notes,
    };
  }

  const matchedLocation = input.longitude ? undefined : findLocation(input.birthplace);
  const longitude = input.longitude ?? matchedLocation?.longitude;
  const latitude = input.latitude ?? matchedLocation?.latitude;

  if (matchedLocation) {
    notes.push(`出生地匹配到：${matchedLocation.name}。`);
  }

  if (longitude === undefined) {
    notes.push("未匹配到出生地经度，暂按北京时间排盘。");
    return {
      dateTime: solarDateTime,
      offsetMinutes: 0,
      notes,
    };
  }

  const offsetMinutes = Math.round((longitude - 120) * 4);
  const corrected = new Date(toDate(solarDateTime).getTime() + offsetMinutes * 60_000);
  notes.push(
    `采用经度校正的近似真太阳时：经度 ${longitude.toFixed(
      2,
    )}°，校正 ${offsetMinutes} 分钟。`,
  );

  return {
    dateTime: fromDate(corrected),
    longitude,
    latitude,
    offsetMinutes,
    notes,
  };
}
