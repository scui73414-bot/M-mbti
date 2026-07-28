"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ResultCard } from "@/components/ResultCard";
import { SaveCardButton } from "@/components/SaveCardButton";
import type { DestinyType } from "@/data/types";
import { useStoredBaziProfile } from "@/hooks/useStoredBaziProfile";
import { downloadResultCard } from "@/lib/export/downloadResultCard";
import { resolveMinggeIdentity } from "@/lib/matching/minggeIdentity";

type ExportStatus = "idle" | "success" | "error";

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));

  await document.fonts.ready;

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve, reject) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => reject(), { once: true });
        });
      }

      if (image.naturalWidth === 0) {
        throw new Error("Result card image failed to load.");
      }

      if (typeof image.decode === "function") {
        await image.decode();
      }
    }),
  );
}

export function ResultSharePanel({ type }: { type: DestinyType }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<ExportStatus>("idle");
  const { profile, ready } = useStoredBaziProfile(type.id);
  const identity = useMemo(
    () => resolveMinggeIdentity(type, profile),
    [profile, type],
  );
  const canSave = ready && identity.mode === "calculated";
  const disabledReason = !ready
    ? "正在读取本地排盘结果。"
    : identity.mode === "simulation"
      ? "当前为演示结果；请重新完成测试以生成可保存的真实排盘卡。"
      : "当前是标签预览；完成测试并生成真实排盘后才可保存。";

  async function handleSave() {
    if (!cardRef.current || isSaving || !canSave) {
      return;
    }

    setIsSaving(true);
    setStatus("idle");

    try {
      await waitForImages(cardRef.current);
      await downloadResultCard(
        cardRef.current,
        `命格卡-${identity.socialName}-${type.code}.png`,
      );
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-xs font-medium tracking-[0.04em] text-[var(--muted)]">
        {canSave
          ? "卡面已按本地排盘生成，可保存为图片。"
          : "当前卡面用于预览；真实排盘完成后开放图片保存。"}
      </p>
      <ResultCard
        ref={cardRef}
        shareText={type.oneLiner}
        type={type}
      />

      <div className="border-y border-[var(--line)] py-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <SaveCardButton
            describedBy={!canSave ? "save-card-reason" : undefined}
            disabled={!canSave}
            isSaving={isSaving}
            onSave={handleSave}
          />
          <Button href="/test" variant="secondary">
            重新测试
          </Button>
        </div>

        {!canSave && (
          <p
            className="mt-3 text-xs leading-5 text-[var(--muted)]"
            id="save-card-reason"
          >
            {disabledReason}
          </p>
        )}

        {status === "success" && (
          <p
            aria-live="polite"
            className="mt-3 text-xs font-semibold text-[var(--ink-soft)]"
          >
            命格卡已保存
          </p>
        )}
        {status === "error" && (
          <p
            aria-live="polite"
            className="mt-3 text-xs font-semibold text-[var(--ink)]"
          >
            保存失败，请稍后重试
          </p>
        )}

        <Link
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--ink-soft)] underline-offset-4 transition hover:text-[var(--ink)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          href="/types"
        >
          查看全部命格&nbsp;→
        </Link>
      </div>
    </div>
  );
}
