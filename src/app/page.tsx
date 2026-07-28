import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/Button";
import { LayeredDestinyCard } from "@/components/LayeredDestinyCard";
import { getPersonalityProfileById } from "@/data/personalityProfiles";
import { getDestinyType } from "@/data/types";

export default function Home() {
  const previewType = getDestinyType("silent-appraiser");
  const previewProfile = getPersonalityProfileById(previewType.id);

  return (
    <main className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-12 sm:px-6 sm:py-16 lg:min-h-[calc(100dvh-15rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(330px,0.72fr)] lg:gap-16 lg:px-8 lg:py-20">
      <section className="max-w-2xl">
        <BrandLogo size="lg" />

        <div className="mt-12 flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--ink)]" aria-hidden="true" />
          <p className="editorial-eyebrow">东方命格人格图鉴</p>
        </div>

        <h1 className="editorial-title mt-6 text-[clamp(2.75rem,5.6vw,4.15rem)] leading-[1.06] text-[var(--ink)]">
          从生辰结构里，
          <br />
          看见你的命格人格。
        </h1>

        <p className="mt-7 max-w-xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
          以日主、十神与五行结构，生成一张属于你的东方命格人物卡。
          不是吉凶断语，而是一种更有故事感的自我观察。
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--line)] py-4 text-xs font-medium tracking-[0.04em] text-[var(--muted)] sm:text-sm">
          {["本地计算", "不上传生日和出生地", "仅供娱乐与自我观察"].map(
            (item, index) => (
              <span className="inline-flex items-center gap-4" key={item}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="size-1 rotate-45 border border-[var(--line-strong)]"
                  />
                )}
                {item}
              </span>
            ),
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/test" className="min-h-14 sm:min-w-40">
            开始测试
          </Button>
          <Button
            href="/types"
            variant="secondary"
            className="min-h-14 sm:min-w-44"
          >
            浏览命格图鉴
          </Button>
        </div>

        <Link
          className="mt-6 inline-flex min-h-11 items-center border-b border-transparent text-sm font-semibold text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          href="/about"
        >
          测试依据与隐私说明&nbsp;→
        </Link>
      </section>

      <aside
        aria-label="命格人格卡预览"
        className="relative mx-auto w-full max-w-[390px] pb-5 pr-3 sm:pr-5 lg:mx-0 lg:ml-auto"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-7 bottom-0 top-8 translate-x-3 border border-[var(--line-strong)] bg-[var(--surface)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-3 top-4 -translate-x-2 border border-[var(--line)] bg-[var(--surface-pure)]"
        />
        <div className="relative">
          <LayeredDestinyCard
            profile={previewProfile}
            shareText={previewType.oneLiner}
            type={previewType}
          />
        </div>
        <div className="relative mt-5 flex items-center justify-between gap-4 text-[10px] font-bold tracking-[0.2em] text-[var(--muted)]">
          <span>ARCHIVE PREVIEW</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
          <span>01 / 84</span>
        </div>
      </aside>
    </main>
  );
}
