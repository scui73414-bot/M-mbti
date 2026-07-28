#!/usr/bin/env python3
"""Normalize transparent character PNG framing without altering the artwork.

The source illustrations intentionally use different poses and aspect ratios.
This script finds the visible alpha bounds, keeps a proportional safety margin,
and rebuilds each image on a tightly fitted transparent canvas. It never uses
cover-cropping and never removes pixels inside the detected subject bounds.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from PIL import Image
except ImportError as error:
    raise SystemExit(
        "Pillow is required. Install it with `python3 -m pip install Pillow`."
    ) from error


PROJECT_DIR = Path(__file__).resolve().parent.parent
ASSET_DIR = PROJECT_DIR / "public/characters/destiny-card/characters"
MANIFEST_PATHS = (
    PROJECT_DIR / "public/characters/destiny-card/manifest.json",
    PROJECT_DIR / "public/characters/destiny-card/image-generation-manifest.json",
)
PRODUCTION_REPORT_PATH = (
    PROJECT_DIR / "public/characters/destiny-card/production-check-report.json"
)

EXPECTED_IMAGE_COUNT = 84
ALPHA_THRESHOLD = 8
MARGIN_LEFT = 0.07
MARGIN_RIGHT = 0.07
MARGIN_TOP = 0.07
MARGIN_BOTTOM = 0.08


@dataclass(frozen=True)
class FramingResult:
    filename: str
    before_width: int
    before_height: int
    after_width: int
    after_height: int
    subject_left: int
    subject_top: int
    subject_right: int
    subject_bottom: int
    margin_left: int
    margin_top: int
    margin_right: int
    margin_bottom: int
    changed: bool


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--apply",
        action="store_true",
        help="Rewrite PNGs and synchronize manifest dimensions.",
    )
    mode.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if any PNG or manifest still needs normalization.",
    )
    parser.add_argument(
        "--report",
        type=Path,
        help="Optionally write the per-image framing measurements as JSON.",
    )
    return parser.parse_args()


def visible_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    threshold_mask = alpha.point(
        lambda value: 255 if value >= ALPHA_THRESHOLD else 0,
        mode="1",
    )
    bbox = threshold_mask.getbbox()

    if bbox is None:
        raise ValueError("image has no visible pixels")

    return bbox


def proportional_margin(subject_size: int, ratio: float) -> int:
    return max(1, math.ceil(subject_size * ratio))


def normalize_image(
    source_path: Path,
    *,
    apply_changes: bool,
) -> FramingResult:
    with Image.open(source_path) as opened:
        image = opened.convert("RGBA")
        source_info = dict(opened.info)

    left, top, right, bottom = visible_bbox(image)
    subject_width = right - left
    subject_height = bottom - top
    margin_left = proportional_margin(subject_width, MARGIN_LEFT)
    margin_right = proportional_margin(subject_width, MARGIN_RIGHT)
    margin_top = proportional_margin(subject_height, MARGIN_TOP)
    margin_bottom = proportional_margin(subject_height, MARGIN_BOTTOM)
    target_width = subject_width + margin_left + margin_right
    target_height = subject_height + margin_top + margin_bottom
    already_normalized = (
        image.width == target_width
        and image.height == target_height
        and left == margin_left
        and top == margin_top
        and image.width - right == margin_right
        and image.height - bottom == margin_bottom
    )

    if apply_changes and not already_normalized:
        desired_left = left - margin_left
        desired_top = top - margin_top
        desired_right = right + margin_right
        desired_bottom = bottom + margin_bottom
        source_box = (
            max(0, desired_left),
            max(0, desired_top),
            min(image.width, desired_right),
            min(image.height, desired_bottom),
        )
        paste_at = (
            max(0, -desired_left),
            max(0, -desired_top),
        )
        normalized = Image.new(
            "RGBA",
            (target_width, target_height),
            (0, 0, 0, 0),
        )
        normalized.alpha_composite(image.crop(source_box), dest=paste_at)

        temporary_path = source_path.with_suffix(".framing.png")
        save_options: dict[str, Any] = {
            "compress_level": 9,
            "optimize": True,
        }
        if source_info.get("icc_profile"):
            save_options["icc_profile"] = source_info["icc_profile"]
        if source_info.get("dpi"):
            save_options["dpi"] = source_info["dpi"]

        normalized.save(temporary_path, **save_options)
        os.replace(temporary_path, source_path)

    return FramingResult(
        filename=source_path.name,
        before_width=image.width,
        before_height=image.height,
        after_width=target_width,
        after_height=target_height,
        subject_left=left,
        subject_top=top,
        subject_right=right,
        subject_bottom=bottom,
        margin_left=margin_left,
        margin_top=margin_top,
        margin_right=margin_right,
        margin_bottom=margin_bottom,
        changed=not already_normalized,
    )


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    temporary_path = path.with_suffix(f"{path.suffix}.framing")
    temporary_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    os.replace(temporary_path, path)


def dimensions_by_path(
    results: list[FramingResult],
) -> dict[str, tuple[int, int]]:
    return {
        f"/characters/destiny-card/characters/{item.filename}": (
            item.after_width,
            item.after_height,
        )
        for item in results
    }


def synchronize_manifest(
    path: Path,
    dimensions: dict[str, tuple[int, int]],
    *,
    apply_changes: bool,
) -> int:
    payload = load_json(path)
    items = payload if isinstance(payload, list) else payload.get("items", [])
    mismatches = 0

    for item in items:
        image_path = item.get("imagePath") or item.get("path")
        expected = dimensions.get(image_path)

        if expected is None:
            continue

        width, height = expected
        if item.get("width") != width or item.get("height") != height:
            mismatches += 1
            if apply_changes:
                item["width"] = width
                item["height"] = height

    if apply_changes and mismatches:
        write_json(path, payload)

    return mismatches


def update_production_report(
    results: list[FramingResult],
    *,
    apply_changes: bool,
) -> bool:
    payload = load_json(PRODUCTION_REPORT_PATH)
    framing = {
        "normalized": len(results),
        "alphaThreshold": ALPHA_THRESHOLD,
        "safetyMargins": {
            "top": MARGIN_TOP,
            "bottom": MARGIN_BOTTOM,
            "left": MARGIN_LEFT,
            "right": MARGIN_RIGHT,
        },
        "displayScale": 1.08,
    }
    note = (
        "84 张人物图已按有效 alpha 内容边界重建透明画布，"
        "保留 7% 左右与顶部、8% 底部安全边距；"
        "卡面仅对独立人物图统一轻微放大 1.08 倍。"
    )
    existing_notes = payload.get("notes", "").replace(
        "、统一为 1024×1280",
        "",
    )
    existing_notes = re.sub(
        r"\s*84 张人物图已按有效 alpha 内容边界重建透明画布，"
        r"保留 7% 左右与顶部、8% 底部安全边距；"
        r"卡面仅对独立人物图统一轻微放大 [0-9.]+ 倍。",
        "",
        existing_notes,
    ).strip()
    normalized_notes = f"{existing_notes} {note}".strip()
    changed = (
        payload.get("characterFraming") != framing
        or payload.get("notes") != normalized_notes
    )

    if apply_changes and changed:
        payload["generatedAt"] = datetime.now(timezone.utc).isoformat()
        payload["characterFraming"] = framing
        payload["notes"] = normalized_notes
        write_json(PRODUCTION_REPORT_PATH, payload)

    return changed


def write_report(path: Path, results: list[FramingResult]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "settings": {
            "alphaThreshold": ALPHA_THRESHOLD,
            "safetyMargins": {
                "top": MARGIN_TOP,
                "bottom": MARGIN_BOTTOM,
                "left": MARGIN_LEFT,
                "right": MARGIN_RIGHT,
            },
        },
        "items": [asdict(item) for item in results],
    }
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    args = parse_args()
    files = sorted(ASSET_DIR.glob("mg-[0-9][0-9].png"))

    if len(files) != EXPECTED_IMAGE_COUNT:
        raise SystemExit(
            f"Expected {EXPECTED_IMAGE_COUNT} character PNGs; found {len(files)}."
        )

    results = [
        normalize_image(path, apply_changes=args.apply) for path in files
    ]
    dimensions = dimensions_by_path(results)
    manifest_mismatches = sum(
        synchronize_manifest(
            path,
            dimensions,
            apply_changes=args.apply,
        )
        for path in MANIFEST_PATHS
    )
    report_mismatch = update_production_report(
        results,
        apply_changes=args.apply,
    )

    if args.report:
        write_report(args.report, results)

    changed_images = [item for item in results if item.changed]
    mode = "normalized" if args.apply else "needs normalization"

    for item in changed_images:
        print(
            f"{mode} {item.filename}: "
            f"{item.before_width}x{item.before_height} -> "
            f"{item.after_width}x{item.after_height}"
        )

    if args.apply:
        print(
            f"Normalized {len(changed_images)} of {len(results)} PNGs; "
            f"updated {manifest_mismatches} manifest dimension records."
        )
        return 0

    if changed_images or manifest_mismatches or report_mismatch:
        print(
            f"Framing check failed: {len(changed_images)} PNGs, "
            f"{manifest_mismatches} manifest records, "
            f"production report mismatch={report_mismatch}."
        )
        return 1 if args.check else 0

    print(f"Character framing check passed ({len(results)} PNGs).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
