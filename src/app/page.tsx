import { Button } from "@/components/Button";
import { Disclaimer } from "@/components/Disclaimer";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-5 py-8">
      <section className="pt-14 text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg shadow-[#2f4a3c]/10">
          <span className="text-3xl font-black text-[#6f8b70]">命</span>
        </div>
        <p className="text-xs font-bold tracking-[0.28em] text-[#6f8b70]">
          MINGGE PERSONALITY
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#1f2822]">
          测测你的命格人格类型
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#59655d]">
          用本地生辰信息生成你的专属命格人格卡。娱乐测试，不上传生日和出生地，不构成现实建议。
        </p>
        <div className="mt-9 flex flex-col gap-3">
          <Button href="/test">开始测试</Button>
          <Button href="/types" variant="secondary">
            先看看全部标签
          </Button>
          <Button href="/about" variant="secondary">
            了解测试说明
          </Button>
        </div>
      </section>

      <div className="pb-2">
        <Disclaimer />
      </div>
    </main>
  );
}
