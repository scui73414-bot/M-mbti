import rolePrompts from "@/data/destinyCharacterPrompts.json";
import {
  DESTINY_CHARACTER_MASTER_PROMPT,
  DESTINY_CHARACTER_NEGATIVE_PROMPT,
} from "@/lib/buildCardImagePrompt";
import { personalityProfiles } from "@/data/personalityProfiles";

export {
  DESTINY_CHARACTER_MASTER_PROMPT,
  DESTINY_CHARACTER_NEGATIVE_PROMPT,
};

export type PersonalityImagePrompt = {
  id: string;
  code: string;
  nameZh: string;
  nameEn: string;
  rolePrompt: string;
  imagePrompt: string;
  imagePath: string;
  thumbnailPath: string;
  shareImagePath: string;
  status: "pending-image" | "image-ready";
};

export const personalityImagePrompts: PersonalityImagePrompt[] =
  personalityProfiles.map((profile) => {
    const rolePrompt = rolePrompts.find((item) => {
      const serial = Number(profile.code.replace(/^MG-0*/, ""));
      return item.code === `MG-${String(serial).padStart(2, "0")}`;
    })?.rolePrompt;

    return {
      id: profile.id,
      code: profile.code,
      nameZh: profile.nameZh,
      nameEn: profile.nameEn,
      rolePrompt: rolePrompt ?? "",
      imagePrompt: profile.imagePrompt,
      imagePath: profile.imagePath,
      thumbnailPath: profile.thumbnailPath,
      shareImagePath: profile.shareImagePath,
      status: profile.imageReview.status === "image-ready" ? "image-ready" : "pending-image",
    };
  });
