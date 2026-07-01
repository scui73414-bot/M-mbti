import { Button } from "@/components/Button";
import { TypesExplorer } from "@/components/TypesExplorer";

export default function TypesPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-5 py-6">
      <div className="mx-auto max-w-md sm:max-w-none">
        <Button href="/" variant="secondary" className="min-h-10 px-4">
          返回首页
        </Button>
      </div>
      <section className="mx-auto mt-7 max-w-md text-left sm:max-w-2xl sm:text-center">
        <p className="text-xs font-bold tracking-[0.24em] text-[#6f8b70]">
          TYPE LIBRARY
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1f2822]">命格标签图鉴</h1>
        <p className="mt-3 text-sm leading-6 text-[#59655d]">
          这些标签由日主、十神、五行偏性和能量模式组合匹配，当前共有 84 张命格人格卡。
        </p>
      </section>

      <TypesExplorer />
    </main>
  );
}
