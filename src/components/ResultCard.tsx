import { forwardRef } from "react";
import { LayeredDestinyCard } from "@/components/LayeredDestinyCard";
import { getPersonalityProfileById } from "@/data/personalityProfiles";
import type { DestinyType } from "@/data/types";

type ResultCardProps = {
  type: DestinyType;
  shareText: string;
};

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard({ type, shareText }, ref) {
    const profile = getPersonalityProfileById(type.id);

    return (
      <div className="w-full">
        <LayeredDestinyCard
          keywords={type.keywords}
          priority
          profile={profile}
          ref={ref}
          shareText={shareText}
          type={type}
        />
      </div>
    );
  },
);
