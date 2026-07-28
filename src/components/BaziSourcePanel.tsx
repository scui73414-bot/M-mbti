"use client";

import type { DestinyType } from "@/data/types";
import { useStoredBaziProfile } from "@/hooks/useStoredBaziProfile";
import { formatCalculatedCardBasis } from "@/lib/cards/cardContent";

export function BaziSourcePanel({ type }: { type: DestinyType }) {
  const { profile } = useStoredBaziProfile(type.id);
  const primaryShenSha = profile?.shenSha?.prominent?.[0];
  const primaryPattern =
    profile?.tenGodPatterns?.primary?.kind === "pattern" &&
    profile.tenGodPatterns.primary.confidence !== "low"
      ? profile.tenGodPatterns.primary
      : undefined;
  const lowConfidencePattern =
    profile?.tenGodPatterns?.primary?.confidence === "low"
      ? profile.tenGodPatterns.primary
      : undefined;
  const dominantTenGod =
    profile?.tenGodPatterns?.weights[0]?.tenGod ??
    profile?.tenGodPatterns?.dominantTenGod;
  const isCalculated = profile?.debug?.engine === "lunar-typescript";
  const isSimulation = Boolean(profile) && !isCalculated;

  const sourceRows = profile && isCalculated
    ? [
        ["四柱", `${profile.pillars.year.text}年｜${profile.pillars.month.text}月｜${profile.pillars.day.text}日｜${profile.pillars.hour.text}时`],
        ["日主", profile.dayMaster],
        ["主导十神", dominantTenGod ?? profile.tenGods.mainGroup],
        ["五行倾向", profile.elements.bias],
        ["灵相", `${type.spiritArchetype}（角色原型）`],
        ["能量模式", profile.energyMode],
        ["突出神煞", primaryShenSha?.name ?? "未取到明显主项"],
        [
          "命理结构",
          primaryPattern?.name ??
            (lowConfidencePattern
              ? `${lowConfidencePattern.name}（低置信候选，不用于主名）`
              : "未形成中高置信结构"),
        ],
        ["排盘依据", formatCalculatedCardBasis(type, profile)],
      ]
    : isSimulation
      ? [
          ["排盘状态", "演示模式，不生成实算命格主名"],
          ["四柱", "未取得可用于命名的真实排盘"],
          ["主神煞", "不用于卡面命名"],
          ["十神结构", "不用于卡面命名"],
          ["灵相", `${type.spiritArchetype}（角色原型）`],
          ["排盘依据", "完成真实排盘后生成"],
        ]
    : [
        ["四柱", "暂无最近排盘记录"],
        ["日主", "完成测试后生成"],
        ["主导十神", "完成测试后生成"],
        ["五行倾向", "完成测试后生成"],
        ["灵相", `${type.spiritArchetype}（角色原型）`],
        ["命格主名", "只使用真实排盘结果"],
        ["排盘依据", "完成真实排盘后生成"],
      ];

  const methodText = profile
    ? isCalculated
      ? `排盘方式：四柱排盘 · 神煞规则 ${profile.shenSha.rulesetVersion}`
      : "排盘方式：演示回退（非命盘实算，不生成神煞或格局主名）"
    : "排盘方式：结果页直达 · 标签预览（未调用出生信息排盘）";

  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-5 sm:px-5">
      <div className="flex items-baseline gap-3 border-b border-[var(--line)] pb-3">
        <span
          aria-hidden="true"
          className="text-[10px] font-semibold tracking-[0.22em] text-[var(--muted)]"
        >
          02
        </span>
        <h3 className="text-sm font-bold tracking-[0.08em] text-[var(--ink)]">
          排盘明细
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)]">
        {sourceRows.map(([label, value]) => (
          <div
            className={[
              "bg-[var(--surface)] px-3 py-4 text-left",
              ["四柱", "排盘状态", "命格主名", "命理结构", "排盘依据"].includes(
                label,
              ) ||
              (isSimulation && label === "灵相")
                ? "col-span-2"
                : "",
            ].join(" ")}
            key={label}
          >
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)]">
              {label}
            </p>
            <p className="mt-1.5 text-sm font-bold leading-6 text-[var(--ink)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {profile && isCalculated && (
        <div className="mt-4 border-t border-[var(--line)] pt-4 text-xs leading-6 text-[var(--ink-soft)]">
          <p>
            五行计数：
            {Object.entries(profile.elements.counts)
              .map(([element, count]) => `${element}${count}`)
              .join(" / ")}
          </p>
        </div>
      )}

      <p className="mt-4 border-t border-[var(--line)] pt-4 text-xs leading-6 text-[var(--ink-soft)]">
        {methodText}。本结果使用四柱、十神结构、五行偏性与本版本支持的神煞规则进行娱乐化人格匹配；
        神煞用于补充人物意象，不单独作为吉凶断语。
      </p>
      <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">
        本地结果档案仅保留四柱与展示所需的结构化计算结果，不保存出生日期、时间、地点、真太阳时文本或排盘调试记录。
      </p>
    </section>
  );
}
