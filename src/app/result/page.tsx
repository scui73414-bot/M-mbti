import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { BaziSourcePanel } from "@/components/BaziSourcePanel";
import { Disclaimer } from "@/components/Disclaimer";
import { ResultSharePanel } from "@/components/ResultSharePanel";
import { Section } from "@/components/Section";
import { getDestinyType } from "@/data/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const type = getDestinyType(params.type);
  const title = `${type.nameCn} / ${type.nameEn}`;
  const description = `${type.oneLiner} 生成你的专属命格人格卡。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: type.cardImage,
          width: 1080,
          height: 1440,
          alt: `${type.nameCn} 命格人格卡`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [type.cardImage],
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
    <main className="mx-auto min-h-dvh max-w-md space-y-5 px-5 py-6">
      <ResultSharePanel type={type} />

      <BaziSourcePanel type={type} />

      <Section title="人格介绍">
        <div className="space-y-3">
          {type.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title="你的优势">
        <div className="flex flex-wrap gap-2">
          {type.strengths.map((item) => (
            <span
              className="rounded-full bg-[#eef4eb] px-3 py-1 text-xs font-semibold text-[#455449]"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </Section>

      <Section title="你的 bug">
        <ul className="space-y-2">
          {type.bugs.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-3">
        <Button href="/" variant="secondary">
          返回首页
        </Button>
      </div>

      <div className="pb-2">
        <Disclaimer />
      </div>
    </main>
  );
}
