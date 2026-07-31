"""Replace weak 10th-grade lesson thumbnails with exact textbook diagrams.

The clean course builder deliberately creates one image per lesson from the
cached extraction.  This pass uses the rendered source PDF pages for lessons
where the automatic image choice was a chapter ornament or a text-heavy crop.
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "tmp" / "pdfs" / "book10"
FIGURES = ROOT / "assets" / "physics10-rebuild" / "figures"

# lesson: (PDF page, left, top, right, bottom)
CROPS = {
    1: (8, 430, 220, 890, 420),       # kuchlarni qo'shish — arqon tortish
    2: (11, 450, 250, 900, 470),      # egri yo'l bo'ylab avtomobil
    4: (17, 70, 295, 830, 475),       # vertikal yo'ldagi harakat
    5: (19, 585, 175, 875, 705),      # vazn va dinamometr
    11: (35, 590, 175, 855, 940),     # qiya tekislik tajribalari
    14: (43, 590, 150, 860, 315),     # richag sxemasi
    15: (48, 45, 700, 330, 1170),     # prujina va mayatnik
    17: (54, 45, 175, 320, 950),      # mayatnik laboratoriya sxemalari
    18: (55, 590, 500, 860, 1160),    # ko'ndalang va bo'ylama to'lqinlar
    20: (61, 55, 275, 850, 560),      # tovush masalasining yechimi
    22: (70, 45, 480, 335, 1165),     # Bernulli va qanot sxemalari
    23: (72, 115, 260, 855, 500),     # suyuqlik masalasi yechimi
    27: (85, 590, 550, 860, 1170),    # elektr maydonidagi ish
    46: (147, 585, 175, 865, 925),    # diod qurilmasi va VAX
    53: (169, 55, 265, 850, 520),     # magnit kuch masalasi
    54: (171, 45, 690, 900, 945),     # Faradey tajribalari
    57: (179, 55, 255, 850, 485),     # induksiya masalasi
    59: (180, 45, 865, 330, 1155),    # magnit maydon energiyasi grafigi
}


def save_crop(lesson: int, page: int, box: tuple[int, int, int, int]) -> None:
    source = PAGES / f"page-{page:03d}.jpg"
    if not source.exists():
        raise FileNotFoundError(source)

    with Image.open(source) as original:
        crop = original.convert("RGB").crop(box)

    # Preserve the textbook drawing, but give it a clean neutral breathing room.
    crop = ImageOps.expand(crop, border=18, fill="white")
    if crop.width < 900:
        scale = 900 / crop.width
        crop = crop.resize(
            (900, round(crop.height * scale)),
            Image.Resampling.LANCZOS,
        )

    destination = FIGURES / f"lesson-{lesson:02d}.png"
    crop.save(destination, "PNG", optimize=True)
    print(f"l{lesson:02d}: p{page} {box} -> {crop.width}x{crop.height}")


def main() -> None:
    FIGURES.mkdir(parents=True, exist_ok=True)
    for lesson, crop_spec in CROPS.items():
        page, left, top, right, bottom = crop_spec
        save_crop(lesson, page, (left, top, right, bottom))
    print(f"Refined {len(CROPS)} figures.")


if __name__ == "__main__":
    main()
