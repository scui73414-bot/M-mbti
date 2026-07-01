import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Disclaimer } from "@/components/Disclaimer";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "隐私说明",
  description: "命格人格测试的隐私说明：输入信息仅用于本地生成结果，不会被上传或保存。",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md space-y-5 px-5 py-6">
      <Button href="/" variant="secondary" className="min-h-10 px-4">
        返回首页
      </Button>

      <section className="pt-4">
        <p className="text-xs font-bold tracking-[0.24em] text-[#6f8b70]">
          PRIVACY
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1f2822]">隐私说明</h1>
        <p className="mt-3 text-sm leading-6 text-[#59655d]">
          我们尽量让这个测试保持轻量和本地化，不收集不必要的个人信息。
        </p>
      </section>

      <Section title="本地计算">
        输入信息仅用于在你的浏览器本地生成测试结果，不会被上传到服务器，也不会保存到数据库。
      </Section>

      <Section title="本地存储">
        为了让结果页能展示最近一次的排盘摘要，浏览器可能保存最近一次结果所需的非明文摘要和哈希指纹，不保存明文生日信息。
      </Section>

      <Section title="统计与第三方">
        当前版本不接入登录、数据库、支付或第三方统计。如果未来接入统计或后端服务，会在上线前更新本页并明确说明用途。
      </Section>

      <Section title="免责声明">
        本测试仅供娱乐与自我观察，不构成心理、医学、法律、投资或人生决策建议。
      </Section>

      <Disclaimer />
    </main>
  );
}
