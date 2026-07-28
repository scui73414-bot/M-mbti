import Link from "next/link";
import { LayeredDestinyCard } from "@/components/LayeredDestinyCard";
import { getPersonalityProfileById } from "@/data/personalityProfiles";
import type { DestinyType } from "@/data/types";

export function TypeCard({ type }: { type: DestinyType }) {
  const profile = getPersonalityProfileById(type.id);

  return (
    <Link
      aria-label={`查看“${type.socialName}”标签详情`}
      className="block rounded-xl transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] motion-reduce:transform-none"
      href={`/result?type=${type.id}`}
    >
      <div>
        <LayeredDestinyCard
          priority={type.code === "MG-01"}
          profile={profile}
          shareText={type.oneLiner}
          type={type}
          variant="thumb"
        />
      </div>
    </Link>
  );
}
