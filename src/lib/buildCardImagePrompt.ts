import type { PersonalityProfile } from "@/data/personalityProfiles";
import rolePrompts from "@/data/destinyCharacterPrompts.json";
import {
  elementThemes,
  type DestinyType,
} from "@/data/types";

export const DESTINY_CHARACTER_MASTER_PROMPT = `生成一张用于东方命格人格图鉴的单人物插画。

唯一风格基准是东方志怪人物图录：山海经异人册页、旧绢本、细腻稳定线稿、轻工笔淡彩、克制的墨色与旧金色。人物采用修长的成年比例，头身自然，不幼态、不Q版。角色可以是东方异士、灵官、巡察者、守藏人、观星人、造物者、行旅者或半人半异兽的志怪化身。

服饰使用层叠古风长袍、披帛、束带、佩印、玉饰、铜器和流苏。神情克制、清醒、安静、有独立人格。器物必须具有象征意义，可加入一只小型异兽灵影或自然灵体，可加入淡云气、烟岚、山石、月轮、命盘圆纹或水纹，但辅助元素必须克制，不形成复杂场景。

构图为4:5竖幅，单个角色居中或微偏中，半身偏全身或完整全身，主体占画面约72%至84%，上方保留少量呼吸空间，不裁掉头饰、双手和主要器物。人物下缘可以自然淡出，图片用于网页卡片中的人物画心。

资产边界：只生成人物插画；透明背景优先；不生成卡片外框、圆角、标题区、底部文案区、标签、编号、关键词、水印或任何可读文字。`;

export const DESTINY_CHARACTER_NEGATIVE_PROMPT =
  "不要Q版，不要chibi，不要大头娃娃，不要幼态比例，不要萌系，不要盲盒，不要公仔，不要现代二次元，不要手游角色立绘，不要游戏宣传海报，不要3D渲染，不要手办感，不要现代时装，不要赛博国风，不要霓虹色，不要高饱和国潮，不要厚重电影光效，不要复杂大场景，不要西式奇幻盔甲，不要网红古风脸，不要精致古装写真，不要人物千篇一律，不要模板换装，不要卡片边框，不要UI界面，不要标题，不要文字，不要伪文字，不要数字，不要水印。";

const elementPalette: Record<DestinyType["elementFamily"], string> = {
  wood: "青绿、灰绿、竹青、苔色、淡金；枝叶、藤蔓、风纹、木纹",
  fire: "朱砂、暗红、暖赭、烟黑、少量旧金；灯焰、日轮、火纹",
  earth: "米褐、赭石、土黄、古铜、山灰；山石、地纹、方印、陶器",
  metal: "银灰、墨黑、青灰、旧金、铜灰；铜镜、刃纹、金石、衡器",
  water: "靛青、灰蓝、墨蓝、月白、冷灰；水纹、涟漪、雾气、月轮",
};

function normalizeCode(code: string) {
  const serial = Number(code.replace(/^MG-0*/, ""));
  return `MG-${String(serial).padStart(2, "0")}`;
}

function getRolePrompt(code: string) {
  return rolePrompts.find((item) => item.code === normalizeCode(code))?.rolePrompt;
}

/**
 * 只生成人物素材，不生成可读文字或卡片外壳。命格卡的标题、关键词、
 * 题下注语和装饰框全部由前端渲染，人物素材统一采用东方志怪图鉴方向。
 */
export function buildCardImagePrompt(
  type: DestinyType,
  profile?: PersonalityProfile,
) {
  const theme = elementThemes[type.elementFamily];
  const rolePrompt = getRolePrompt(type.code);

  return [
    DESTINY_CHARACTER_MASTER_PROMPT,
    "",
    `配色依据：${type.elementFamily}，${elementPalette[type.elementFamily]}。${theme.motif}只能作为极淡自然纹样，不要写出五行名称。`,
    `十神角色原型：${type.dominantTenGod} · ${type.spiritArchetype}。`,
    `命格化身概念：${profile?.archetype ?? type.spiritArchetype}。`,
    rolePrompt ? `角色专属设定：${rolePrompt}` : "",
    ...(profile
      ? [
          `服装特征：${profile.costume}`,
          `道具：${profile.props.join("、")}`,
          `象征元素：${profile.symbols.join("、")}`,
          `主色方向：${profile.palette.join("、")}`,
          `姿态：${profile.pose}`,
          `表情：${profile.expression}`,
        ]
      : []),
    "",
    `人格关键词气质：${type.keywords.join("、")}。关键词只用于动作和情绪，不得绘制成文字。`,
    `统一负面提示：${DESTINY_CHARACTER_NEGATIVE_PROMPT}`,
  ].join("\n");
}
