import { forwardRef } from "react";
import { CardImage } from "@/components/CardImage";
import { getPersonalityProfileById } from "@/data/personalityProfiles";
import type { DestinyType } from "@/data/types";

type ResultCardProps = {
  type: DestinyType;
};

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard({ type }, ref) {
    const profile = getPersonalityProfileById(type.id);

    if (profile?.assetType === "full-card-with-baked-text") {
      return (
        <div className="w-full overflow-hidden rounded-[2rem] border border-[#e5eee2] bg-white p-3 shadow-sm shadow-[#2f4a3c]/8">
          <div
            ref={ref}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.65rem] border border-[#eadfca] bg-[#fffdf8]"
          >
            <CardImage priority profile={profile} type={type} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full overflow-hidden rounded-[2rem] border border-[#e5eee2] bg-white p-3 shadow-sm shadow-[#2f4a3c]/8">
        <div
          ref={ref}
          className="aspect-[3/4] w-full overflow-hidden rounded-[1.65rem] border border-[#eadfca] bg-[#fffdf8] p-5 text-center"
        >
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.2rem] border border-[#efe2bd]/80 bg-white/70 px-5 py-6 shadow-inner shadow-[#d8c99d]/10">
            <div className="pointer-events-none absolute inset-3 rounded-[1rem] border border-[#d8c99d]/45" />
            <header className="relative z-10">
              <p
                className="text-[2.25rem] font-black leading-none tracking-[0.12em]"
                style={{ color: type.color.accent }}
              >
                {profile?.nameEn ?? type.nameEn}
              </p>
              <h1 className="mt-3 text-[2.55rem] font-black leading-none tracking-tight text-[#1f2822]">
                {profile?.nameZh ?? type.nameCn}
              </h1>
              <p className="mt-3 text-[11px] font-black tracking-[0.18em] text-[#8d8060]">
                {type.code} · {type.typeCode}
              </p>
            </header>

            <div className="relative z-0 mx-auto my-3 h-[48%] w-[92%] overflow-hidden rounded-[1.35rem]">
              <CardImage priority profile={profile} type={type} />
            </div>

            <section className="relative z-10 flex justify-center gap-2">
              {(profile?.keywords ?? type.keywords.slice(0, 3)).map((keyword) => (
                <span
                  className="rounded-full border border-[#dccb9d] bg-white/85 px-3 py-1.5 text-[11px] font-black text-[#554c3b] shadow-sm shadow-[#d8c99d]/15"
                  key={keyword}
                >
                  {keyword}
                </span>
              ))}
            </section>

            <footer className="relative z-10 mt-3 rounded-[1.1rem] border border-[#eadfca] bg-white/80 px-4 py-4 text-left">
              <p className="text-sm font-bold leading-6 text-[#4d574f]">
                {profile?.tagline ?? type.oneLiner}
              </p>
              <p className="mt-4 text-[11px] font-black tracking-[0.14em] text-[#79867e]">
                DESTINY CARD · {profile?.reviewStatus === "pending-review" ? "PENDING REVIEW" : "REVIEWED"}
              </p>
            </footer>
          </div>
        </div>
      </div>
    );
  },
);
