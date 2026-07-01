import Image from "next/image";
import { getPersonalityProfileById, type PersonalityProfile } from "@/data/personalityProfiles";
import type { DestinyType } from "@/data/types";

type CardImageProps = {
  type: DestinyType;
  profile?: PersonalityProfile;
  priority?: boolean;
  variant?: "full" | "thumb";
};

function PendingCardArt({ profile }: { profile: PersonalityProfile }) {
  const [primary, secondary, accent] = profile.palette;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit] border border-[#eadfca] bg-[#fbfaf5]"
      style={{
        background:
          `radial-gradient(circle at 50% 44%, ${secondary ?? "#efe8d6"} 0, transparent 38%), ` +
          `linear-gradient(145deg, #fffdf7 0%, ${primary ?? "#f0ead8"} 100%)`,
      }}
    >
      <div className="absolute inset-4 rounded-[1.4rem] border border-[#d9c99b]/70" />
      <div className="absolute left-1/2 top-[9%] h-[12%] w-[68%] -translate-x-1/2 rounded-2xl border border-[#e4d7b4]/70 bg-white/45" />
      <div className="absolute bottom-[12%] left-1/2 h-[12%] w-[76%] -translate-x-1/2 rounded-2xl border border-[#e4d7b4]/70 bg-white/55" />
      <div className="absolute bottom-[27%] left-1/2 flex w-[62%] -translate-x-1/2 justify-center gap-2">
        {profile.keywords.map((keyword) => (
          <span
            aria-hidden="true"
            className="h-6 w-14 rounded-full border border-[#d8c796]/70 bg-white/50"
            key={keyword}
          />
        ))}
      </div>
      <div className="relative mt-4 flex h-[42%] w-[48%] flex-col items-center justify-end">
        <div
          className="h-[42%] w-[62%] rounded-[45%_45%_38%_38%] border border-[#d9c99b]/60 shadow-sm"
          style={{ backgroundColor: secondary ?? "#d8dccd" }}
        />
        <div
          className="mt-[-4%] h-[44%] w-[78%] rounded-[35%_35%_24%_24%] border border-[#d9c99b]/60 shadow-sm"
          style={{ backgroundColor: primary ?? "#9ca88f" }}
        />
        <div
          className="absolute right-[8%] top-[46%] h-7 w-7 rounded-full border border-[#d9c99b]/60"
          style={{ backgroundColor: accent ?? "#d2b36b" }}
        />
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-[#d9c99b]/80 bg-white/75 px-2 py-1 text-[10px] font-black tracking-[0.12em] text-[#8b7b52]">
        pending-image
      </div>
    </div>
  );
}

export function CardImage({
  type,
  profile = getPersonalityProfileById(type.id),
  priority = false,
  variant = "full",
}: CardImageProps) {
  if (!profile) {
    return null;
  }

  const imagePath = variant === "thumb" ? profile.thumbnailPath : profile.imagePath;

  if (!imagePath || profile.imageReview.status !== "image-ready") {
    return <PendingCardArt profile={profile} />;
  }

  return (
    <Image
      alt={`${type.nameCn} 人格角色图`}
      className="object-contain"
      fill
      priority={priority}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      src={imagePath}
    />
  );
}
