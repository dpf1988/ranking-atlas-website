"""
Generate hero image for /resources/the-cost-of-authority
Output: public/assets/images/resources/the-cost-of-authority/hero.jpg
Dimensions: 1600x900 (16:9)
"""
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib import rcParams

# Use Inter if available, fall back gracefully
rcParams['font.family'] = 'sans-serif'
rcParams['font.sans-serif'] = ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'DejaVu Sans']
rcParams['axes.unicode_minus'] = False

# ── Data (verified against SVG + table) ──────────────────────────────────────
# SVG formula: price = (380 - y) / 320 * 250
# FATJOE:          2020=$95, 2021=$81, 2025=$120, 2026=$120
# Loganix:         2020=$134, 2024=$200, 2025=$200, 2026=$200
# Searcharoo:      2022=$117, 2025=$180
# RhinoRank:       2022=$120, 2026=$120
# Publisher-direct: 2020=$30, 2024=$91

VENDORS_GRAY = {
    'FATJOE':      [(2020, 95),  (2021, 81),  (2025, 120), (2026, 120)],
    'Loganix':     [(2020, 134), (2024, 200), (2025, 200), (2026, 200)],
    'Searcharoo':  [(2022, 117), (2025, 180)],
    'RhinoRank':   [(2022, 120), (2026, 120)],
}
VENDOR_PURPLE = [(2020, 30), (2024, 91)]

# ── Colours ───────────────────────────────────────────────────────────────────
GRAY       = '#94A3B8'
PURPLE     = '#5D4FE0'
BG         = '#F8F7FA'
TEXT_DARK  = '#0A0F1E'
TEXT_MID   = '#475569'
TEXT_LIGHT = '#64748B'
GRID_COL   = '#E2E8F0'

# ── Figure setup: exactly 1600×900 ───────────────────────────────────────────
fig, ax = plt.subplots(figsize=(16, 9), dpi=100)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

# ── Agency lines — gray, behind ───────────────────────────────────────────────
for name, pts in VENDORS_GRAY.items():
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    ax.plot(xs, ys, color=GRAY, linewidth=2, zorder=2,
            solid_capstyle='round', solid_joinstyle='round')
    ax.scatter(xs, ys, color=GRAY, s=35, zorder=3, linewidths=0)

# ── Publisher-direct — purple, on top ────────────────────────────────────────
pd_xs = [p[0] for p in VENDOR_PURPLE]
pd_ys = [p[1] for p in VENDOR_PURPLE]
ax.plot(pd_xs, pd_ys, color=PURPLE, linewidth=3, zorder=10,
        solid_capstyle='round', solid_joinstyle='round')
ax.scatter(pd_xs, pd_ys, color=PURPLE, s=65, zorder=11, linewidths=0)

# End-point value labels on the purple line
ax.annotate('$30', xy=(2020, 30), xytext=(-10, 12),
            textcoords='offset points',
            fontsize=13, color=PURPLE, fontweight='semibold', ha='right')
ax.annotate('$91 (+203%)', xy=(2024, 91), xytext=(10, 8),
            textcoords='offset points',
            fontsize=13, color=PURPLE, fontweight='semibold', ha='left')

# ── Axes formatting ───────────────────────────────────────────────────────────
years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
ax.set_xlim(2019.4, 2027.0)
ax.set_ylim(0, 265)
ax.set_xticks(years)
ax.set_xticklabels([str(y) for y in years], fontsize=14, color=TEXT_LIGHT)
ax.set_yticks([0, 50, 100, 150, 200, 250])
ax.set_yticklabels(['$0', '$50', '$100', '$150', '$200', '$250'],
                   fontsize=14, color=TEXT_LIGHT)
ax.tick_params(axis='both', which='both', length=0, pad=8)

# Grid lines (horizontal only)
ax.yaxis.grid(True, color=GRID_COL, linewidth=1, zorder=1)
ax.xaxis.grid(False)
ax.set_axisbelow(True)

# Baseline
ax.axhline(y=0, color='#CBD5E1', linewidth=1.2, zorder=4)

# Remove all spines
for spine in ax.spines.values():
    spine.set_visible(False)

# ── Legend (inside chart area, top-left) ─────────────────────────────────────
gray_patch  = mpatches.Patch(color=GRAY,   label='Agency-managed: FATJOE, Loganix, Searcharoo, RhinoRank')
purple_line = mpatches.Patch(color=PURPLE, label='Publisher-direct (FatRank benchmark)')
legend = ax.legend(
    handles=[purple_line, gray_patch],
    loc='upper left',
    bbox_to_anchor=(0.01, 0.98),
    frameon=False,
    fontsize=12,
    handlelength=1.4,
    handleheight=0.8,
    labelspacing=0.5,
)
for text, color in zip(legend.get_texts(), [PURPLE, GRAY]):
    text.set_color(color)

# ── Layout: leave top 28% for title block ────────────────────────────────────
plt.subplots_adjust(left=0.075, right=0.965, top=0.72, bottom=0.10)

# ── Title ─────────────────────────────────────────────────────────────────────
fig.text(
    0.075, 0.96,
    'Per-link pricing has tripled at the publisher,\nbut only inched at the agency.',
    fontsize=27, fontweight='bold', color=TEXT_DARK,
    ha='left', va='top', linespacing=1.35,
)

# ── Subtitle ──────────────────────────────────────────────────────────────────
fig.text(
    0.075, 0.81,
    'Wayback Machine snapshots across five link-building agencies + publisher-direct benchmark',
    fontsize=14, color=TEXT_LIGHT, ha='left', va='top',
)

# ── Top-right label ───────────────────────────────────────────────────────────
fig.text(
    0.965, 0.81,
    'Publisher-direct pricing, 2020\u20132026',
    fontsize=13, color=PURPLE, ha='right', va='top', style='italic',
)

# ── Save ──────────────────────────────────────────────────────────────────────
output_dir  = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'images', 'resources', 'the-cost-of-authority')
output_path = os.path.join(output_dir, 'hero.jpg')
os.makedirs(output_dir, exist_ok=True)

fig.savefig(
    os.path.abspath(output_path),
    dpi=100,
    format='jpeg',
    facecolor=BG,
    pil_kwargs={'optimize': True, 'quality': 85},
)

# ── Report ────────────────────────────────────────────────────────────────────
from PIL import Image
img = Image.open(output_path)
size_kb = os.path.getsize(output_path) / 1024
print(f"Saved : {os.path.abspath(output_path)}")
print(f"Size  : {img.size[0]}x{img.size[1]} px")
print(f"File  : {size_kb:.1f} KB")

print("\nData verification (SVG coords -> USD):")
def px_to_usd(y): return round((380 - y) / 320 * 250)
print(f"  FATJOE 2020: {px_to_usd(259)} (expect 95)")
print(f"  FATJOE 2021: {px_to_usd(276)} (expect 81)")
print(f"  FATJOE 2025/26: {px_to_usd(227)} (expect 120)")
print(f"  Loganix 2020: {px_to_usd(209)} (expect 134)")
print(f"  Loganix 2024-26: {px_to_usd(124)} (expect 200)")
print(f"  Searcharoo 2022: {px_to_usd(230)} (expect 117)")
print(f"  Searcharoo 2025: {px_to_usd(150)} (expect 180)")
print(f"  RhinoRank 2022/26: {px_to_usd(227)} (expect 120)")
print(f"  Publisher-direct 2020: {px_to_usd(342)} (expect 30)")
print(f"  Publisher-direct 2024: {px_to_usd(264)} (expect 91)")
