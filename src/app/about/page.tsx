import { Section } from "@/components/Section";

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
      <section className="border-b border-[var(--line)] pb-8">
        <p className="editorial-eyebrow">About The Archive</p>
        <h1 className="editorial-title mt-4 text-3xl text-[var(--ink)] sm:text-4xl">
          关于命格人格测试
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--ink-soft)]">
          这是一个参考 MBTI / SBTI 传播形式的娱乐化人格标签测试，用出生信息生成一个更适合分享和自我观察的命格标签。
        </p>
      </section>

      <div className="mt-10">
        <Section title="隐私说明">
          当前版本所有计算都在浏览器本地完成，不接数据库、不登录、不上传；浏览器只保留最近一次结果页展示所需的排盘摘要和哈希指纹，不保存明文生日信息。
        </Section>

        <Section title="结果说明">
          当前版本已接入本地八字排盘，并以四柱、日主、天干及藏干十神、五行偏性、十神组合结构和神煞显著度做娱乐化标签匹配。
          命格主名只使用真实排盘中满足门槛的神煞与十神结构；每个神煞结果会保留命中柱位与查法依据，但不单独作为吉凶断语。
        </Section>

        <Section title="规则口径">
          神煞在不同典籍与流派中并没有唯一总表。本产品采用版本化规则库，当前只纳入可由本命四柱直接复算、
          不依赖性别或大运的项目；新增或调整规则时会升级版本，避免把不同口径混在一起。
        </Section>

        <Section title="图片资产">
          结果卡统一使用一套外壳：木、火、土、金、水只控制低饱和视觉主题，
          十神灵相负责人物身份与道具。当前 84 张旧成品卡作为迁移素材保留；
          它们不会作为新卡面的默认人物图展示。后续接入东方志怪风的无文字人物 PNG 后，
          只需替换人物资产，不需要重做命格名称与卡面信息。
        </Section>

        <Section title="更多说明">
          查看{" "}
          <a
            className="font-bold text-[var(--ink)] underline decoration-[var(--line-strong)] underline-offset-4 hover:decoration-[var(--ink)]"
            href="/privacy"
          >
            隐私说明
          </a>
          。
        </Section>
      </div>
    </main>
  );
}
