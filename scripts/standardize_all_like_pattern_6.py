import os
import cv2
import numpy as np
from PIL import Image

QUESTIONS_DIR = "public/images/non-verbal/questions"
OPTIONS_DIR = "public/images/non-verbal/options"
BASE_IMG_DIR = "public/images/non-verbal"

# Keep these 24 untouched because they are authentic user-snipped crops (including Question #6):
USER_SNIPPED = {6, 12, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 29, 30, 34, 35, 36, 37, 38, 39, 41, 45, 46, 48}

def process_question(idx):
    if idx in USER_SNIPPED:
        return f"Q#{idx:02d}: Kept user-snipped"
        
    base_file = f"{BASE_IMG_DIR}/nv-{idx}.jpg"
    if not os.path.exists(base_file):
        return f"Q#{idx:02d}: Not found"
        
    img = cv2.imread(base_file)
    if img is None:
        return f"Q#{idx:02d}: Unreadable"
    h, w = img.shape[:2]
    
    # Question 16 is special (circular number puzzle)
    if idx == 16:
        return "Q#16: Kept puzzle"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY_INV)[1]
    # Filter left edge scanner artifact
    thresh[:, :35] = 0
    
    row_sum = np.sum(thresh, axis=1)
    
    # Find valley separating Row 1 (Problem figures) and Row 2 (Answer figures)
    search_start = int(h * 0.28)
    search_end = int(h * 0.72)
    mid_valley = search_start + np.argmin(row_sum[search_start:search_end])
    
    # 1. Row 1: Problem sequence
    r1_thresh = thresh[:mid_valley, :]
    r1_cols = np.where(np.sum(r1_thresh, axis=0) > 0)[0]
    r1_rows = np.where(np.sum(r1_thresh, axis=1) > 0)[0]
    
    if len(r1_cols) > 0 and len(r1_rows) > 0:
        q_x0 = max(0, int(np.min(r1_cols)) - 8)
        q_x1 = min(w, int(np.max(r1_cols)) + 8)
        q_y0 = max(0, int(np.min(r1_rows)) - 6)
        q_y1 = min(mid_valley, int(np.max(r1_rows)) + 6)
        
        q_crop = img[q_y0:q_y1, q_x0:q_x1]
        cv2.imwrite(f"{QUESTIONS_DIR}/nv-q-{idx}.jpg", q_crop, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    
    # 2. Row 2: Answer options (4 individual figures)
    r2_thresh = thresh[mid_valley:, :]
    r2_cols = np.where(np.sum(r2_thresh, axis=0) > 0)[0]
    r2_rows = np.where(np.sum(r2_thresh, axis=1) > 0)[0]
    
    if len(r2_cols) > 0 and len(r2_rows) > 0:
        ans_x0 = int(np.min(r2_cols))
        ans_x1 = int(np.max(r2_cols))
        ans_y0 = mid_valley + int(np.min(r2_rows))
        ans_y1 = mid_valley + int(np.max(r2_rows))
        
        total_ans_w = ans_x1 - ans_x0
        seg_w = total_ans_w / 4.0
        
        letters = ['a', 'b', 'c', 'd']
        for i, let in enumerate(letters):
            bx0 = max(0, int(ans_x0 + i * seg_w))
            bx1 = min(w, int(ans_x0 + (i + 1) * seg_w))
            by0 = max(0, ans_y0 - 4)
            by1 = min(h, ans_y1 + 4)
            
            opt_crop = img[by0:by1, bx0:bx1]
            cv2.imwrite(f"{OPTIONS_DIR}/nv-{idx}-opt-{let}.jpg", opt_crop, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
            
    return f"Q#{idx:02d}: Processed successfully like Pattern #6"

for idx in range(1, 53):
    res = process_question(idx)
    print(res)

print("\nAll 52 non-verbal questions standardized to Pattern #6 standard!")
