import type { Metadata } from "next";
import { MinggeInsightPanel } from "@/components/MinggeInsightPanel";
import { ResultSharePanel } from "@/components/ResultSharePanel";
import { minggeNames } from "@/data/minggeNames";
import { getDestinyType } from "@/data/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const type = getDestinyType(params.type);
  const social = minggeNames[type.id];
  const displayName = type.socialName;
  const title = `${displayName} · 命格人格卡`;
  const description = `${social?.shareHook ?? type.oneLiner} 生成你的专属命格人格卡。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = getDestinyType(params.type);

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-6xl items-start gap-10 px-5 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(340px,430px)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-16">
      <section className="mx-auto w-full max-w-[430px] lg:sticky lg:top-8">
        <ResultSharePanel type={type} />
      </section>

      <section className="min-w-0">
        <div className="mb-8 border-b border-[var(--line)] pb-5">
          <p className="editorial-eyebrow">Result Archive</p>
          <h1 className="editorial-title mt-3 text-3xl text-[var(--ink)] sm:text-4xl">
            你的命格人物档案
          </h1>
        </div>
        <MinggeInsightPanel type={type} />
      </section>
    </main>
  );
}
