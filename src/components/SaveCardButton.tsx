"use client";

import { Button } from "@/components/Button";

type SaveCardButtonProps = {
  isSaving: boolean;
  onSave: () => void;
  disabled?: boolean;
  describedBy?: string;
};

export function SaveCardButton({
  isSaving,
  onSave,
  disabled = false,
  describedBy,
}: SaveCardButtonProps) {
  return (
    <Button
      aria-describedby={describedBy}
      disabled={isSaving || disabled}
      onClick={onSave}
      type="button"
    >
      {isSaving ? "正在生成图片…" : "保存命格卡"}
    </Button>
  );
}
