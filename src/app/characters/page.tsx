import { Button } from "@/components/Button";
import { CardImage } from "@/components/CardImage";
import { getReviewedPersonalityProfiles } from "@/data/personalityProfiles";
import { destinyTypes } from "@/data/types";

export default function CharactersPage() {
  const profiles = getReviewedPersonalityProfiles();

  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-5 py-6">
      <div className="mx-auto max-w-md sm:max-w-none">
        <Button href="/" variant="secondary" className="min-h-10 px-4">
          返回首页
        </Button>
      </div>

      <section className="mx-auto mt-7 max-w-md text-left sm:max-w-2xl sm:text-center">
        <p className="text-xs font-bold tracking-[0.24em] text-[#6f8b70]">
          CHARACTER CARDS
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1f2822]">
          命格人格卡展示
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#59655d]">
          这里展示已接入的 84 张完整命格人格卡。每张图都包含标题、关键词和底部文案，前端直接展示成品卡。
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {profiles.map((profile) => {
          const type = destinyTypes.find((item) => item.id === profile.id);

          if (!type) {
            return null;
          }

          return (
          <article
            className="overflow-hidden rounded-[2rem] border border-[#e6eee3] bg-white p-3 shadow-sm shadow-[#38463b]/5"
            key={profile.id}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[#fbfdfb]">
              <CardImage profile={profile} type={type} />
            </div>
            <div className="px-2 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6f8b70]">
                {profile.imageReview.status}
              </p>
              <h2 className="mt-2 text-xl font-black text-[#1f2822]">
                {profile.nameZh}
              </h2>
              <p className="mt-1 text-sm font-black tracking-[0.12em] text-[#7b887f]">
                {profile.nameEn}
              </p>
              <p className="mt-2 break-all text-xs leading-5 text-[#65736d]">
                {profile.imagePath}
              </p>
            </div>
          </article>
          );
        })}
      </section>
    </main>
  );
}
