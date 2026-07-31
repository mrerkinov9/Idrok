"""Create a QA contact sheet for the rebuilt 10th-grade lesson figures."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "physics10-rebuild" / "figures"
OUTPUT = ROOT / "tmp" / "pdfs" / "physics10-rebuild-contact-refined.png"


def main() -> None:
    files = sorted(SOURCE.glob("lesson-*.png"))
    columns = 5
    cell_w, cell_h = 300, 230
    rows = (len(files) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_w, rows * cell_h), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=18)

    for index, path in enumerate(files):
        row, col = divmod(index, columns)
        x, y = col * cell_w, row * cell_h
        with Image.open(path) as source:
            image = source.convert("RGB")
            image.thumbnail((cell_w - 28, cell_h - 40), Image.Resampling.LANCZOS)
            image = ImageOps.expand(image, border=1, fill="#d9deea")
        px = x + (cell_w - image.width) // 2
        py = y + 28 + (cell_h - 34 - image.height) // 2
        sheet.paste(image, (px, py))
        draw.text((x + 8, y + 5), f"{index + 1:02d}", fill="#111827", font=font)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, "PNG", optimize=True)
    print(f"{len(files)} figures -> {OUTPUT}")


if __name__ == "__main__":
    main()
