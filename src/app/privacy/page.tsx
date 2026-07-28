import type { Metadata } from "next";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "隐私说明",
  description:
    "命格人格测试的隐私说明：输入只用于本地计算，明文生日与出生地不会上传或写入结果档案。",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
      <section className="border-b border-[var(--line)] pb-8">
        <p className="editorial-eyebrow">Privacy Archive</p>
        <h1 className="editorial-title mt-4 text-3xl text-[var(--ink)] sm:text-4xl">
          隐私说明
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[var(--ink-soft)]">
          我们尽量让这个测试保持轻量和本地化，不收集不必要的个人信息。
        </p>
      </section>

      <div className="mt-10">
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
      </div>
    </main>
  );
}
