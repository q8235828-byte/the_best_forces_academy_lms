import { Quiz, QuizQuestion } from '@/types';

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 1,
    course_id: 2,
    title: 'GHQ Initial Verbal Intelligence Computer Mock Test 01',
    test_type: 'Verbal',
    duration_minutes: 15,
    passing_score: 60
  },
  {
    id: 2,
    course_id: 2,
    title: 'PAF / Navy Non-Verbal Pattern Matrix Mock Test 02',
    test_type: 'Non-Verbal',
    duration_minutes: 15,
    passing_score: 60
  },
  {
    id: 3,
    course_id: 3,
    title: 'Forces Initial Academic Test (Physics, Math, English, GK)',
    test_type: 'Academic',
    duration_minutes: 20,
    passing_score: 50
  },
  {
    id: 4,
    course_id: 1,
    title: 'ISSB Official 10-Second Word Association Test (WAT) Battery',
    test_type: 'WAT',
    duration_minutes: 5,
    passing_score: 70
  }
];

export const SAMPLE_QUESTIONS: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 1,
      quiz_id: 1,
      question_text: 'What comes next in the series: 3, 7, 15, 31, 63, ...?',
      option_a: '95',
      option_b: '127',
      option_c: '128',
      option_d: '125',
      correct_option: 'B',
      explanation: 'Pattern: Multiply previous number by 2 and add 1. (63 × 2) + 1 = 127.',
      order_index: 1
    },
    {
      id: 2,
      quiz_id: 1,
      question_text: 'If SOUTH is coded as 12345, and WEST is coded as 6714, how is TOSS coded?',
      option_a: '4211',
      option_b: '4122',
      option_c: '4212',
      option_d: '4112',
      correct_option: 'A',
      explanation: 'From SOUTH: S=1, O=2, U=3, T=4, H=5. Therefore TOSS = T(4) O(2) S(1) S(1) = 4211.',
      order_index: 2
    },
    {
      id: 3,
      quiz_id: 1,
      question_text: 'Pointing to a photograph, a soldier said, "His mother is the only daughter of my mother." How is the person in the photograph related to the soldier?',
      option_a: 'Brother',
      option_b: 'Nephew',
      option_c: 'Son',
      option_d: 'Father',
      correct_option: 'B',
      explanation: 'The only daughter of the soldier\'s mother is the soldier\'s sister. The person is her son, which makes him the soldier\'s nephew.',
      order_index: 3
    },
    {
      id: 4,
      quiz_id: 1,
      question_text: 'Choose the odd one out from the given military designations:',
      option_a: 'Major',
      option_b: 'Captain',
      option_c: 'Squadron Leader',
      option_d: 'Lieutenant',
      correct_option: 'C',
      explanation: 'Major, Captain, and Lieutenant are Pakistan Army ranks, whereas Squadron Leader is a Pakistan Air Force rank.',
      order_index: 4
    },
    {
      id: 5,
      quiz_id: 1,
      question_text: 'If yesterday was Tuesday, what day will it be 3 days after tomorrow?',
      option_a: 'Saturday',
      option_b: 'Sunday',
      option_c: 'Monday',
      option_d: 'Friday',
      correct_option: 'B',
      explanation: 'Yesterday was Tuesday -> Today is Wednesday -> Tomorrow is Thursday. 3 days after Thursday (Fri, Sat, Sun) is Sunday.',
      order_index: 5
    }
  ],
  2: [
    {
      id: 6,
      quiz_id: 2,
      question_text: 'A square rotates 45 degrees clockwise each step. If Step 1 is flat, Step 2 is tilted diamond, Step 3 is flat, what is Step 4?',
      option_a: 'Diamond shape (vertex pointing upward)',
      option_b: 'Circle',
      option_c: 'Horizontal line',
      option_d: 'Triangle',
      correct_option: 'A',
      explanation: 'Rotations alternate between flat square (0 deg) and diamond (45 deg). Step 4 is diamond (45 deg).',
      order_index: 1
    },
    {
      id: 7,
      quiz_id: 2,
      question_text: 'Pattern Matrix: Row 1 has 1 dot, Row 2 has 2 dots, Row 3 has 3 dots. Column 1 has single outline, Column 2 has double outline, Column 3 has triple outline. What is at Row 3, Column 3?',
      option_a: '3 dots inside a triple outline box',
      option_b: '2 dots inside a single outline box',
      option_c: '1 dot inside a triple outline box',
      option_d: '4 dots inside a double outline box',
      correct_option: 'A',
      explanation: 'Combining Row rule (3 dots) with Column rule (triple outline) results in 3 dots inside a triple outline.',
      order_index: 2
    },
    {
      id: 8,
      quiz_id: 2,
      question_text: 'Which shape completes the mirror reflection on the vertical axis for an arrow pointing TOP-RIGHT?',
      option_a: 'TOP-LEFT',
      option_b: 'BOTTOM-RIGHT',
      option_c: 'BOTTOM-LEFT',
      option_d: 'DIRECTLY UP',
      correct_option: 'A',
      explanation: 'Reflecting across a vertical line flips horizontal direction: Right becomes Left while vertical orientation remains unchanged (Top). Thus, TOP-LEFT.',
      order_index: 3
    }
  ],
  3: [
    {
      id: 9,
      quiz_id: 3,
      question_text: 'Choose the correct preposition: The officer insisted ______ completing the tactical exercise before dusk.',
      option_a: 'in',
      option_b: 'on',
      option_c: 'at',
      option_d: 'for',
      correct_option: 'B',
      explanation: 'The verb "insist" is always followed by the preposition "on" (insist on doing something).',
      order_index: 1
    },
    {
      id: 10,
      quiz_id: 3,
      question_text: 'Physics: A projectile launched at an angle of 45 degrees achieves what characteristic in ideal conditions?',
      option_a: 'Maximum Range',
      option_b: 'Minimum Flight Time',
      option_c: 'Maximum Height',
      option_d: 'Zero Acceleration',
      correct_option: 'A',
      explanation: 'In projectile motion, maximum horizontal range R is achieved when the launch angle is 45 degrees (sin 2(45) = sin 90 = 1).',
      order_index: 2
    },
    {
      id: 11,
      quiz_id: 3,
      question_text: 'Defense GK: What is the highest military gallantry award of Pakistan?',
      option_a: 'Hilal-e-Jurat',
      option_b: 'Sitara-e-Jurat',
      option_c: 'Nishan-e-Haider',
      option_d: 'Tamgha-e-Basalat',
      correct_option: 'C',
      explanation: 'Nishan-e-Haider is the supreme military award of the Islamic Republic of Pakistan, awarded for extraordinary acts of valor.',
      order_index: 3
    },
    {
      id: 12,
      quiz_id: 3,
      question_text: 'Mathematics: If a military convoy travels 180 km in 2 hours and 30 minutes, what is its average speed in km/h?',
      option_a: '65 km/h',
      option_b: '72 km/h',
      option_c: '75 km/h',
      option_d: '80 km/h',
      correct_option: 'B',
      explanation: 'Speed = Distance / Time = 180 / 2.5 = 72 km/h.',
      order_index: 4
    }
  ]
};

export const WAT_WORDS = [
  'DUTY',
  'COURAGE',
  'LEADER',
  'DIFFICULTY',
  'DEFEAT',
  'COUNTRY',
  'DISCIPLINE',
  'FEAR',
  'WEAPON',
  'HONOR',
  'SACRIFICE',
  'OBEY',
  'ENEMY',
  'ATTACK',
  'SUCCESS',
  'RESPONSIBILITY',
  'SOLDIER',
  'PATIENCE',
  'VICTORY',
  'DECISION'
];
