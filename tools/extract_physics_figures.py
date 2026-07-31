import json
import math
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OCR_PATH = ROOT / "tmp" / "pdfs" / "ocr" / "physics-ocr.json"
CONTENT_PATH = ROOT / "assets" / "physics" / "physics-content.js"
BOOK_DIR = ROOT / "assets" / "physics" / "book"
OUTPUT_DIR = ROOT / "assets" / "physics" / "figures"
CONTACT_PATH = ROOT / "tmp" / "pdfs" / "ocr" / "figure-contact-sheet.jpg"


def load_course():
    raw = CONTENT_PATH.read_text(encoding="utf-8").strip()
    prefix = "window.PHYSICS_COURSE = "
    if not raw.startswith(prefix):
        raise ValueError("Unexpected physics-content.js format")
    return json.loads(raw[len(prefix):].rstrip(";"))


def dilate(mask, radius=3):
    padded = np.pad(mask, radius, mode="constant")
    result = np.zeros_like(mask, dtype=bool)
    height, width = mask.shape
    for dy in range(radius * 2 + 1):
        for dx in range(radius * 2 + 1):
            result |= padded[dy:dy + height, dx:dx + width]
    return result


def components(mask):
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    for y in range(height):
        for x in range(width):
            if not mask[y, x] or seen[y, x]:
                continue
            queue = deque([(x, y)])
            seen[y, x] = True
            min_x = max_x = x
            min_y = max_y = y
            count = 0
            while queue:
                cx, cy = queue.popleft()
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((nx, ny))
            yield min_x, min_y, max_x + 1, max_y + 1, count


def page_candidates(page_number, page_ocr):
    image_path = BOOK_DIR / f"page-{page_number:03}.jpg"
    image = Image.open(image_path).convert("RGB")
    rgb = np.asarray(image)
    max_channel = rgb.max(axis=2)
    min_channel = rgb.min(axis=2)
    saturation = max_channel - min_channel
    dark = min_channel < 185
    colored = (saturation > 24) & (max_channel < 250)
    ink = dark | colored

    for line in page_ocr.get("lines", []):
        x1 = max(0, int(line["x"]) - 5)
        y1 = max(0, int(line["y"]) - 4)
        x2 = min(image.width, int(line["x"] + line["width"]) + 6)
        y2 = min(image.height, int(line["y"] + line["height"]) + 5)
        ink[y1:y2, x1:x2] = False

    ink[:65, :] = False
    ink[-75:, :] = False
    ink[:, :35] = False
    ink[:, -35:] = False

    scale = 2
    small = ink[::scale, ::scale]
    grouped = dilate(small, radius=4)
    candidates = []
    for sx1, sy1, sx2, sy2, _ in components(grouped):
        x1, y1, x2, y2 = sx1 * scale, sy1 * scale, sx2 * scale, sy2 * scale
        width, height = x2 - x1, y2 - y1
        if width < 72 or height < 58:
            continue
        if width > 620 and height < 130:
            continue
        if y1 < 155 and height < 165:
            continue
        local_ink = int(ink[y1:y2, x1:x2].sum())
        local_color = int(colored[y1:y2, x1:x2].sum())
        area = width * height
        fill = local_ink / max(area, 1)
        if local_ink < 260 or fill < 0.006:
            continue
        aspect = width / max(height, 1)
        aspect_bonus = 1.22 if 0.45 <= aspect <= 2.8 else 0.86
        color_bonus = 1 + min(local_color / max(local_ink, 1), 0.8)
        size_bonus = min(math.sqrt(area) / 180, 1.65)
        edge_penalty = 0.72 if x1 < 65 or x2 > image.width - 65 else 1
        score = (local_ink + local_color * 2.8) * aspect_bonus * color_bonus * size_bonus * edge_penalty
        padding = 6
        crop_box = (
            max(42, x1 - padding),
            max(75, y1 - padding),
            min(image.width - 42, x2 + padding),
            min(image.height - 70, y2 + padding),
        )
        candidates.append({"page": page_number, "score": score, "box": crop_box, "image": image})
    return candidates


def make_contact(entries):
    columns = 4
    cell_width, cell_height = 280, 235
    rows = math.ceil(len(entries) / columns)
    sheet = Image.new("RGB", (columns * cell_width, rows * cell_height), "#eef2ff")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, entry in enumerate(entries):
        x = (index % columns) * cell_width
        y = (index // columns) * cell_height
        thumb = Image.open(entry["path"]).convert("RGB")
        thumb.thumbnail((250, 182), Image.Resampling.LANCZOS)
        px = x + (cell_width - thumb.width) // 2
        py = y + 28 + (182 - thumb.height) // 2
        sheet.paste(thumb, (px, py))
        draw.text((x + 12, y + 8), f"{entry['lesson']:02}. p.{entry['page']}  {entry['title'][:28]}", fill="#11182d", font=font)
        draw.rectangle((x, y, x + cell_width - 1, y + cell_height - 1), outline="#cbd4ef", width=1)
    CONTACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT_PATH, quality=91)


def main():
    course = load_course()
    raw_ocr = json.loads(OCR_PATH.read_text(encoding="utf-8-sig"))
    if isinstance(raw_ocr, dict):
        raw_ocr = [raw_ocr]
    ocr = {int(page["page"]): page for page in raw_ocr}
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    entries = []

    for lesson in course["lessons"]:
        candidates = []
        for page_number in lesson["pageNumbers"]:
            if page_number in ocr:
                candidates.extend(page_candidates(page_number, ocr[page_number]))
        if not candidates:
            continue
        best = max(candidates, key=lambda item: item["score"])
        crop = best["image"].crop(best["box"])
        output_path = OUTPUT_DIR / f"lesson-{lesson['number']:02}.jpg"
        crop.save(output_path, quality=94, subsampling=0)
        entries.append({
            "lesson": lesson["number"],
            "title": lesson["title"],
            "page": best["page"],
            "path": output_path,
            "score": round(best["score"], 2),
        })

    make_contact(entries)
    manifest = [
        {**entry, "path": str(entry["path"].relative_to(ROOT)).replace("\\", "/")}
        for entry in entries
    ]
    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Extracted {len(entries)} lesson figures")
    print(f"Contact sheet: {CONTACT_PATH}")


if __name__ == "__main__":
    main()
