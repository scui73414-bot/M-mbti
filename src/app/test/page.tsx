import { TestForm } from "@/components/TestForm";

export default function TestPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 py-10 sm:px-6 sm:py-14 lg:py-16">
      <section className="border-b border-[var(--line)] pb-7">
        <div className="flex items-center justify-between gap-4">
          <p className="editorial-eyebrow">Test Archive</p>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--muted)]">
            STEP 01 / 01
          </p>
        </div>
        <h1 className="editorial-title mt-4 text-3xl text-[var(--ink)] sm:text-4xl">
          输入你的生辰信息
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--ink-soft)]">
          当前版本会在浏览器本地完成八字排盘与娱乐化标签匹配，不上传明文生日或出生地；
          结果页仅在本地保留四柱与结构化摘要。
        </p>
      </section>
      <div className="mt-8">
        <TestForm />
      </div>
    </main>
  );
}
