"""
Re-annotation script v2 — margin-based layout, larger typography.
Outputs ai-answer-example.png, backs up existing as ai-answer-example-v1.png.
"""

import math
import os
import shutil
from PIL import Image, ImageDraw, ImageFont

# ── Paths ──────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
RAW   = os.path.join(BASE, "ai-answer-example-raw.png.png")
OUT   = os.path.join(BASE, "ai-answer-example.png")
V1    = os.path.join(BASE, "ai-answer-example-v1.png")

# ── Colours ────────────────────────────────────────────────────────────────
PURPLE = (93, 79, 224)    # #5D4FE0
BLACK  = (0, 0, 0)
DARK   = (51, 65, 85)     # #334155  supporting italic text
WHITE  = (255, 255, 255)
MARG   = (250, 250, 250)  # #FAFAFA  margin tint

# ── Canvas geometry ────────────────────────────────────────────────────────
L_MAR = 240   # left margin px
R_MAR = 240   # right margin px
B_EXT = 0     # no bottom extension

# ── Font loader ────────────────────────────────────────────────────────────
WIN_FONTS = "C:/Windows/Fonts"

def load_font(basename, size):
    for name in [basename, basename.lower()]:
        p = os.path.join(WIN_FONTS, name + ".ttf")
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return None

def best_font(size, bold=False, italic=False):
    candidates = {
        (True,  False): ["arialbd", "calibrib", "segoeuib", "verdanab", "tahomabd"],
        (False, True):  ["ariali",  "calibrii", "segoeuii", "verdanai"],
        (False, False): ["arial",   "calibri",  "segoeui",  "verdana",  "tahoma"],
        (True,  True):  ["arialbi", "calibriz", "segoeuiz"],
    }
    for name in candidates.get((bold, italic), candidates[(False, False)]):
        f = load_font(name, size)
        if f:
            return f
    # last resort: built-in
    return ImageFont.load_default()

f_label_bold   = best_font(20, bold=True)
f_label_italic = best_font(15, italic=True)
f_bar_bold     = best_font(20, bold=True)
f_bar_body     = best_font(18)

print("Fonts:")
print("  label bold   :", f_label_bold)
print("  label italic :", f_label_italic)
print("  bar bold     :", f_bar_bold)
print("  bar body     :", f_bar_body)

# ── Helpers ────────────────────────────────────────────────────────────────

def text_wrap(text, font, max_w, draw_ref):
    """Return list of lines that fit within max_w pixels."""
    words = text.split()
    lines, cur = [], []
    for w in words:
        trial = " ".join(cur + [w])
        bbox  = draw_ref.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_w:
            cur.append(w)
        else:
            if cur:
                lines.append(" ".join(cur))
            cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines or [""]


def line_height(font, leading=1.4):
    bbox = font.getbbox("Ag")
    return int((bbox[3] - bbox[1]) * leading + 0.5)


def draw_arrow(draw, x1, y1, x2, y2, color=PURPLE, width=2, head=12):
    draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
    angle  = math.atan2(y2 - y1, x2 - x1)
    spread = math.pi / 6
    pts = [
        (x2, y2),
        (int(x2 - head * math.cos(angle - spread)),
         int(y2 - head * math.sin(angle - spread))),
        (int(x2 - head * math.cos(angle + spread)),
         int(y2 - head * math.sin(angle + spread))),
    ]
    draw.polygon(pts, fill=color)


def draw_label_box(draw, cx, cy, side,
                   line1, line2,
                   pad=18, border=2, radius=10,
                   max_w=200):
    """
    Draw a label box.
      side='left'  → box right edge at cx, centred on cy
      side='right' → box left  edge at cx, centred on cy
    Returns (bx1, by1, bx2, by2).
    """
    inner_w = max_w - pad * 2

    l1_lines = text_wrap(line1, f_label_bold,   inner_w, draw)
    l2_lines = text_wrap(line2, f_label_italic, inner_w, draw)

    lh1 = line_height(f_label_bold,   1.35)
    lh2 = line_height(f_label_italic, 1.35)

    text_h = len(l1_lines) * lh1 + 6 + len(l2_lines) * lh2
    box_h  = text_h + pad * 2

    if side == "left":
        bx1, bx2 = cx - max_w, cx
    else:
        bx1, bx2 = cx, cx + max_w

    by1 = cy - box_h // 2
    by2 = by1 + box_h

    # White fill + purple border
    draw.rounded_rectangle([bx1, by1, bx2, by2],
                            radius=radius, fill=WHITE,
                            outline=PURPLE, width=border)

    tx = bx1 + pad
    ty = by1 + pad

    for ln in l1_lines:
        draw.text((tx, ty), ln, font=f_label_bold, fill=BLACK)
        ty += lh1

    ty += 6  # gap between line sets

    for ln in l2_lines:
        draw.text((tx, ty), ln, font=f_label_italic, fill=DARK)
        ty += lh2

    return (bx1, by1, bx2, by2)


# ── Build canvas ───────────────────────────────────────────────────────────

# Backup
if os.path.exists(OUT):
    shutil.copy2(OUT, V1)
    print(f"Backed up existing to {V1}")

raw = Image.open(RAW).convert("RGB")
rw, rh = raw.size
print(f"Raw screenshot: {rw}×{rh}")

cw = rw + L_MAR + R_MAR   # 1541
ch = rh + B_EXT            # 1112

canvas = Image.new("RGB", (cw, ch), MARG)
canvas.paste(raw, (L_MAR, 0))

draw = ImageDraw.Draw(canvas)

# ── Rectangle coordinates (raw-image space) ───────────────────────────────
# Brand block: Wiz / Orca Security / Lacework / Sysdig section
# Visually ~y 47-90% of height, x ~1-63% of width
BR_RAW = (8,   int(rh * 0.470), int(rw * 0.628), int(rh * 0.898))
# Sources panel: right column, full height
SR_RAW = (int(rw * 0.634), 5,   int(rw * 0.992), rh - 5)

# Shift to canvas coords
def to_canvas(x1, y1, x2, y2):
    return (x1 + L_MAR, y1, x2 + L_MAR, y2)

BR = to_canvas(*BR_RAW)
SR = to_canvas(*SR_RAW)

# Draw rectangles
draw.rounded_rectangle(BR, radius=6, outline=PURPLE, width=3)
draw.rounded_rectangle(SR, radius=6, outline=PURPLE, width=3)

# ── Label 1 — left margin ─────────────────────────────────────────────────
# Right edge of label box sits at x = L_MAR - 20 (20px gap to screenshot edge)
# Arrow from box right edge → brand rect left edge
br_vert_mid = (BR[1] + BR[3]) // 2

box1 = draw_label_box(
    draw,
    cx=L_MAR - 22,        # right edge of label
    cy=br_vert_mid,
    side="left",
    line1="Brands named in the answer",
    line2="Coverage of these vendors signals category authority to AI",
    max_w=200,
)

# Arrow: right-centre of box → left-centre of brand rect
draw_arrow(draw,
    box1[2], (box1[1] + box1[3]) // 2,   # from
    BR[0],   br_vert_mid,                 # to
    PURPLE, width=2, head=10)

# ── Label 2 — right margin ────────────────────────────────────────────────
# Left edge of label box sits at x = L_MAR + rw + 22
# Vertically at top-quarter of sources rect
sr_vert_anchor = SR[1] + (SR[3] - SR[1]) // 4

box2 = draw_label_box(
    draw,
    cx=L_MAR + rw + 22,   # left edge of label
    cy=sr_vert_anchor,
    side="right",
    line1="The authoritative domains in this category",
    line2="AI cites the domains that accumulated trust signals over time.",
    max_w=200,
)

# Arrow: left-centre of box → right-centre of sources rect
draw_arrow(draw,
    box2[0], (box2[1] + box2[3]) // 2,   # from
    SR[2],   sr_vert_anchor,              # to
    PURPLE, width=2, head=10)


# ── Save ──────────────────────────────────────────────────────────────────
canvas.save(OUT, "PNG", optimize=True)
file_sz = os.path.getsize(OUT)
print(f"\nOutput: {cw}×{ch}")
print(f"File size: {file_sz / 1024:.0f} KB")
print(f"Saved: {OUT}")

# ── Overlap check ─────────────────────────────────────────────────────────
def overlaps_screenshot(box):
    """Does the box overlap the screenshot region (L_MAR..L_MAR+rw, 0..rh)?"""
    bx1, by1, bx2, by2 = box
    sx1, sy1, sx2, sy2 = L_MAR, 0, L_MAR + rw, rh
    return not (bx2 <= sx1 or bx1 >= sx2 or by2 <= sy1 or by1 >= sy2)

print("\nOverlap check:")
print(f"  Label 1 overlaps screenshot: {overlaps_screenshot(box1)}")
print(f"  Label 2 overlaps screenshot: {overlaps_screenshot(box2)}")
print("Done.")
