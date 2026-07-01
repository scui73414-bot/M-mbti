"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ResultCard } from "@/components/ResultCard";
import { SaveCardButton } from "@/components/SaveCardButton";
import type { DestinyType } from "@/data/types";
import { downloadResultCard } from "@/lib/export/downloadResultCard";

type ExportStatus = "idle" | "success" | "error";

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));

  await Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => reject(), { once: true });
      });
    }),
  );
}

export function ResultSharePanel({ type }: { type: DestinyType }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<ExportStatus>("idle");

  async function handleSave() {
    if (!cardRef.current || isSaving) {
      return;
    }

    setIsSaving(true);
    setStatus("idle");

    try {
      await waitForImages(cardRef.current);
      await downloadResultCard(
        cardRef.current,
        `命格卡-${type.nameCn}-${type.code}.png`,
      );
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <p className="text-center text-xs font-medium text-[#718078]">
        长按或点击保存，生成你的专属命格卡。
      </p>
      <ResultCard ref={cardRef} type={type} />

      <div className="grid gap-3 rounded-3xl border border-[#e7efe4] bg-white p-5 shadow-sm shadow-[#38463b]/5">
        <SaveCardButton isSaving={isSaving} onSave={handleSave} />
        <Button href="/types" variant="secondary">
          查看全部标签
        </Button>
        <Button href="/test" variant="secondary">
          重新测试
        </Button>
        {status === "success" && (
          <p className="text-center text-xs font-semibold text-[#58725c]">
            命格卡已保存
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-xs font-semibold text-[#9a4b42]">
            保存失败，请稍后重试
          </p>
        )}
      </div>
    </>
  );
}
