import type {
  BaziPillars,
  EarthlyBranch,
  HeavenlyStem,
} from "@/lib/bazi/types";

/**
 * 本规则库只回答“按哪条固定查法命中了什么”，不承担吉凶断命。
 *
 * 版本说明：
 * - 采用本命四柱可直接复算的常见子平查法；
 * - 不纳入依赖性别、顺逆大运、流年、胎元或命宫的规则；
 * - 学堂、词馆采用日干十二长生的简化查法，不冒充纳音正位；
 * - 阳刃仅取五阳干，避免把阴干逆行刃混入同一规则；
 * - 对古籍中有多套表格的项目，以本文件的显式映射为准。
 */
export const SHEN_SHA_RULESET_VERSION = "2026.07-v2";

export type ShenShaCategory =
  | "贵人与支持"
  | "德性与调和"
  | "才情与表达"
  | "行动与主导"
  | "人际与吸引"
  | "独处与边界"
  | "提醒与张力"
  | "特殊日柱"
  | "空亡";

/**
 * polarity 仅用于产品呈现语气，不表示命理上的绝对吉凶。
 */
export type ShenShaPolarity = "supportive" | "neutral" | "caution";

export type ShenShaPosition = keyof BaziPillars;

export type ShenShaCatalogItem = {
  id: string;
  name: string;
  category: ShenShaCategory;
  polarity: ShenShaPolarity;
  baseWeight: number;
  traits: readonly string[];
};

export type ShenShaHit = {
  id: string;
  name: string;
  category: ShenShaCategory;
  polarity: ShenShaPolarity;
  positions: ShenShaPosition[];
  baseWeight: number;
  prominence: number;
  basis: string;
  traits: string[];
};

export type ShenShaResult = {
  rulesetVersion: typeof SHEN_SHA_RULESET_VERSION;
  hits: ShenShaHit[];
  /**
   * 取突出度最高的五项，供人格命名或结果页优先展示。
   */
  prominent: ShenShaHit[];
};

const catalog = [
  ["tian-yi", "天乙贵人", "贵人与支持", "supportive", 8.8, ["容易获得关键协助", "善于连接资源"]],
  ["tai-ji", "太极贵人", "贵人与支持", "supportive", 7.2, ["爱追问事物原理", "有抽象理解力"]],
  ["wen-chang", "文昌贵人", "才情与表达", "supportive", 7.8, ["学习转化快", "擅长组织表达"]],
  ["guo-yin", "国印贵人", "行动与主导", "supportive", 7.0, ["重视秩序与责任", "做事有章法"]],
  ["jin-yu", "金舆", "贵人与支持", "supportive", 6.5, ["在意品质与体验", "善于经营稳定感"]],
  ["lu-shen", "禄神", "行动与主导", "supportive", 7.4, ["重视自我驱动", "倾向靠长期积累"]],
  ["yang-ren", "阳刃", "提醒与张力", "caution", 7.3, ["行动果断", "需要给强度设置边界"]],
  ["tian-guan", "天官贵人", "贵人与支持", "supportive", 6.7, ["重视专业认可", "愿意承担公共责任"]],
  ["tian-fu", "天福贵人", "贵人与支持", "supportive", 6.4, ["善于发现顺手资源", "有生活调度感"]],
  ["tian-chu", "天厨贵人", "贵人与支持", "supportive", 6.2, ["懂得照顾体验", "有分享与款待意识"]],
  ["wen-xing", "文星贵人", "才情与表达", "supportive", 6.9, ["对文字与观点敏感", "表达有个人风格"]],
  ["tian-yin", "天印贵人", "才情与表达", "supportive", 6.6, ["擅长归纳信息", "在规范中建立方法"]],
  ["tian-de", "天德贵人", "德性与调和", "supportive", 8.1, ["愿意缓和冲突", "处事留有余地"]],
  ["tian-de-he", "天德合", "德性与调和", "supportive", 6.9, ["善于寻找共同点", "合作中重视分寸"]],
  ["yue-de", "月德贵人", "德性与调和", "supportive", 7.9, ["待人温和有原则", "容易成为协调者"]],
  ["yue-de-he", "月德合", "德性与调和", "supportive", 6.8, ["能把分歧重新接上", "注重关系修复"]],
  ["de-xiu", "德秀贵人", "德性与调和", "supportive", 7.2, ["温厚而有审美", "兼顾原则与表达"]],
  ["tian-yi-medical", "天医", "贵人与支持", "supportive", 6.0, ["关注身心状态", "有照料与修复意识"]],
  ["san-qi", "三奇贵人", "才情与表达", "supportive", 8.3, ["思路组合独特", "容易跨领域连接"]],
  ["yi-ma", "驿马", "行动与主导", "neutral", 7.7, ["需要变化与流动", "在新环境中被激活"]],
  ["tao-hua", "桃花", "人际与吸引", "neutral", 7.1, ["容易被人注意", "对互动氛围敏感"]],
  ["hua-gai", "华盖", "独处与边界", "neutral", 7.4, ["有独立精神空间", "偏爱深度与冷门主题"]],
  ["jiang-xing", "将星", "行动与主导", "supportive", 7.8, ["有组织与带队倾向", "关键时刻愿意定调"]],
  ["jie-sha", "劫煞", "提醒与张力", "caution", 6.7, ["反应快且敢突破", "需要避免资源消耗过急"]],
  ["wang-shen", "亡神", "提醒与张力", "caution", 6.5, ["脑内活动丰富", "需要把灵感及时落地"]],
  ["zai-sha", "灾煞", "提醒与张力", "caution", 6.2, ["对风险变化敏锐", "适合预留缓冲空间"]],
  ["liu-e", "六厄", "提醒与张力", "caution", 5.9, ["容易感知流程阻力", "适合拆小目标推进"]],
  ["gu-chen", "孤辰", "独处与边界", "neutral", 6.4, ["自主性强", "需要主动表达连接需求"]],
  ["gua-su", "寡宿", "独处与边界", "neutral", 6.4, ["重视精神边界", "关系中偏好高质量陪伴"]],
  ["hong-luan", "红鸾", "人际与吸引", "supportive", 6.6, ["容易回应关系契机", "愿意营造仪式感"]],
  ["tian-xi", "天喜", "人际与吸引", "supportive", 6.5, ["有传递愉快气氛的能力", "乐于分享好消息"]],
  ["kong-wang", "空亡", "空亡", "neutral", 7.0, ["擅长留白与跳脱", "需要把设想连接到现实步骤"]],
  ["ri-gui", "日贵", "特殊日柱", "supportive", 7.5, ["自我要求清楚", "善于借助合作完成目标"]],
  ["kui-gang", "魁罡", "特殊日柱", "neutral", 8.0, ["意志与原则感强", "需要给坚定保留弹性"]],
  ["ri-de", "日德", "特殊日柱", "supportive", 7.2, ["做事讲道理与体面", "有稳定他人的能力"]],
  ["yin-yang-cha-cuo", "阴阳差错", "特殊日柱", "caution", 6.5, ["容易察觉关系错位", "适合把默契改成明确沟通"]],
  ["jiu-chou", "九丑", "特殊日柱", "caution", 6.1, ["对评价与形象敏感", "适合减少过度自我审视"]],
  ["tian-she", "天赦", "德性与调和", "supportive", 7.6, ["擅长给事情重启机会", "有复盘后翻篇的能力"]],
  ["si-fei", "四废", "特殊日柱", "caution", 6.3, ["能感知节奏不合", "适合顺势蓄力而非硬推"]],
  ["tian-zhuan", "天转", "特殊日柱", "neutral", 6.2, ["能量集中而鲜明", "需要在高投入后主动复位"]],
  ["di-zhuan", "地转", "特殊日柱", "neutral", 6.2, ["环境感受力强", "适合通过稳定日常落地"]],
  ["gu-luan", "孤鸾日（核心表）", "特殊日柱", "neutral", 6.4, ["亲密关系标准独立", "需要用表达替代猜测"]],
  ["ba-zhuan", "八专", "特殊日柱", "neutral", 6.7, ["专注投入度高", "关系与兴趣中容易全情进入"]],
  ["shi-e-da-bai", "十恶大败", "特殊日柱", "caution", 6.5, ["对资源起落较敏感", "适合建立可持续的节奏"]],
  ["xue-tang", "学堂", "才情与表达", "supportive", 6.8, ["通过系统学习成长", "擅长搭建知识框架"]],
  ["ci-guan", "词馆", "才情与表达", "supportive", 6.8, ["善于精炼观点", "能把复杂内容讲清楚"]],
] as const satisfies readonly (readonly [
  string,
  string,
  ShenShaCategory,
  ShenShaPolarity,
  number,
  readonly string[],
])[];

export const SHEN_SHA_CATALOG: readonly ShenShaCatalogItem[] = catalog.map(
  ([id, name, category, polarity, baseWeight, traits]) => ({
    id,
    name,
    category,
    polarity,
    baseWeight,
    traits,
  }),
);

const catalogById = new Map(SHEN_SHA_CATALOG.map((item) => [item.id, item]));

const positions: ShenShaPosition[] = ["year", "month", "day", "hour"];

const positionLabels: Record<ShenShaPosition, string> = {
  year: "年",
  month: "月",
  day: "日",
  hour: "时",
};

const positionWeight: Record<ShenShaPosition, number> = {
  year: 5,
  month: 9,
  day: 11,
  hour: 7,
};

type Match = {
  id: string;
  positions: ShenShaPosition[];
  basis: string;
};

type StemBranchMap = Partial<Record<HeavenlyStem, readonly EarthlyBranch[]>>;

const tianYiMap: StemBranchMap = {
  甲: ["丑", "未"],
  乙: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  戊: ["丑", "未"],
  己: ["子", "申"],
  庚: ["丑", "未"],
  辛: ["寅", "午"],
  壬: ["卯", "巳"],
  癸: ["卯", "巳"],
};

const taiJiMap: StemBranchMap = {
  甲: ["子", "午"],
  乙: ["子", "午"],
  丙: ["卯", "酉"],
  丁: ["卯", "酉"],
  戊: ["辰", "戌", "丑", "未"],
  己: ["辰", "戌", "丑", "未"],
  庚: ["寅", "亥"],
  辛: ["寅", "亥"],
  壬: ["巳", "申"],
  癸: ["巳", "申"],
};

const wenChangMap: StemBranchMap = {
  甲: ["巳"],
  乙: ["午"],
  丙: ["申"],
  丁: ["酉"],
  戊: ["申"],
  己: ["酉"],
  庚: ["亥"],
  辛: ["子"],
  壬: ["寅"],
  癸: ["卯"],
};

const guoYinMap: StemBranchMap = {
  甲: ["戌"],
  乙: ["亥"],
  丙: ["丑"],
  丁: ["寅"],
  戊: ["丑"],
  己: ["寅"],
  庚: ["辰"],
  辛: ["巳"],
  壬: ["未"],
  癸: ["申"],
};

const jinYuMap: StemBranchMap = {
  甲: ["辰"],
  乙: ["巳"],
  丙: ["未"],
  丁: ["申"],
  戊: ["未"],
  己: ["申"],
  庚: ["戌"],
  辛: ["亥"],
  壬: ["丑"],
  癸: ["寅"],
};

const luShenMap: StemBranchMap = {
  甲: ["寅"],
  乙: ["卯"],
  丙: ["巳"],
  丁: ["午"],
  戊: ["巳"],
  己: ["午"],
  庚: ["申"],
  辛: ["酉"],
  壬: ["亥"],
  癸: ["子"],
};

// 子平常用的五阳干阳刃；阴干“刃”有多种取法，本规则集不混用。
const yangRenMap: StemBranchMap = {
  甲: ["卯"],
  丙: ["午"],
  戊: ["午"],
  庚: ["酉"],
  壬: ["子"],
};

const tianGuanMap: StemBranchMap = {
  甲: ["未"],
  乙: ["辰"],
  丙: ["巳"],
  丁: ["酉"],
  戊: ["戌"],
  己: ["卯"],
  庚: ["亥"],
  辛: ["申"],
  壬: ["寅"],
  癸: ["午"],
};

const tianFuMap: StemBranchMap = {
  甲: ["酉"],
  乙: ["申"],
  丙: ["子"],
  丁: ["亥"],
  戊: ["卯"],
  己: ["寅"],
  庚: ["午"],
  辛: ["巳"],
  壬: ["午"],
  癸: ["巳"],
};

// 采用《易冒》所载“甲丁巳、丙子、壬酉、癸亥、乙戊辛午、己申、庚寅”表。
const tianChuMap: StemBranchMap = {
  甲: ["巳"],
  乙: ["午"],
  丙: ["子"],
  丁: ["巳"],
  戊: ["午"],
  己: ["申"],
  庚: ["寅"],
  辛: ["午"],
  壬: ["酉"],
  癸: ["亥"],
};

const wenXingMap: StemBranchMap = {
  甲: ["午"],
  乙: ["巳"],
  丙: ["申"],
  丁: ["酉"],
  戊: ["申"],
  己: ["酉"],
  庚: ["戌"],
  辛: ["亥"],
  壬: ["寅"],
  癸: ["卯"],
};

const tianYinMap: StemBranchMap = {
  甲: ["寅"],
  乙: ["亥"],
  丙: ["戌"],
  丁: ["酉"],
  戊: ["申"],
  己: ["未"],
  庚: ["午"],
  辛: ["巳"],
  壬: ["辰"],
  癸: ["卯"],
};

type StemPillarMap = Partial<Record<HeavenlyStem, readonly string[]>>;

// 正学堂与正词馆按日干查完整干支，不以单个地支替代。
const xueTangPillarMap: StemPillarMap = {
  甲: ["己亥"],
  乙: ["壬午"],
  丙: ["丙寅"],
  丁: ["丁酉"],
  戊: ["戊寅"],
  己: ["己酉"],
  庚: ["辛巳"],
  辛: ["甲子"],
  壬: ["甲申"],
  癸: ["乙卯"],
};

const ciGuanPillarMap: StemPillarMap = {
  甲: ["庚寅"],
  乙: ["辛卯"],
  丙: ["乙巳"],
  丁: ["戊午"],
  戊: ["丁巳"],
  己: ["庚午"],
  庚: ["壬申"],
  辛: ["癸酉"],
  壬: ["癸亥"],
  癸: ["壬子"],
};

const branchGroupTarget = {
  yiMa: {
    "申子辰": "寅",
    "寅午戌": "申",
    "巳酉丑": "亥",
    "亥卯未": "巳",
  },
  taoHua: {
    "申子辰": "酉",
    "寅午戌": "卯",
    "巳酉丑": "午",
    "亥卯未": "子",
  },
  huaGai: {
    "申子辰": "辰",
    "寅午戌": "戌",
    "巳酉丑": "丑",
    "亥卯未": "未",
  },
  jiangXing: {
    "申子辰": "子",
    "寅午戌": "午",
    "巳酉丑": "酉",
    "亥卯未": "卯",
  },
  jieSha: {
    "申子辰": "巳",
    "寅午戌": "亥",
    "巳酉丑": "寅",
    "亥卯未": "申",
  },
  wangShen: {
    "申子辰": "亥",
    "寅午戌": "巳",
    "巳酉丑": "申",
    "亥卯未": "寅",
  },
  zaiSha: {
    "申子辰": "午",
    "寅午戌": "子",
    "巳酉丑": "卯",
    "亥卯未": "酉",
  },
  liuE: {
    "申子辰": "卯",
    "寅午戌": "酉",
    "巳酉丑": "子",
    "亥卯未": "午",
  },
} as const;

const seasonByMonth: Record<EarthlyBranch, "春" | "夏" | "秋" | "冬"> = {
  寅: "春",
  卯: "春",
  辰: "春",
  巳: "夏",
  午: "夏",
  未: "夏",
  申: "秋",
  酉: "秋",
  戌: "秋",
  亥: "冬",
  子: "冬",
  丑: "冬",
};

function findBranchPositions(
  pillars: BaziPillars,
  targets: readonly EarthlyBranch[],
): ShenShaPosition[] {
  return positions.filter((position) =>
    targets.includes(pillars[position].branch),
  );
}

function findStemPositions(
  pillars: BaziPillars,
  targets: readonly HeavenlyStem[],
): ShenShaPosition[] {
  return positions.filter((position) =>
    targets.includes(pillars[position].stem),
  );
}

function addStemAnchoredBranchRule(
  matches: Match[],
  pillars: BaziPillars,
  id: string,
  map: StemBranchMap,
  anchors: readonly ("year" | "day")[],
  searchPositions: readonly ShenShaPosition[],
  label: string,
) {
  const targetSet = new Set<EarthlyBranch>();
  const basis: string[] = [];

  for (const anchor of anchors) {
    const stem = pillars[anchor].stem;
    const targets = map[stem] ?? [];
    targets.forEach((target) => targetSet.add(target));
    if (targets.length > 0) {
      basis.push(`${anchor === "year" ? "年干" : "日干"}${stem}查${targets.join("、")}`);
    }
  }

  const hitPositions = searchPositions.filter((position) =>
    targetSet.has(pillars[position].branch),
  );
  if (hitPositions.length > 0) {
    matches.push({
      id,
      positions: hitPositions,
      basis: `${label}：${basis.join("；")}；在${searchPositions
        .map((position) => `${positionLabels[position]}柱`)
        .join("、")}地支查见`,
    });
  }
}

function addDayStemPillarRule(
  matches: Match[],
  pillars: BaziPillars,
  id: string,
  map: StemPillarMap,
  label: string,
) {
  const targets = map[pillars.day.stem] ?? [];
  const hitPositions = positions.filter((position) =>
    targets.includes(pillars[position].text),
  );
  if (hitPositions.length > 0) {
    matches.push({
      id,
      positions: hitPositions,
      basis: `${label}：日干${pillars.day.stem}查完整干支${targets.join(
        "、",
      )}；四柱见之`,
    });
  }
}

function getBranchGroup(branch: EarthlyBranch) {
  if (["申", "子", "辰"].includes(branch)) return "申子辰" as const;
  if (["寅", "午", "戌"].includes(branch)) return "寅午戌" as const;
  if (["巳", "酉", "丑"].includes(branch)) return "巳酉丑" as const;
  return "亥卯未" as const;
}

function addBranchGroupRule(
  matches: Match[],
  pillars: BaziPillars,
  id: string,
  table: Record<ReturnType<typeof getBranchGroup>, EarthlyBranch>,
  anchors: readonly ("year" | "day")[],
  searchPositions: readonly ShenShaPosition[],
  label: string,
) {
  const targetSet = new Set<EarthlyBranch>();
  const basis: string[] = [];

  for (const anchor of anchors) {
    const branch = pillars[anchor].branch;
    const group = getBranchGroup(branch);
    const target = table[group];
    targetSet.add(target);
    basis.push(`${anchor === "year" ? "年支" : "日支"}${branch}属${group}局查${target}`);
  }

  const hitPositions = searchPositions.filter((position) =>
    targetSet.has(pillars[position].branch),
  );
  if (hitPositions.length > 0) {
    matches.push({
      id,
      positions: hitPositions,
      basis: `${label}：${basis.join("；")}；在${searchPositions
        .map((position) => `${positionLabels[position]}柱`)
        .join("、")}地支查见`,
    });
  }
}

function addMonthStemRule(
  matches: Match[],
  pillars: BaziPillars,
  id: string,
  targets: readonly HeavenlyStem[],
  label: string,
) {
  const hitPositions = findStemPositions(pillars, targets);
  if (hitPositions.length > 0) {
    matches.push({
      id,
      positions: hitPositions,
      basis: `${label}：月支${pillars.month.branch}查天干${targets.join("、")}`,
    });
  }
}

function addSpecialDayRule(
  matches: Match[],
  pillars: BaziPillars,
  id: string,
  days: readonly string[],
  label: string,
) {
  if (days.includes(pillars.day.text)) {
    matches.push({
      id,
      positions: ["day"],
      basis: `${label}：日柱${pillars.day.text}在固定日柱表中`,
    });
  }
}

function calculateRawMatches(pillars: BaziPillars): Match[] {
  const matches: Match[] = [];

  addStemAnchoredBranchRule(
    matches,
    pillars,
    "tian-yi",
    tianYiMap,
    ["year", "day"],
    positions,
    "天乙按年干、日干两路并查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "tai-ji",
    taiJiMap,
    ["year", "day"],
    positions,
    "太极按年干、日干两路并查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "wen-chang",
    wenChangMap,
    ["day"],
    positions,
    "文昌按日干查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "guo-yin",
    guoYinMap,
    ["day"],
    positions,
    "国印按日干查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "jin-yu",
    jinYuMap,
    ["day"],
    positions,
    "金舆按日干查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "lu-shen",
    luShenMap,
    ["day"],
    positions,
    "禄神按日干查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "yang-ren",
    yangRenMap,
    ["day"],
    positions,
    "阳刃仅按日干且只取五阳干",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "tian-guan",
    tianGuanMap,
    ["day"],
    positions,
    "天官按日干固定表查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "tian-fu",
    tianFuMap,
    ["day"],
    positions,
    "天福按日干之正官临官位查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "tian-chu",
    tianChuMap,
    ["day"],
    positions,
    "天厨按日干固定歌诀表查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "wen-xing",
    wenXingMap,
    ["day"],
    positions,
    "文星按日干查",
  );
  addStemAnchoredBranchRule(
    matches,
    pillars,
    "tian-yin",
    tianYinMap,
    ["day"],
    positions,
    "天印按日干查",
  );
  addDayStemPillarRule(
    matches,
    pillars,
    "xue-tang",
    xueTangPillarMap,
    "学堂采用日干正学堂完整干支表",
  );
  addDayStemPillarRule(
    matches,
    pillars,
    "ci-guan",
    ciGuanPillarMap,
    "词馆采用日干正词馆完整干支表",
  );

  const monthBranch = pillars.month.branch;
  const tianDeTarget: Record<
    EarthlyBranch,
    { stem?: HeavenlyStem; branch?: EarthlyBranch }
  > = {
    寅: { stem: "丁" },
    卯: { branch: "申" },
    辰: { stem: "壬" },
    巳: { stem: "辛" },
    午: { branch: "亥" },
    未: { stem: "甲" },
    申: { stem: "癸" },
    酉: { branch: "寅" },
    戌: { stem: "丙" },
    亥: { stem: "乙" },
    子: { branch: "巳" },
    丑: { stem: "庚" },
  };
  const tianDe = tianDeTarget[monthBranch];
  if (tianDe) {
    const hitPositions = tianDe.stem
      ? findStemPositions(pillars, [tianDe.stem])
      : findBranchPositions(pillars, [tianDe.branch!]);
    if (hitPositions.length > 0) {
      matches.push({
        id: "tian-de",
        positions: hitPositions,
        basis: `天德月令表：月支${monthBranch}查${
          tianDe.stem ?? tianDe.branch
        }`,
      });
    }
  }

  const tianDeHeMap: Record<
    EarthlyBranch,
    { stem?: HeavenlyStem; branch?: EarthlyBranch }
  > = {
    寅: { stem: "壬" },
    卯: { branch: "巳" },
    辰: { stem: "丁" },
    巳: { stem: "丙" },
    午: { branch: "寅" },
    未: { stem: "己" },
    申: { stem: "戊" },
    酉: { branch: "亥" },
    戌: { stem: "辛" },
    亥: { stem: "庚" },
    子: { branch: "申" },
    丑: { stem: "乙" },
  };
  const tianDeHe = tianDeHeMap[monthBranch];
  const tianDeHePositions = tianDeHe.stem
    ? findStemPositions(pillars, [tianDeHe.stem])
    : findBranchPositions(pillars, [tianDeHe.branch!]);
  if (tianDeHePositions.length > 0) {
    matches.push({
      id: "tian-de-he",
      positions: tianDeHePositions,
      basis: `天德合：月支${monthBranch}之天德为${
        tianDe.stem ?? tianDe.branch
      }，查其${tianDeHe.stem ? "天干五合" : "地支六合"}${
        tianDeHe.stem ?? tianDeHe.branch
      }`,
    });
  }

  const monthGroup = getBranchGroup(monthBranch);
  const yueDeMap: Record<ReturnType<typeof getBranchGroup>, HeavenlyStem> = {
    "寅午戌": "丙",
    "亥卯未": "甲",
    "申子辰": "壬",
    "巳酉丑": "庚",
  };
  const yueDeHeMap: Record<ReturnType<typeof getBranchGroup>, HeavenlyStem> = {
    "寅午戌": "辛",
    "亥卯未": "己",
    "申子辰": "丁",
    "巳酉丑": "乙",
  };
  addMonthStemRule(matches, pillars, "yue-de", [yueDeMap[monthGroup]], "月德三合局");
  addMonthStemRule(
    matches,
    pillars,
    "yue-de-he",
    [yueDeHeMap[monthGroup]],
    "月德五合",
  );

  const deXiuMap: Record<
    ReturnType<typeof getBranchGroup>,
    { de: readonly HeavenlyStem[]; xiu: readonly HeavenlyStem[] }
  > = {
    "寅午戌": { de: ["丙", "丁"], xiu: ["戊", "癸"] },
    "申子辰": { de: ["壬", "癸", "戊", "己"], xiu: ["丙", "辛", "甲", "己"] },
    "巳酉丑": { de: ["庚", "辛"], xiu: ["乙", "庚"] },
    "亥卯未": { de: ["甲", "乙"], xiu: ["丁", "壬"] },
  };
  const deXiu = deXiuMap[monthGroup];
  const dePositions = findStemPositions(pillars, deXiu.de);
  const xiuPositions = findStemPositions(pillars, deXiu.xiu);
  const deXiuPositions = [...new Set([...dePositions, ...xiuPositions])];
  if (dePositions.length > 0 && xiuPositions.length > 0) {
    matches.push({
      id: "de-xiu",
      positions: deXiuPositions,
      basis: `德秀月令表：${monthGroup}月，德见${deXiu.de.join(
        "、",
      )}且秀见${deXiu.xiu.join("、")}`,
    });
  }

  const branchOrder: EarthlyBranch[] = [
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ];
  const monthIndex = branchOrder.indexOf(monthBranch);
  const tianYiMedicalTarget =
    branchOrder[(monthIndex + branchOrder.length - 1) % branchOrder.length];
  const tianYiMedicalPositions = findBranchPositions(pillars, [
    tianYiMedicalTarget,
  ]);
  if (tianYiMedicalPositions.length > 0) {
    matches.push({
      id: "tian-yi-medical",
      positions: tianYiMedicalPositions,
      basis: `天医取月支前一位：月支${monthBranch}查${tianYiMedicalTarget}`,
    });
  }

  const stemSequence = positions.map((position) => pillars[position].stem);
  const sanQiSequences = [
    ["乙", "丙", "丁"],
    ["甲", "戊", "庚"],
    ["壬", "癸", "辛"],
  ] satisfies HeavenlyStem[][];
  for (const sequence of sanQiSequences) {
    for (let index = 0; index <= stemSequence.length - 3; index += 1) {
      if (
        sequence.every((stem, offset) => stemSequence[index + offset] === stem)
      ) {
        matches.push({
          id: "san-qi",
          positions: positions.slice(index, index + 3),
          basis: `三奇顺布：${positions
            .slice(index, index + 3)
            .map(
              (position) =>
                `${positionLabels[position]}柱${pillars[position].stem}`,
            )
            .join("、")}`,
        });
      }
    }
  }

  addBranchGroupRule(
    matches,
    pillars,
    "yi-ma",
    branchGroupTarget.yiMa,
    ["year", "day"],
    positions,
    "驿马按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "tao-hua",
    branchGroupTarget.taoHua,
    ["year", "day"],
    positions,
    "桃花按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "hua-gai",
    branchGroupTarget.huaGai,
    ["year", "day"],
    positions,
    "华盖按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "jiang-xing",
    branchGroupTarget.jiangXing,
    ["year", "day"],
    positions,
    "将星按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "jie-sha",
    branchGroupTarget.jieSha,
    ["year", "day"],
    positions,
    "劫煞按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "wang-shen",
    branchGroupTarget.wangShen,
    ["year", "day"],
    positions,
    "亡神按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "zai-sha",
    branchGroupTarget.zaiSha,
    ["year", "day"],
    positions,
    "灾煞按年支、日支所属三合局两路并查",
  );
  addBranchGroupRule(
    matches,
    pillars,
    "liu-e",
    branchGroupTarget.liuE,
    ["year"],
    positions,
    "六厄仅按年支所属三合局查",
  );

  const yearGroup = (() => {
    if (["亥", "子", "丑"].includes(pillars.year.branch)) return "亥子丑";
    if (["寅", "卯", "辰"].includes(pillars.year.branch)) return "寅卯辰";
    if (["巳", "午", "未"].includes(pillars.year.branch)) return "巳午未";
    return "申酉戌";
  })();
  const guChenMap = {
    亥子丑: "寅",
    寅卯辰: "巳",
    巳午未: "申",
    申酉戌: "亥",
  } as const;
  const guaSuMap = {
    亥子丑: "戌",
    寅卯辰: "丑",
    巳午未: "辰",
    申酉戌: "未",
  } as const;
  for (const [id, target, label] of [
    ["gu-chen", guChenMap[yearGroup], "孤辰"],
    ["gua-su", guaSuMap[yearGroup], "寡宿"],
  ] as const) {
    const hitPositions = findBranchPositions(pillars, [target]);
    if (hitPositions.length > 0) {
      matches.push({
        id,
        positions: hitPositions,
        basis: `${label}四方表：年支${pillars.year.branch}属${yearGroup}，查${target}`,
      });
    }
  }

  const hongLuanMap: Record<EarthlyBranch, EarthlyBranch> = {
    子: "卯",
    丑: "寅",
    寅: "丑",
    卯: "子",
    辰: "亥",
    巳: "戌",
    午: "酉",
    未: "申",
    申: "未",
    酉: "午",
    戌: "巳",
    亥: "辰",
  };
  const tianXiMap: Record<EarthlyBranch, EarthlyBranch> = {
    子: "酉",
    丑: "申",
    寅: "未",
    卯: "午",
    辰: "巳",
    巳: "辰",
    午: "卯",
    未: "寅",
    申: "丑",
    酉: "子",
    戌: "亥",
    亥: "戌",
  };
  for (const [id, table, label] of [
    ["hong-luan", hongLuanMap, "红鸾"],
    ["tian-xi", tianXiMap, "天喜"],
  ] as const) {
    const target = table[pillars.year.branch];
    const hitPositions = findBranchPositions(pillars, [target]);
    if (hitPositions.length > 0) {
      matches.push({
        id,
        positions: hitPositions,
        basis: `${label}年支表：年支${pillars.year.branch}查${target}`,
      });
    }
  }

  const stemOrder: HeavenlyStem[] = [
    "甲",
    "乙",
    "丙",
    "丁",
    "戊",
    "己",
    "庚",
    "辛",
    "壬",
    "癸",
  ];
  const dayStemIndex = stemOrder.indexOf(pillars.day.stem);
  const dayBranchIndex = branchOrder.indexOf(pillars.day.branch);
  const dayCycleIndex = Array.from({ length: 60 }, (_, index) => index).find(
    (index) => index % 10 === dayStemIndex && index % 12 === dayBranchIndex,
  );
  if (dayCycleIndex !== undefined) {
    const xunStart = Math.floor(dayCycleIndex / 10) * 10;
    const usedBranches = new Set(
      Array.from(
        { length: 10 },
        (_, offset) => branchOrder[(xunStart + offset) % 12],
      ),
    );
    const emptyBranches = branchOrder.filter((branch) => !usedBranches.has(branch));
    const hitPositions = findBranchPositions(pillars, emptyBranches);
    if (hitPositions.length > 0) {
      matches.push({
        id: "kong-wang",
        positions: hitPositions,
        basis: `日柱${pillars.day.text}所在旬，旬空为${emptyBranches.join("、")}`,
      });
    }
  }

  addSpecialDayRule(matches, pillars, "ri-gui", ["丁酉", "丁亥", "癸卯", "癸巳"], "日贵");
  addSpecialDayRule(matches, pillars, "kui-gang", ["庚辰", "庚戌", "壬辰", "戊戌"], "魁罡");
  addSpecialDayRule(matches, pillars, "ri-de", ["甲寅", "丙辰", "戊辰", "庚辰", "壬戌"], "日德");
  addSpecialDayRule(
    matches,
    pillars,
    "yin-yang-cha-cuo",
    ["丙子", "丁丑", "戊寅", "辛卯", "壬辰", "癸巳", "丙午", "丁未", "戊申", "辛酉", "壬戌", "癸亥"],
    "阴阳差错",
  );
  addSpecialDayRule(
    matches,
    pillars,
    "jiu-chou",
    ["戊子", "丁酉", "丁卯", "戊午", "己酉", "己卯", "壬子", "壬午", "辛卯", "辛酉"],
    "九丑",
  );
  addSpecialDayRule(
    matches,
    pillars,
    "gu-luan",
    ["乙巳", "丁巳", "辛亥", "戊申", "甲寅"],
    "孤鸾日（核心表，仅取甲寅、乙巳、丁巳、戊申、辛亥）",
  );
  addSpecialDayRule(
    matches,
    pillars,
    "ba-zhuan",
    ["甲寅", "乙卯", "丁未", "戊戌", "己未", "庚申", "辛酉", "癸丑"],
    "八专",
  );
  addSpecialDayRule(
    matches,
    pillars,
    "shi-e-da-bai",
    ["甲辰", "乙巳", "丙申", "丁亥", "戊戌", "己丑", "庚辰", "辛巳", "壬申", "癸亥"],
    "十恶大败",
  );

  const season = seasonByMonth[monthBranch];
  const tianSheDay = {
    春: "戊寅",
    夏: "甲午",
    秋: "戊申",
    冬: "甲子",
  } as const;
  if (pillars.day.text === tianSheDay[season]) {
    matches.push({
      id: "tian-she",
      positions: ["day"],
      basis: `天赦按节令月支定季节：${season}季查${tianSheDay[season]}`,
    });
  }

  const siFeiDays = {
    春: ["庚申", "辛酉"],
    夏: ["壬子", "癸亥"],
    秋: ["甲寅", "乙卯"],
    冬: ["丙午", "丁巳"],
  } as const;
  if ((siFeiDays[season] as readonly string[]).includes(pillars.day.text)) {
    matches.push({
      id: "si-fei",
      positions: ["day"],
      basis: `四废按节令月支定季节：${season}季查${siFeiDays[season].join("、")}`,
    });
  }

  const tianZhuanDay = { 春: "乙卯", 夏: "丙午", 秋: "辛酉", 冬: "壬子" } as const;
  const diZhuanDay = { 春: "辛卯", 夏: "戊午", 秋: "癸酉", 冬: "丙子" } as const;
  if (pillars.day.text === tianZhuanDay[season]) {
    matches.push({
      id: "tian-zhuan",
      positions: ["day"],
      basis: `天转按节令月支定季节：${season}季查${tianZhuanDay[season]}`,
    });
  }
  if (pillars.day.text === diZhuanDay[season]) {
    matches.push({
      id: "di-zhuan",
      positions: ["day"],
      basis: `地转按节令月支定季节：${season}季查${diZhuanDay[season]}`,
    });
  }

  return matches;
}

function mergeMatches(matches: Match[]): Match[] {
  const merged = new Map<string, Match>();

  for (const match of matches) {
    const existing = merged.get(match.id);
    if (!existing) {
      merged.set(match.id, match);
      continue;
    }

    existing.positions = [
      ...new Set([...existing.positions, ...match.positions]),
    ].sort((left, right) => positions.indexOf(left) - positions.indexOf(right));
    existing.basis = `${existing.basis}；${match.basis}`;
  }

  return [...merged.values()];
}

function calculateProminence(
  baseWeight: number,
  hitPositions: ShenShaPosition[],
): number {
  const strongestPosition = Math.max(
    ...hitPositions.map((position) => positionWeight[position]),
  );
  const repeatedBonus = Math.max(0, hitPositions.length - 1) * 4.5;
  const dayMonthBonus =
    hitPositions.includes("day") && hitPositions.includes("month") ? 3 : 0;

  return Math.round(
    Math.min(
      100,
      baseWeight * 7.5 + strongestPosition * 1.6 + repeatedBonus + dayMonthBonus,
    ),
  );
}

export function calculateShenSha(pillars: BaziPillars): ShenShaResult {
  const hits = mergeMatches(calculateRawMatches(pillars))
    .map((match): ShenShaHit | undefined => {
      const definition = catalogById.get(match.id);
      if (!definition) return undefined;

      return {
        id: definition.id,
        name: definition.name,
        category: definition.category,
        polarity: definition.polarity,
        positions: match.positions,
        baseWeight: definition.baseWeight,
        prominence: calculateProminence(
          definition.baseWeight,
          match.positions,
        ),
        basis: match.basis,
        traits: [...definition.traits],
      };
    })
    .filter((hit): hit is ShenShaHit => Boolean(hit))
    .sort(
      (left, right) =>
        right.prominence - left.prominence ||
        right.baseWeight - left.baseWeight ||
        left.name.localeCompare(right.name, "zh-CN"),
    );

  return {
    rulesetVersion: SHEN_SHA_RULESET_VERSION,
    hits,
    prominent: hits.slice(0, 5),
  };
}
