import type { DestinyType } from "@/data/types";

export type CharacterFrameConfig = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const defaultCharacterFrameConfig: CharacterFrameConfig = {
  // After the 7%/8% asset safety margins, 1.08 renders MG-01 at
  // approximately 105% of its former visible height.
  scale: 1.08,
  offsetX: 0,
  offsetY: 0,
};

/**
 * Optional per-character optical corrections.
 *
 * The PNG assets are already normalized around their visible alpha bounds.
 * Keep overrides sparse and small so TypeCard, ResultCard, and exported cards
 * continue to share one predictable framing system.
 */
export const characterFrameOverrides: Partial<
  Record<string, Partial<CharacterFrameConfig>>
> = {};

export function getCharacterFrameConfig(
  type: Pick<DestinyType, "code">,
): CharacterFrameConfig {
  return {
    ...defaultCharacterFrameConfig,
    ...characterFrameOverrides[type.code],
  };
}
