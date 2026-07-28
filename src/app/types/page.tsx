import { TypesExplorer } from "@/components/TypesExplorer";
import { assertValidDestinyTypes } from "@/lib/validateTypes";

export default function TypesPage() {
  const validation = assertValidDestinyTypes();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <section className="grid gap-5 border-b border-[var(--line)] pb-8 md:grid-cols-[minmax(0,0.7fr)_minmax(320px,1fr)] md:items-end">
        <div>
          <p className="editorial-eyebrow">Type Archive</p>
          <h1 className="editorial-title mt-4 text-3xl text-[var(--ink)] sm:text-4xl">
            命格标签图鉴
          </h1>
        </div>
        <p className="text-[15px] leading-7 text-[var(--ink-soft)]">
          这些标签会综合日主、天干与藏干十神、十神结构、五行偏性、能量模式和突出神煞进行匹配，
          当前共有 {validation.total} 张命格人格卡。卡面主标签采用便于识别和分享的传播名，
          命理结构、神煞和排盘依据会在完成真实排盘后的结果详情中展示。
        </p>
      </section>

      <TypesExplorer />
    </main>
  );
}
