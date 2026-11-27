import os
import math
import json
import re
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageOps

QUESTIONS_DIR = "public/images/non-verbal/questions"
OPTIONS_DIR = "public/images/non-verbal/options"
BASE_DIR = "public/images/non-verbal"
BANK_PATH = "src/lib/non-verbal-questions-bank.ts"

os.makedirs(QUESTIONS_DIR, exist_ok=True)
os.makedirs(OPTIONS_DIR, exist_ok=True)

# Copy the 2 Mirror Study Reference Charts
shutil.copy(r"C:\Users\wc\.gemini\antigravity\brain\687c0c7f-f601-4ec0-9cc3-14e555a2f804\.user_uploaded\media_1795750674380_512f4c7b.jpg", f"{BASE_DIR}/mirror-words-ref.jpg")
shutil.copy(r"C:\Users\wc\.gemini\antigravity\brain\687c0c7f-f601-4ec0-9cc3-14e555a2f804\.user_uploaded\media_1795750688986_980b4f94.jpg", f"{BASE_DIR}/mirror-letters-ref.jpg")

S = 4
SZ = 140 * S
BLACK = (15, 23, 42)
SLATE = (100, 116, 139)
FILL_DARK = (30, 41, 59)
FILL_LIGHT = (203, 213, 225)
BLUE = (37, 99, 235)
WHITE = (255, 255, 255)
W = 3 * S

font_path = r"C:\Windows\Fonts\timesbd.ttf"
if not os.path.exists(font_path):
    font_path = r"C:\Windows\Fonts\arialbd.ttf"
font_q = ImageFont.truetype(font_path, 26 * S)

def new_tile(sz=SZ):
    return Image.new("RGB", (sz, sz), WHITE)

def poly_pts(cx, cy, r, n, rot_deg=-90):
    return [(cx + r * math.cos(math.radians(rot_deg + i * 360 / n)),
             cy + r * math.sin(math.radians(rot_deg + i * 360 / n))) for i in range(n)]

def draw_poly(d, cx, cy, r, n, rot_deg=-90, outline=BLACK, fill=None, w=W):
    d.polygon(poly_pts(cx, cy, r, n, rot_deg), fill=fill, outline=outline, width=w)

def draw_arrow(d, x0, y0, x1, y1, w=W, head=11*S, color=BLACK):
    d.line([x0, y0, x1, y1], fill=color, width=w)
    ang = math.atan2(y1 - y0, x1 - x0)
    for a_off in [math.radians(150), math.radians(-150)]:
        d.line([x1, y1, x1 + head*math.cos(ang+a_off), y1 + head*math.sin(ang+a_off)], fill=color, width=w)

def draw_dot(d, x, y, r=5*S, color=BLACK):
    d.ellipse([x-r, y-r, x+r, y+r], fill=color)

def draw_qmark(d, cx, cy, r=42*S):
    d.rectangle([cx-r, cy-r, cx+r, cy+r], outline=SLATE, width=W)
    scale = r / (42*S)
    d.arc([cx-12*S*scale, cy-22*S*scale, cx+12*S*scale, cy-2*S*scale], start=180, end=45, fill=BLACK, width=W)
    d.line([cx+8*S*scale, cy-4*S*scale, cx, cy+6*S*scale, cx, cy+12*S*scale], fill=BLACK, width=W)
    draw_dot(d, cx, cy+21*S*scale, r=3.5*S*scale)

def asym_flag(d, cx, cy, rot=0, flip_h=False, flip_v=False, scale=1.0):
    pts = [(-20*S*scale, 30*S*scale), (-20*S*scale, -30*S*scale), (22*S*scale, -30*S*scale)]
    bar = [(-20*S*scale, -4*S*scale), (10*S*scale, -4*S*scale)]
    dot = (-6*S*scale, -17*S*scale)
    def tx(p):
        x, y = p
        if flip_h: x = -x
        if flip_v: y = -y
        rad = math.radians(rot)
        return (cx + x*math.cos(rad) - y*math.sin(rad), cy + x*math.sin(rad) + y*math.cos(rad))
    d.line([tx(p) for p in pts], fill=BLACK, width=W+S, joint="curve")
    d.line([tx(p) for p in bar], fill=BLACK, width=W+S)
    dx, dy = tx(dot)
    draw_dot(d, dx, dy, r=4.5*S)

def asym_hook(d, cx, cy, rot=0, flip_h=False, flip_v=False):
    pts = [(-24*S, 24*S), (-24*S, -24*S), (18*S, -24*S), (18*S, 0), (2*S, 0)]
    def tx(p):
        x, y = p
        if flip_h: x = -x
        if flip_v: y = -y
        rad = math.radians(rot)
        return (cx + x*math.cos(rad) - y*math.sin(rad), cy + x*math.sin(rad) + y*math.cos(rad))
    tpts = [tx(p) for p in pts]
    d.line(tpts, fill=BLACK, width=W+S, joint="curve")
    x0, y0 = tpts[-2]; x1, y1 = tpts[-1]
    draw_arrow(d, x0, y0, x1, y1, w=W+S, head=9*S)

def render_text_tile(text, mirror_h=False, mirror_v=False, w_px=200*S, h_px=SZ, font=font_q):
    im = Image.new("RGB", (w_px, h_px), WHITE)
    d = ImageDraw.Draw(im)
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((w_px - tw)//2 - bbox[0], (h_px - th)//2 - bbox[1]), text, fill=BLACK, font=font)
    if mirror_h: im = ImageOps.mirror(im)
    if mirror_v: im = ImageOps.flip(im)
    return im

cx, cy = SZ // 2, SZ // 2
R = 42 * S
CAT_NAMES = {
    1: "1. Pattern Series Completion",
    2: "2. Analogy of Figures",
    4: "4. Matrix & Pattern Completion",
    5: "5. Spatial Rotation & Orientation",
    6: "6. Mirror & Water Reflection",
    7: "7. Embedded & Hidden Figures",
    8: "8. Paper Folding & Cutting",
    9: "9. Dot Situation Logic",
    10: "10. Figure Formation & Grouping",
}
PROMPTS = {
    1: "Select the appropriate figure (A, B, C, or D) that completes the pattern series:",
    2: "Study the relationship between the first two figures and select the matching fourth figure (A, B, C, or D):",
    4: "Identify the missing pattern (A, B, C, or D) that completes the 3x3 matrix:",
    5: "Which figure (A, B, C, or D) is a pure rotation of the target figure without mirroring?",
    6: "Select the correct mirror or water reflection (A, B, C, or D) of the given figure:",
    7: "Find the composite figure (A, B, C, or D) in which the target shape is hidden/embedded:",
    8: "Determine how the punched folded paper will look when completely unfolded (A, B, C, or D):",
    9: "Find the figure (A, B, C, or D) that satisfies the exact same dot placement condition:",
    10: "Which assembled figure (A, B, C, or D) can be formed by joining the given separate pieces?",
}

all_catalog = {k: [] for k in CAT_NAMES}

# --- CAT 1 ---
for i in range(20):
    q_tiles = []; rule = i % 5; variant = i // 5
    if rule == 0:
        step_deg = 45 if variant % 2 == 0 else 90
        start_deg = -90 + variant * 45
        for s in range(3):
            im = new_tile(); d = ImageDraw.Draw(im)
            d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
            ang = math.radians(start_deg + s * step_deg)
            draw_arrow(d, cx, cy, cx + (R-8*S)*math.cos(ang), cy + (R-8*S)*math.sin(ang))
            q_tiles.append(im)
        im_q = new_tile(); draw_qmark(ImageDraw.Draw(im_q), cx, cy); q_tiles.append(im_q)
        target_deg = start_deg + 3 * step_deg
        degs = [target_deg, target_deg + 90, target_deg + 180, target_deg - 45]
        ans_idx = i % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
        for k in order:
            im = new_tile(); d = ImageDraw.Draw(im)
            d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
            ang = math.radians(degs[k])
            draw_arrow(d, cx, cy, cx + (R-8*S)*math.cos(ang), cy + (R-8*S)*math.sin(ang))
            opts.append(im)
        expl = f"The arrow inside the circle rotates {step_deg} degrees clockwise at each step."
    elif rule == 1:
        base_n = 3 + (variant % 2)
        for s in range(3):
            im = new_tile(); draw_poly(ImageDraw.Draw(im), cx, cy, R, base_n + s); q_tiles.append(im)
        im_q = new_tile(); draw_qmark(ImageDraw.Draw(im_q), cx, cy); q_tiles.append(im_q)
        target_n = base_n + 3
        ns = [target_n, target_n - 2, target_n + 2, 3 if target_n != 3 else 4]
        ans_idx = (i + 1) % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
        for k in order:
            im = new_tile(); draw_poly(ImageDraw.Draw(im), cx, cy, R, ns[k]); opts.append(im)
        expl = f"Polygon sides increase by +1 at each step ({base_n} -> {base_n+1} -> {base_n+2} -> {target_n})."
    elif rule == 2:
        corners = [(-24*S, -24*S), (24*S, -24*S), (24*S, 24*S), (-24*S, 24*S)]
        start_c = variant % 4
        for s in range(3):
            im = new_tile(); d = ImageDraw.Draw(im)
            d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
            if variant >= 2:
                d.line([cx-R, cy, cx+R, cy], fill=FILL_LIGHT, width=W); d.line([cx, cy-R, cx, cy+R], fill=FILL_LIGHT, width=W)
            dx, dy = corners[(start_c + s) % 4]; draw_dot(d, cx+dx, cy+dy, r=8*S); q_tiles.append(im)
        im_q = new_tile(); draw_qmark(ImageDraw.Draw(im_q), cx, cy); q_tiles.append(im_q)
        target_c = (start_c + 3) % 4
        cs = [target_c, (target_c+1)%4, (target_c+2)%4, (target_c+3)%4]
        ans_idx = (i + 2) % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
        for k in order:
            im = new_tile(); d = ImageDraw.Draw(im)
            d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
            if variant >= 2:
                d.line([cx-R, cy, cx+R, cy], fill=FILL_LIGHT, width=W); d.line([cx, cy-R, cx, cy+R], fill=FILL_LIGHT, width=W)
            dx, dy = corners[cs[k]]; draw_dot(d, cx+dx, cy+dy, r=8*S); opts.append(im)
        expl = "The black dot steps clockwise to the next corner at each step."
    elif rule == 3:
        start_q = (variant * 90) % 360
        for s in range(3):
            im = new_tile(); d = ImageDraw.Draw(im); ang = (start_q + s * 90) % 360
            d.pieslice([cx-R, cy-R, cx+R, cy+R], ang, ang+90, fill=FILL_DARK, outline=BLACK, width=W)
            d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W); d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W); d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)
            q_tiles.append(im)
        im_q = new_tile(); draw_qmark(ImageDraw.Draw(im_q), cx, cy); q_tiles.append(im_q)
        target_q = (start_q + 270) % 360
        qs = [target_q, (target_q+90)%360, (target_q+180)%360, (target_q+270)%360]
        ans_idx = (i + 3) % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
        for k in order:
            im = new_tile(); d = ImageDraw.Draw(im); ang = qs[k]
            d.pieslice([cx-R, cy-R, cx+R, cy+R], ang, ang+90, fill=FILL_DARK, outline=BLACK, width=W)
            d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W); d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W); d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)
            opts.append(im)
        expl = "The shaded quadrant rotates 90 degrees clockwise at each step."
    else:
        horiz = (variant % 2 == 0)
        for s in range(1, 4):
            im = new_tile(); d = ImageDraw.Draw(im); d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
            for b in range(s):
                off = -24*S + b * 18*S
                if horiz: d.line([cx-R, cy+off, cx+R, cy+off], fill=BLACK, width=W)
                else: d.line([cx+off, cy-R, cx+off, cy+R], fill=BLACK, width=W)
            q_tiles.append(im)
        im_q = new_tile(); draw_qmark(ImageDraw.Draw(im_q), cx, cy); q_tiles.append(im_q)
        counts = [4, 2, 5, 1]; ans_idx = i % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
        for k in order:
            im = new_tile(); d = ImageDraw.Draw(im); d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
            cnt = counts[k]
            for b in range(cnt):
                off = -28*S + b * (56*S / max(cnt, 1))
                if horiz: d.line([cx-R, cy+off, cx+R, cy+off], fill=BLACK, width=W)
                else: d.line([cx+off, cy-R, cx+off, cy+R], fill=BLACK, width=W)
            opts.append(im)
        expl = "One additional parallel line is added inside the square at each step (1 -> 2 -> 3 -> 4)."
    all_catalog[1].append((i+1, q_tiles, opts, ['A', 'B', 'C', 'D'][ans_idx], expl))

# --- CAT 2 ---
for i in range(20):
    rule = i % 5; variant = i // 5
    if rule == 0:
        shapes = [(3, -90), (4, 45), (5, -90), (6, -90)]
        n1, r1 = shapes[variant % 4]; n2, r2 = shapes[(variant + 1) % 4]
        im1 = new_tile(); draw_poly(ImageDraw.Draw(im1), cx, cy, R, n1, r1, fill=None)
        im2 = new_tile(); draw_poly(ImageDraw.Draw(im2), cx, cy, R, n1, r1, fill=FILL_DARK)
        im3 = new_tile(); draw_poly(ImageDraw.Draw(im3), cx, cy, R, n2, r2, fill=None)
        im4 = new_tile(); draw_qmark(ImageDraw.Draw(im4), cx, cy)
        q_tiles = [im1, im2, im3, im4]; ans_idx = i % 4
        raw_opts = [
            lambda d: draw_poly(d, cx, cy, R, n2, r2, fill=FILL_DARK),
            lambda d: draw_poly(d, cx, cy, R, n2, r2, fill=None),
            lambda d: draw_poly(d, cx, cy, R, n1, r1, fill=FILL_DARK),
            lambda d: draw_poly(d, cx, cy, R*0.6, n2, r2+30, fill=FILL_LIGHT),
        ]
        order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
        for k in order: im = new_tile(); raw_opts[k](ImageDraw.Draw(im)); opts.append(im)
        expl = "First figure becomes solid-filled in the second; apply the same rule to the third figure."
    elif rule == 1:
        ang1 = variant * 45; ang2 = ang1 + 90
        def make_arr(a):
            im = new_tile(); r1 = math.radians(a)
            draw_arrow(ImageDraw.Draw(im), cx - R*0.8*math.cos(r1), cy - R*0.8*math.sin(r1), cx + R*0.8*math.cos(r1), cy + R*0.8*math.sin(r1))
            return im
        q_tiles = [make_arr(ang1), make_arr(ang1+180), make_arr(ang2), new_tile()]
        draw_qmark(ImageDraw.Draw(q_tiles[3]), cx, cy); ans_idx = (i + 1) % 4
        degs = [ang2+180, ang2, ang2+90, ang1+180]; order = [(k - ans_idx) % 4 for k in range(4)]
        opts = [make_arr(degs[k]) for k in order]
        expl = "The arrow reverses direction by 180 degrees in the pair."
    elif rule == 2:
        pairs = [((0, 4), (3, 0)), ((4, 3), (0, 3)), ((3, 4), (4, 0)), ((0, 5), (3, 5))]
        (o1, in1), (o2, in2) = pairs[variant % 4]
        def draw_s(d, sh, rad):
            if sh == 0: d.ellipse([cx-rad, cy-rad, cx+rad, cy+rad], outline=BLACK, width=W)
            else: draw_poly(d, cx, cy, rad, sh, 45 if sh==4 else -90)
        def make_pair(a, b):
            im = new_tile(); d = ImageDraw.Draw(im); draw_s(d, a, R); draw_s(d, b, R*0.48); return im
        q_tiles = [make_pair(o1, in1), make_pair(in1, o1), make_pair(o2, in2), new_tile()]
        draw_qmark(ImageDraw.Draw(q_tiles[3]), cx, cy); ans_idx = (i + 2) % 4
        cand = [(in2, o2), (o2, in2), (in1, o2), (in2, in1 if in1 != in2 else 6)]
        order = [(k - ans_idx) % 4 for k in range(4)]; opts = [make_pair(*cand[k]) for k in order]
        expl = "The inner and outer shapes swap positions."
    elif rule == 3:
        shs = [0, 4, 3, 5]; s1, s2 = shs[variant % 4], shs[(variant + 1) % 4]
        def draw_one(sh, dbl=False):
            im = new_tile(); d = ImageDraw.Draw(im)
            if not dbl:
                if sh == 0: d.ellipse([cx-R*0.7, cy-R*0.7, cx+R*0.7, cy+R*0.7], outline=BLACK, width=W)
                else: draw_poly(d, cx, cy, R*0.75, sh, 45 if sh==4 else -90)
            else:
                for dx in [-18*S, 18*S]:
                    if sh == 0: d.ellipse([cx+dx-R*0.55, cy-R*0.55, cx+dx+R*0.55, cy+R*0.55], outline=BLACK, width=W)
                    else: draw_poly(d, cx+dx, cy, R*0.55, sh, 45 if sh==4 else -90)
            return im
        q_tiles = [draw_one(s1, False), draw_one(s1, True), draw_one(s2, False), new_tile()]
        draw_qmark(ImageDraw.Draw(q_tiles[3]), cx, cy); ans_idx = (i + 3) % 4
        cand = [(s2, True), (s2, False), (s1, True), ((s2+1)%4 if (s2+1)%4 in [0,3,4,5] else 6, True)]
        order = [(k - ans_idx) % 4 for k in range(4)]; opts = [draw_one(*cand[k]) for k in order]
        expl = "A single shape becomes an overlapping pair of the same shape."
    else:
        r_base = variant * 90
        def make_f(deg):
            im = new_tile(); asym_flag(ImageDraw.Draw(im), cx, cy, rot=deg); return im
        q_tiles = [make_f(r_base), make_f(r_base+90), make_f(r_base+180), new_tile()]
        draw_qmark(ImageDraw.Draw(q_tiles[3]), cx, cy); ans_idx = i % 4
        degs = [r_base+270, r_base+180, r_base, r_base+90]; order = [(k - ans_idx) % 4 for k in range(4)]
        opts = [make_f(degs[k]) for k in order]
        expl = "The figure rotates 90 degrees clockwise from first to second."
    all_catalog[2].append((i+1, q_tiles, opts, ['A', 'B', 'C', 'D'][ans_idx], expl))

# --- CAT 4 ---
for i in range(20):
    rule = i % 4; variant = i // 4; MSZ = 240 * S; im_m = Image.new("RGB", (MSZ, MSZ), WHITE); dm = ImageDraw.Draw(im_m); cell = MSZ // 3
    for g in range(1, 3): dm.line([g*cell, 6*S, g*cell, MSZ-6*S], fill=SLATE, width=2*S); dm.line([6*S, g*cell, MSZ-6*S, g*cell], fill=SLATE, width=2*S)
    dm.rectangle([4*S, 4*S, MSZ-4*S, MSZ-4*S], outline=BLACK, width=W)
    def draw_cell_shape(d, gx, gy, sh, fill_mode):
        fl = FILL_DARK if fill_mode == 2 else (FILL_LIGHT if fill_mode == 1 else None); rad = 22 * S
        if sh == 0: d.ellipse([gx-rad, gy-rad, gx+rad, gy+rad], fill=fl, outline=BLACK, width=W)
        elif sh == 1: draw_poly(d, gx, gy, rad*1.1, 4, 45, fill=fl)
        else: draw_poly(d, gx, gy+3*S, rad*1.1, 3, -90, fill=fl)
    if rule == 0:
        rows = [[0, 1, 2], [1, 2, 0], [2, 0, 1]]; shift = variant % 3; target_sh = (rows[2][2] + shift) % 3
        for r in range(3):
            for c in range(3):
                gx, gy = c*cell + cell//2, r*cell + cell//2
                if r == 2 and c == 2: draw_qmark(dm, gx, gy, r=24*S)
                else: draw_cell_shape(dm, gx, gy, (rows[r][c] + shift) % 3, 0)
        cand = [(target_sh, 0), ((target_sh+1)%3, 0), ((target_sh+2)%3, 0), (target_sh, 2)]
        expl = "Each row and column contains Circle, Square, and Triangle exactly once."
    elif rule == 1:
        sh_row = [(variant+0)%3, (variant+1)%3, (variant+2)%3]
        for r in range(3):
            for c in range(3):
                gx, gy = c*cell + cell//2, r*cell + cell//2
                if r == 2 and c == 2: draw_qmark(dm, gx, gy, r=24*S)
                else: draw_cell_shape(dm, gx, gy, sh_row[r], c)
        cand = [(sh_row[2], 2), (sh_row[2], 0), (sh_row[2], 1), ((sh_row[2]+1)%3, 2)]
        expl = "Each row keeps the same shape while shading progresses: Outline -> Light -> Solid."
    elif rule == 2:
        counts = [[1, 1, 2], [1, 2, 3], [2, 2, 4]]
        for r in range(3):
            for c in range(3):
                gx, gy = c*cell + cell//2, r*cell + cell//2
                if r == 2 and c == 2: draw_qmark(dm, gx, gy, r=24*S)
                else:
                    cnt = counts[r][c]; offs = {1:[(0,0)], 2:[(-12*S,0),(12*S,0)], 3:[(0,-12*S),(-12*S,10*S),(12*S,10*S)], 4:[(-12*S,-12*S),(12*S,-12*S),(-12*S,12*S),(12*S,12*S)]}[cnt]
                    for dx, dy in offs: draw_dot(dm, gx+dx, gy+dy, r=5*S)
        cand = [4, 2, 3, 1]; expl = "In each row, Column 1 dots + Column 2 dots = Column 3 dots (2 + 2 = 4)."
    else:
        base_a = variant * 45
        for r in range(3):
            for c in range(3):
                gx, gy = c*cell + cell//2, r*cell + cell//2
                if r == 2 and c == 2: draw_qmark(dm, gx, gy, r=24*S)
                else:
                    ang = math.radians(base_a + r*45 + c*45)
                    draw_arrow(dm, gx - 20*S*math.cos(ang), gy - 20*S*math.sin(ang), gx + 20*S*math.cos(ang), gy + 20*S*math.sin(ang), head=9*S)
        target_a = base_a + 180; cand = [target_a, target_a+45, target_a+90, target_a-90]
        expl = "The arrow rotates 45 degrees clockwise across each column and down each row."
    ans_idx = i % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
    for k in order:
        im = new_tile(); d = ImageDraw.Draw(im)
        if rule in (0, 1): draw_cell_shape(d, cx, cy, cand[k][0], cand[k][1])
        elif rule == 2:
            offs = {1:[(0,0)], 2:[(-16*S,0),(16*S,0)], 3:[(0,-16*S),(-16*S,14*S),(16*S,14*S)], 4:[(-16*S,-16*S),(16*S,-16*S),(-16*S,16*S),(16*S,16*S)]}[cand[k]]
            for dx, dy in offs: draw_dot(d, cx+dx, cy+dy, r=7*S)
        else:
            ang = math.radians(cand[k]); draw_arrow(d, cx - 32*S*math.cos(ang), cy - 32*S*math.sin(ang), cx + 32*S*math.cos(ang), cy + 32*S*math.sin(ang))
        opts.append(im)
    all_catalog[4].append((i+1, [im_m], opts, ['A', 'B', 'C', 'D'][ans_idx], expl))

# --- CAT 5 ---
for i in range(20):
    base_rot = (i * 35) % 360; rot_ans = base_rot + [90, 180, 270, 135][i % 4]; use_flag = (i % 2 == 0)
    def make_rot(r, mir=False):
        im = new_tile(); d = ImageDraw.Draw(im)
        if use_flag: asym_flag(d, cx, cy, rot=r, flip_h=mir)
        else: asym_hook(d, cx, cy, rot=r, flip_h=mir)
        return im
    q_im = make_rot(base_rot, mir=False); ans_idx = i % 4
    cand = [(rot_ans, False), (rot_ans, True), (base_rot+90, True), (base_rot+180, True)]
    order = [(k - ans_idx) % 4 for k in range(4)]; opts = [make_rot(*cand[k]) for k in order]
    correct = ['A', 'B', 'C', 'D'][ans_idx]
    all_catalog[5].append((i+1, [q_im], opts, correct, f"Option {correct} is a pure rotation of the target figure without mirror flipping."))

# --- CAT 6 (Q1-10 Words & Numbers Mirror + Q11-20 Water Reflections) ---
words_nums = [
    ("PREDICTION", "NOITCIDERP", "PЯEDICTION"),
    ("HOSPITAL", "LATIPSOH", "HOSPITAl"),
    ("DARPAN", "NAPRAD", "DARPAN"),
    ("STRIDENT", "TNEDIRTS", "STRIDEИT"),
    ("OPULENT", "TNELUPO", "OPULEИT"),
    ("32596", "69523", "32569"),
    ("8932", "2398", "8923"),
    ("786", "687", "768"),
    ("10190", "09101", "10910"),
    ("8964", "4698", "8946"),
]
for i in range(20):
    if i < 10:
        word, rev_only, typo_word = words_nums[i]
        q_im = Image.new("RGB", (300*S, SZ), WHITE); dq = ImageDraw.Draw(q_im)
        q_im.paste(render_text_tile(word, w_px=195*S, font=font_q), (0, 0))
        dq.line([205*S, 15*S, 205*S, SZ-15*S], fill=BLUE, width=W)
        for ty in range(20*S, SZ-15*S, 12*S): dq.line([205*S, ty, 215*S, ty-6*S], fill=BLUE, width=2*S)
        draw_qmark(dq, 258*S, SZ//2, r=24*S)
        cands = [
            render_text_tile(word, mirror_h=True, w_px=200*S, font=font_q),
            render_text_tile(rev_only, mirror_h=False, w_px=200*S, font=font_q),
            render_text_tile(word, mirror_v=True, w_px=200*S, font=font_q),
            render_text_tile(typo_word, mirror_h=True, w_px=200*S, font=font_q),
        ]
        ans_idx = i % 4; order = [(k - ans_idx) % 4 for k in range(4)]
        opts = [cands[k] for k in order]
        expl = f"Vertical mirror image of '{word}' reverses character order from right to left and laterally inverts each glyph."
    else:
        rot_base = (i * 40) % 360; use_flag = (i % 2 == 0)
        q_im = Image.new("RGB", (SZ, 220*S), WHITE); dq = ImageDraw.Draw(q_im)
        if use_flag: asym_flag(dq, cx, 65*S, rot=rot_base)
        else: asym_hook(dq, cx, 65*S, rot=rot_base)
        dq.line([15*S, 135*S, SZ-15*S, 135*S], fill=BLUE, width=W)
        for tx in range(20*S, SZ-15*S, 12*S): dq.line([tx, 135*S, tx-6*S, 145*S], fill=BLUE, width=2*S)
        draw_qmark(dq, cx, 180*S, r=24*S)
        def make_ref(fh, fv, r):
            im = new_tile(); d = ImageDraw.Draw(im)
            if use_flag: asym_flag(d, cx, cy, rot=r, flip_h=fh, flip_v=fv)
            else: asym_hook(d, cx, cy, rot=r, flip_h=fh, flip_v=fv)
            return im
        ans_idx = i % 4
        cand = [(False, True, -rot_base), (True, False, rot_base), (False, False, rot_base+90), (False, True, -rot_base+90)]
        order = [(k - ans_idx) % 4 for k in range(4)]; opts = [make_ref(*cand[k]) for k in order]
        expl = "Horizontal water reflection inverts top-to-bottom across the water surface line."
    all_catalog[6].append((i+1, [q_im], opts, ['A', 'B', 'C', 'D'][ans_idx], expl))

# --- CAT 7 ---
for i in range(20):
    t_type = i % 5
    def draw_target(d, col=BLACK):
        if t_type == 0: d.line([cx-24*S, cy-24*S, cx+24*S, cy-24*S, cx-24*S, cy+24*S, cx+24*S, cy+24*S], fill=col, width=W+S)
        elif t_type == 1: d.line([cx-24*S, cy-20*S, cx, cy+24*S, cx+24*S, cy-20*S], fill=col, width=W+S)
        elif t_type == 2: d.line([cx-24*S, cy-20*S, cx+24*S, cy-20*S], fill=col, width=W+S); d.line([cx, cy-20*S, cx, cy+24*S], fill=col, width=W+S)
        elif t_type == 3: d.line([cx-24*S, cy-24*S, cx-24*S, cy, cx+24*S, cy, cx+24*S, cy+24*S], fill=col, width=W+S)
        else: draw_poly(d, cx, cy, 24*S, 3, -90, outline=col, w=W+S); d.line([cx, cy-24*S, cx, cy+12*S], fill=col, width=W+S)
    q_im = new_tile(); draw_target(ImageDraw.Draw(q_im)); ans_idx = i % 4; opts = []
    for k in range(4):
        im = new_tile(); d = ImageDraw.Draw(im); d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
        if k == ans_idx:
            draw_target(d); d.line([cx-R, cy, cx+R, cy], fill=BLACK, width=W); d.ellipse([cx-R*0.6, cy-R*0.6, cx+R*0.6, cy+R*0.6], outline=BLACK, width=W)
        elif k == (ans_idx+1)%4: d.line([cx-R, cy-R, cx+R, cy+R], fill=BLACK, width=W); d.line([cx-R, cy+R, cx+R, cy-R], fill=BLACK, width=W)
        elif k == (ans_idx+2)%4: d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W); d.line([cx, cy-R, cx, cy+R], fill=BLACK, width=W)
        else: draw_poly(d, cx, cy, R*0.8, 4, 0)
        opts.append(im)
    correct = ['A', 'B', 'C', 'D'][ans_idx]
    all_catalog[7].append((i+1, [q_im], opts, correct, f"The exact target shape is embedded inside composite figure {correct}."))

# --- CAT 8 ---
for i in range(20):
    punch_type = i % 4; q_im = Image.new("RGB", (300*S, SZ), WHITE); dq = ImageDraw.Draw(q_im)
    dq.rectangle([15*S, 28*S, 95*S, 108*S], outline=BLACK, width=W); dq.line([55*S, 28*S, 55*S, 108*S], fill=BLUE, width=2*S); draw_arrow(dq, 28*S, 68*S, 48*S, 68*S, head=6*S, color=BLUE)
    dq.rectangle([115*S, 28*S, 155*S, 108*S], outline=BLACK, width=W); dq.line([115*S, 68*S, 155*S, 68*S], fill=BLUE, width=2*S); draw_arrow(dq, 135*S, 40*S, 135*S, 60*S, head=6*S, color=BLUE)
    dq.rectangle([180*S, 68*S, 220*S, 108*S], outline=BLACK, width=W)
    if punch_type == 0:
        draw_dot(dq, 200*S, 88*S, r=6*S); pts_ans = [(-22*S,-22*S),(22*S,-22*S),(-22*S,22*S),(22*S,22*S)]
        pts_d1, pts_d2, pts_d3 = [(0,-22*S),(0,22*S)], [(-22*S,-22*S),(22*S,22*S)], [(-22*S,0),(22*S,0),(0,-22*S),(0,22*S)]
    elif punch_type == 1:
        draw_dot(dq, 186*S, 74*S, r=6*S); pts_ans = [(0, 0)]
        pts_d1, pts_d2, pts_d3 = [(-22*S,-22*S),(22*S,-22*S),(-22*S,22*S),(22*S,22*S)], [(-16*S,0),(16*S,0)], [(0,-16*S),(0,16*S)]
    elif punch_type == 2:
        draw_dot(dq, 214*S, 88*S, r=5*S); pts_ans = [(-32*S,-20*S),(32*S,-20*S),(-32*S,20*S),(32*S,20*S)]
        pts_d1, pts_d2, pts_d3 = [(0,-32*S),(0,32*S)], [(0,0)], [(-20*S,-20*S),(20*S,20*S)]
    else:
        draw_dot(dq, 195*S, 80*S, r=4*S); draw_dot(dq, 208*S, 96*S, r=4*S)
        pts_ans = [(-14*S,-14*S),(14*S,-14*S),(-14*S,14*S),(14*S,14*S),(-28*S,-28*S),(28*S,-28*S),(-28*S,28*S),(28*S,28*S)]
        pts_d1, pts_d2, pts_d3 = [(-20*S,-20*S),(20*S,-20*S),(-20*S,20*S),(20*S,20*S)], [(-14*S,-14*S),(14*S,14*S)], [(0,0),(-28*S,0),(28*S,0)]
    draw_qmark(dq, 265*S, 68*S, r=24*S); ans_idx = i % 4
    cand = [pts_ans, pts_d1, pts_d2, pts_d3]; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
    for k in order:
        im = new_tile(); d = ImageDraw.Draw(im); d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W)
        for dx, dy in cand[k]: draw_dot(d, cx+dx, cy+dy, r=6*S)
        opts.append(im)
    all_catalog[8].append((i+1, [q_im], opts, ['A', 'B', 'C', 'D'][ans_idx], "Unfolding twice mirrors the punched holes symmetrically across both fold lines."))

# --- CAT 9 ---
for i in range(20):
    cond = i % 3
    def draw_venn(d, mode):
        if mode == 0: d.ellipse([cx-44*S, cy-24*S, cx+16*S, cy+36*S], outline=BLACK, width=W); d.rectangle([cx-14*S, cy-24*S, cx+44*S, cy+36*S], outline=BLACK, width=W); draw_poly(d, cx+24*S, cy-26*S, 20*S, 3)
        elif mode == 1: d.ellipse([cx-44*S, cy-24*S, cx+16*S, cy+36*S], outline=BLACK, width=W); draw_poly(d, cx+6*S, cy+4*S, 34*S, 3); d.rectangle([cx+18*S, cy-40*S, cx+46*S, cy-10*S], outline=BLACK, width=W)
        elif mode == 2: d.ellipse([cx-40*S, cy-28*S, cx+20*S, cy+32*S], outline=BLACK, width=W); d.rectangle([cx-12*S, cy-16*S, cx+42*S, cy+38*S], outline=BLACK, width=W); draw_poly(d, cx, cy-4*S, 38*S, 3)
        else: d.ellipse([cx-44*S, cy-40*S, cx-8*S, cy-4*S], outline=BLACK, width=W); d.rectangle([cx+8*S, cy-40*S, cx+44*S, cy-4*S], outline=BLACK, width=W); draw_poly(d, cx, cy+24*S, 24*S, 3)
    q_im = new_tile(); dq = ImageDraw.Draw(q_im); draw_venn(dq, cond)
    if cond == 0: draw_dot(dq, cx, cy+8*S, r=5*S, color=BLUE)
    elif cond == 1: draw_dot(dq, cx-4*S, cy+10*S, r=5*S, color=BLUE)
    else: draw_dot(dq, cx, cy+6*S, r=5*S, color=BLUE)
    ans_idx = i % 4; modes = [cond, (cond+1)%3, (cond+2)%3, 3]; order = [(k - ans_idx) % 4 for k in range(4)]
    opts = []
    for k in order: im = new_tile(); draw_venn(ImageDraw.Draw(im), modes[k]); opts.append(im)
    correct = ['A', 'B', 'C', 'D'][ans_idx]
    all_catalog[9].append((i+1, [q_im], opts, correct, f"Only figure {correct} satisfies the exact same region-overlap condition for placing the dot."))

# --- CAT 10 ---
for i in range(20):
    ftype = i % 4; q_im = new_tile(); dq = ImageDraw.Draw(q_im)
    if ftype == 0:
        dq.polygon([(cx-36*S, cy-28*S), (cx+8*S, cy-28*S), (cx-36*S, cy+16*S)], outline=BLACK, width=W)
        dq.polygon([(cx+36*S, cy+28*S), (cx-8*S, cy+28*S), (cx+36*S, cy-16*S)], outline=BLACK, width=W)
        cand = [lambda d: (d.rectangle([cx-30*S, cy-30*S, cx+30*S, cy+30*S], outline=BLACK, width=W), d.line([cx-30*S, cy+30*S, cx+30*S, cy-30*S], fill=BLACK, width=W)), lambda d: draw_poly(d, cx, cy, R, 3), lambda d: d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), lambda d: draw_poly(d, cx, cy, R, 5)]
    elif ftype == 1:
        dq.arc([cx-44*S, cy-30*S, cx+16*S, cy+30*S], 90, 270, fill=BLACK, width=W); dq.line([cx-14*S, cy-30*S, cx-14*S, cy+30*S], fill=BLACK, width=W)
        dq.arc([cx-16*S, cy-30*S, cx+44*S, cy+30*S], -90, 90, fill=BLACK, width=W); dq.line([cx+14*S, cy-30*S, cx+14*S, cy+30*S], fill=BLACK, width=W)
        cand = [lambda d: (d.ellipse([cx-34*S, cy-34*S, cx+34*S, cy+34*S], outline=BLACK, width=W), d.line([cx, cy-34*S, cx, cy+34*S], fill=BLACK, width=W)), lambda d: d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), lambda d: draw_poly(d, cx, cy, R, 3), lambda d: draw_poly(d, cx, cy, R, 6)]
    elif ftype == 2:
        for dx in [-32*S, 0, 32*S]: draw_poly(dq, cx+dx, cy, 18*S, 3)
        cand = [lambda d: (d.polygon([(cx-42*S, cy+20*S), (cx+42*S, cy+20*S), (cx+21*S, cy-20*S), (cx-21*S, cy-20*S)], outline=BLACK, width=W), d.line([cx-21*S, cy-20*S, cx, cy+20*S, cx+21*S, cy-20*S], fill=BLACK, width=W)), lambda d: d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), lambda d: d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), lambda d: draw_poly(d, cx, cy, R, 5)]
    else:
        dq.rectangle([cx-42*S, cy-12*S, cx-6*S, cy+24*S], outline=BLACK, width=W); draw_poly(dq, cx+24*S, cy+6*S, 22*S, 3)
        cand = [lambda d: (d.rectangle([cx-26*S, cy-4*S, cx+26*S, cy+38*S], outline=BLACK, width=W), d.polygon([(cx-30*S, cy-4*S), (cx, cy-38*S), (cx+30*S, cy-4*S)], outline=BLACK, width=W)), lambda d: d.ellipse([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), lambda d: draw_poly(d, cx, cy, R, 6), lambda d: (d.rectangle([cx-R, cy-R, cx+R, cy+R], outline=BLACK, width=W), d.line([cx-R, cy-R, cx+R, cy+R], fill=BLACK, width=W))]
    ans_idx = i % 4; order = [(k - ans_idx) % 4 for k in range(4)]; opts = []
    for k in order: im = new_tile(); cand[k](ImageDraw.Draw(im)); opts.append(im)
    correct = ['A', 'B', 'C', 'D'][ans_idx]
    all_catalog[10].append((i+1, [q_im], opts, correct, f"Joining the given separate pieces forms figure {correct}."))

# Save all 180 question images + 720 option images & build JSON entries
new_entries = []
next_id = 1201
for cat_id in sorted(all_catalog.keys()):
    for q_idx, q_tiles, opts, correct, expl in all_catalog[cat_id]:
        q_fname = f"nv-q-cat{cat_id}-{q_idx}.jpg"
        if len(q_tiles) == 4:
            strip = Image.new("RGB", (600, 150), WHITE)
            ds = ImageDraw.Draw(strip)
            for ti, qt in enumerate(q_tiles):
                thumb = qt.resize((132, 132), Image.Resampling.LANCZOS)
                strip.paste(thumb, (12 + ti*146, 9))
            strip.save(f"{QUESTIONS_DIR}/{q_fname}", quality=95)
        else:
            qt = q_tiles[0].copy()
            qt.thumbnail((480, 220), Image.Resampling.LANCZOS)
            qt.save(f"{QUESTIONS_DIR}/{q_fname}", quality=95)

        opt_urls = {}
        for oi, o_im in enumerate(opts):
            let = ['a', 'b', 'c', 'd'][oi]
            o_fname = f"nv-cat{cat_id}-{q_idx}-opt-{let}.jpg"
            o_thumb = o_im.copy()
            o_thumb.thumbnail((160, 160), Image.Resampling.LANCZOS)
            o_thumb.save(f"{OPTIONS_DIR}/{o_fname}", quality=95)
            opt_urls[let] = f"/images/non-verbal/options/{o_fname}?v=20261127d"

        new_entries.append({
            "id": next_id,
            "category_id": cat_id,
            "category": CAT_NAMES[cat_id],
            "question_text": f"[{CAT_NAMES[cat_id]} #{q_idx}] {PROMPTS[cat_id]}",
            "option_a": "Pattern 1 (Figure A)",
            "option_b": "Pattern 2 (Figure B)",
            "option_c": "Pattern 3 (Figure C)",
            "option_d": "Pattern 4 (Figure D)",
            "correct_option": correct,
            "explanation": expl,
            "question_image_url": f"/images/non-verbal/questions/{q_fname}?v=20261127d",
            "option_a_image_url": opt_urls['a'],
            "option_b_image_url": opt_urls['b'],
            "option_c_image_url": opt_urls['c'],
            "option_d_image_url": opt_urls['d'],
        })
        next_id += 1

with open(BANK_PATH, "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r'export const NON_VERBAL_52_BANK: BankQuestion\[\] = (\[.*?\]);', content, re.S)
arr = json.loads(m.group(1))
# Remove any prior 1201..1400 if re-run, and align existing Mirror & Water Reflection items to category_id 6
cleaned = []
for q in arr:
    if 1201 <= q["id"] <= 1400:
        continue
    if "Mirror & Water" in q.get("category", ""):
        q["category_id"] = 6
        q["category"] = "6. Mirror & Water Reflection"
    cleaned.append(q)

cleaned.extend(new_entries)
new_json = json.dumps(cleaned, indent=2)
new_content = content[:m.start(1)] + new_json + content[m.end(1):]
with open(BANK_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Deployed {len(new_entries)} new questions! Total verified bank size: {len(cleaned)}")
