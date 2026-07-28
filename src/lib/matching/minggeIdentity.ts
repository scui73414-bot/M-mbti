import { minggeNames, type MinggeSocialCopy } from "@/data/minggeNames";
import type { DestinyType } from "@/data/types";
import type { BaziProfile } from "@/lib/bazi/types";
import type { PatternEvidence } from "@/lib/bazi/patterns";
import type { ShenShaHit } from "@/lib/bazi/shenSha";

type IdentityProfile = Pick<
  BaziProfile,
  "shenSha" | "tenGodPatterns" | "dayMaster" | "elements"
> & {
  debug?: {
    engine: string;
  };
};

export type MinggeIdentityMode = "calculated" | "simulation" | "preview";

export type MinggeIdentity = {
  formalName: string;
  socialName: string;
  social: MinggeSocialCopy;
  calculated: boolean;
  mode: MinggeIdentityMode;
  primaryShenSha?: ShenShaHit;
  primaryPattern?: PatternEvidence;
  supportingShenSha: ShenShaHit[];
  evidence: string[];
};

const cautionAllowedAsIdentity = new Set([
  "yang-ren",
  "jie-sha",
  "wang-shen",
  "kong-wang",
  "kui-gang",
]);

const shortShenShaNames: Record<string, string> = {
  天乙贵人: "天乙",
  太极贵人: "太极",
  文昌贵人: "文昌",
  国印贵人: "国印",
  天官贵人: "天官",
  天福贵人: "天福",
  天厨贵人: "天厨",
  天德贵人: "天德",
  月德贵人: "月德",
  德秀贵人: "德秀",
  三奇贵人: "三奇",
  "孤鸾日（核心表）": "孤鸾",
};

const elementBiasPhrases: Record<BaziProfile["elements"]["bias"], string> = {
  木旺: "木势舒枝",
  火旺: "火势明燃",
  土旺: "土势承山",
  金旺: "金势凝锋",
  水旺: "水势流锋",
  平衡: "五行调衡",
};

function getSocialCopy(type: DestinyType): MinggeSocialCopy {
  const copy = minggeNames[type.id];

  if (copy) {
    return {
      ...copy,
      socialName: type.socialName,
    };
  }

  return {
    socialName: type.socialName,
    shareHook: type.oneLiner,
    firstImpression: type.cautions[0] ?? type.oneLiner,
    familiarImpression: type.strengths[0] ?? type.oneLiner,
    openingTip: type.oneLiner,
  };
}

function isIdentitySafeShenSha(item: ShenShaHit) {
  return (
    item.polarity !== "caution" || cautionAllowedAsIdentity.has(item.id)
  );
}

function getEligibleShenSha(profile: IdentityProfile) {
  return profile.shenSha.hits.filter(isIdentitySafeShenSha);
}

function getSignificantShenSha(profile: IdentityProfile) {
  return profile.shenSha.prominent.find(
    (item) =>
      isIdentitySafeShenSha(item) &&
      item.prominence >= 75 &&
      (item.positions.includes("day") ||
        item.positions.includes("month") ||
        item.positions.length > 1),
  );
}

function shortShenShaName(name: string) {
  return shortShenShaNames[name] ?? name;
}

function getEligiblePattern(profile: IdentityProfile) {
  const primaryPattern = profile.tenGodPatterns.primary;

  if (
    primaryPattern?.kind === "pattern" &&
    (primaryPattern.confidence === "medium" ||
      primaryPattern.confidence === "high")
  ) {
    return primaryPattern;
  }

  return undefined;
}

function getClearlyDominantTenGod(profile: IdentityProfile) {
  const [leader, runnerUp] = profile.tenGodPatterns.weights;

  if (
    leader &&
    leader.share >= 0.18 &&
    leader.share - (runnerUp?.share ?? 0) >= 0.03
  ) {
    return leader;
  }

  return undefined;
}

function formatElementCounts(profile: IdentityProfile) {
  return Object.entries(profile.elements.counts)
    .map(([element, count]) => `${element}${count}`)
    .join("、");
}

export function resolveMinggeIdentity(
  type: DestinyType,
  profile?: IdentityProfile,
): MinggeIdentity {
  const social = getSocialCopy(type);

  if (!profile?.shenSha || !profile.tenGodPatterns) {
    return {
      formalName: "完成排盘生成命格主名",
      socialName: social.socialName,
      social,
      calculated: false,
      mode: "preview",
      supportingShenSha: [],
      evidence: ["当前为标签直达预览；完成出生信息排盘后生成神煞与十神结构名。"],
    };
  }

  const engine = profile.debug?.engine;
  if (engine !== "lunar-typescript") {
    const isSimulation = engine === "deterministic-fallback";

    return {
      formalName: isSimulation ? "演示 · 非实算" : "完成排盘生成命格主名",
      socialName: social.socialName,
      social,
      calculated: false,
      mode: isSimulation ? "simulation" : "preview",
      supportingShenSha: [],
      evidence: [
        isSimulation
          ? "当前结果来自演示推演，不使用推演神煞或十神结构为用户命名。"
          : "当前没有可核验的真实排盘来源，请完成出生信息排盘后生成命格主名。",
      ],
    };
  }

  const eligiblePattern = getEligiblePattern(profile);
  const significantShenSha = getSignificantShenSha(profile);
  const primaryShenSha = eligiblePattern ? significantShenSha : undefined;
  const dominantTenGod = getClearlyDominantTenGod(profile);
  const formalName = primaryShenSha
    ? `${shortShenShaName(primaryShenSha.name)} · ${eligiblePattern!.name}`
    : eligiblePattern
      ? eligiblePattern.name
      : dominantTenGod
        ? `${profile.dayMaster} · ${dominantTenGod.tenGod}显影`
        : `${profile.dayMaster} · ${elementBiasPhrases[profile.elements.bias]}`;
  const supportingShenSha = getEligibleShenSha(profile)
    .filter((item) => item.id !== primaryShenSha?.id)
    .slice(0, 4);
  const lowConfidencePattern =
    profile.tenGodPatterns.primary?.confidence === "low"
      ? profile.tenGodPatterns.primary
      : undefined;
  const evidence = [
    ...(primaryShenSha
      ? [
          `${primaryShenSha.name}：${primaryShenSha.basis}，突出度 ${primaryShenSha.prominence}。`,
        ]
      : []),
    ...(eligiblePattern
      ? [
          `${eligiblePattern.name}：${eligiblePattern.evidence.join(" ")}可信度为${eligiblePattern.confidence}。`,
        ]
      : dominantTenGod
        ? [
            `${dominantTenGod.tenGod}占十神权重 ${Math.round(
              dominantTenGod.share * 100,
            )}%，领先第二项 ${Math.round(
              (dominantTenGod.share -
                (profile.tenGodPatterns.weights[1]?.share ?? 0)) *
                100,
            )} 个百分点，作为主导十神。`,
          ]
        : [
            `十神首项未同时达到占比 18% 且领先第二项 3 个百分点，改用五行计数倾向；当前为${profile.elements.bias}（${formatElementCounts(
              profile,
            )}）。`,
          ]),
    ...(significantShenSha && !primaryShenSha
      ? [
          `${significantShenSha.name}虽达到产品突出度门槛，但没有中高置信十神结构与之共同命名，因此仅作为辅助证据。`,
        ]
      : []),
    ...(lowConfidencePattern
      ? [
          `${lowConfidencePattern.name}仅为低置信结构候选，不用于命格主名。`,
        ]
      : []),
  ];

  return {
    formalName,
    socialName: social.socialName,
    social,
    calculated: true,
    mode: "calculated",
    primaryShenSha,
    primaryPattern: eligiblePattern,
    supportingShenSha,
    evidence,
  };
}
