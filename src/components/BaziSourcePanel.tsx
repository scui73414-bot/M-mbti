"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import type { DestinyType } from "@/data/types";
import type { BaziProfile } from "@/lib/bazi";

const lastBaziProfileKey = "mingge:lastBaziProfile";

type StoredBaziProfile = Omit<BaziProfile, "input">;

function readLastProfile(typeId: string) {
  try {
    const raw = window.localStorage.getItem(lastBaziProfileKey);
    if (!raw) {
      return undefined;
    }

    const profile = JSON.parse(raw) as StoredBaziProfile;
    return profile.matchedTypeId === typeId ? profile : undefined;
  } catch {
    return undefined;
  }
}

export function BaziSourcePanel({ type }: { type: DestinyType }) {
  const [profile, setProfile] = useState<StoredBaziProfile | undefined>();

  useEffect(() => {
    setProfile(readLastProfile(type.id));
  }, [type.id]);

  const sourceRows = profile
    ? [
        ["四柱", `${profile.pillars.year.text}年｜${profile.pillars.month.text}月｜${profile.pillars.day.text}日｜${profile.pillars.hour.text}时`],
        ["日主", profile.dayMaster],
        [
          "主导十神",
          `${profile.tenGods.mainGroup}${
            profile.tenGods.monthStem ? ` / ${profile.tenGods.monthStem}` : ""
          }`,
        ],
        ["五行偏性", profile.elements.bias],
        ["能量模式", profile.energyMode],
      ]
    : [
        ["四柱", "暂无最近排盘记录"],
        ["日主", type.baziMock.dayMaster],
        ["主导十神", type.baziMock.tenGod],
        ["五行偏性", type.baziMock.elementBias],
        ["能量模式", type.baziMock.energyMode],
      ];

  const methodText = profile
    ? profile.debug?.engine === "deterministic-fallback"
      ? "排盘方式：演示 fallback"
      : `排盘方式：真实排盘${
          profile.trueSolarDateTime ? " · 真太阳时校正" : ""
        }`
    : "排盘方式：结果页直达 · 使用标签 fallback 信息";

  return (
    <Section title="排盘来源">
      <div className="grid grid-cols-2 gap-2">
        {sourceRows.map(([label, value]) => (
          <div
            className="rounded-2xl bg-[#f4f8f1] px-3 py-4 text-center"
            key={label}
          >
            <p className="text-[11px] font-semibold text-[#738077]">{label}</p>
            <p className="mt-1 text-sm font-black leading-5 text-[#26302a]">
              {value}
            </p>
          </div>
        ))}
      </div>
      {profile && (
        <div className="mt-3 grid gap-2 rounded-2xl bg-[#f8faf6] p-3 text-xs leading-6 text-[#68746c]">
          <p>阳历时间：{profile.solarDateTime}</p>
          {profile.trueSolarDateTime && (
            <p>近似真太阳时：{profile.trueSolarDateTime}</p>
          )}
          <p>
            五行计数：
            {Object.entries(profile.elements.counts)
              .map(([element, count]) => `${element}${count}`)
              .join(" / ")}
          </p>
        </div>
      )}
      <p className="mt-4 rounded-2xl bg-[#f8faf6] p-3 text-xs leading-6 text-[#68746c]">
        {methodText}。本结果使用八字排盘中的日主、十神和五行偏性进行娱乐化标签匹配，不代表传统命理断语。
      </p>
      {profile?.debug?.notes && profile.debug.notes.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-2xl bg-white p-3 text-xs leading-5 text-[#79867e]">
          {profile.debug.notes.map((note) => (
            <li key={note}>· {note}</li>
          ))}
        </ul>
      )}
    </Section>
  );
}
