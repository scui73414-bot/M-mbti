import { Button } from "@/components/Button";
import { TestForm } from "@/components/TestForm";

export default function TestPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-6">
      <Button href="/" variant="secondary" className="min-h-10 px-4">
        返回首页
      </Button>
      <section className="mt-7">
        <p className="text-xs font-bold tracking-[0.24em] text-[#6f8b70]">
          STEP 01
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1f2822]">
          输入你的生辰信息
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#59655d]">
          当前版本会在本地浏览器中进行八字排盘与娱乐化标签匹配，不会上传或保存你的生日信息。
        </p>
      </section>
      <div className="mt-6">
        <TestForm />
      </div>
    </main>
  );
}
