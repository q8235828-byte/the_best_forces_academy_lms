import json

questions = []

metadata = [
    (1, 1, '1. Pattern Series Completion', 'B', 'Each step adds one new line segment (1 -> 2 -> 3 -> 4 -> 5 lines). Square with diagonal has 5 lines.'),
    (2, 1, '1. Pattern Series Completion', 'A', 'Inner symbols alternate and expand while outer shapes rotate 90 degrees sequentially.'),
    (3, 1, '1. Pattern Series Completion', 'C', 'The black triangle rotates clockwise by 90 degrees in each step around the circle center.'),
    (4, 1, '1. Pattern Series Completion', 'B', 'The shaded quarter rotates clockwise by 90 degrees while the plus sign moves counter-clockwise.'),
    (5, 1, '1. Pattern Series Completion', 'D', 'The line segment rotates clockwise around the corners of the bounding square.'),
    (6, 1, '1. Pattern Series Completion', 'C', 'The inner circle traverses counter-clockwise along the circumference of the outer circle.'),
    (7, 1, '1. Pattern Series Completion', 'B', 'The diagonal divider alternates directions while the plus marker shifts between quadrants.'),
    (8, 1, '1. Pattern Series Completion', 'C', 'The arrow heads rotate and reverse direction in an alternating arithmetic sequence.'),
    (9, 1, '1. Pattern Series Completion', 'A', 'The arm rotates 45 degrees clockwise at each consecutive step.'),
    (10, 1, '1. Pattern Series Completion', 'B', 'Outer and inner shapes alternate between triangle, square, and circle in cyclic order.'),
    (11, 1, '1. Pattern Series Completion', 'D', 'The arrow rotates 45 degrees clockwise while translating across the frame.'),
    (12, 1, '1. Pattern Series Completion', 'C', 'The embedded nested geometric figure alternates between square, triangle, and circle.'),
    (13, 1, '1. Pattern Series Completion', 'A', 'The split geometric shape toggles division line and shape alternation.'),
    (14, 1, '1. Pattern Series Completion', 'D', 'Solid fill and outline alternate in synchronized sequence across alternating shapes.'),
    (15, 1, '1. Pattern Series Completion', 'B', 'The crossbars rotate 45 degrees while the circular loop shifts along the axis.'),
    
    (16, 4, '4. Matrix & Grid Reasoning', 'C', 'Opposite sectors follow the relationship: sector * 2 = opposite sector (3*2=6, 5*2=10, 7*2=14, so 4*2=8), completing the cyclic progression.'),
    (17, 5, '5. Mirror & Water Reflection', 'B', 'The letter E with the dot on the left reflects across the vertical mirror axis to an inverted E with the dot on the right.'),
    (18, 4, '4. Matrix & Grid Reasoning', 'D', 'Row-wise analysis shows pattern variation: each column maintains constant stripe count while ray projections follow 4 -> 5 -> 6 rays.'),
    (19, 3, '3. Classification & Odd One Out', 'C', 'In figures (a), (b), (d), (e), and (f) the shaded sections are opposite, whereas in (c) the shading orientation is altered.'),
    
    (20, 4, '4. Matrix & Grid Reasoning', 'B', 'Looking across rows: the element count doubles or increments predictably. Row 2 has 3 squares, so the missing box has 4 or 6 squares.'),
    (21, 4, '4. Matrix & Grid Reasoning', 'A', 'The 4x4 sub-grid cross patterns follow logical XOR addition across each row.'),
    (22, 1, '1. Pattern Series Completion', 'C', 'The plus symbol shifts position relative to the circle (left -> top -> right -> bottom).'),
    (23, 4, '4. Matrix & Grid Reasoning', 'B', 'Concentric shapes alternate between circle, triangle, and hexagon across rows and columns.'),
    (24, 4, '4. Matrix & Grid Reasoning', 'C', 'Grid lines subdivide the square from 1 to 2 to 4 quadrants.'),
    
    (25, 1, '1. Pattern Series Completion', 'C', 'Circular sectors shade 1/4 clockwise at each consecutive step.'),
    (26, 1, '1. Pattern Series Completion', 'B', 'The colored triangular wedge rotates clockwise by 45 degrees around the octant grid.'),
    (27, 1, '1. Pattern Series Completion', 'A', 'Geometric base alternates triangle and circle, while top crown alternates square and triangle.'),
    (28, 1, '1. Pattern Series Completion', 'C', 'The star symbol shifts across quadrants while the bounding triangle rotates 90 degrees.'),
    (29, 1, '1. Pattern Series Completion', 'B', 'The geometric profile rotates 45 degrees clockwise in each successive frame.'),
    (30, 1, '1. Pattern Series Completion', 'A', 'The star marker steps across the 2x2 grid in counter-clockwise sequence.'),
    (31, 1, '1. Pattern Series Completion', 'C', 'The vector arrow rotates 90 degrees clockwise at each step.'),
    (32, 1, '1. Pattern Series Completion', 'B', 'The horizontal pointer rotates 45 degrees clockwise, pointing diagonally up-right in step 2 and upward in step 3.'),
    (33, 1, '1. Pattern Series Completion', 'C', 'The green corner square advances clockwise along the corners of the black bounding box.'),
    (34, 1, '1. Pattern Series Completion', 'B', 'The fold lines alternate orientation across horizontal and vertical axes.'),
    
    (35, 4, '4. Matrix & Grid Reasoning', 'C', 'Across rows, the liquid bottle tilts 0 -> 45 -> 90 degrees while the volume level remains consistent.'),
    (36, 1, '1. Pattern Series Completion', 'C', 'The insect antennae and leg counts follow an arithmetic progression (2 -> 4 -> 6 appendages).'),
    (37, 1, '1. Pattern Series Completion', 'A', 'The geometric envelope shape rotates 90 degrees counter-clockwise.'),
    (38, 1, '1. Pattern Series Completion', 'B', 'The arrow arrows alternate directions: row 1 arrows invert and shift symmetrically.'),
    (39, 2, '2. Pattern Analogies', 'D', 'First pair rotates 90 degrees and inverts color fill. Second pair follows the same transformation rule.'),
    
    (40, 5, '5. Mirror & Water Reflection', 'B', 'Reference mirror table: Capital letters and numbers invert left-to-right across vertical axis.'),
    (41, 1, '1. Pattern Series Completion', 'C', 'The stick figure limb positions alternate swinging motion (left leg -> both legs -> right leg).'),
    (42, 5, '5. Mirror & Water Reflection', 'A', 'Mirror reflection reverses letter order and letter glyphs horizontally from right to left.'),
    (43, 5, '5. Mirror & Water Reflection', 'C', 'Object mirror reflection preserves vertical height while flipping horizontal orientations.'),
    (44, 5, '5. Mirror & Water Reflection', 'B', 'The diagonal arrow pointing top-right reflects across the vertical mirror plane to point top-left.'),
    (45, 5, '5. Mirror & Water Reflection', 'D', 'Word mirror reflection of "jealous" reverses letter sequence and inverts each character laterally.'),
    (46, 5, '5. Mirror & Water Reflection', 'B', 'The cylinder orientation flips horizontally: the front circle with dots reflects to the opposite side.'),
    (47, 5, '5. Mirror & Water Reflection', 'C', 'Two vectors reflecting across vertical axis mirror their angles symmetrically across the plane.'),
    (48, 5, '5. Mirror & Water Reflection', 'B', 'The cylindrical object with striped tail reflects across the vertical plane.'),
    (49, 5, '5. Mirror & Water Reflection', 'A', 'Solved reference example: Diagonal vectors mirror symmetrically across the vertical boundary.'),
    (50, 5, '5. Mirror & Water Reflection', 'C', 'Symmetric vector mirror reflection verifies arrow orientation in option (3).'),
    (51, 5, '5. Mirror & Water Reflection', 'C', 'The circle with angled pin reflects across vertical axis, flipping the pin direction.'),
    (52, 5, '5. Mirror & Water Reflection', 'B', 'The S-curve with central dot and arrow flips horizontally across the vertical mirror axis.')
]

for idx, cat_id, cat_name, correct_opt, explanation in metadata:
    q_text = f'[Visual Pattern #{idx}] Study the problem diagram above and determine which answer figure (A, B, C, or D) replaces the question mark (?):'
    if idx == 16:
        q_text = '[Visual Puzzle #16] Insert the missing number in the circle segment replacing the question mark (?):'
    elif idx == 19:
        q_text = '[Visual Pattern #19] State the serial letter of the figure which is different from the others in the group:'
    elif idx in [40, 42, 43]:
        q_text = f'[Visual Study Guide #{idx}] Study the mirror reflection table and select the correct corresponding reflection pattern:'

    q = {
        'id': 1000 + idx,
        'category_id': cat_id,
        'category': cat_name,
        'question_text': q_text,
        'option_a': 'Pattern 1 (Figure A)',
        'option_b': 'Pattern 2 (Figure B)',
        'option_c': 'Pattern 3 (Figure C)',
        'option_d': 'Pattern 4 (Figure D)',
        'correct_option': correct_opt,
        'explanation': explanation,
        'question_image_url': f'/images/non-verbal/questions/nv-q-{idx}.jpg',
        'option_a_image_url': f'/images/non-verbal/options/nv-{idx}-opt-a.jpg',
        'option_b_image_url': f'/images/non-verbal/options/nv-{idx}-opt-b.jpg',
        'option_c_image_url': f'/images/non-verbal/options/nv-{idx}-opt-c.jpg',
        'option_d_image_url': f'/images/non-verbal/options/nv-{idx}-opt-d.jpg',
    }
    questions.append(q)

file_content = '''// 52 Authentic Non-Verbal Intelligence Questions Bank
// Directly derived 1:1 from the provided forces pattern diagrams
import { QuizQuestion } from '@/types';

export interface BankQuestion {
  id: number;
  category_id: number;
  category: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_a_image_url?: string;
  option_b_image_url?: string;
  option_c_image_url?: string;
  option_d_image_url?: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  question_image_url?: string;
}

export const NON_VERBAL_52_BANK: BankQuestion[] = ''' + json.dumps(questions, indent=2) + ''';

// Backward compatibility alias for PDF guide & other consumers
export const NON_VERBAL_500_BANK: BankQuestion[] = NON_VERBAL_52_BANK;

export function getRandomNonVerbalQuizQuestions(): QuizQuestion[] {
  // Return the authentic 52 visual questions corresponding to the provided diagram images
  return NON_VERBAL_52_BANK.map((q, index) => ({
    id: q.id,
    quiz_id: 2,
    category: q.category,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_option: q.correct_option,
    explanation: q.explanation,
    question_image_url: q.question_image_url,
    option_a_image_url: q.option_a_image_url,
    option_b_image_url: q.option_b_image_url,
    option_c_image_url: q.option_c_image_url,
    option_d_image_url: q.option_d_image_url,
    order_index: index + 1,
  }));
}
'''

with open('src/lib/non-verbal-questions-bank.ts', 'w', encoding='utf-8') as f:
    f.write(file_content)

print('Generated src/lib/non-verbal-questions-bank.ts with 52 questions!')
