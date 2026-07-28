"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { generateBaziProfile, type BirthInput } from "@/lib/bazi";
import {
  baziStorageKeys,
  createStoredBaziProfile,
  readStorageJson,
} from "@/lib/bazi/storage";
import { hashString } from "@/lib/matching/hash";

const fieldClass =
  "mt-2 h-12 w-full min-w-0 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--muted)] hover:border-[var(--line-strong)] focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--line-strong)]";

const birthHours = [
  "00:00 子时",
  "01:00 丑时",
  "03:00 寅时",
  "05:00 卯时",
  "07:00 辰时",
  "09:00 巳时",
  "11:00 午时",
  "13:00 未时",
  "15:00 申时",
  "17:00 酉时",
  "19:00 戌时",
  "21:00 亥时",
  "23:00 子时",
];

function readNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function persistMatch(fingerprint: string, typeId: string) {
  const fingerprintMap = readStorageJson<Record<string, string>>(
    baziStorageKeys.fingerprintMap,
    {},
  );
  const recentIds = readStorageJson<string[]>(
    baziStorageKeys.recentResults,
    [],
  );
  fingerprintMap[fingerprint] = typeId;

  window.localStorage.setItem(
    baziStorageKeys.fingerprintMap,
    JSON.stringify(fingerprintMap),
  );
  window.localStorage.setItem(
    baziStorageKeys.recentResults,
    JSON.stringify([typeId, ...recentIds.filter((id) => id !== typeId)].slice(0, 10)),
  );
}

function createClientFingerprint(input: BirthInput) {
  const rawFingerprint = [
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
  ].join("|");

  return `birth:${hashString(rawFingerprint)}`;
}

function parseTime(value: FormDataEntryValue | null) {
  const [hour = "9", minute = "0"] = String(value ?? "09:00").split(":");
  const parsedHour = Number(hour);
  const parsedMinute = Number(minute);

  return {
    hour: Number.isFinite(parsedHour)
      ? Math.min(Math.max(parsedHour, 0), 23)
      : 9,
    minute: Number.isFinite(parsedMinute)
      ? Math.min(Math.max(parsedMinute, 0), 59)
      : 0,
  };
}

export function TestForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const parsedTime = parseTime(formData.get("hour"));
        const input: BirthInput = {
          calendarType:
            formData.get("calendarType") === "lunar" ? "lunar" : "solar",
          year: readNumber(formData.get("year"), 1998),
          month: readNumber(formData.get("month"), 8),
          day: readNumber(formData.get("day"), 18),
          hour: parsedTime.hour,
          minute: parsedTime.minute,
          birthplace: String(formData.get("birthplace") ?? ""),
          useTrueSolarTime: formData.get("useTrueSolarTime") === "on",
        };
        const fingerprint = createClientFingerprint(input);
        const fingerprintMap = readStorageJson<Record<string, string>>(
          baziStorageKeys.fingerprintMap,
          {},
        );
        const cachedTypeId = fingerprintMap[fingerprint];

        if (cachedTypeId) {
          const profile = await generateBaziProfile(input, { fingerprint });
          window.localStorage.setItem(
            baziStorageKeys.lastProfile,
            JSON.stringify(
              createStoredBaziProfile({
                ...profile,
                matchedTypeId: cachedTypeId,
              }),
            ),
          );
          persistMatch(fingerprint, cachedTypeId);
          router.push(`/result?type=${cachedTypeId}`);
          return;
        }

        const recentIds = readStorageJson<string[]>(
          baziStorageKeys.recentResults,
          [],
        );
        const profile = await generateBaziProfile(input, {
          avoidIds: recentIds.slice(0, 5),
          fingerprint,
        });
        window.localStorage.setItem(
          baziStorageKeys.lastProfile,
          JSON.stringify(createStoredBaziProfile(profile)),
        );
        persistMatch(fingerprint, profile.matchedTypeId);
        router.push(`/result?type=${profile.matchedTypeId}`);
      }}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--ink)]">
          出生日期类型
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[
            { label: "阳历", value: "solar" },
            { label: "农历", value: "lunar" },
          ].map((item) => (
            <label key={item.value} className="group cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="calendarType"
                value={item.value}
                defaultChecked={item.value === "solar"}
              />
              <span className="flex h-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] text-sm font-semibold text-[var(--ink-soft)] transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-[var(--line-strong)] peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--white)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ink)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--surface)]">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="min-w-0">
          <label className="text-sm font-semibold text-[var(--ink)]" htmlFor="year">
            年份
          </label>
          <input
            className={fieldClass}
            defaultValue="1998"
            id="year"
            inputMode="numeric"
            name="year"
            placeholder="1998"
          />
        </div>
        <div className="min-w-0">
          <label className="text-sm font-semibold text-[var(--ink)]" htmlFor="month">
            月份
          </label>
          <input
            className={fieldClass}
            defaultValue="08"
            id="month"
            inputMode="numeric"
            name="month"
            placeholder="08"
          />
        </div>
        <div className="min-w-0">
          <label className="text-sm font-semibold text-[var(--ink)]" htmlFor="day">
            日期
          </label>
          <input
            className={fieldClass}
            defaultValue="18"
            id="day"
            inputMode="numeric"
            name="day"
            placeholder="18"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-[var(--ink)]" htmlFor="hour">
          出生时间
        </label>
        <select className={fieldClass} defaultValue="09:00" id="hour" name="hour">
          {birthHours.map((hour) => (
            <option key={hour} value={hour.slice(0, 5)}>
              {hour}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="text-sm font-semibold text-[var(--ink)]"
          htmlFor="birthplace"
        >
          出生地
        </label>
        <input
          className={fieldClass}
          id="birthplace"
          name="birthplace"
          placeholder="例如：上海"
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-3">
        <span>
          <span className="block text-sm font-semibold text-[var(--ink)]">
            启用真太阳时
          </span>
          <span className="text-xs text-[var(--muted)]">默认开启，仅用于演示口径</span>
        </span>
        <input
          className="peer sr-only"
          name="useTrueSolarTime"
          type="checkbox"
          defaultChecked
        />
        <span className="relative h-7 w-12 shrink-0 rounded-full bg-[var(--line-strong)] transition-[background-color,box-shadow] duration-200 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-[var(--white)] after:transition-transform after:duration-200 peer-checked:bg-[var(--ink)] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ink)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--surface)]" />
      </label>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4">
        <h2 className="text-sm font-bold text-[var(--ink)]">为什么默认启用真太阳时？</h2>
        <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
          同一个北京时间，在不同出生地对应的太阳位置会略有差异。为了让结果更稳定，本测试默认使用出生地进行真太阳时校正。
        </p>
        <p className="mt-2 text-xs font-semibold leading-6 text-[var(--ink-soft)]">
          当前版本采用经度校正的近似真太阳时，结果仅供娱乐与自我观察。
        </p>
      </div>

      <Button className="w-full" type="submit">
        生成我的命格
      </Button>
    </form>
  );
}
