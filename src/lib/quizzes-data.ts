import { Quiz, QuizQuestion } from '@/types';

export const VERBAL_REASONING_TYPES = [
  'Number + Alphabetical series (same concept)',
  'Days reasoning',
  'Age reasoning',
  'Direction reasoning',
  'Percentage reasoning',
  'Dozen reasoning',
  'Speed, distance, time',
  'Arithmetic + comparison',
  'Blood relations',
  'Analogy + logical reasoning'
];

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 1,
    course_id: 2,
    title: 'Verbal Intelligence Test (100 Questions Exam)',
    test_type: 'Verbal',
    duration_minutes: 35,
    passing_score: 60,
    sequence_number: 1,
    description: 'Full 100-Question Computer Exam: 10 random questions from each of the 10 Verbal reasoning types. Authentic 35-min military countdown timer.'
  },
  {
    id: 2,
    course_id: 2,
    title: 'Non-Verbal Intelligence Test',
    test_type: 'Non-Verbal',
    duration_minutes: 15,
    passing_score: 60,
    sequence_number: 2,
    description: 'Visual pattern matrices, spatial 45°/90° rotations, shape reflections, and odd-one-out figures.'
  },
  {
    id: 3,
    course_id: 3,
    title: 'Academic Test',
    test_type: 'Academic',
    duration_minutes: 20,
    passing_score: 50,
    sequence_number: 3,
    description: 'Forces syllabus: Physics, Mathematics, English Grammar, and Defense/Islamic General Knowledge.'
  },
  {
    id: 4,
    course_id: 1,
    title: 'ISSB Test (Word Association Test - WAT)',
    test_type: 'WAT',
    duration_minutes: 5,
    passing_score: 70,
    sequence_number: 4,
    description: 'Authentic 10-second Word Association Test simulator for psychological battery screening.'
  }
];

export const SAMPLE_QUESTIONS: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 1,
      quiz_id: 1,
      category: '1. Number + Alphabetical series',
      question_text: 'What comes next in the alphanumeric series: A2, C4, F8, J16, ...?',
      option_a: 'O32',
      option_b: 'N32',
      option_c: 'O24',
      option_d: 'P32',
      correct_option: 'A',
      explanation: 'Letters increase by consecutive skip intervals (+2, +3, +4, +5): A (+2) -> C, C (+3) -> F, F (+4) -> J, J (+5) -> O. Numbers double each step: 2, 4, 8, 16, 32. The result is O32.',
      order_index: 1
    },
    {
      id: 2,
      quiz_id: 1,
      category: '2. Days reasoning',
      question_text: 'If the day before yesterday was Thursday, what day will it be 2 days after tomorrow?',
      option_a: 'Monday',
      option_b: 'Tuesday',
      option_c: 'Wednesday',
      option_d: 'Sunday',
      correct_option: 'B',
      explanation: 'Day before yesterday = Thursday -> Today = Saturday -> Tomorrow = Sunday. 2 days after tomorrow (Mon, Tue) = Tuesday.',
      order_index: 2
    },
    {
      id: 3,
      quiz_id: 1,
      category: '3. Age reasoning',
      question_text: "A father is currently 4 times older than his son. In 20 years, he will be twice as old as his son. What is the father's current age?",
      option_a: '36 years',
      option_b: '40 years',
      option_c: '48 years',
      option_d: '32 years',
      correct_option: 'B',
      explanation: "Let son's current age = x. Father = 4x. In 20 years: (4x + 20) = 2(x + 20) => 4x + 20 = 2x + 40 => 2x = 20 => x = 10. Father is 4 × 10 = 40 years.",
      order_index: 3
    },
    {
      id: 4,
      quiz_id: 1,
      category: '4. Direction reasoning',
      question_text: 'A cadet marches 6 km North, turns right and marches 8 km. How far and in which direction is he now from his starting point?',
      option_a: '10 km North-East',
      option_b: '14 km North-East',
      option_c: '10 km North-West',
      option_d: '12 km East',
      correct_option: 'A',
      explanation: 'Using Pythagoras theorem: Distance = √(6² + 8²) = √(36 + 64) = √100 = 10 km. He started North and turned right (East), so direction is North-East.',
      order_index: 4
    },
    {
      id: 5,
      quiz_id: 1,
      category: '5. Percentage reasoning',
      question_text: 'What is 90% of 90?',
      option_a: '9',
      option_b: '81',
      option_c: '99',
      option_d: '72',
      correct_option: 'B',
      explanation: '90% of 90 = (90 / 100) × 90 = 9 × 9 = 81.',
      order_index: 5
    },
    {
      id: 6,
      quiz_id: 1,
      category: '6. Dozen reasoning',
      question_text: 'If 1 dozen (12) eggs cost Rs. 180, what is the cost of 8 eggs?',
      option_a: 'Rs. 100',
      option_b: 'Rs. 110',
      option_c: 'Rs. 120',
      option_d: 'Rs. 130',
      correct_option: 'C',
      explanation: 'Cost of 1 egg = Rs. 180 ÷ 12 = Rs. 15. Cost of 8 eggs = 8 × 15 = Rs. 120.',
      order_index: 6
    },
    {
      id: 7,
      quiz_id: 1,
      category: '7. Speed, distance, time',
      question_text: 'A military convoy travels at a constant speed of 90 km/h. How many meters does it cover in 20 seconds?',
      option_a: '450 meters',
      option_b: '500 meters',
      option_c: '600 meters',
      option_d: '550 meters',
      correct_option: 'B',
      explanation: 'Speed in m/s = 90 × (5/18) = 25 m/s. Distance = Speed × Time = 25 × 20 = 500 meters.',
      order_index: 7
    },
    {
      id: 8,
      quiz_id: 1,
      category: '8. Arithmetic + comparison',
      question_text: 'Ali is older than Bilal. Bilal is older than Danish. Danish is younger than Tariq, but Tariq is younger than Bilal. Who is the oldest among them?',
      option_a: 'Ali',
      option_b: 'Bilal',
      option_c: 'Tariq',
      option_d: 'Danish',
      correct_option: 'A',
      explanation: 'Arranging by age: Ali > Bilal > Tariq > Danish. Therefore, Ali is the oldest.',
      order_index: 8
    },
    {
      id: 9,
      quiz_id: 1,
      category: '9. Blood relations',
      question_text: "Pointing to a man, a girl says: 'He is the son of the only brother of my father\\'s sister.' How is the man related to the girl?",
      option_a: 'Brother',
      option_b: 'Cousin',
      option_c: 'Uncle',
      option_d: 'Nephew',
      correct_option: 'A',
      explanation: "Father's sister is Aunt. The only brother of Aunt is the girl's father. The son of the girl's father is her Brother.",
      order_index: 9
    },
    {
      id: 10,
      quiz_id: 1,
      category: '10. Analogy + logical reasoning',
      question_text: 'SOLDIER is to BARRACKS as SAILOR is to _______?',
      option_a: 'OCEAN',
      option_b: 'DOCK',
      option_c: 'SHIP',
      option_d: 'AIRBASE',
      correct_option: 'C',
      explanation: 'A soldier resides or is stationed in barracks; similarly, a sailor resides or is stationed on a ship.',
      order_index: 10
    }
  ],
  2: [
    {
      id: 11,
      quiz_id: 2,
      category: 'Shape Rotation',
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
      id: 12,
      quiz_id: 2,
      category: 'Pattern Matrix',
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
      id: 13,
      quiz_id: 2,
      category: 'Mirror Reflection',
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
      id: 14,
      quiz_id: 3,
      category: 'English Grammar',
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
      id: 15,
      quiz_id: 3,
      category: 'Physics',
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
      id: 16,
      quiz_id: 3,
      category: 'Defense General Knowledge',
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
      id: 17,
      quiz_id: 3,
      category: 'Mathematics',
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
