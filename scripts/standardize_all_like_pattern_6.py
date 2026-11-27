import os
import cv2
import numpy as np
from PIL import Image

QUESTIONS_DIR = "public/images/non-verbal/questions"
OPTIONS_DIR = "public/images/non-verbal/options"
BASE_IMG_DIR = "public/images/non-verbal"

# Keep these 25 untouched (24 user-snipped + #16 circular puzzle):
KEEP_UNTOUCHED = {6, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 29, 30, 34, 35, 36, 37, 38, 39, 41, 45, 46, 48}

# Questions that have a middle header/banner row between Problem Figures and Answer Figures:
HAS_MIDDLE_BANNER = {1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 47, 51, 52}

def get_row_segments(thresh):
    h = thresh.shape[0]
    row_sum = np.sum(thresh, axis=1)
    active = row_sum > 5
    segments = []
    in_seg = False
    start = 0
    for y in range(h):
        if active[y] and not in_seg:
            in_seg = True
            start = y
        elif not active[y] and in_seg:
            in_seg = False
            if y - start > 5:
                segments.append((start, y))
    if in_seg and h - start > 5:
        segments.append((start, h))
    return segments

def process_question(idx):
    if idx in KEEP_UNTOUCHED:
        return f"Q#{idx:02d}: Kept untouched"

    base_file = f"{BASE_IMG_DIR}/nv-{idx}.jpg"
    if not os.path.exists(base_file):
        return f"Q#{idx:02d}: Not found"

    img = cv2.imread(base_file)
    if img is None:
        return f"Q#{idx:02d}: Unreadable"
    h, w = img.shape[:2]

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY_INV)[1]
    thresh[:, :35] = 0  # Remove left vertical scanner artifact

    segments = get_row_segments(thresh)

    if idx in HAS_MIDDLE_BANNER and len(segments) >= 3:
        # Segment 0 is Question; Segment 1 is "[Q1] [Answer Patterns]"; Segment 2..end are Options!
        q_y0, q_y1 = max(0, segments[0][0] - 6), min(h, segments[0][1] + 6)
        ans_y0 = max(0, segments[2][0] - 4)
        ans_y1 = min(h, segments[-1][1] + 4)
    else:
        # Standard 2-tier split via middle valley
        row_sum = np.sum(thresh, axis=1)
        search_start = int(h * 0.28)
        search_end = int(h * 0.72)
        mid_valley = search_start + int(np.argmin(row_sum[search_start:search_end]))

        r1_rows = np.where(np.sum(thresh[:mid_valley, :], axis=1) > 0)[0]
        r2_rows = np.where(np.sum(thresh[mid_valley:, :], axis=1) > 0)[0]
        if len(r1_rows) == 0 or len(r2_rows) == 0:
            return f"Q#{idx:02d}: Empty split"
        q_y0 = max(0, int(np.min(r1_rows)) - 6)
        q_y1 = min(mid_valley, int(np.max(r1_rows)) + 6)
        ans_y0 = max(0, mid_valley + int(np.min(r2_rows)) - 4)
        ans_y1 = min(h, mid_valley + int(np.max(r2_rows)) + 4)

    # 1. Save Question Problem Sequence
    q_cols = np.where(np.sum(thresh[q_y0:q_y1, :], axis=0) > 0)[0]
    if len(q_cols) > 0:
        q_x0 = max(0, int(np.min(q_cols)) - 8)
        q_x1 = min(w, int(np.max(q_cols)) + 8)
        q_crop = img[q_y0:q_y1, q_x0:q_x1]
        cv2.imwrite(f"{QUESTIONS_DIR}/nv-q-{idx}.jpg", q_crop, [int(cv2.IMWRITE_JPEG_QUALITY), 95])

    # 2. Save 4 Individual Option Cards
    r2_cols = np.where(np.sum(thresh[ans_y0:ans_y1, :], axis=0) > 0)[0]
    if len(r2_cols) > 0:
        ans_x0 = int(np.min(r2_cols))
        ans_x1 = int(np.max(r2_cols))
        total_ans_w = ans_x1 - ans_x0
        seg_w = total_ans_w / 4.0

        letters = ['a', 'b', 'c', 'd']
        for i, let in enumerate(letters):
            bx0 = max(0, int(ans_x0 + i * seg_w))
            bx1 = min(w, int(ans_x0 + (i + 1) * seg_w))
            opt_crop = img[ans_y0:ans_y1, bx0:bx1]
            cv2.imwrite(f"{OPTIONS_DIR}/nv-{idx}-opt-{let}.jpg", opt_crop, [int(cv2.IMWRITE_JPEG_QUALITY), 95])

    return f"Q#{idx:02d}: Cleanly cropped (Q: {q_y0}..{q_y1}, Opts: {ans_y0}..{ans_y1})"

for idx in range(1, 53):
    print(process_question(idx))
