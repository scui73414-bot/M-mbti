import type { PersonalityProfile } from "@/data/personalityProfiles";

export function buildCardImagePrompt(profile: PersonalityProfile) {
  return [
    "请为以下人格生成一张竖版“命格人格卡”插图。",
    "",
    "整体视觉方向：幻想人物 + 手办感 + 命运卡版式 + 精致收藏卡气质。",
    "",
    "重要要求：图片中不要生成真实可读的中文文字、英文文字或长段文字。请保留清晰的标题区域、关键词区域和底部描述区域，由前端后期叠加文字。图片本身只生成卡片视觉、人物、边框、图标、留白和氛围。",
    "",
    "卡片结构：顶部留出标题区域；中部为人物主形象；中下部留出 3 个关键词徽章 / 小图标区域；底部留出一句短描述区域；卡片外框统一为精致命运卡边框，带少量金色装饰线；背景必须简洁克制，不能复杂，不能高对比大场景。",
    "",
    "人物风格：高辨识度 Q 版幻想人物，具有手办般的精致 3D 质感，人物比例可爱但不要过度幼稚。每个人格必须通过发型、服装、姿态、表情、道具、色彩形成差异，不能像同一个角色换衣服。",
    "",
    "当前人格信息：",
    `中文名：${profile.nameZh}`,
    `英文名：${profile.nameEn}`,
    `人物原型：${profile.archetype}`,
    `核心气质：${profile.temperament}`,
    `服装特征：${profile.costume}`,
    `道具：${profile.props.join("、")}`,
    `象征元素：${profile.symbols.join("、")}`,
    `主色 / 辅色：${profile.palette.join("、")}`,
    `姿态：${profile.pose}`,
    `表情：${profile.expression}`,
    `关键词：${profile.keywords.join("、")}`,
    `结果短句：${profile.tagline}`,
    `视觉补充：${profile.visualNotes}`,
    "",
    "画面要求：人物位于卡片中心，轮廓清晰；背景只允许轻装饰，例如淡淡星点、植物纹样、几何纹章、柔和光晕；标题区域必须干净，便于前端叠加文字；底部区域必须干净，便于前端叠加短句；整体像一张高颜值、高识别度、适合移动端截图分享的命格人物卡。",
    "",
    "禁止：不要低多边形风格；不要赛博朋克风；不要写实真人；不要复杂海报构图；不要生成乱码文字；不要生成大量小字；不要让背景比人物更突出；不要让 84 张图人物脸部高度重复。",
  ].join("\n");
}
