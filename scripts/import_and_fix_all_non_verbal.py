import os
import glob
import shutil
import cv2
import numpy as np
from PIL import Image

SCREENSHOTS_DIR = r"C:\Users\wc\OneDrive\Pictures\Screenshots"
QUESTIONS_DIR = "public/images/non-verbal/questions"
OPTIONS_DIR = "public/images/non-verbal/options"
BASE_IMG_DIR = "public/images/non-verbal"

os.makedirs(QUESTIONS_DIR, exist_ok=True)
os.makedirs(OPTIONS_DIR, exist_ok=True)

# 1. User Hand-Snipped Screenshots Mapping
# Maps question index -> (question_screenshot, [opt_a, opt_b, opt_c, opt_d])
user_snipped_map = {
    # Cylinder Mirror Question (#11 in book, replaces old nv-48 & nv-46)
    48: ("Screenshot 2026-11-25 171051.png", [
        "Screenshot 2026-11-25 171058.png",
        "Screenshot 2026-11-25 171104.png",
        "Screenshot 2026-11-25 171108.png",
        "Screenshot 2026-11-25 171112.png"
    ]),
    46: ("Screenshot 2026-11-25 171051.png", [
        "Screenshot 2026-11-25 171058.png",
        "Screenshot 2026-11-25 171104.png",
        "Screenshot 2026-11-25 171108.png",
        "Screenshot 2026-11-25 171112.png"
    ]),
    # Jealous Mirror (#45)
    45: ("Screenshot 2026-11-25 171601.png", [
        "Screenshot 2026-11-25 171606.png",
        "Screenshot 2026-11-25 171610.png",
        "Screenshot 2026-11-25 171618.png",
        "Screenshot 2026-11-25 171626.png"
    ]),
    # Stick Man Series (#41)
    41: ("Screenshot 2026-11-25 171654.png", [
        "Screenshot 2026-11-25 171703.png",
        "Screenshot 2026-11-25 171709.png",
        "Screenshot 2026-11-25 171718.png",
        "Screenshot 2026-11-25 171724.png"
    ]),
    # Hourglass Analogy (#39)
    39: ("Screenshot 2026-11-25 171740.png", [
        "Screenshot 2026-11-25 171747.png",
        "Screenshot 2026-11-25 171753.png",
        "Screenshot 2026-11-25 171759.png",
        "Screenshot 2026-11-25 171805.png"
    ]),
    # Arrows Sequence (#38)
    38: ("Screenshot 2026-11-25 171822.png", [
        "Screenshot 2026-11-25 171828.png",
        "Screenshot 2026-11-25 171833.png",
        "Screenshot 2026-11-25 171838.png",
        "Screenshot 2026-11-25 171843.png"
    ]),
    # Envelope Series (#37)
    37: ("Screenshot 2026-11-25 171852.png", [
        "Screenshot 2026-11-25 171858.png",
        "Screenshot 2026-11-25 171902.png",
        "Screenshot 2026-11-25 171906.png",
        "Screenshot 2026-11-25 171912.png"
    ]),
    # Insect Appendages (#36)
    36: ("Screenshot 2026-11-25 171927.png", [
        "Screenshot 2026-11-25 171936.png",
        "Screenshot 2026-11-25 171941.png",
        "Screenshot 2026-11-25 171947.png",
        "Screenshot 2026-11-25 171954.png"
    ]),
    # Triangles Series (#34)
    34: ("Screenshot 2026-11-25 172007.png", [
        "Screenshot 2026-11-25 172014.png",
        "Screenshot 2026-11-25 172019.png",
        "Screenshot 2026-11-25 172024.png",
        "Screenshot 2026-11-25 172030.png"
    ]),
    # Bottles Matrix (#35)
    35: ("Screenshot 2026-11-25 172038.png", [
        "Screenshot 2026-11-25 172043.png",
        "Screenshot 2026-11-25 172048.png",
        "Screenshot 2026-11-25 172053.png",
        "Screenshot 2026-11-25 172058.png"
    ]),
    # Pointer Series (#29)
    29: ("Screenshot 2026-11-25 172114.png", [
        "Screenshot 2026-11-25 172128.png",
        "Screenshot 2026-11-25 172132.png",
        "Screenshot 2026-11-25 172138.png",
        "Screenshot 2026-11-25 172143.png"
    ]),
    # Star Grid Series (#30)
    30: ("Screenshot 2026-11-25 172158.png", [
        "Screenshot 2026-11-25 172202.png",
        "Screenshot 2026-11-25 172207.png",
        "Screenshot 2026-11-25 172211.png",
        "Screenshot 2026-11-25 172216.png"
    ]),
    # Circle Sectors (#25)
    25: ("Screenshot 2026-11-25 172243.png", [
        "Screenshot 2026-11-25 172250.png",
        "Screenshot 2026-11-25 172253.png",
        "Screenshot 2026-11-25 172257.png",
        "Screenshot 2026-11-25 172301.png"
    ]),
    # Concentric Matrix (#23) - 3 options given, create clean 4th decoy
    23: ("Screenshot 2026-11-25 172311.png", [
        "Screenshot 2026-11-25 172317.png",
        "Screenshot 2026-11-25 172323.png",
        "Screenshot 2026-11-25 172331.png"
    ]),
    # Subdivided Square Matrix (#24)
    24: ("Screenshot 2026-11-25 172340.png", [
        "Screenshot 2026-11-25 172346.png",
        "Screenshot 2026-11-25 172351.png",
        "Screenshot 2026-11-25 172355.png"
    ]),
    # Crosshatch Matrix (#21)
    21: ("Screenshot 2026-11-25 172404.png", [
        "Screenshot 2026-11-25 172410.png",
        "Screenshot 2026-11-25 172414.png",
        "Screenshot 2026-11-25 172422.png"
    ]),
    # Problem Figures Series (#22)
    22: ("Screenshot 2026-11-25 172447.png", [
        "Screenshot 2026-11-25 172451.png",
        "Screenshot 2026-11-25 172455.png",
        "Screenshot 2026-11-25 172501.png",
        "Screenshot 2026-11-25 172509.png"
    ]),
    # Shapes Dots Matrix (#20)
    20: ("Screenshot 2026-11-25 172527.png", [
        "Screenshot 2026-11-25 172531.png",
        "Screenshot 2026-11-25 172536.png",
        "Screenshot 2026-11-25 172540.png"
    ]),
    # Striped Circle Matrix (#18)
    18: ("Screenshot 2026-11-25 172555.png", [
        "Screenshot 2026-11-25 172600.png",
        "Screenshot 2026-11-25 172604.png",
        "Screenshot 2026-11-25 172607.png",
        "Screenshot 2026-11-25 172612.png"
    ]),
    # Odd One Out (#19)
    19: ("Screenshot 2026-11-25 172650.png", [
        "Screenshot 2026-11-25 172655.png",
        "Screenshot 2026-11-25 172659.png",
        "Screenshot 2026-11-25 172703.png",
        "Screenshot 2026-11-25 172706.png"
    ]),
    # Circles Series (#6)
    6: ("Screenshot 2026-11-25 172807.png", [
        "Screenshot 2026-11-25 172811.png",
        "Screenshot 2026-11-25 172816.png",
        "Screenshot 2026-11-25 172820.png",
        "Screenshot 2026-11-25 172823.png"
    ]),
    # Stars Loops Series (#15)
    15: ("Screenshot 2026-11-25 172833.png", [
        "Screenshot 2026-11-25 172838.png",
        "Screenshot 2026-11-25 172842.png",
        "Screenshot 2026-11-25 172847.png",
        "Screenshot 2026-11-25 172851.png"
    ]),
    # Nested Geometric (#12)
    12: ("Screenshot 2026-11-25 172910.png", [
        "Screenshot 2026-11-25 172917.png",
        "Screenshot 2026-11-25 172922.png",
        "Screenshot 2026-11-25 172926.png",
        "Screenshot 2026-11-25 172930.png"
    ]),
    # Solid Outline Shapes (#14)
    14: ("Screenshot 2026-11-25 172937.png", [
        "Screenshot 2026-11-25 172942.png",
        "Screenshot 2026-11-25 172946.png",
        "Screenshot 2026-11-25 172949.png",
        "Screenshot 2026-11-25 172955.png"
    ])
}

print(f"Loaded {len(user_snipped_map)} user-snipped question mappings.")

# Apply user-snipped images first
for q_idx, (q_ss, opts) in user_snipped_map.items():
    q_src = os.path.join(SCREENSHOTS_DIR, q_ss)
    if os.path.exists(q_src):
        im = Image.open(q_src).convert('RGB')
        im.save(f"{QUESTIONS_DIR}/nv-q-{q_idx}.jpg", quality=95)
    
    letters = ['a', 'b', 'c', 'd']
    for i, opt_name in enumerate(letters):
        if i < len(opts):
            opt_src = os.path.join(SCREENSHOTS_DIR, opts[i])
            if os.path.exists(opt_src):
                im = Image.open(opt_src).convert('RGB')
                im.save(f"{OPTIONS_DIR}/nv-{q_idx}-opt-{opt_name}.jpg", quality=95)
        else:
            # 4th option for 3-choice questions: create clean flipped decoy from option 1
            if len(opts) > 0:
                first_src = os.path.join(SCREENSHOTS_DIR, opts[0])
                if os.path.exists(first_src):
                    im = Image.open(first_src).convert('RGB')
                    im.transpose(Image.FLIP_LEFT_RIGHT).save(f"{OPTIONS_DIR}/nv-{q_idx}-opt-{opt_name}.jpg", quality=95)

print("Applied all user-snipped images.")

# 2. General Smart Cropper for remaining questions
def auto_crop_question_and_options(q_idx):
    base_file = f"{BASE_IMG_DIR}/nv-{q_idx}.jpg"
    if not os.path.exists(base_file):
        return False
        
    img = cv2.imread(base_file)
    if img is None:
        return False
    h, w = img.shape[:2]
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 225, 255, cv2.THRESH_BINARY_INV)[1]
    # Remove left vertical edge artifact
    thresh[:, :35] = 0
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for c in contours:
        x, y, bw, bh = cv2.boundingRect(c)
        if bw > 25 and bh > 25:
            boxes.append((x, y, bw, bh))
            
    if not boxes:
        return False
        
    # Split into rows by y position
    # Find row threshold
    y_coords = [b[1] for b in boxes]
    min_y, max_y = min(y_coords), max(y_coords)
    
    if max_y - min_y < 35:
        # Single row or whole image
        # nv-q is whole image or boxes
        min_x = max(0, min(b[0] for b in boxes) - 10)
        max_x = min(w, max(b[0] + b[2] for b in boxes) + 10)
        min_y = max(0, min(b[1] for b in boxes) - 10)
        max_y = min(h, max(b[1] + b[3] for b in boxes) + 10)
        q_img = img[min_y:max_y, min_x:max_x]
        cv2.imwrite(f"{QUESTIONS_DIR}/nv-q-{q_idx}.jpg", q_img)
        
        # Options if 4 boxes exist
        boxes_sorted = sorted(boxes, key=lambda b: b[0])
        letters = ['a', 'b', 'c', 'd']
        for i, opt_name in enumerate(letters):
            if i < len(boxes_sorted):
                bx, by, bw_i, bh_i = boxes_sorted[i]
                pad_y = 5
                pad_x = 5
                opt_img = img[max(0, by-pad_y):min(h, by+bh_i+pad_y), max(0, bx-pad_x):min(w, bx+bw_i+pad_x)]
                cv2.imwrite(f"{OPTIONS_DIR}/nv-{q_idx}-opt-{opt_name}.jpg", opt_img)
        return True
        
    # Two or more rows:
    # Separate problem figures (top row) vs answer figures (bottom row)
    mid_y = (min_y + max_y) / 2
    row1_boxes = [b for b in boxes if b[1] < mid_y]
    row2_boxes = [b for b in boxes if b[1] >= mid_y]
    
    # Sort row1 by x
    row1_boxes = sorted(row1_boxes, key=lambda b: b[0])
    # Sort row2 by x
    row2_boxes = sorted(row2_boxes, key=lambda b: b[0])
    
    if row1_boxes:
        # Problem figures: bounding box of all row1 boxes
        q_min_x = max(0, min(b[0] for b in row1_boxes) - 10)
        q_max_x = min(w, max(b[0] + b[2] for b in row1_boxes) + 10)
        q_min_y = max(0, min(b[1] for b in row1_boxes) - 10)
        q_max_y = min(h, int(mid_y))
        
        # If question includes header text above row1, include it
        q_min_y = max(0, q_min_y - 20)
        q_img = img[q_min_y:q_max_y, q_min_x:q_max_x]
        cv2.imwrite(f"{QUESTIONS_DIR}/nv-q-{q_idx}.jpg", q_img)
        
    if row2_boxes:
        letters = ['a', 'b', 'c', 'd']
        for i, opt_name in enumerate(letters):
            if i < len(row2_boxes):
                bx, by, bw_i, bh_i = row2_boxes[i]
                pad = 6
                opt_img = img[max(0, by-pad):min(h, by+bh_i+pad), max(0, bx-pad):min(w, bx+bw_i+pad)]
                cv2.imwrite(f"{OPTIONS_DIR}/nv-{q_idx}-opt-{opt_name}.jpg", opt_img)
            elif len(row2_boxes) > 0:
                # Decoy
                bx, by, bw_i, bh_i = row2_boxes[0]
                opt_img = cv2.flip(img[by:by+bh_i, bx:bx+bw_i], 1)
                cv2.imwrite(f"{OPTIONS_DIR}/nv-{q_idx}-opt-{opt_name}.jpg", opt_img)
    return True

# Crop remaining questions (skip those already set by user snippets)
for i in range(1, 53):
    if i not in user_snipped_map:
        auto_crop_question_and_options(i)

print("Smart crop complete across all questions!")
