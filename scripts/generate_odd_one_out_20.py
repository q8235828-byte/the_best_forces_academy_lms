import os
import math
import json
import re
from PIL import Image, ImageDraw

QUESTIONS_DIR = "public/images/non-verbal/questions"
OPTIONS_DIR = "public/images/non-verbal/options"
BANK_PATH = "src/lib/non-verbal-questions-bank.ts"

os.makedirs(QUESTIONS_DIR, exist_ok=True)
os.makedirs(OPTIONS_DIR, exist_ok=True)

S = 4
BOX = 160 * S
BLACK = (15, 23, 42)
SLATE = (71, 85, 105)
WHITE = (255, 255, 255)
FILL_DARK = (30, 41, 59)
FILL_LIGHT = (203, 213, 225)
W = 4 * S

def new_card():
    return Image.new('RGB', (BOX, BOX), WHITE)

def poly_pts(cx, cy, r, n, rot_deg=-90):
    pts = []
    for i in range(n):
        ang = math.radians(rot_deg + i * 360 / n)
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return pts

def draw_poly(d, cx, cy, r, n, rot_deg=-90, outline=BLACK, fill=None, w=W):
    pts = poly_pts(cx, cy, r, n, rot_deg)
    d.polygon(pts, fill=fill, outline=outline, width=w)

def draw_dots(d, cx, cy, count, r_dot=5*S, y_spread=12*S):
    offsets = {
        1: [(0, 0)],
        2: [(-15*S, 0), (15*S, 0)],
        3: [(0, -14*S), (-12*S, y_spread), (12*S, y_spread)],
        4: [(-14*S, -14*S), (14*S, -14*S), (-14*S, 14*S), (14*S, 14*S)],
        5: [(-15*S, -14*S), (15*S, -14*S), (0, 0), (-15*S, 14*S), (15*S, 14*S)],
        6: [(-15*S, -16*S), (15*S, -16*S), (-15*S, 0), (15*S, 0), (-15*S, 16*S), (15*S, 16*S)],
    }[count]
    for dx, dy in offsets:
        d.ellipse([cx+dx-r_dot, cy+dy-r_dot, cx+dx+r_dot, cy+dy+r_dot], fill=BLACK)

def draw_arrow(d, x0, y0, x1, y1, w=W, head=14*S, double=False):
    d.line([x0, y0, x1, y1], fill=BLACK, width=w)
    ang = math.atan2(y1 - y0, x1 - x0)
    for a_off in [math.radians(150), math.radians(-150)]:
        d.line([x1, y1, x1 + head*math.cos(ang+a_off), y1 + head*math.sin(ang+a_off)], fill=BLACK, width=w)
    if double:
        ang2 = ang + math.pi
        for a_off in [math.radians(150), math.radians(-150)]:
            d.line([x0, y0, x0 + head*math.cos(ang2+a_off), y0 + head*math.sin(ang2+a_off)], fill=BLACK, width=w)

def draw_curved_arrow(d, cx, cy, r, start_deg, end_deg, cw=True):
    d.arc([cx-r, cy-r, cx+r, cy+r], start=start_deg, end=end_deg, fill=BLACK, width=W)
    tip_deg = end_deg if cw else start_deg
    ang = math.radians(tip_deg)
    tx, ty = cx + r*math.cos(ang), cy + r*math.sin(ang)
    tangent = ang + (math.pi/2 if cw else -math.pi/2)
    head = 13*S
    for a_off in [math.radians(145), math.radians(-145)]:
        d.line([tx, ty, tx + head*math.cos(tangent+a_off), ty + head*math.sin(tangent+a_off)], fill=BLACK, width=W)

def draw_L(d, cx, cy, rot_deg, mirror=False):
    pts = [(-22*S, -38*S), (-22*S, 38*S), (26*S, 38*S)]
    if mirror: pts = [(-x, y) for x, y in pts]
    rad = math.radians(rot_deg)
    rpts = [(cx + x*math.cos(rad) - y*math.sin(rad), cy + x*math.sin(rad) + y*math.cos(rad)) for x, y in pts]
    d.line(rpts, fill=BLACK, width=W+2*S, joint='curve')

def draw_clock(d, cx, cy, R, a1, a2):
    d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
    d.ellipse([cx-4*S, cy-4*S, cx+4*S, cy+4*S], fill=BLACK)
    d.line([cx, cy, cx+R*0.55*math.cos(math.radians(a1)), cy+R*0.55*math.sin(math.radians(a1))], fill=BLACK, width=W+S)
    d.line([cx, cy, cx+R*0.8*math.cos(math.radians(a2)), cy+R*0.8*math.sin(math.radians(a2))], fill=BLACK, width=W)

def corner_tri(d, cx, cy, R, corners):
    d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
    s = R * 0.65
    if 'TL' in corners: d.polygon([(cx-R, cy-R), (cx-R+s, cy-R), (cx-R, cy-R+s)], fill=FILL_DARK)
    if 'TR' in corners: d.polygon([(cx+R, cy-R), (cx+R-s, cy-R), (cx+R, cy-R+s)], fill=FILL_DARK)
    if 'BL' in corners: d.polygon([(cx-R, cy+R), (cx-R+s, cy+R), (cx-R, cy+R-s)], fill=FILL_DARK)
    if 'BR' in corners: d.polygon([(cx+R, cy+R), (cx+R-s, cy+R), (cx+R, cy+R-s)], fill=FILL_DARK)

cx, cy = BOX // 2, BOX // 2
R = 52 * S

specs = [
    (1, 'C', 'In A, B, and D the number of interior dots equals the number of polygon sides (3, 4, 6), whereas C has a 5-sided pentagon with only 4 dots.', [
        lambda d: (draw_poly(d, cx, cy+4*S, R, 3), draw_dots(d, cx, cy+10*S, 3, y_spread=8*S)),
        lambda d: (draw_poly(d, cx, cy, R, 4, 45), draw_dots(d, cx, cy, 4)),
        lambda d: (draw_poly(d, cx, cy, R, 5), draw_dots(d, cx, cy, 4)),
        lambda d: (draw_poly(d, cx, cy, R, 6), draw_dots(d, cx, cy, 6)),
    ]),
    (2, 'D', 'Curved arrows A, B, and C rotate clockwise, whereas arrow D rotates counter-clockwise.', [
        lambda d: draw_curved_arrow(d, cx, cy, R-6*S, -90, 90, cw=True),
        lambda d: draw_curved_arrow(d, cx, cy, R-6*S, 0, 180, cw=True),
        lambda d: draw_curved_arrow(d, cx, cy, R-6*S, 90, 270, cw=True),
        lambda d: draw_curved_arrow(d, cx, cy, R-6*S, -90, 90, cw=False),
    ]),
    (3, 'D', 'Figures A, B, and C are divided into two equal halves, whereas D is divided unequally.', [
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W)),
        lambda d: (draw_poly(d, cx, cy+6*S, R, 3), d.line([cx, cy+6*S-R, cx, cy+6*S+R*0.5], fill=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R*0.7, cx+R, cy+R*0.7], outline=BLACK, width=W), d.line([cx-R*0.45, cy-R*0.7, cx-R*0.45, cy+R*0.7], fill=BLACK, width=W)),
    ]),
    (4, 'C', 'A, B, and D show parallel lines, whereas C shows intersecting lines.', [
        lambda d: (d.line([cx-R, cy-16*S, cx+R, cy-16*S], fill=BLACK, width=W), d.line([cx-R, cy+16*S, cx+R, cy+16*S], fill=BLACK, width=W)),
        lambda d: (d.line([cx-R, cy+R*0.6, cx+R*0.6, cy-R], fill=BLACK, width=W), d.line([cx-R*0.6, cy+R, cx+R, cy-R*0.6], fill=BLACK, width=W)),
        lambda d: (d.line([cx-R, cy-R, cx+R, cy+R], fill=BLACK, width=W), d.line([cx-R, cy+R, cx+R, cy-R], fill=BLACK, width=W)),
        lambda d: (d.line([cx-16*S, cy-R, cx-16*S, cy+R], fill=BLACK, width=W), d.line([cx+16*S, cy-R, cx+16*S, cy+R], fill=BLACK, width=W)),
    ]),
    (5, 'C', 'A, B, and D have 1/4 of their area shaded, whereas C has 1/2 shaded.', [
        lambda d: (d.pieslice([cx-R, cy-R, cx+R, cy+R], 0, 90, fill=FILL_LIGHT, outline=BLACK, width=W), d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx, cy], fill=FILL_LIGHT), d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.pieslice([cx-R, cy-R, cx+R, cy+R], 0, 180, fill=FILL_LIGHT, outline=BLACK, width=W), d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.polygon([(cx, cy), (cx+R, cy), (cx, cy+R)], fill=FILL_LIGHT), draw_poly(d, cx, cy, R, 4, 0), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
    ]),
    (6, 'B', 'A, C, and D are closed geometric figures, whereas B is an open shape.', [
        lambda d: draw_poly(d, cx, cy+5*S, R, 3),
        lambda d: (d.line([cx-R*0.8, cy-R*0.8, cx-R*0.8, cy+R*0.8, cx+R*0.8, cy+R*0.8, cx+R*0.8, cy-R*0.8], fill=BLACK, width=W)),
        lambda d: draw_poly(d, cx, cy, R, 4, 45),
        lambda d: draw_poly(d, cx, cy, R, 5),
    ]),
    (7, 'D', 'Letters A, M, and T have vertical mirror symmetry, whereas F is asymmetric.', [
        lambda d: (d.line([cx, cy-R, cx-R*0.75, cy+R], fill=BLACK, width=W+S), d.line([cx, cy-R, cx+R*0.75, cy+R], fill=BLACK, width=W+S), d.line([cx-R*0.4, cy+R*0.2, cx+R*0.4, cy+R*0.2], fill=BLACK, width=W+S)),
        lambda d: (d.line([cx-R*0.8, cy+R, cx-R*0.8, cy-R, cx, cy+R*0.2, cx+R*0.8, cy-R, cx+R*0.8, cy+R], fill=BLACK, width=W+S)),
        lambda d: (d.line([cx-R*0.8, cy-R, cx+R*0.8, cy-R], fill=BLACK, width=W+S), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W+S)),
        lambda d: (d.line([cx-R*0.5, cy+R, cx-R*0.5, cy-R, cx+R*0.6, cy-R], fill=BLACK, width=W+S), d.line([cx-R*0.5, cy, cx+R*0.4, cy], fill=BLACK, width=W+S)),
    ]),
    (8, 'C', 'In A, B, and D the inner and outer shapes are identical, whereas C has a circle inside a triangle.', [
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.ellipse([cx-R*0.45, cy-R*0.45, cx+R*0.45, cy+R*0.45], outline=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.rectangle([cx-R*0.45, cy-R*0.45, cx+R*0.45, cy+R*0.45], outline=BLACK, width=W)),
        lambda d: (draw_poly(d, cx, cy+6*S, R*1.1, 3), d.ellipse([cx-R*0.38, cy-R*0.18, cx+R*0.38, cy+R*0.58], outline=BLACK, width=W)),
        lambda d: (draw_poly(d, cx, cy+6*S, R*1.1, 3), draw_poly(d, cx, cy+12*S, R*0.45, 3)),
    ]),
    (9, 'C', 'In A, B, and D the dot is near the arrow tail, whereas in C the dot is near the arrowhead.', [
        lambda d: (draw_arrow(d, cx-R, cy, cx+R, cy), d.ellipse([cx-R-4*S, cy-18*S, cx-R+8*S, cy-6*S], fill=BLACK)),
        lambda d: (draw_arrow(d, cx, cy+R, cx, cy-R), d.ellipse([cx+8*S, cy+R-8*S, cx+20*S, cy+R+4*S], fill=BLACK)),
        lambda d: (draw_arrow(d, cx, cy-R, cx, cy+R), d.ellipse([cx+12*S, cy+R-12*S, cx+24*S, cy+R], fill=BLACK)),
        lambda d: (draw_arrow(d, cx+R, cy, cx-R, cy), d.ellipse([cx+R-8*S, cy-18*S, cx+R+4*S, cy-6*S], fill=BLACK)),
    ]),
    (10, 'C', 'Circles A, B, and D are divided by 4 spokes, whereas C has 5 spokes.', [
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx, cy, cx+R*math.cos(math.radians(a)), cy+R*math.sin(math.radians(a))], fill=BLACK, width=W) for a in [0, 90, 180, 270]]),
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx, cy, cx+R*math.cos(math.radians(a)), cy+R*math.sin(math.radians(a))], fill=BLACK, width=W) for a in [45, 135, 225, 315]]),
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx, cy, cx+R*math.cos(math.radians(a)), cy+R*math.sin(math.radians(a))], fill=BLACK, width=W) for a in [-90, -18, 54, 126, 198]]),
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx, cy, cx+R*math.cos(math.radians(a)), cy+R*math.sin(math.radians(a))], fill=BLACK, width=W) for a in [20, 110, 200, 290]]),
    ]),
    (11, 'D', 'A, B, and C are rotations of the same L-shape, whereas D is a mirror reflection.', [
        lambda d: draw_L(d, cx, cy, 0),
        lambda d: draw_L(d, cx, cy, 90),
        lambda d: draw_L(d, cx, cy, 180),
        lambda d: draw_L(d, cx, cy, 0, mirror=True),
    ]),
    (12, 'C', 'A, B, and D are straight-edged polygons, whereas C is a curved circle.', [
        lambda d: draw_poly(d, cx, cy+6*S, R, 3),
        lambda d: draw_poly(d, cx, cy, R, 4, 45),
        lambda d: d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W),
        lambda d: draw_poly(d, cx, cy, R, 6),
    ]),
    (13, 'D', 'Squares A, B, and C contain 3 parallel lines, whereas D contains 4 parallel lines.', [
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx-R, cy+y, cx+R, cy+y], fill=BLACK, width=W) for y in [-24*S, 0, 24*S]]),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx+x, cy-R, cx+x, cy+R], fill=BLACK, width=W) for x in [-24*S, 0, 24*S]]),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy+R, cx+R, cy-R], fill=BLACK, width=W), d.line([cx-R, cy+10*S, cx+10*S, cy-R], fill=BLACK, width=W), d.line([cx-10*S, cy+R, cx+R, cy-10*S], fill=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), [d.line([cx-R, cy+y, cx+R, cy+y], fill=BLACK, width=W) for y in [-30*S, -10*S, 10*S, 30*S]]),
    ]),
    (14, 'B', 'In A, C, and D the dot is inside the shape, whereas in B the dot is outside.', [
        lambda d: (d.rectangle([cx-R*0.8, cy-R*0.8, cx+R*0.8, cy+R*0.8], outline=BLACK, width=W), draw_dots(d, cx, cy, 1, 7*S)),
        lambda d: (d.ellipse([cx-R*0.75, cy-R*0.75, cx+R*0.75, cy+R*0.75], outline=BLACK, width=W), draw_dots(d, cx+R*0.95, cy-R*0.85, 1, 7*S)),
        lambda d: (draw_poly(d, cx, cy+6*S, R, 3), draw_dots(d, cx, cy+12*S, 1, 7*S)),
        lambda d: (draw_poly(d, cx, cy, R, 4, 0), draw_dots(d, cx, cy, 1, 7*S)),
    ]),
    (15, 'D', 'A, B, and C feature a vertical-horizontal plus (+) cross, whereas D features a diagonal (X) cross.', [
        lambda d: (d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W), d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy-R, cx+R, cy+R], fill=BLACK, width=W), d.line([cx-R, cy+R, cx+R, cy-R], fill=BLACK, width=W)),
    ]),
    (16, 'C', 'Clocks A, B, and D show a 90-degree right angle between hands, whereas C shows a 180-degree straight angle.', [
        lambda d: draw_clock(d, cx, cy, R, 0, -90),
        lambda d: draw_clock(d, cx, cy, R, 180, -90),
        lambda d: draw_clock(d, cx, cy, R, 90, -90),
        lambda d: draw_clock(d, cx, cy, R, 90, 0),
    ]),
    (17, 'C', 'A, B, and D have 2 concentric shapes, whereas C has 3 concentric circles.', [
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.ellipse([cx-R*0.5, cy-R*0.5, cx+R*0.5, cy+R*0.5], outline=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.rectangle([cx-R*0.5, cy-R*0.5, cx+R*0.5, cy+R*0.5], outline=BLACK, width=W)),
        lambda d: (d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.ellipse([cx-R*0.65, cy-R*0.65, cx+R*0.65, cy+R*0.65], outline=BLACK, width=W), d.ellipse([cx-R*0.32, cy-R*0.32, cx+R*0.32, cy+R*0.32], outline=BLACK, width=W)),
        lambda d: (draw_poly(d, cx, cy+6*S, R, 3), draw_poly(d, cx, cy+10*S, R*0.5, 3)),
    ]),
    (18, 'C', 'In A, B, and D the two shapes overlap, whereas in C the two triangles are separated.', [
        lambda d: (d.ellipse([cx-R, cy-R*0.6, cx+R*0.2, cy+R*0.6], outline=BLACK, width=W), d.ellipse([cx-R*0.2, cy-R*0.6, cx+R, cy+R*0.6], outline=BLACK, width=W)),
        lambda d: (d.rectangle([cx-R, cy-R*0.55, cx+R*0.2, cy+R*0.55], outline=BLACK, width=W), d.rectangle([cx-R*0.2, cy-R*0.55, cx+R, cy+R*0.55], outline=BLACK, width=W)),
        lambda d: (draw_poly(d, cx-R*0.55, cy+4*S, R*0.48, 3), draw_poly(d, cx+R*0.55, cy+4*S, R*0.48, 3)),
        lambda d: (draw_poly(d, cx-R*0.35, cy, R*0.55, 4, 0), draw_poly(d, cx+R*0.35, cy, R*0.55, 4, 0)),
    ]),
    (19, 'C', 'In A, B, and D opposite corners are shaded, whereas in C adjacent (top) corners are shaded.', [
        lambda d: corner_tri(d, cx, cy, R, ['TL', 'BR']),
        lambda d: corner_tri(d, cx, cy, R, ['TR', 'BL']),
        lambda d: corner_tri(d, cx, cy, R, ['TL', 'TR']),
        lambda d: corner_tri(d, cx, cy, R, ['BL', 'TR']),
    ]),
    (20, 'D', 'A, B, and C are single-headed arrows, whereas D is a double-headed arrow.', [
        lambda d: draw_arrow(d, cx-R*0.7, cy+R*0.7, cx+R*0.7, cy-R*0.7),
        lambda d: draw_arrow(d, cx+R*0.7, cy-R*0.7, cx-R*0.7, cy+R*0.7),
        lambda d: draw_arrow(d, cx+R*0.7, cy+R*0.7, cx-R*0.7, cy-R*0.7),
        lambda d: draw_arrow(d, cx-R*0.8, cy, cx+R*0.8, cy, double=True),
    ]),
]

new_entries = []
for q_idx, correct, explanation, fns in specs:
    # Build 4 option images (160x160) AND 1 combined question diagram (680x180)
    q_strip = Image.new('RGB', (700, 180), WHITE)
    q_draw = ImageDraw.Draw(q_strip)
    letters = ['a', 'b', 'c', 'd']
    for i, fn in enumerate(fns):
        im = new_card()
        d = ImageDraw.Draw(im)
        fn(d)
        opt_im = im.resize((160, 160), Image.Resampling.LANCZOS)
        opt_im.save(f"{OPTIONS_DIR}/nv-odd-{q_idx}-opt-{letters[i]}.jpg", quality=95)

        # Paste into question strip with label A/B/C/D
        ox = 15 + i * 170
        q_draw.rectangle([ox, 8, ox + 158, 172], outline=(226, 232, 240), width=1)
        q_draw.text((ox + 8, 12), f"({letters[i].upper()})", fill=SLATE)
        q_thumb = opt_im.resize((136, 136), Image.Resampling.LANCZOS)
        q_strip.paste(q_thumb, (ox + 11, 28))

    q_strip.save(f"{QUESTIONS_DIR}/nv-q-odd-{q_idx}.jpg", quality=95)

    new_entries.append({
        "id": 1100 + q_idx,
        "category_id": 3,
        "category": "3. Classification & Odd One Out",
        "question_text": f"[Odd Figure Out #{q_idx}] Identify the figure (A, B, C, or D) that is different from the other three:",
        "option_a": "Pattern 1 (Figure A)",
        "option_b": "Pattern 2 (Figure B)",
        "option_c": "Pattern 3 (Figure C)",
        "option_d": "Pattern 4 (Figure D)",
        "correct_option": correct,
        "explanation": explanation,
        "question_image_url": f"/images/non-verbal/questions/nv-q-odd-{q_idx}.jpg?v=20261127c",
        "option_a_image_url": f"/images/non-verbal/options/nv-odd-{q_idx}-opt-a.jpg?v=20261127c",
        "option_b_image_url": f"/images/non-verbal/options/nv-odd-{q_idx}-opt-b.jpg?v=20261127c",
        "option_c_image_url": f"/images/non-verbal/options/nv-odd-{q_idx}-opt-c.jpg?v=20261127c",
        "option_d_image_url": f"/images/non-verbal/options/nv-odd-{q_idx}-opt-d.jpg?v=20261127c",
    })

with open(BANK_PATH, "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r'export const NON_VERBAL_52_BANK: BankQuestion\[\] = (\[.*?\]);', content, re.S)
arr = json.loads(m.group(1))
# Remove any prior 1101..1120 if re-run
arr = [q for q in arr if not (1101 <= q["id"] <= 1120)]
arr.extend(new_entries)

new_json = json.dumps(arr, indent=2)
new_content = content[:m.start(1)] + new_json + content[m.end(1):]
with open(BANK_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Generated 20 Odd One Out questions & 80 option images. Total bank size: {len(arr)}")
