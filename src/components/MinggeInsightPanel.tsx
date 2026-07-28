"use client";

import { useMemo } from "react";
import { BaziSourcePanel } from "@/components/BaziSourcePanel";
import type { DestinyType } from "@/data/types";
import { useStoredBaziProfile } from "@/hooks/useStoredBaziProfile";
import { resolveMinggeIdentity } from "@/lib/matching/minggeIdentity";

const positionLabels: Record<string, string> = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const confidenceLabels: Record<string, string> = {
  low: "较低",
  medium: "中等",
  high: "较高",
};

function localizePositions(positions: readonly string[]) {
  return positions.map((position) => positionLabels[position] ?? position).join("、");
}

function localizeEvidence(evidence: string) {
  return evidence.replace(
    /\b(low|medium|high)\b/g,
    (confidence) => confidenceLabels[confidence] ?? confidence,
  );
}

export function MinggeInsightPanel({ type }: { type: DestinyType }) {
  const { profile } = useStoredBaziProfile(type.id);
  const identity = useMemo(
    () => resolveMinggeIdentity(type, profile),
    [profile, type],
  );
  const firstImpression =
    identity.social.firstImpression ??
    `初见时容易被注意到“${type.cautions[0] ?? "不太好读懂"}”的一面`;
  const familiarImpression =
    identity.social.familiarImpression ??
    `熟悉以后会发现你真正稳定的是“${type.strengths[0] ?? "自己的节奏"}”`;
  const openingTip = identity.social.openingTip ?? type.oneLiner;
  const primaryTraits = [
    ...(identity.primaryShenSha?.traits ?? []),
    ...(identity.primaryPattern?.traits ?? []),
  ].slice(0, 4);
  const calculationLabel =
    identity.mode === "calculated"
      ? "命盘实算"
      : identity.mode === "simulation"
        ? "演示推演"
        : "标签预览";
  const structureName =
    identity.mode === "calculated"
      ? identity.primaryPattern?.name ??
        (profile?.tenGodPatterns?.dominantTenGod
          ? `${profile.tenGodPatterns.dominantTenGod}主导`
          : "未形成中高置信结构")
      : "完成真实排盘后生成";

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="text-[10px] font-semibold tracking-[0.22em] text-[var(--muted)]"
            >
              01
            </span>
            <h2 className="text-xl font-extrabold text-[var(--ink)]">
              一眼看懂你
            </h2>
          </div>
          <span className="shrink-0 border-l border-[var(--line)] pl-3 text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)]">
            {calculationLabel}
          </span>
        </div>

        <p className="mt-5 text-base font-bold leading-7 text-[var(--ink)]">
          {type.oneLiner}
        </p>
        <p className="mt-2 text-[15px] leading-8 text-[var(--ink-soft)]">
          “{type.socialName}”是这张人格标签的社交表达。{firstImpression}；
          {familiarImpression}。
        </p>

        {primaryTraits.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {primaryTraits.map((trait) => (
              <span
                className="rounded-[0.3rem] border border-[var(--line)] px-2.5 py-1.5 text-xs font-semibold text-[var(--ink-soft)]"
                key={trait}
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </section>

      <BaziSourcePanel type={type} />

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="flex items-baseline gap-3 border-b border-[var(--line)] pb-3">
          <span
            aria-hidden="true"
            className="text-[10px] font-semibold tracking-[0.22em] text-[var(--muted)]"
          >
            03
          </span>
          <h2 className="text-base font-bold tracking-[0.04em] text-[var(--ink)]">
            你的高光与卡点
          </h2>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="py-4 sm:pr-5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--muted)]">
              高光时刻
            </p>
            <ul className="mt-3 space-y-2">
              {type.strengths.map((item) => (
                <li
                  className="flex gap-2 text-sm font-semibold leading-6 text-[var(--ink-soft)]"
                  key={item}
                >
                  <span aria-hidden="true" className="text-[var(--muted)]">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[var(--line)] py-4 sm:border-l sm:border-t-0 sm:pl-5">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--muted)]">
              容易卡住
            </p>
            <ul className="mt-3 space-y-2">
              {type.cautions.map((item) => (
                <li
                  className="flex gap-2 text-sm leading-6 text-[var(--ink-soft)]"
                  key={item}
                >
                  <span aria-hidden="true" className="text-[var(--muted)]">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="text-[10px] font-semibold tracking-[0.22em] text-[var(--muted)]"
          >
            04
          </span>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)]">
            正确打开方式
          </p>
        </div>
        <p className="mt-4 border-t border-[var(--line)] pt-4 text-base font-semibold leading-7 text-[var(--ink)]">
          {openingTip}
        </p>
      </section>

      <details className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left [&::-webkit-details-marker]:hidden">
          <span className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="text-[10px] font-semibold tracking-[0.22em] text-[var(--muted)]"
            >
              05
            </span>
            <span className="text-lg font-bold text-[var(--ink)]">
              这个标签从哪里来
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">
            展开查看
          </span>
        </summary>

        <div className="border-t border-[var(--line)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)]">
                实算命格主名
              </p>
              <h2 className="mt-2 text-lg font-bold text-[var(--ink)]">
                {identity.formalName}
              </h2>
            </div>
            <span className="shrink-0 border-l border-[var(--line)] pl-3 text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)]">
              {calculationLabel}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)]">
            <div className="bg-[var(--surface)] p-3">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)]">
                主神煞
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--ink)]">
                {identity.primaryShenSha?.name ?? "暂无明显主项"}
              </p>
              {identity.primaryShenSha && (
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {localizePositions(identity.primaryShenSha.positions)} · 突出度{" "}
                  {identity.primaryShenSha.prominence}
                </p>
              )}
            </div>
            <div className="bg-[var(--surface)] p-3">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)]">
                十神结构
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--ink)]">
                {structureName}
              </p>
              {identity.primaryPattern && (
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  可信度{" "}
                  {confidenceLabels[identity.primaryPattern.confidence] ??
                    identity.primaryPattern.confidence}
                </p>
              )}
            </div>
          </div>

          {identity.supportingShenSha.length > 0 && (
            <div className="mt-5 border-t border-[var(--line)] pt-4">
              <p className="text-[11px] font-semibold tracking-[0.1em] text-[var(--muted)]">
                辅助神煞
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {identity.supportingShenSha.map((item) => (
                  <span
                    className="rounded-[0.3rem] border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--ink-soft)]"
                    key={item.id}
                  >
                    {item.name} · {localizePositions(item.positions)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {identity.mode === "calculated" &&
            profile?.tenGodPatterns?.patterns &&
            profile.tenGodPatterns.patterns.length > 0 && (
              <div className="mt-5 border-t border-[var(--line)] pt-4">
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[var(--muted)]">
                  十神组合候选
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.tenGodPatterns.patterns.slice(0, 4).map((item) => (
                    <span
                      className="rounded-[0.3rem] border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--ink-soft)]"
                      key={item.id}
                    >
                      {item.name} ·{" "}
                      {confidenceLabels[item.confidence] ?? item.confidence}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <details className="mt-5 rounded-lg border border-[var(--line)] p-4 text-xs leading-6 text-[var(--ink-soft)]">
            <summary className="cursor-pointer font-bold text-[var(--ink)]">
              查看计算证据
            </summary>
            <ul className="mt-3 space-y-2">
              {identity.evidence.map((item) => (
                <li key={item}>· {localizeEvidence(item)}</li>
              ))}
            </ul>
          </details>

          {identity.mode === "calculated" &&
            profile?.shenSha?.hits &&
            profile.shenSha.hits.length > 0 && (
              <details className="mt-3 rounded-lg border border-[var(--line)] p-4 text-xs leading-6 text-[var(--ink-soft)]">
                <summary className="cursor-pointer font-bold text-[var(--ink)]">
                  查看全部命中神煞（{profile.shenSha.hits.length}）
                </summary>
                <div className="mt-3 grid gap-2">
                  {profile.shenSha.hits.map((item) => (
                    <div
                      className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
                      key={item.id}
                    >
                      <p className="font-bold text-[var(--ink)]">
                        {item.name} · 突出度 {item.prominence}
                      </p>
                      <p className="mt-1 text-[var(--muted)]">
                        命中位置：{localizePositions(item.positions)}
                      </p>
                      <p className="mt-1 text-[var(--muted)]">{item.basis}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
        </div>
      </details>
    </div>
  );
}
