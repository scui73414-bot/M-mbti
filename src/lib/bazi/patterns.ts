import { branchHiddenStems } from "@/lib/bazi/constants";
import { getTenGod } from "@/lib/bazi/tenGods";
import type {
  BaziPillars,
  EarthlyBranch,
  HeavenlyStem,
  TenGod,
} from "@/lib/bazi/types";

const TEN_GODS: TenGod[] = [
  "比肩",
  "劫财",
  "食神",
  "伤官",
  "正财",
  "偏财",
  "正官",
  "七杀",
  "正印",
  "偏印",
];

const PILLAR_LABELS = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
} as const;

type PillarKey = keyof BaziPillars;

export type TenGodWeight = {
  tenGod: TenGod;
  weight: number;
  share: number;
  visibleWeight: number;
  hiddenWeight: number;
  visibleCount: number;
  hiddenCount: number;
  sources: Array<{
    pillar: PillarKey;
    layer: "visible-stem" | "hidden-stem";
    stem: HeavenlyStem;
    branch?: EarthlyBranch;
    weight: number;
  }>;
};

export type PatternEvidence = {
  id:
    | "sha-yin-mutual"
    | "guan-yin-mutual"
    | "shi-shen-controls-sha"
    | "shang-guan-with-yin"
    | "shi-shen-generates-wealth"
    | "shang-guan-generates-wealth"
    | "output-generates-wealth"
    | "wealth-generates-official"
    | "seal-peer-support"
    | "peer-carries-wealth"
    | "mixed-official-killing"
    | "hurting-official-meets-official"
    | "indirect-seal-overcomes-food"
    | "peer-competes-for-wealth";
  name: string;
  kind: "pattern" | "warning";
  confidence: "low" | "medium" | "high";
  score: number;
  evidence: string[];
  traits: string[];
  involvedTenGods: TenGod[];
};

export type TenGodPatternResult = {
  dominantTenGod: TenGod;
  weights: TenGodWeight[];
  primary: PatternEvidence | null;
  patterns: PatternEvidence[];
  warnings: PatternEvidence[];
  methodology: string;
};

type WeightAccumulator = Omit<
  TenGodWeight,
  "tenGod" | "weight" | "share" | "visibleWeight" | "hiddenWeight"
> & {
  visibleWeight: number;
  hiddenWeight: number;
};

type Component = {
  label: string;
  gods: TenGod[];
  minShare: number;
  strongShare: number;
};

type PatternDefinition = {
  id: PatternEvidence["id"];
  name: string;
  kind: PatternEvidence["kind"];
  components: Component[];
  traits: string[];
  scoreAdjustment?: number;
  guard?: (context: AnalysisContext) => boolean;
  relationEvidence?: (context: AnalysisContext) => string;
};

type AnalysisContext = {
  weights: Record<TenGod, TenGodWeight>;
  shareOf: (gods: TenGod[]) => number;
  weightOf: (gods: TenGod[]) => number;
  visibleWeightOf: (gods: TenGod[]) => number;
};

const VISIBLE_STEM_WEIGHTS: Record<PillarKey, number> = {
  year: 1,
  month: 1.35,
  day: 0,
  hour: 1.05,
};

const BRANCH_POSITION_WEIGHTS: Record<PillarKey, number> = {
  year: 0.85,
  month: 1.45,
  day: 1.15,
  hour: 1,
};

const HIDDEN_STEM_WEIGHTS = [1, 0.55, 0.3] as const;

const PATTERN_DEFINITIONS: PatternDefinition[] = [
  {
    id: "sha-yin-mutual",
    name: "杀印相生",
    kind: "pattern",
    components: [
      component("七杀", ["七杀"], 0.055, 0.14),
      component("印星", ["正印", "偏印"], 0.09, 0.22),
    ],
    traits: ["压力越明确，越容易进入状态", "擅长把约束转成方法", "关键时刻倾向稳住局面"],
    relationEvidence: () => "七杀与印星同时达到结构阈值，形成“压力—吸收—转化”的组合。",
  },
  {
    id: "guan-yin-mutual",
    name: "官印相生",
    kind: "pattern",
    components: [
      component("正官", ["正官"], 0.055, 0.14),
      component("印星", ["正印", "偏印"], 0.09, 0.22),
    ],
    traits: ["重视规则与可信度", "适合在清晰体系里积累优势", "做事讲依据，也顾及秩序"],
    relationEvidence: () => "正官与印星同时达到结构阈值，呈现“规则—学习—承接”的组合。",
  },
  {
    id: "shi-shen-controls-sha",
    name: "食神制杀",
    kind: "pattern",
    components: [
      component("食神", ["食神"], 0.055, 0.14),
      component("七杀", ["七杀"], 0.055, 0.14),
    ],
    traits: ["面对强压仍会寻找从容解法", "善于用技能降低冲突", "越难的事越想拆成可操作步骤"],
    relationEvidence: () => "食神与七杀同时达到结构阈值，呈现“以输出与技能消化压力”的关系。",
  },
  {
    id: "shang-guan-with-yin",
    name: "伤官佩印",
    kind: "pattern",
    components: [
      component("伤官", ["伤官"], 0.055, 0.14),
      component("印星", ["正印", "偏印"], 0.09, 0.22),
    ],
    traits: ["有表达锋芒，也愿意建立理论依据", "既会质疑，也会补足论证", "适合把新点子整理成体系"],
    relationEvidence: () => "伤官与印星同时达到结构阈值，呈现“表达突破由知识与方法承托”的组合。",
  },
  {
    id: "shi-shen-generates-wealth",
    name: "食神生财",
    kind: "pattern",
    components: [
      component("食神", ["食神"], 0.055, 0.14),
      component("财星", ["正财", "偏财"], 0.09, 0.22),
    ],
    traits: ["擅长把兴趣变成可交付成果", "重视体验，也关注实际回报", "更愿意用长期手艺换稳定价值"],
    relationEvidence: () => "食神与财星同时达到结构阈值，呈现“输出转化为现实价值”的组合。",
  },
  {
    id: "shang-guan-generates-wealth",
    name: "伤官生财",
    kind: "pattern",
    components: [
      component("伤官", ["伤官"], 0.055, 0.14),
      component("财星", ["正财", "偏财"], 0.09, 0.22),
    ],
    traits: ["敢于打破旧做法寻找机会", "表达与创意常带有结果意识", "对变化中的需求比较敏锐"],
    relationEvidence: () => "伤官与财星同时达到结构阈值，呈现“突破与表达导向机会转化”的组合。",
  },
  {
    id: "output-generates-wealth",
    name: "食伤生财",
    kind: "pattern",
    components: [
      component("食伤", ["食神", "伤官"], 0.13, 0.28),
      component("财星", ["正财", "偏财"], 0.11, 0.24),
    ],
    traits: ["输出欲与成果意识都较明显", "容易从内容、技能或创意中发现价值", "适合边做边验证反馈"],
    scoreAdjustment: -4,
    relationEvidence: () => "食伤整体与财星同时达到结构阈值，呈现较宽泛的“输出—转化”链条。",
  },
  {
    id: "wealth-generates-official",
    name: "财官相生",
    kind: "pattern",
    components: [
      component("财星", ["正财", "偏财"], 0.1, 0.23),
      component("官星", ["正官", "七杀"], 0.075, 0.19),
    ],
    traits: ["重视资源如何转成影响力", "有现实判断，也在意规则位置", "容易从责任和结果中确认价值"],
    relationEvidence: () => "财星与官杀同时达到结构阈值，呈现“资源—责任—位置”的组合。",
  },
  {
    id: "seal-peer-support",
    name: "印比相扶",
    kind: "pattern",
    components: [
      component("印星", ["正印", "偏印"], 0.12, 0.26),
      component("比劫", ["比肩", "劫财"], 0.12, 0.26),
    ],
    traits: ["依靠学习和同伴支持积累底气", "先建立安全感，再稳定发力", "擅长在熟悉体系中持续精进"],
    relationEvidence: () => "印星与比劫同时达到结构阈值，呈现“吸收支持—自我承接”的组合。",
  },
  {
    id: "peer-carries-wealth",
    name: "比劫担财",
    kind: "pattern",
    components: [
      component("比劫", ["比肩", "劫财"], 0.13, 0.27),
      component("财星", ["正财", "偏财"], 0.1, 0.22),
    ],
    traits: ["愿意亲自扛住资源与结果压力", "重行动，也重实际得失", "适合在边界清楚时协作攻坚"],
    guard: ({ shareOf }) => {
      const peer = shareOf(["比肩", "劫财"]);
      const wealth = shareOf(["正财", "偏财"]);
      const ratio = peer / Math.max(wealth, 0.001);
      return ratio >= 0.65 && ratio < 1.35;
    },
    relationEvidence: ({ shareOf }) =>
      `比劫与财星比例为 ${formatRatio(
        shareOf(["比肩", "劫财"]) / Math.max(shareOf(["正财", "偏财"]), 0.001),
      )}，处在本模型定义的相对均衡区间（0.65–1.35）。`,
  },
  {
    id: "mixed-official-killing",
    name: "官杀并见",
    kind: "warning",
    components: [
      component("正官", ["正官"], 0.045, 0.12),
      component("七杀", ["七杀"], 0.045, 0.12),
    ],
    traits: ["可能同时在意规范与效率", "面对多重标准时容易拉扯", "需要先确认当前最重要的评价尺度"],
    relationEvidence: () => "正官与七杀分别达到提示阈值，说明两种约束方式同时可见。",
  },
  {
    id: "hurting-official-meets-official",
    name: "伤官见官",
    kind: "warning",
    components: [
      component("伤官", ["伤官"], 0.05, 0.13),
      component("正官", ["正官"], 0.05, 0.13),
    ],
    traits: ["表达锋芒与规则要求可能互相顶住", "不认同规则时容易直接指出", "先区分必要边界与可优化流程会更顺"],
    relationEvidence: () => "伤官与正官分别达到提示阈值，提示表达突破与规范要求可能并存。",
  },
  {
    id: "indirect-seal-overcomes-food",
    name: "枭神夺食",
    kind: "warning",
    components: [
      component("偏印", ["偏印"], 0.055, 0.14),
      component("食神", ["食神"], 0.055, 0.14),
    ],
    traits: ["思考过深时可能压住自然表达", "容易在输出前反复校验", "给灵感保留低门槛试错空间会更轻松"],
    guard: ({ shareOf }) =>
      shareOf(["偏印"]) >= shareOf(["食神"]) * 0.8,
    relationEvidence: ({ shareOf }) =>
      `偏印/食神比例为 ${formatRatio(
        shareOf(["偏印"]) / Math.max(shareOf(["食神"]), 0.001),
      )}，达到本模型的提示条件（≥0.80）。`,
  },
  {
    id: "peer-competes-for-wealth",
    name: "比劫争财",
    kind: "warning",
    components: [
      component("比劫", ["比肩", "劫财"], 0.15, 0.29),
      component("财星", ["正财", "偏财"], 0.08, 0.2),
    ],
    traits: ["合作与资源边界容易成为敏感点", "行动快时可能低估分配成本", "提前约定权责和收益更能发挥战斗力"],
    guard: ({ shareOf }) => {
      const peer = shareOf(["比肩", "劫财"]);
      const wealth = shareOf(["正财", "偏财"]);
      return peer / Math.max(wealth, 0.001) >= 1.35;
    },
    relationEvidence: ({ shareOf }) =>
      `比劫/财星比例为 ${formatRatio(
        shareOf(["比肩", "劫财"]) / Math.max(shareOf(["正财", "偏财"]), 0.001),
      )}，达到本模型的失衡提示线（≥1.35）。`,
  },
];

/**
 * 依据可见天干和地支藏干，计算用于人格产品的十神结构倾向。
 *
 * 这不是传统子平法中的严格取格：未纳入旺衰、透干通根、合冲刑害、
 * 调候和大运流年等完整条件。因此结果应表述为“结构倾向”或“匹配素材”，
 * 不应作为确定性的命理判断。
 */
export function analyzeTenGodPatterns(
  pillars: BaziPillars,
  dayStem: HeavenlyStem,
): TenGodPatternResult {
  const accumulators = createAccumulators();

  (Object.keys(PILLAR_LABELS) as PillarKey[]).forEach((pillarKey) => {
    const pillar = pillars[pillarKey];
    const visibleWeight = VISIBLE_STEM_WEIGHTS[pillarKey];

    // 日干是十神参照点，本身不作为一个额外“比肩”计入分布。
    if (visibleWeight > 0) {
      addWeight(accumulators, getTenGod(dayStem, pillar.stem), {
        pillar: pillarKey,
        layer: "visible-stem",
        stem: pillar.stem,
        weight: visibleWeight,
      });
    }

    branchHiddenStems[pillar.branch].forEach((hiddenStem, index) => {
      const hiddenWeight =
        BRANCH_POSITION_WEIGHTS[pillarKey] *
        (HIDDEN_STEM_WEIGHTS[index] ?? HIDDEN_STEM_WEIGHTS[2]);

      addWeight(accumulators, getTenGod(dayStem, hiddenStem), {
        pillar: pillarKey,
        layer: "hidden-stem",
        stem: hiddenStem,
        branch: pillar.branch,
        weight: hiddenWeight,
      });
    });
  });

  const totalWeight = TEN_GODS.reduce(
    (total, tenGod) =>
      total +
      accumulators[tenGod].visibleWeight +
      accumulators[tenGod].hiddenWeight,
    0,
  );

  const weights = TEN_GODS.map((tenGod): TenGodWeight => {
    const accumulator = accumulators[tenGod];
    const weight = accumulator.visibleWeight + accumulator.hiddenWeight;

    return {
      tenGod,
      weight: round(weight),
      share: round(weight / Math.max(totalWeight, 0.001), 4),
      visibleWeight: round(accumulator.visibleWeight),
      hiddenWeight: round(accumulator.hiddenWeight),
      visibleCount: accumulator.visibleCount,
      hiddenCount: accumulator.hiddenCount,
      sources: [...accumulator.sources].sort(
        (left, right) => right.weight - left.weight,
      ),
    };
  }).sort(
    (left, right) =>
      right.weight - left.weight ||
      TEN_GODS.indexOf(left.tenGod) - TEN_GODS.indexOf(right.tenGod),
  );

  const weightMap = Object.fromEntries(
    weights.map((weight) => [weight.tenGod, weight]),
  ) as Record<TenGod, TenGodWeight>;

  const context: AnalysisContext = {
    weights: weightMap,
    shareOf: (gods) =>
      gods.reduce((total, tenGod) => total + weightMap[tenGod].share, 0),
    weightOf: (gods) =>
      gods.reduce((total, tenGod) => total + weightMap[tenGod].weight, 0),
    visibleWeightOf: (gods) =>
      gods.reduce(
        (total, tenGod) => total + weightMap[tenGod].visibleWeight,
        0,
      ),
  };

  const matches = PATTERN_DEFINITIONS.map((definition) =>
    evaluatePattern(definition, context),
  ).filter((match): match is PatternEvidence => match !== null);

  const patterns = matches
    .filter((match) => match.kind === "pattern")
    .sort(sortMatches);
  const warnings = matches
    .filter((match) => match.kind === "warning")
    .sort(sortMatches);

  return {
    dominantTenGod: weights[0]?.tenGod ?? "比肩",
    weights,
    primary: patterns[0] ?? null,
    patterns,
    warnings,
    methodology:
      "以日干为参照，统计年、月、时三处可见天干与四支藏干；月柱权重较高，藏干按本气、中气、余气递减。结果仅用于人格产品的十神结构匹配，不等同于传统命理的严格取格。",
  };
}

function component(
  label: string,
  gods: TenGod[],
  minShare: number,
  strongShare: number,
): Component {
  return { label, gods, minShare, strongShare };
}

function createAccumulators(): Record<TenGod, WeightAccumulator> {
  const accumulators = {} as Record<TenGod, WeightAccumulator>;

  TEN_GODS.forEach((tenGod) => {
    accumulators[tenGod] = {
      visibleWeight: 0,
      hiddenWeight: 0,
      visibleCount: 0,
      hiddenCount: 0,
      sources: [],
    };
  });

  return accumulators;
}

function addWeight(
  accumulators: Record<TenGod, WeightAccumulator>,
  tenGod: TenGod,
  source: TenGodWeight["sources"][number],
) {
  const accumulator = accumulators[tenGod];
  accumulator.sources.push({ ...source, weight: round(source.weight) });

  if (source.layer === "visible-stem") {
    accumulator.visibleWeight += source.weight;
    accumulator.visibleCount += 1;
  } else {
    accumulator.hiddenWeight += source.weight;
    accumulator.hiddenCount += 1;
  }
}

function evaluatePattern(
  definition: PatternDefinition,
  context: AnalysisContext,
): PatternEvidence | null {
  if (definition.guard && !definition.guard(context)) {
    return null;
  }

  const componentShares = definition.components.map((item) =>
    context.shareOf(item.gods),
  );

  if (
    definition.components.some(
      (item, index) => componentShares[index] < item.minShare,
    )
  ) {
    return null;
  }

  const strengthRatios = definition.components.map((item, index) =>
    clamp(componentShares[index] / item.strongShare, 0, 1),
  );
  const averageStrength =
    strengthRatios.reduce((total, ratio) => total + ratio, 0) /
    strengthRatios.length;
  const weakestStrength = Math.min(...strengthRatios);
  const involvedTenGods = unique(
    definition.components.flatMap((item) => item.gods),
  );
  const visibleBonus = Math.min(
    5,
    context.visibleWeightOf(involvedTenGods) * 1.5,
  );
  const score = Math.round(
    clamp(
      30 +
        averageStrength * 35 +
        weakestStrength * 30 +
        visibleBonus +
        (definition.scoreAdjustment ?? 0),
      0,
      100,
    ),
  );

  if (score < 52) {
    return null;
  }

  const componentEvidence = definition.components.map((item, index) => {
    const weight = context.weightOf(item.gods);
    const share = componentShares[index];
    const visible = context.visibleWeightOf(item.gods);
    const sourceText = describeStrongestSources(item.gods, context.weights);

    return `${item.label}权重 ${round(weight)}（占比 ${formatPercent(
      share,
    )}，其中透干权重 ${round(visible)}）${sourceText}`;
  });

  return {
    id: definition.id,
    name: definition.name,
    kind: definition.kind,
    confidence: score >= 82 ? "high" : score >= 68 ? "medium" : "low",
    score,
    evidence: [
      ...componentEvidence,
      definition.relationEvidence?.(context) ??
        "各组成十神均达到本模型预设的结构阈值。",
    ],
    traits: definition.traits,
    involvedTenGods,
  };
}

function describeStrongestSources(
  gods: TenGod[],
  weights: Record<TenGod, TenGodWeight>,
) {
  const sources = gods
    .flatMap((tenGod) =>
      weights[tenGod].sources.map((source) => ({ tenGod, ...source })),
    )
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 2);

  if (sources.length === 0) {
    return "。";
  }

  const descriptions = sources.map((source) => {
    const pillarLabel = PILLAR_LABELS[source.pillar];
    if (source.layer === "visible-stem") {
      return `${pillarLabel}天干${source.stem}（${source.tenGod}）`;
    }

    return `${pillarLabel}${source.branch}支藏${source.stem}（${source.tenGod}）`;
  });

  return `；主要来源：${descriptions.join("、")}。`;
}

function sortMatches(left: PatternEvidence, right: PatternEvidence) {
  return right.score - left.score || left.name.localeCompare(right.name, "zh-CN");
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 2) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatRatio(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "∞";
}
