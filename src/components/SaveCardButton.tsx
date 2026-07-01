"use client";

import { Button } from "@/components/Button";

type SaveCardButtonProps = {
  isSaving: boolean;
  onSave: () => void;
};

export function SaveCardButton({ isSaving, onSave }: SaveCardButtonProps) {
  return (
    <Button disabled={isSaving} onClick={onSave} type="button">
      {isSaving ? "正在生成图片..." : "保存我的命格卡"}
    </Button>
  );
}
