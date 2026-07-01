import Link from "next/link";
import { CardImage } from "@/components/CardImage";
import { getPersonalityProfileById } from "@/data/personalityProfiles";
import type { DestinyType } from "@/data/types";

const familyStyles = {
  treasure: "text-[#8a8358]",
  spark: "text-[#8c9b70]",
  quality: "text-[#78918b]",
  elegant: "text-[#7f9295]",
  frostfire: "text-[#768392]",
};

export function TypeCard({ type }: { type: DestinyType }) {
  const profile = getPersonalityProfileById(type.id);

  return (
    <Link
      className="block overflow-hidden rounded-[2rem] border border-[#e6eee3] bg-white shadow-sm shadow-[#38463b]/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#38463b]/10"
      href={`/result?type=${type.id}`}
    >
      <div className="aspect-[3/4] bg-white p-3">
        {profile?.assetType === "full-card-with-baked-text" ? (
          <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-[#eadfca] bg-[#fffdf8]">
            <CardImage
              priority={type.id === "quality"}
              profile={profile}
              type={type}
              variant="thumb"
            />
          </div>
        ) : (
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border border-[#eadfca] bg-[#fffdf8] p-4">
            <div className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-[#d8c99d]/45" />
            <div className="relative z-10 text-center">
              <p
                className={`text-xl font-black leading-none tracking-[0.08em] ${familyStyles[type.visualFamily]}`}
              >
                {profile?.nameEn ?? type.nameEn}
              </p>
              <h2 className="mt-2 text-xl font-black leading-none text-[#1f2822]">
                {profile?.nameZh ?? type.nameCn}
              </h2>
              <p className="mt-2 text-[10px] font-black tracking-[0.16em] text-[#8d8060]">
                {type.code} · {type.typeCode}
              </p>
            </div>
            <div className="relative z-0 mx-auto h-[46%] w-[86%] overflow-hidden rounded-[1.15rem]">
              <CardImage
                priority={type.id === "quality"}
                profile={profile}
                type={type}
                variant="thumb"
              />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap justify-center gap-1.5">
                {(profile?.keywords ?? type.keywords.slice(0, 3)).map((keyword) => (
                  <span
                    className="rounded-full border border-[#dccb9d] bg-white/85 px-2.5 py-1 text-[10px] font-black text-[#554c3b]"
                    key={keyword}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="line-clamp-2 rounded-2xl border border-[#eadfca] bg-white/75 px-3 py-2 text-xs font-semibold leading-5 text-[#65736d]">
                {profile?.tagline ?? type.oneLiner}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-[#edf2ea] px-5 py-5">
        <p
          className={`text-3xl font-black leading-none tracking-[0.06em] ${familyStyles[type.visualFamily]}`}
        >
          {type.nameEn}
        </p>
        <h2 className="mt-3 text-2xl font-black text-[#1f2822]">
          {type.nameCn}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#65736d]">
          {profile?.tagline ?? type.oneLiner}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(profile?.keywords ?? type.keywords.slice(0, 3)).map((keyword) => (
            <span
              className="rounded-full border border-[#e1eadf] px-2.5 py-1 text-[11px] font-semibold text-[#65736d]"
              key={keyword}
            >
              {keyword}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs font-black tracking-[0.12em] text-[#7b887f]">
          {type.code} · {type.typeCode} · {type.tone}
        </p>
      </div>
    </Link>
  );
}
