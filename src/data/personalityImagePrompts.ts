import { personalityProfiles } from "@/data/personalityProfiles";

export type PersonalityImagePrompt = {
  id: string;
  nameZh: string;
  nameEn: string;
  imagePrompt: string;
  imagePath: string;
  thumbnailPath: string;
  shareImagePath: string;
  status: "pending-image" | "generated";
};

export const personalityImagePrompts: PersonalityImagePrompt[] = personalityProfiles.map((profile) => ({
  id: profile.id,
  nameZh: profile.nameZh,
  nameEn: profile.nameEn,
  imagePrompt: profile.imagePrompt,
  imagePath: profile.imagePath,
  thumbnailPath: profile.thumbnailPath,
  shareImagePath: profile.shareImagePath,
  status: profile.imageReview.status === "image-ready" ? "generated" : "pending-image",
}));
