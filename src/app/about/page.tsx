import { Button } from "@/components/Button";
import { Disclaimer } from "@/components/Disclaimer";
import { Section } from "@/components/Section";

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md space-y-5 px-5 py-6">
      <Button href="/" variant="secondary" className="min-h-10 px-4">
        返回首页
      </Button>

      <section className="pt-4">
        <p className="text-xs font-bold tracking-[0.24em] text-[#6f8b70]">
          ABOUT
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1f2822]">
          关于命格人格测试
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#59655d]">
          这是一个参考 MBTI / SBTI 传播形式的娱乐化人格标签测试，用出生信息生成一个更适合分享和自我观察的命格标签。
        </p>
      </section>

      <Section title="隐私说明">
        当前版本所有计算都在浏览器本地完成，不接数据库、不登录、不上传；浏览器只保留最近一次结果页展示所需的排盘摘要和哈希指纹，不保存明文生日信息。
      </Section>

      <Section title="结果说明">
        当前版本已接入本地八字排盘库，并用日主、十神、五行偏性、能量模式做娱乐化标签匹配。它适合做人格测试式分享，不代表传统命理断语，也不构成现实决策建议。
      </Section>

      <Section title="后续计划">
        后续可以继续优化真太阳时口径、闰月输入和标签权重。当前 84 张命格人格卡已经接入正式图片资产。
      </Section>

      <Section title="图片资产">
        角色主视觉位于 public/characters/destiny-card/cards。图片为完整成品卡，前端不会重复叠加标题、关键词或底部文案。
      </Section>

      <Section title="更多说明">
        查看 <a className="font-bold text-[#2f4a3c]" href="/privacy">隐私说明</a>。
      </Section>

      <Disclaimer />
    </main>
  );
}
