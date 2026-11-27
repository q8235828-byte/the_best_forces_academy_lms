import { Course } from '@/types';

export interface CourseEligibility {
  minAge: number;
  maxAge: number;
  ageLabel: string;
  minHeightMaleInches: number;
  minHeightFemaleInches: number;
  heightLabel: string;
  educationLevel: 'Matric' | 'Intermediate' | 'Graduation' | 'School' | 'All';
  minPercent: number;
  educationLabel: string;
  allowedGenders: ('Male' | 'Female')[];
  genderLabel: string;
  maritalStatus: string;
  nationality: string;
  notes: string[];
}

export interface EligibilityCheckItem {
  label: string;
  passed: boolean;
  detail: string;
}

export interface EligibilityEvaluation {
  status: 'eligible' | 'not_eligible' | 'incomplete';
  isEligible: boolean;
  ageYears: number | null;
  checks: EligibilityCheckItem[];
  summaryMessage: string;
}

const SLUG_OVERRIDES: Record<string, Partial<CourseEligibility>> = {
  'army-soldier': {
    minAge: 17.5,
    maxAge: 23,
    ageLabel: '17.5 – 23 Years',
    minHeightMaleInches: 66,
    minHeightFemaleInches: 0,
    heightLabel: "5'6\" (167.5 cm) Minimum",
    educationLevel: 'Matric',
    minPercent: 45,
    educationLabel: 'Matric Passed (Minimum 45% Marks)',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only (Pakistani Citizens)',
    notes: [
      'Chest: 31" – 33" (with 2" expansion)',
      '1.6 km running in 8 minutes + 15 push-ups & sit-ups',
      'Relaxation of 1 year in upper age for Shaheed/ward of serving personnel',
    ],
  },
  'army-clerk': {
    minAge: 17.5,
    maxAge: 23,
    ageLabel: '17.5 – 23 Years',
    minHeightMaleInches: 63,
    minHeightFemaleInches: 0,
    heightLabel: "5'3\" (160 cm) Minimum",
    educationLevel: 'Intermediate',
    minPercent: 50,
    educationLabel: 'Intermediate (FA/FSc/ICS) Min 50% or Matric with Computer',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only',
    notes: ['Basic computer & English typing proficiency required', 'Chest: 31" – 33"'],
  },
  'pma-long-course': {
    minAge: 17,
    maxAge: 22,
    ageLabel: '17 – 22 Years (24 for Graduates)',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 0,
    heightLabel: "5'4\" (162.5 cm) Minimum",
    educationLevel: 'Intermediate',
    minPercent: 55,
    educationLabel: 'Intermediate (FA/FSc/ICS/I.Com) Min 55% Marks',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only (Unmarried)',
    notes: [
      'Hope Certificate accepted for FSc Part-II appearing candidates (60%+ in Part-I)',
      'Valid Computerized CNIC / B-Form required',
      'Initial Computerized Intelligence + Academic + Physical + ISSB',
    ],
  },
  'afns-nursing': {
    minAge: 17,
    maxAge: 25,
    ageLabel: '17 – 25 Years',
    minHeightMaleInches: 0,
    minHeightFemaleInches: 60,
    heightLabel: "5'0\" (152.4 cm) Minimum",
    educationLevel: 'Intermediate',
    minPercent: 50,
    educationLabel: 'FSc (Pre-Medical) Min 50% & Matric Science Min 60%',
    allowedGenders: ['Female'],
    genderLabel: 'Female Only (Unmarried / Widow / Divorced without encumbrances)',
    notes: ['Biology, Chemistry & Physics mandatory in FSc', 'GHQ Selection Board Interview after Initial Test'],
  },
  'amc-medical-cadet': {
    minAge: 17,
    maxAge: 21,
    ageLabel: '17 – 21 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 0,
    heightLabel: "5'4\" (162.5 cm) Minimum",
    educationLevel: 'Intermediate',
    minPercent: 70,
    educationLabel: 'FSc (Pre-Medical) Minimum 70% Marks',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only (Unmarried)',
    notes: ['NUMS / AMC Entry Test & GHQ Medical Clearance required'],
  },
  'tcc-technical-cadet': {
    minAge: 17,
    maxAge: 21,
    ageLabel: '17 – 21 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 0,
    heightLabel: "5'4\" (162.5 cm) Minimum",
    educationLevel: 'Intermediate',
    minPercent: 65,
    educationLabel: 'FSc (Pre-Engineering) / ICS Minimum 65% Marks',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only (Unmarried)',
    notes: ['Physics, Maths & Chemistry/Computer required', 'Leads to B.E. at NUST (MCS/EME/CAE)'],
  },
  'army-ssc': {
    minAge: 21,
    maxAge: 28,
    ageLabel: '21 – 28 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 0,
    heightLabel: "5'4\" (162.5 cm) Minimum",
    educationLevel: 'Graduation',
    minPercent: 50,
    educationLabel: 'BS (4-Year) / Masters / Engineering (Min 2.5 CGPA or 50%)',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only',
  },
  'army-lcc': {
    minAge: 20,
    maxAge: 28,
    ageLabel: '20 – 28 Years',
    minHeightMaleInches: 0,
    minHeightFemaleInches: 60,
    heightLabel: "5'0\" (152.4 cm) Minimum",
    educationLevel: 'Graduation',
    minPercent: 50,
    educationLabel: 'BS (4-Year) / Masters (Min 2.5 CGPA or 50%)',
    allowedGenders: ['Female'],
    genderLabel: 'Female Only (Unmarried)',
  },
  'pn-cadet': {
    minAge: 16.5,
    maxAge: 21,
    ageLabel: '16.5 – 21 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 0,
    heightLabel: "5'4\" (162.5 cm) Minimum",
    educationLevel: 'Intermediate',
    minPercent: 60,
    educationLabel: 'FSc (Pre-Eng / ICS / Pre-Med) Min 60% Marks',
    allowedGenders: ['Male'],
    genderLabel: 'Male Only (Unmarried)',
  },
  'paf-gdp': {
    minAge: 16,
    maxAge: 22,
    ageLabel: '16 – 22 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 64,
    heightLabel: "5'4\" (163 cm) Minimum (6/6 Eyesight without glasses)",
    educationLevel: 'Intermediate',
    minPercent: 60,
    educationLabel: 'FSc (Pre-Eng / Pre-Med / ICS) Min 60% Marks',
    allowedGenders: ['Male', 'Female'],
    genderLabel: 'Both Male & Female (Unmarried)',
    notes: ['Perfect 6/6 distant vision without glasses mandatory for GDP'],
  },
  'paf-cae': {
    minAge: 16,
    maxAge: 22,
    ageLabel: '16 – 22 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 62,
    heightLabel: "5'4\" (Male) / 5'2\" (Female)",
    educationLevel: 'Intermediate',
    minPercent: 65,
    educationLabel: 'FSc (Pre-Engineering) Minimum 65% Marks',
    allowedGenders: ['Male', 'Female'],
    genderLabel: 'Both Male & Female (Unmarried)',
  },
  'paf-ad': {
    minAge: 16,
    maxAge: 22,
    ageLabel: '16 – 22 Years',
    minHeightMaleInches: 64,
    minHeightFemaleInches: 62,
    heightLabel: "5'4\" (Male) / 5'2\" (Female)",
    educationLevel: 'Intermediate',
    minPercent: 60,
    educationLabel: 'FSc (Pre-Eng / ICS) Minimum 60% Marks',
    allowedGenders: ['Male', 'Female'],
    genderLabel: 'Both Male & Female (Unmarried)',
  },
};

export function getCourseEligibility(course: Course): CourseEligibility {
  const override = SLUG_OVERRIDES[course.slug];

  const allowedGenders: ('Male' | 'Female')[] =
    course.target_gender === 'Boys'
      ? ['Male']
      : course.target_gender === 'Girls'
      ? ['Female']
      : ['Male', 'Female'];

  const qLower = course.qualification.toLowerCase();
  let educationLevel: CourseEligibility['educationLevel'] = 'Matric';
  let minAge = 16;
  let maxAge = 23;
  let minHeightMaleInches = 64;
  let minHeightFemaleInches = 60;
  let minPercent = 50;

  if (qLower.includes('class 5') || qLower.includes('grade 1') || course.category === 'cadet_college') {
    educationLevel = 'School';
    minAge = 10;
    maxAge = 18;
    minHeightMaleInches = 0;
    minHeightFemaleInches = 0;
    minPercent = 0;
  } else if (qLower.includes('all levels') || qLower.includes('grade 11')) {
    educationLevel = 'All';
    minAge = 12;
    maxAge = 35;
    minHeightMaleInches = 0;
    minHeightFemaleInches = 0;
    minPercent = 0;
  } else if (qLower.includes('graduation') || qLower.includes('masters')) {
    educationLevel = 'Graduation';
    minAge = 20;
    maxAge = 28;
  } else if (qLower.includes('fsc') || qLower.includes('intermediate') || qLower.includes('a-levels')) {
    educationLevel = 'Intermediate';
    minAge = 16;
    maxAge = 23;
    minPercent = 55;
  } else if (qLower.includes('matric')) {
    educationLevel = 'Matric';
    minAge = 16;
    maxAge = 23;
    minPercent = 50;
  }

  if (
    course.category === 'initial_prep' ||
    course.category === 'entry_test' ||
    course.category === 'academics'
  ) {
    minHeightMaleInches = 0;
    minHeightFemaleInches = 0;
    maxAge = 30;
  }

  const base: CourseEligibility = {
    minAge,
    maxAge,
    ageLabel: `${minAge} – ${maxAge} Years`,
    minHeightMaleInches,
    minHeightFemaleInches,
    heightLabel:
      minHeightMaleInches === 0 && minHeightFemaleInches === 0
        ? 'No Minimum Height Requirement'
        : allowedGenders.length === 2
        ? `5'4" (Boys) / 5'0" (Girls)`
        : allowedGenders[0] === 'Male'
        ? `5'4" (162.5 cm) Minimum`
        : `5'0" (152.4 cm) Minimum`,
    educationLevel,
    minPercent,
    educationLabel: course.qualification + (minPercent > 0 ? ` (Min ${minPercent}%)` : ''),
    allowedGenders,
    genderLabel:
      allowedGenders.length === 2
        ? 'Both Male & Female'
        : allowedGenders[0] === 'Male'
        ? 'Male Only'
        : 'Female Only',
    maritalStatus: educationLevel === 'Graduation' ? 'Unmarried / Married' : 'Unmarried',
    nationality: 'Pakistani Citizen / AJK',
    notes: [
      'Original CNIC / B-Form & Academic Certificates required at Selection Center',
      'Medically fit as per Armed Forces Selection Standards',
    ],
  };

  return { ...base, ...override };
}

function parseHeightToInches(heightStr?: string): number | null {
  if (!heightStr) return null;
  const cleaned = heightStr.trim().replace(/['"]/g, '.').replace(/\s+/g, '');
  const parts = cleaned.split('.');
  const feet = parseInt(parts[0], 10);
  if (isNaN(feet)) return null;
  if (feet > 20) {
    // User may have entered cm or total inches
    return feet > 100 ? Math.round(feet / 2.54) : feet;
  }
  const inches = parts[1] ? parseInt(parts[1], 10) : 0;
  return feet * 12 + (isNaN(inches) ? 0 : inches);
}

function parseMarksPercent(marksStr?: string): number | null {
  if (!marksStr) return null;
  const s = marksStr.trim();
  if (!s) return null;
  // Handle "850/1100" or "78%" or "850"
  if (s.includes('/')) {
    const [obt, tot] = s.split('/').map((n) => parseFloat(n.replace(/[^0-9.]/g, '')));
    if (!isNaN(obt) && !isNaN(tot) && tot > 0) return (obt / tot) * 100;
  }
  const num = parseFloat(s.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return null;
  if (num <= 100) return num;
  if (num <= 1100) return (num / 1100) * 100;
  return null;
}

export function checkCandidateEligibility(
  course: Course,
  candidate: {
    dob?: string;
    gender: 'Male' | 'Female';
    height?: string;
    matricMarks?: string;
    fscMarks?: string;
  }
): EligibilityEvaluation {
  const criteria = getCourseEligibility(course);
  const checks: EligibilityCheckItem[] = [];
  let hasFailed = false;
  let hasMissing = false;

  // 1. Gender check
  const genderOk = criteria.allowedGenders.includes(candidate.gender);
  checks.push({
    label: 'Gender Requirement',
    passed: genderOk,
    detail: genderOk
      ? `${candidate.gender} accepted (${criteria.genderLabel})`
      : `Not Eligible: This course is for ${criteria.genderLabel} only`,
  });
  if (!genderOk) hasFailed = true;

  // 2. Age check
  let ageYears: number | null = null;
  if (candidate.dob) {
    const birth = new Date(candidate.dob);
    if (!isNaN(birth.getTime())) {
      const now = new Date();
      ageYears = (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      const rounded = Math.round(ageYears * 10) / 10;
      const ageOk = ageYears >= criteria.minAge && ageYears <= criteria.maxAge;
      checks.push({
        label: 'Age Limit',
        passed: ageOk,
        detail: ageOk
          ? `${rounded} years (Allowed: ${criteria.ageLabel})`
          : `Age ${rounded} yrs is outside allowed range (${criteria.ageLabel})`,
      });
      if (!ageOk) hasFailed = true;
    }
  } else {
    hasMissing = true;
    checks.push({
      label: 'Age Limit',
      passed: false,
      detail: `Enter Date of Birth to verify (${criteria.ageLabel})`,
    });
  }

  // 3. Height check
  const reqHeight =
    candidate.gender === 'Male' ? criteria.minHeightMaleInches : criteria.minHeightFemaleInches;
  if (reqHeight > 0) {
    const parsedInches = parseHeightToInches(candidate.height);
    if (parsedInches !== null) {
      const heightOk = parsedInches >= reqHeight;
      const reqFt = Math.floor(reqHeight / 12);
      const reqIn = reqHeight % 12;
      const curFt = Math.floor(parsedInches / 12);
      const curIn = parsedInches % 12;
      checks.push({
        label: 'Height Standard',
        passed: heightOk,
        detail: heightOk
          ? `${curFt}'${curIn}" meets minimum ${reqFt}'${reqIn}"`
          : `${curFt}'${curIn}" is below minimum required ${reqFt}'${reqIn}"`,
      });
      if (!heightOk) hasFailed = true;
    } else {
      hasMissing = true;
      checks.push({
        label: 'Height Standard',
        passed: false,
        detail: `Enter height (e.g. 5.8) — Min: ${criteria.heightLabel}`,
      });
    }
  }

  // 4. Education / Marks check
  if (criteria.educationLevel === 'Matric') {
    const pct = parseMarksPercent(candidate.matricMarks);
    if (pct !== null) {
      const ok = pct >= criteria.minPercent;
      checks.push({
        label: 'Academic Qualification',
        passed: ok,
        detail: ok
          ? `Matric ${pct.toFixed(0)}% meets minimum ${criteria.minPercent}%`
          : `Matric ${pct.toFixed(0)}% is below required ${criteria.minPercent}%`,
      });
      if (!ok) hasFailed = true;
    } else if (candidate.matricMarks?.trim()) {
      checks.push({
        label: 'Academic Qualification',
        passed: true,
        detail: `Matric provided (${candidate.matricMarks})`,
      });
    } else {
      hasMissing = true;
      checks.push({
        label: 'Academic Qualification',
        passed: false,
        detail: `Enter Matric marks (${criteria.educationLabel})`,
      });
    }
  } else if (criteria.educationLevel === 'Intermediate' || criteria.educationLevel === 'Graduation') {
    const pct = parseMarksPercent(candidate.fscMarks);
    if (pct !== null) {
      const ok = pct >= criteria.minPercent;
      checks.push({
        label: 'Academic Qualification',
        passed: ok,
        detail: ok
          ? `Inter/FSc ${pct.toFixed(0)}% meets minimum ${criteria.minPercent}%`
          : `Inter/FSc ${pct.toFixed(0)}% is below required ${criteria.minPercent}%`,
      });
      if (!ok) hasFailed = true;
    } else if (candidate.fscMarks?.trim()) {
      checks.push({
        label: 'Academic Qualification',
        passed: true,
        detail: `Inter/FSc provided (${candidate.fscMarks})`,
      });
    } else {
      hasMissing = true;
      checks.push({
        label: 'Academic Qualification',
        passed: false,
        detail: `Enter Inter/FSc marks (${criteria.educationLabel})`,
      });
    }
  }

  const status: EligibilityEvaluation['status'] = hasFailed
    ? 'not_eligible'
    : hasMissing
    ? 'incomplete'
    : 'eligible';

  const summaryMessage =
    status === 'eligible'
      ? `Congratulations! You are ELIGIBLE to apply for ${course.title}.`
      : status === 'not_eligible'
      ? `You are currently NOT ELIGIBLE for ${course.title} based on the highlighted criteria.`
      : `Please complete Date of Birth, Height, and Academic Marks to verify eligibility for ${course.title}.`;

  return {
    status,
    isEligible: status === 'eligible',
    ageYears,
    checks,
    summaryMessage,
  };
}

export interface TestPatternSection {
  title: string;
  questions: string;
  duration: string;
  details: string;
}

export interface CourseTestPattern {
  mode: string;
  passingScore: string;
  negativeMarking: string;
  sections: TestPatternSection[];
}

export interface SelectionStep {
  step: number;
  title: string;
  description: string;
}

export function getCourseTestPattern(course: Course): CourseTestPattern {
  const s = course.slug;
  const cat = course.category;

  if (cat === 'issb' || s === 'issb-complete-prep') {
    return {
      mode: '5-Day Comprehensive Selection Board (Kohat / Gujranwala / Malir / Quetta)',
      passingScore: 'Board Recommendation (Psych + GTO + Deputy President)',
      negativeMarking: 'No negative marking; continuous personality & leadership grading',
      sections: [
        { title: 'Day 1: Screening & Psychological Tests', questions: '100+ WAT, 26 SRT, 4 Picture/Pointer Stories', duration: 'Day 1–2', details: '10-second Word Association (WAT), Sentence Completion, Self-Description & OPI.' },
        { title: 'Day 2–3: GTO Indoor & Outdoor Tasks', questions: 'GD, Lecturette, PGT, HGT, Command Task', duration: 'Day 2–4', details: 'Group Discussion, Military Planning, Progressive Group Task, Individual Obstacles.' },
        { title: 'Day 3–4: Deputy President Interview', questions: 'One-on-One Board Interview', duration: '25–40 mins', details: 'Biographical verification, GK, current affairs, rapid-fire situational stress questions.' },
      ],
    };
  }

  if (s === 'pma-long-course' || s === 'tcc-technical-cadet' || s === 'pn-cadet' || s === 'paf-gdp' || s === 'paf-cae' || s === 'paf-ad' || s === 'paf-asd' || s === 'paf-logistics' || s === 'amc-medical-cadet') {
    const academicSubj =
      s === 'amc-medical-cadet'
        ? 'Biology, Chemistry, Physics & English'
        : s === 'tcc-technical-cadet' || s === 'paf-cae' || s === 'pn-cadet'
        ? 'Mathematics, Physics, Chemistry/Computer & English'
        : 'English, General Math, Pak Studies, Islamic Studies & General Knowledge';
    return {
      mode: 'Computerized E-Testing at AS&RC / PN / PAF Selection Centers',
      passingScore: 'Minimum 50–60% in each module (Sequential Pass)',
      negativeMarking: 'No negative marking',
      sections: [
        { title: '1. Verbal Intelligence Test', questions: '84 MCQs', duration: '30 Minutes', details: 'Number/Letter series, coding-decoding, blood relations, odd one out, analogies, directions.' },
        { title: '2. Non-Verbal Intelligence Test', questions: '64 MCQs', duration: '30 Minutes', details: 'Pattern series, matrices, mirror/water reflection, paper folding, rotation & spatial logic.' },
        { title: '3. Academic Test', questions: '50 MCQs', duration: '25–30 Minutes', details: academicSubj },
      ],
    };
  }

  if (s === 'afns-nursing') {
    return {
      mode: 'Computerized Initial Test at Army Selection & Recruitment Centers (AS&RC)',
      passingScore: 'Minimum 50% per section',
      negativeMarking: 'No negative marking',
      sections: [
        { title: '1. Verbal Intelligence Test', questions: '84 MCQs', duration: '30 Minutes', details: 'Series, analogies, logical reasoning, direction sense & comprehension.' },
        { title: '2. Non-Verbal Intelligence Test', questions: '64 MCQs', duration: '30 Minutes', details: 'Visual pattern series, odd figure out, matrices & mirror reflections.' },
        { title: '3. Academic Test (Pre-Medical)', questions: '50 MCQs', duration: '30 Minutes', details: 'FSc Biology, Chemistry, Physics & English Grammar.' },
      ],
    };
  }

  if (cat === 'cadet_college') {
    return {
      mode: 'Written Entrance Examination + Intelligence & Interview',
      passingScore: 'Merit-Based Top Cutoff (60%+)',
      negativeMarking: 'No negative marking',
      sections: [
        { title: '1. English & Composition', questions: '100 Marks', duration: '60 Minutes', details: 'Grammar, comprehension, essay/letter writing, translation & vocabulary.' },
        { title: '2. Mathematics & General Science', questions: '100 Marks', duration: '60 Minutes', details: 'Class-level arithmetic, algebra, geometry & core science concepts.' },
        { title: '3. Urdu / Islamiat & Intelligence', questions: '50–100 Marks', duration: '45 Minutes', details: 'Urdu grammar, Islamic studies, Pak Studies & basic IQ.' },
      ],
    };
  }

  if (cat === 'entry_test') {
    return {
      mode: 'Standardized University / Medical / Law Entry Test Pattern',
      passingScore: 'Minimum 50–65% (Merit Aggregate)',
      negativeMarking: 'As per PMDC / ECAT / HEC policy',
      sections: [
        { title: '1. Core Major Subjects', questions: '120–150 MCQs', duration: '120 Minutes', details: 'Biology/Math, Physics, Chemistry based on selected track (MDCAT/ECAT/LAT).' },
        { title: '2. English & Analytical Reasoning', questions: '30–50 MCQs', duration: '45 Minutes', details: 'Vocabulary, grammar, critical reading & logical deduction.' },
      ],
    };
  }

  // Soldier, Sailor, Airman, Clerk, FMT, FMA, etc.
  return {
    mode: 'Computerized / Written Initial Test at Recruitment Centers',
    passingScore: 'Minimum 50% in Intelligence & Academic modules',
    negativeMarking: 'No negative marking',
    sections: [
      { title: '1. Intelligence Test (Verbal + Non-Verbal)', questions: '60–80 MCQs', duration: '30 Minutes', details: 'Basic number/figure series, odd one out, analogies & pattern completion.' },
      { title: '2. Academic Test', questions: '40–50 MCQs', duration: '30 Minutes', details: `${course.qualification}-level English, General Math, Pak Studies, Islamic Studies & General Knowledge.` },
      { title: '3. Physical & Trade Test', questions: 'Practical Standards', duration: 'Same Day / Next Day', details: '1.6 km running, push-ups, sit-ups, chin-ups & trade/medical screening.' },
    ],
  };
}

export function getCourseSelectionProcedure(course: Course): SelectionStep[] {
  const s = course.slug;
  const cat = course.category;

  if (s === 'pma-long-course' || s === 'tcc-technical-cadet' || s === 'pn-cadet' || s === 'paf-gdp' || s === 'paf-cae' || s === 'paf-ad' || s === 'paf-asd' || s === 'paf-logistics' || s === 'amc-medical-cadet' || s === 'army-ssc' || s === 'army-lcc' || s === 'navy-ssc') {
    return [
      { step: 1, title: 'Online Registration', description: 'Apply online via official Join Pak Army / Navy / PAF portal and download your Registration Slip.' },
      { step: 2, title: 'Initial Computerized Test', description: 'Appear at your selected AS&RC / Selection Center for Verbal, Non-Verbal & Academic tests.' },
      { step: 3, title: 'Initial Medical & Physical Test', description: 'Height, weight, eyesight, chest check plus 1.6 km run, push-ups, sit-ups & chin-ups.' },
      { step: 4, title: 'ISSB Call & 5-Day Selection Board', description: 'Shortlisted candidates receive ISSB call letter for Psychological, GTO & Deputy President assessments.' },
      { step: 5, title: 'Final Medical & GHQ/NHQ/AHQ Merit List', description: 'CMB final medical clearance followed by final merit list & Academy Joining Letter.' },
    ];
  }

  if (s === 'afns-nursing') {
    return [
      { step: 1, title: 'Online Registration', description: 'Register on Join Pak Army portal during AFNS induction window.' },
      { step: 2, title: 'Initial Computerized Test', description: 'Pass Verbal, Non-Verbal & Pre-Medical Academic test at AS&RC.' },
      { step: 3, title: 'Initial Medical Examination', description: 'Preliminary height, weight, vision & general medical fitness screening.' },
      { step: 4, title: 'GHQ Selection Board Interview', description: 'Panel interview assessing communication, confidence & nursing aptitude.' },
      { step: 5, title: 'Final Merit & AFNS Training', description: 'Final medical & merit selection for 4-Year BSc Nursing at Armed Forces Nursing Colleges.' },
    ];
  }

  if (cat === 'cadet_college') {
    return [
      { step: 1, title: 'Admission Form Submission', description: 'Submit college admission form with B-Form and school record before deadline.' },
      { step: 2, title: 'Written Entrance Exam', description: 'Appear in English, Mathematics, Science & Urdu/Islamiat test at designated center.' },
      { step: 3, title: 'Intelligence & Interview', description: 'Qualified candidates appear before Principal & Selection Board for interview.' },
      { step: 4, title: 'Medical Fitness & Joining', description: 'Final medical checkup followed by fee challan & cadet college induction.' },
    ];
  }

  if (cat === 'entry_test' || cat === 'academics' || cat === 'initial_prep' || cat === 'issb') {
    return [
      { step: 1, title: 'Course Enrollment', description: 'Enroll in the preparation batch and unlock all video lectures, PDFs & mock exams.' },
      { step: 2, title: 'Daily Topic Mastery', description: 'Follow the structured syllabus roadmap and practice timed computerized MCQs.' },
      { step: 3, title: 'Mock Exams & Leaderboard', description: 'Attempt full-length simulated tests and review detailed step-by-step solutions.' },
      { step: 4, title: 'Mentor Feedback & Final Readiness', description: 'Get personal guidance via VIP WhatsApp batch until your final exam day.' },
    ];
  }

  // Soldier, Sailor, Airman, Clerk, etc.
  return [
    { step: 1, title: 'Online / Center Registration', description: 'Register online or visit nearest Army/Navy/PAF Selection & Recruitment Center with original documents.' },
    { step: 2, title: 'Document & Physical Verification', description: 'Verification of CNIC, Domicile, Matric certificate plus height & chest measurement.' },
    { step: 3, title: 'Physical Efficiency Test', description: '1.6 km running within 8 minutes, push-ups, sit-ups & pull-ups.' },
    { step: 4, title: 'Written / Computerized Test', description: 'Intelligence & Matric-level Academic MCQs test.' },
    { step: 5, title: 'Final Medical & Training Call Letter', description: 'Medical clearance by Classified Specialist followed by Training Center Joining Letter.' },
  ];
}
