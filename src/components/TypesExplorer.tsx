"use client";

import { useMemo, useState } from "react";
import { TypeCard } from "@/components/TypeCard";
import {
  destinyTypes,
  visualFamilyLabels,
  type DestinyType,
  type TypeTone,
  type VisualFamily,
} from "@/data/types";

const familyOptions: Array<VisualFamily | "all"> = [
  "all",
  "treasure",
  "spark",
  "quality",
  "elegant",
  "frostfire",
];

const toneOptions: Array<TypeTone | "all"> = [
  "all",
  "自嘲",
  "冷幽默",
  "职场",
  "社交",
  "内耗",
  "野心",
  "审美",
];

function matchesSearch(type: DestinyType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    type.nameCn,
    type.nameEn,
    type.oneLiner,
    type.subtitle,
    type.code,
    type.typeCode,
    ...type.keywords,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function TypesExplorer() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<VisualFamily | "all">("all");
  const [tone, setTone] = useState<TypeTone | "all">("all");

  const familyCounts = useMemo(() => {
    return destinyTypes.reduce(
      (counts, type) => ({
        ...counts,
        [type.visualFamily]: (counts[type.visualFamily] ?? 0) + 1,
      }),
      {} as Record<VisualFamily, number>,
    );
  }, []);

  const filteredTypes = useMemo(() => {
    return destinyTypes.filter((type) => {
      const familyMatched = family === "all" || type.visualFamily === family;
      const toneMatched = tone === "all" || type.tone === tone;
      return familyMatched && toneMatched && matchesSearch(type, query);
    });
  }, [family, query, tone]);

  return (
    <>
      <section className="mx-auto mt-7 max-w-md rounded-3xl border border-[#e7efe4] bg-white p-5 shadow-sm shadow-[#38463b]/5 sm:max-w-4xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
          <label className="block">
            <span className="text-xs font-black tracking-[0.16em] text-[#6f7c73]">
              搜索标签
            </span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-[#dce4d9] bg-[#fbfdfb] px-4 text-sm outline-none transition focus:border-[#8ca58b] focus:ring-4 focus:ring-[#8ca58b]/15"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="中文名 / 英文名 / 关键词 / 吐槽"
              value={query}
            />
          </label>

          <label className="block">
            <span className="text-xs font-black tracking-[0.16em] text-[#6f7c73]">
              视觉家族
            </span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-[#dce4d9] bg-[#fbfdfb] px-4 text-sm font-semibold outline-none"
              onChange={(event) =>
                setFamily(event.target.value as VisualFamily | "all")
              }
              value={family}
            >
              {familyOptions.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "全部家族" : visualFamilyLabels[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black tracking-[0.16em] text-[#6f7c73]">
              语气
            </span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-[#dce4d9] bg-[#fbfdfb] px-4 text-sm font-semibold outline-none"
              onChange={(event) => setTone(event.target.value as TypeTone | "all")}
              value={tone}
            >
              {toneOptions.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "全部语气" : item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[#627067]">
          <span className="rounded-full bg-[#eef4eb] px-3 py-1">
            全部标签 {destinyTypes.length}
          </span>
          {familyOptions
            .filter((item): item is VisualFamily => item !== "all")
            .map((item) => (
              <span className="rounded-full bg-[#f6f8f1] px-3 py-1" key={item}>
                {visualFamilyLabels[item]} {familyCounts[item] ?? 0}
              </span>
            ))}
          <span className="rounded-full bg-white px-3 py-1 text-[#7b887f]">
            当前显示 {filteredTypes.length}
          </span>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTypes.map((type) => (
          <TypeCard key={type.id} type={type} />
        ))}
      </section>
    </>
  );
}
