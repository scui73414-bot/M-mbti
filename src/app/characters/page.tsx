import { LayeredDestinyCard } from "@/components/LayeredDestinyCard";
import { getReviewedPersonalityProfiles } from "@/data/personalityProfiles";
import { destinyTypes } from "@/data/types";

export default function CharactersPage() {
  const profiles = getReviewedPersonalityProfiles();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <section className="grid gap-5 border-b border-[var(--line)] pb-8 md:grid-cols-[minmax(0,0.7fr)_minmax(320px,1fr)] md:items-end">
        <div>
          <p className="editorial-eyebrow">Character Archive</p>
          <h1 className="editorial-title mt-4 text-3xl text-[var(--ink)] sm:text-4xl">
          命格人格卡展示
          </h1>
        </div>
        <p className="text-[15px] leading-7 text-[var(--ink-soft)]">
          这里展示已接入统一外壳的 84 张命格人格卡。卡面只保留传播名与十神灵相，
          命理结构和排盘证据统一放在结果详情中。
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
              className="transition duration-200 hover:-translate-y-0.5"
              key={profile.id}
            >
              <LayeredDestinyCard
                profile={profile}
                shareText={type.oneLiner}
                type={type}
                variant="thumb"
              />
            </article>
          );
        })}
      </section>
    </main>
  );
}
