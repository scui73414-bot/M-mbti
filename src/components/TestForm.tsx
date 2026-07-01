"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { generateBaziProfile, type BaziProfile, type BirthInput } from "@/lib/bazi";
import { hashString } from "@/lib/matching/hash";

const fieldClass =
  "mt-2 h-12 w-full rounded-2xl border border-[#dce4d9] bg-white px-4 text-sm text-[#26302a] outline-none transition focus:border-[#8ca58b] focus:ring-4 focus:ring-[#8ca58b]/15";

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

const fingerprintMapKey = "mingge:fingerprintResultMap";
const recentResultsKey = "mingge:recentResultIds";
const lastBaziProfileKey = "mingge:lastBaziProfile";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persistMatch(fingerprint: string, typeId: string) {
  const fingerprintMap = readJson<Record<string, string>>(fingerprintMapKey, {});
  const recentIds = readJson<string[]>(recentResultsKey, []);
  fingerprintMap[fingerprint] = typeId;

  window.localStorage.setItem(fingerprintMapKey, JSON.stringify(fingerprintMap));
  window.localStorage.setItem(
    recentResultsKey,
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

function createStoredProfile(profile: BaziProfile) {
  const { input: _input, ...shareableProfile } = profile;

  return shareableProfile;
}

export function TestForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-5 rounded-3xl border border-[#e7efe4] bg-white p-5 shadow-sm shadow-[#38463b]/5"
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
        const fingerprintMap = readJson<Record<string, string>>(fingerprintMapKey, {});
        const cachedTypeId = fingerprintMap[fingerprint];

        if (cachedTypeId) {
          const profile = await generateBaziProfile(input, { fingerprint });
          window.localStorage.setItem(
            lastBaziProfileKey,
            JSON.stringify(createStoredProfile({ ...profile, matchedTypeId: cachedTypeId })),
          );
          persistMatch(fingerprint, cachedTypeId);
          router.push(`/result?type=${cachedTypeId}`);
          return;
        }

        const recentIds = readJson<string[]>(recentResultsKey, []);
        const profile = await generateBaziProfile(input, {
          avoidIds: recentIds.slice(0, 5),
          fingerprint,
        });
        window.localStorage.setItem(
          lastBaziProfileKey,
          JSON.stringify(createStoredProfile(profile)),
        );
        persistMatch(fingerprint, profile.matchedTypeId);
        router.push(`/result?type=${profile.matchedTypeId}`);
      }}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-[#2b342e]">
          出生日期类型
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[
            { label: "阳历", value: "solar" },
            { label: "农历", value: "lunar" },
          ].map((item) => (
            <label key={item.value} className="group">
              <input
                className="peer sr-only"
                type="radio"
                name="calendarType"
                value={item.value}
                defaultChecked={item.value === "solar"}
              />
              <span className="flex h-12 items-center justify-center rounded-2xl border border-[#dce4d9] bg-[#f8faf6] text-sm font-semibold text-[#526057] transition peer-checked:border-[#8ca58b] peer-checked:bg-[#eef5eb] peer-checked:text-[#2f4a3c]">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-semibold text-[#2b342e]" htmlFor="year">
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
        <div>
          <label className="text-sm font-semibold text-[#2b342e]" htmlFor="month">
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
        <div>
          <label className="text-sm font-semibold text-[#2b342e]" htmlFor="day">
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
        <label className="text-sm font-semibold text-[#2b342e]" htmlFor="hour">
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
          className="text-sm font-semibold text-[#2b342e]"
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

      <label className="flex items-center justify-between rounded-2xl border border-[#e2ebdf] bg-[#f4f8f1] px-4 py-3">
        <span>
          <span className="block text-sm font-semibold text-[#2b342e]">
            启用真太阳时
          </span>
          <span className="text-xs text-[#657168]">默认开启，仅用于演示口径</span>
        </span>
        <input
          className="peer sr-only"
          name="useTrueSolarTime"
          type="checkbox"
          defaultChecked
        />
        <span className="relative h-7 w-12 rounded-full bg-[#cfd9cb] transition after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:bg-[#6f8b70] peer-checked:after:translate-x-5" />
      </label>

      <div className="rounded-2xl border border-[#e7efe4] bg-[#f8faf6] p-4">
        <h2 className="text-sm font-bold text-[#2b342e]">为什么默认启用真太阳时？</h2>
        <p className="mt-2 text-xs leading-6 text-[#68746c]">
          同一个北京时间，在不同出生地对应的太阳位置会略有差异。为了让结果更稳定，本测试默认使用出生地进行真太阳时校正。
        </p>
        <p className="mt-2 text-xs font-semibold leading-6 text-[#68746c]">
          当前版本采用经度校正的近似真太阳时，结果仅供娱乐与自我观察。
        </p>
      </div>

      <Button className="w-full" type="submit">
        生成我的命格
      </Button>
    </form>
  );
}
