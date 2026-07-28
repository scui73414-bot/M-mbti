export type DestinyCardCopy = {
  code: string;
  socialName: string;
  recommendedSubLabel: string;
  keywords: readonly [string, string, string];
  oneLiner: string;
};

/**
 * 命运卡方向的统一卡面文案。命理结构仍由 types.ts / matching 层计算，
 * 这里只负责 84 张卡的传播名、关键词和题下注语。
 */
export const destinyCardCopy: readonly DestinyCardCopy[] = [
  { code: "MG-01", socialName: "闻风识金", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["辨值", "察机", "慎取"], oneLiner: "风未入庭，你已听出其中轻重。" },
  { code: "MG-02", socialName: "暗灯自明", recommendedSubLabel: "正印 · 守光灵相", keywords: ["藏光", "待时", "后发"], oneLiner: "光不争先，却总会在暗处自明。" },
  { code: "MG-03", socialName: "照微知瑕", recommendedSubLabel: "正官 · 执律灵相", keywords: ["察微", "辨瑕", "守准"], oneLiner: "再细一线的失衡，也逃不过你的眼睛。" },
  { code: "MG-04", socialName: "敛锋成章", recommendedSubLabel: "正官 · 执礼灵相", keywords: ["收锋", "成章", "持仪"], oneLiner: "锋芒收进袖里，礼数替你先行。" },
  { code: "MG-05", socialName: "寒衣藏火", recommendedSubLabel: "正印 · 护持灵相", keywords: ["藏温", "守意", "慢言"], oneLiner: "寒意留在衣外，温度一直藏在心中。" },
  { code: "MG-06", socialName: "辨虚见实", recommendedSubLabel: "伤官 · 破局灵相", keywords: ["破妄", "见实", "拆局"], oneLiner: "你先拆掉虚妄，再把真实摆到眼前。" },
  { code: "MG-07", socialName: "清门择客", recommendedSubLabel: "比肩 · 同行灵相", keywords: ["择交", "守界", "慎纳"], oneLiner: "不是谁都能入席，门槛也是一种诚意。" },
  { code: "MG-08", socialName: "蓄光待时", recommendedSubLabel: "正印 · 守光灵相", keywords: ["蓄势", "守静", "待明"], oneLiner: "蓄光不等于沉默，只是在等合适的时辰。" },
  { code: "MG-09", socialName: "未雨持筹", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["预判", "避险", "持筹"], oneLiner: "风雨尚未落下，你已经替众人备好伞。" },
  { code: "MG-10", socialName: "闲门少客", recommendedSubLabel: "比肩 · 同行灵相", keywords: ["寡交", "自守", "慢近"], oneLiner: "人少一点，心反而有地方安放。" },
  { code: "MG-11", socialName: "潜局引潮", recommendedSubLabel: "偏印 · 观局灵相", keywords: ["观局", "引势", "藏锋"], oneLiner: "局势还未成形，你已看见潮水将往哪里去。" },
  { code: "MG-12", socialName: "静水封澜", recommendedSubLabel: "正印 · 护持灵相", keywords: ["敛情", "定心", "守澜"], oneLiner: "水面看似平静，心里早已把波澜收好。" },
  { code: "MG-13", socialName: "毫末见真", recommendedSubLabel: "正官 · 察微灵相", keywords: ["见微", "校准", "审细"], oneLiner: "微小的偏差，往往最先透露真相。" },
  { code: "MG-14", socialName: "无声成事", recommendedSubLabel: "正官 · 执律灵相", keywords: ["克己", "成事", "无哗"], oneLiner: "不声张也能成事，安静本身就是力量。" },
  { code: "MG-15", socialName: "持仪成章", recommendedSubLabel: "正官 · 执礼灵相", keywords: ["仪度", "体面", "收束"], oneLiner: "衣冠整肃不是拘谨，是你对场面的尊重。" },
  { code: "MG-16", socialName: "铁口藏春", recommendedSubLabel: "劫财 · 夺锋灵相", keywords: ["嘴硬", "藏柔", "护短"], oneLiner: "话可以冷一点，护着的人始终在心上。" },
  { code: "MG-17", socialName: "心弦自扣", recommendedSubLabel: "偏印 · 观星灵相", keywords: ["自省", "内耗", "审心"], oneLiner: "心里那根弦，常在无人处轻轻响起。" },
  { code: "MG-18", socialName: "风起先知", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["嗅机", "趋势", "先觉"], oneLiner: "风还没有起，你已经听见远处的方向。" },
  { code: "MG-19", socialName: "明镜择真", recommendedSubLabel: "正官 · 执律灵相", keywords: ["审美", "甄别", "择真"], oneLiner: "镜子照见细节，也照见你不肯妥协的标准。" },
  { code: "MG-20", socialName: "整衣自持", recommendedSubLabel: "正印 · 执礼灵相", keywords: ["自持", "续力", "持身"], oneLiner: "把自己收拾妥当，才能稳稳走完长路。" },
  { code: "MG-21", socialName: "识金辨璞", recommendedSubLabel: "正财 · 守藏灵相", keywords: ["辨材", "识值", "守财"], oneLiner: "石中有玉，先要有一双识材的眼睛。" },
  { code: "MG-22", socialName: "玄衡照物", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["衡量", "察物", "断值"], oneLiner: "众人先问其价，你先辨它究竟值什么。" },
  { code: "MG-23", socialName: "守拙观势", recommendedSubLabel: "偏印 · 观局灵相", keywords: ["藏巧", "观势", "不争"], oneLiner: "藏住一点巧，不争也能看清全局。" },
  { code: "MG-24", socialName: "乘时而发", recommendedSubLabel: "食神 · 造物灵相", keywords: ["伺机", "显能", "应时"], oneLiner: "时机一到便出手，迟疑从不替你保留机会。" },
  { code: "MG-25", socialName: "执简驭繁", recommendedSubLabel: "正官 · 执律灵相", keywords: ["化繁", "归整", "有序"], oneLiner: "事情越复杂，越要把它还原成几件简单的事。" },
  { code: "MG-26", socialName: "玉尺量心", recommendedSubLabel: "正财 · 守藏灵相", keywords: ["分寸", "审度", "衡心"], oneLiner: "尺在手中，分寸便有了清楚的边界。" },
  { code: "MG-27", socialName: "拂尘见性", recommendedSubLabel: "偏印 · 观星灵相", keywords: ["澄念", "去妄", "返真"], oneLiner: "拂去心上尘埃，才能看见真正的自己。" },
  { code: "MG-28", socialName: "以退为进", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["收势", "留路", "反制"], oneLiner: "退一步不是认输，是给下一步留下回旋。" },
  { code: "MG-29", socialName: "见隙投针", recommendedSubLabel: "伤官 · 破局灵相", keywords: ["抓点", "破题", "入缝"], oneLiner: "缝隙虽小，也足够让你把难题拆开。" },
  { code: "MG-30", socialName: "霜刃藏芒", recommendedSubLabel: "劫财 · 夺锋灵相", keywords: ["藏锋", "警觉", "护界"], oneLiner: "锋刃藏在霜下，边界从来不靠喧哗维护。" },
  { code: "MG-31", socialName: "听雪辨音", recommendedSubLabel: "正印 · 藏书灵相", keywords: ["静听", "察意", "辨微"], oneLiner: "雪落无声，你却听见话语里未说完的部分。" },
  { code: "MG-32", socialName: "隔岸观潮", recommendedSubLabel: "偏印 · 观局灵相", keywords: ["旁观", "审势", "不躁"], oneLiner: "站在岸边看潮，不急着被浪带走。" },
  { code: "MG-33", socialName: "乘雾寻踪", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["探机", "寻路", "追势"], oneLiner: "雾里有踪迹，耐心会替你把方向找出来。" },
  { code: "MG-34", socialName: "入局知止", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["果断", "节制", "知止"], oneLiner: "入局之前先知止，真正的果断懂得收手。" },
  { code: "MG-35", socialName: "轻舟渡势", recommendedSubLabel: "食神 · 造物灵相", keywords: ["变通", "借势", "过关"], oneLiner: "水路怎样变，你总能找到一条渡过去的路。" },
  { code: "MG-36", socialName: "缄言守意", recommendedSubLabel: "正印 · 护持灵相", keywords: ["少言", "藏意", "守心"], oneLiner: "少说一句，是把真正重要的意思留在心里。" },
  { code: "MG-37", socialName: "澄怀照影", recommendedSubLabel: "正印 · 护持灵相", keywords: ["澄心", "自照", "守静"], oneLiner: "心澄以后，影子也会变得清楚。" },
  { code: "MG-38", socialName: "照夜提灯", recommendedSubLabel: "食神 · 守光灵相", keywords: ["引路", "微光", "照夜"], oneLiner: "一盏小灯不喧哗，却能替许多人照夜。" },
  { code: "MG-39", socialName: "剖石见玉", recommendedSubLabel: "正财 · 守藏灵相", keywords: ["去伪", "识珍", "定价"], oneLiner: "剖开表面之后，真正的珍贵才会显形。" },
  { code: "MG-40", socialName: "扪心校准", recommendedSubLabel: "正官 · 察微灵相", keywords: ["校准", "自检", "归正"], oneLiner: "每一次回看，都是把自己重新校准一遍。" },
  { code: "MG-41", socialName: "冷月试锋", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["冷断", "试锋", "防险"], oneLiner: "冷月照刃，先试锋芒，也先看清风险。" },
  { code: "MG-42", socialName: "执炬候门", recommendedSubLabel: "食神 · 守光灵相", keywords: ["候机", "明察", "守门"], oneLiner: "提灯候门的人，最懂机会何时值得打开。" },
  { code: "MG-43", socialName: "望气知时", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["观变", "知时", "预感"], oneLiner: "气息稍有变化，你便知道时辰正在转向。" },
  { code: "MG-44", socialName: "静处观变", recommendedSubLabel: "偏印 · 观局灵相", keywords: ["观变", "藏思", "慎动"], oneLiner: "安静不是停滞，是在观察变化如何发生。" },
  { code: "MG-45", socialName: "抱素守真", recommendedSubLabel: "正印 · 护持灵相", keywords: ["抱朴", "守真", "内守"], oneLiner: "守住朴素与真，外界的喧闹便难以动摇你。" },
  { code: "MG-46", socialName: "掩锋养锐", recommendedSubLabel: "劫财 · 夺锋灵相", keywords: ["养锐", "藏锋", "待争"], oneLiner: "把锋芒养在沉默里，等真正需要的时刻。" },
  { code: "MG-47", socialName: "探囊识珠", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["识珠", "淘珍", "取精"], oneLiner: "囊中一点微光，也能让你认出真正的珍珠。" },
  { code: "MG-48", socialName: "看潮定向", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["识向", "观潮", "定策"], oneLiner: "潮水改变方向之前，你已经把船头调好。" },
  { code: "MG-49", socialName: "留白成境", recommendedSubLabel: "食神 · 造物灵相", keywords: ["留白", "节制", "造境"], oneLiner: "留白不是空缺，是让万物各自抵达。" },
  { code: "MG-50", socialName: "识微断续", recommendedSubLabel: "正官 · 察微灵相", keywords: ["识微", "补漏", "断续"], oneLiner: "细微的断续，常常暴露一条未补的缝。" },
  { code: "MG-51", socialName: "定弦听音", recommendedSubLabel: "偏印 · 观星灵相", keywords: ["调频", "听音", "定神"], oneLiner: "先调好心弦，再去分辨外界的声音。" },
  { code: "MG-52", socialName: "执灯入局", recommendedSubLabel: "伤官 · 破局灵相", keywords: ["入局", "试探", "照明"], oneLiner: "举灯入局，既是照路，也是试探深浅。" },
  { code: "MG-53", socialName: "裁云作帛", recommendedSubLabel: "食神 · 造物灵相", keywords: ["巧思", "编织", "成景"], oneLiner: "云可裁成衣，巧思总能把无形织成景。" },
  { code: "MG-54", socialName: "逆风整冠", recommendedSubLabel: "正官 · 执礼灵相", keywords: ["逆境", "持仪", "不乱"], oneLiner: "风再急，也要把衣冠重新整好。" },
  { code: "MG-55", socialName: "量海知深", recommendedSubLabel: "正财 · 守藏灵相", keywords: ["量度", "深浅", "审势"], oneLiner: "海有多深，要先量过脚下的潮。" },
  { code: "MG-56", socialName: "持秤问路", recommendedSubLabel: "正财 · 守藏灵相", keywords: ["权衡", "取舍", "问路"], oneLiner: "手中的秤不偏，脚下的路才走得稳。" },
  { code: "MG-57", socialName: "藏锋入鞘", recommendedSubLabel: "劫财 · 夺锋灵相", keywords: ["收刃", "克制", "不露"], oneLiner: "刀入鞘中，力量并没有因此消失。" },
  { code: "MG-58", socialName: "巡檐听雨", recommendedSubLabel: "正印 · 藏书灵相", keywords: ["听雨", "守夜", "观心"], oneLiner: "檐下听雨的人，往往最懂夜里的心事。" },
  { code: "MG-59", socialName: "临渊照骨", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["见底", "识险", "鉴真"], oneLiner: "临近深渊仍要照骨，清醒是最好的护身符。" },
  { code: "MG-60", socialName: "破雾开城", recommendedSubLabel: "伤官 · 破局灵相", keywords: ["破障", "开路", "攻坚"], oneLiner: "雾再厚也要开城，路是一步一步打出来的。" },
  { code: "MG-61", socialName: "守阙观星", recommendedSubLabel: "偏印 · 观星灵相", keywords: ["守候", "观天", "长思"], oneLiner: "守着高阙看星，耐心会把漫长变成答案。" },
  { code: "MG-62", socialName: "以简驭众", recommendedSubLabel: "比肩 · 同行灵相", keywords: ["简御", "聚众", "定场"], oneLiner: "把复杂的人事理清，众人便有了同行的路。" },
  { code: "MG-63", socialName: "深林候鹿", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["耐心", "伏机", "等候"], oneLiner: "深林里等鹿，最先抵达的是你的耐心。" },
  { code: "MG-64", socialName: "叩石知音", recommendedSubLabel: "正印 · 藏书灵相", keywords: ["试探", "鉴心", "知音"], oneLiner: "轻叩一声便知回响，也知对方是否同频。" },
  { code: "MG-65", socialName: "立雪候晴", recommendedSubLabel: "正印 · 守光灵相", keywords: ["守候", "忍耐", "晴开"], oneLiner: "雪还未化，你已守到天色放晴。" },
  { code: "MG-66", socialName: "云表留痕", recommendedSubLabel: "伤官 · 破局灵相", keywords: ["表达", "留痕", "出锋"], oneLiner: "云上的痕迹也值得留下，表达总会找到回声。" },
  { code: "MG-67", socialName: "引泉入渠", recommendedSubLabel: "食神 · 造物灵相", keywords: ["引导", "疏通", "落地"], oneLiner: "把泉水引入渠中，想法才真正走到地面。" },
  { code: "MG-68", socialName: "敛羽待鸣", recommendedSubLabel: "食神 · 守光灵相", keywords: ["蓄鸣", "藏翼", "待飞"], oneLiner: "羽翼收起不是退缩，是在等一次真正的鸣响。" },
  { code: "MG-69", socialName: "见火知温", recommendedSubLabel: "正印 · 护持灵相", keywords: ["知暖", "体贴", "缓释"], oneLiner: "见火便知温，不必把体贴说得太满。" },
  { code: "MG-70", socialName: "执钥候门", recommendedSubLabel: "正官 · 执律灵相", keywords: ["守门", "鉴别", "开阖"], oneLiner: "钥匙握在手里，开与不开都要先辨边界。" },
  { code: "MG-71", socialName: "澹墨裁心", recommendedSubLabel: "偏印 · 观星灵相", keywords: ["裁心", "去杂", "定念"], oneLiner: "墨色越淡，心里越能留下清楚的取舍。" },
  { code: "MG-72", socialName: "听潮纳川", recommendedSubLabel: "食神 · 造物灵相", keywords: ["纳新", "听潮", "容流"], oneLiner: "听见潮声之后，你总能容下新的水流。" },
  { code: "MG-73", socialName: "驭风定盘", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["定盘", "驭变", "稳局"], oneLiner: "风再乱也要定盘，先稳住自己再稳住全局。" },
  { code: "MG-74", socialName: "试玉量才", recommendedSubLabel: "正官 · 执律灵相", keywords: ["识才", "衡量", "试真"], oneLiner: "玉要试过才知成色，人也要相处才见真才。" },
  { code: "MG-75", socialName: "山窗夜读", recommendedSubLabel: "正印 · 藏书灵相", keywords: ["读意", "沉潜", "积识"], oneLiner: "山窗一灯，慢读的人总会把见识读深。" },
  { code: "MG-76", socialName: "清灯照壁", recommendedSubLabel: "正印 · 守光灵相", keywords: ["守灯", "自照", "静修"], oneLiner: "清灯照壁，先把自己的影子看清楚。" },
  { code: "MG-77", socialName: "行川避险", recommendedSubLabel: "七杀 · 镇煞灵相", keywords: ["趋避", "绕险", "护航"], oneLiner: "行路不绕开所有风险，只选择值得经过的路。" },
  { code: "MG-78", socialName: "结网待时", recommendedSubLabel: "偏财 · 猎机灵相", keywords: ["布局", "等机", "收网"], oneLiner: "先把网结好，再等那阵真正的风经过。" },
  { code: "MG-79", socialName: "秤影衡心", recommendedSubLabel: "正财 · 守藏灵相", keywords: ["衡心", "取舍", "守界"], oneLiner: "秤影落在心上，取舍便不再只凭一时。" },
  { code: "MG-80", socialName: "雁过留声", recommendedSubLabel: "食神 · 造物灵相", keywords: ["留声", "传意", "有痕"], oneLiner: "雁过留下声息，你也总会把心意留下。" },
  { code: "MG-81", socialName: "守炉待沸", recommendedSubLabel: "正印 · 守光灵相", keywords: ["守火", "候沸", "温养"], oneLiner: "守着炉火候沸，温养本身就是一种坚持。" },
  { code: "MG-82", socialName: "积霜成镜", recommendedSubLabel: "正官 · 察微灵相", keywords: ["砺镜", "自修", "澄明"], oneLiner: "霜落成镜，照见你一路磨出来的清明。" },
  { code: "MG-83", socialName: "拨雾见辰", recommendedSubLabel: "伤官 · 破局灵相", keywords: ["拨雾", "见机", "破迷"], oneLiner: "拨开眼前的雾，辰光就会显出它的方向。" },
  { code: "MG-84", socialName: "静谷鸣泉", recommendedSubLabel: "食神 · 造物灵相", keywords: ["藏响", "回甘", "生发"], oneLiner: "山谷不急着喧响，泉水自会慢慢回甘。" },
] as const;

const byCode = new Map(destinyCardCopy.map((item) => [item.code, item]));

export function getDestinyCardCopy(code: string) {
  const serial = Number(code.replace(/^MG-0*/, ""));
  return byCode.get(`MG-${String(serial).padStart(2, "0")}`);
}
