import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "build"
SIZE = 1024


def png_chunk(kind, data):
    body = kind + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)


def write_png(path, pixels):
    rows = []
    for y in range(SIZE):
        row = bytearray([0])
        for x in range(SIZE):
            row.extend(pixels(x, y))
        rows.append(bytes(row))

    raw = b"".join(rows)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0))
        + png_chunk(b"IDAT", zlib.compress(raw, 9))
        + png_chunk(b"IEND", b"")
    )
    path.write_bytes(png)


def inside_round_rect(x, y, left, top, right, bottom, radius):
    if x < left or x >= right or y < top or y >= bottom:
        return False
    cx = left + radius if x < left + radius else right - radius - 1 if x >= right - radius else x
    cy = top + radius if y < top + radius else bottom - radius - 1 if y >= bottom - radius else y
    return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= radius * radius


def shield_bounds(y):
    top = 216
    shoulder = 326
    bottom = 784
    if y < top or y > bottom:
        return None
    if y <= shoulder:
        inset = int((shoulder - y) * 0.45)
        return 262 + inset, 762 - inset
    t = (y - shoulder) / (bottom - shoulder)
    half = int(250 * (1 - t) + 24 * t)
    return 512 - half, 512 + half


def pixel(x, y):
    if not inside_round_rect(x, y, 64, 64, 960, 960, 176):
        return (0, 0, 0, 0)

    bg = 18 if (x + y) % 2 else 16
    color = (bg, bg, bg, 255)

    bounds = shield_bounds(y)
    if bounds:
        left, right = bounds
        if left <= x <= right:
            edge = min(x - left, right - x, y - 216, 784 - y)
            if edge < 20:
                return (248, 250, 252, 255)
            return (230, 232, 236, 255)

    key_y = 510
    if (x - 446) * (x - 446) + (y - key_y) * (y - key_y) <= 54 * 54:
        if (x - 446) * (x - 446) + (y - key_y) * (y - key_y) >= 30 * 30:
            return (17, 17, 17, 255)
    if 494 <= x <= 654 and 494 <= y <= 526:
        return (17, 17, 17, 255)
    if 626 <= x <= 658 and 526 <= y <= 586:
        return (17, 17, 17, 255)
    if 574 <= x <= 606 and 526 <= y <= 562:
        return (17, 17, 17, 255)

    return color


def write_ico(path, png_data):
    header = struct.pack("<HHH", 0, 1, 1)
    directory = struct.pack("<BBBBHHII", 0, 0, 0, 0, 1, 32, len(png_data), 22)
    path.write_bytes(header + directory + png_data)


def write_icns(path, png_data):
    item = b"ic10" + struct.pack(">I", len(png_data) + 8) + png_data
    path.write_bytes(b"icns" + struct.pack(">I", len(item) + 8) + item)


def main():
    BUILD.mkdir(exist_ok=True)
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect x="64" y="64" width="896" height="896" rx="176" fill="#111"/>
  <path d="M512 216 762 326v160c0 142-86 252-250 330C348 738 262 628 262 486V326l250-110Z" fill="#f8fafc"/>
  <path d="M446 456a54 54 0 1 0 0 108 54 54 0 0 0 0-108Zm48 38h160v32h-28v60h-32v-60h-38v36h-32v-36h-30v-32Z" fill="#111"/>
</svg>
"""
    (BUILD / "icon.svg").write_text(svg, encoding="utf-8")
    png_path = BUILD / "icon.png"
    write_png(png_path, pixel)
    png_data = png_path.read_bytes()
    write_ico(BUILD / "icon.ico", png_data)
    write_icns(BUILD / "icon.icns", png_data)
    print("Generated build/icon.svg, build/icon.png, build/icon.ico, build/icon.icns")


if __name__ == "__main__":
    main()
