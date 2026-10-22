-- ==============================================================================
-- THE BEST FORCES ACADEMY LMS
-- Native Cloudflare D1 (SQLite Edge) Database Schema & Complete Course Seeding
-- Domain: bestforcesacademy.net | Lead: Sir Faryad Tabassum (+92 305 4599659)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE STRUCTURES
-- ------------------------------------------------------------------------------

-- Profiles & ISSB Complete Admission Biodata
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY, -- Auth User UID
  full_name TEXT NOT NULL,
  father_name TEXT,
  cnic_bform TEXT UNIQUE,
  dob TEXT, -- Format: YYYY-MM-DD
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  phone_number TEXT NOT NULL UNIQUE,
  domicile_district TEXT,
  height_feet REAL,
  weight_kg REAL,
  identification_mark TEXT,
  religion TEXT DEFAULT 'Islam',
  sect TEXT,
  father_occupation TEXT,
  monthly_income REAL,
  matric_marks INTEGER,
  matric_total INTEGER DEFAULT 1100,
  fsc_marks INTEGER,
  fsc_total INTEGER DEFAULT 1100,
  issb_status TEXT DEFAULT 'Fresh' CHECK (issb_status IN ('Fresh', 'Repeater')),
  bform_document_url TEXT,
  current_session_token TEXT, -- Enforces Single Active Session
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Courses Catalog
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'issb', 'initial_prep', 'army', 'navy', 'paf', 'cadet_college', 'entry_test', 'academics'
  qualification TEXT NOT NULL,
  target_gender TEXT NOT NULL, -- 'Boys', 'Girls', 'Both'
  regular_price REAL NOT NULL DEFAULT 0,
  sale_price REAL NOT NULL DEFAULT 0,
  whatsapp_group_link TEXT,
  thumbnail_url TEXT,
  syllabus_summary TEXT,
  is_published INTEGER DEFAULT 1, -- 1 = active, 0 = draft
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Lessons (Video Lectures with Free Lesson 1 Rule)
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  video_url TEXT NOT NULL,
  is_free_preview INTEGER DEFAULT 0, -- 1 = Free Demo (Lesson 1), 0 = Locked
  created_at TEXT DEFAULT (datetime('now'))
);

-- Open PDF Notes
CREATE TABLE IF NOT EXISTS course_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Quizzes (Verbal, Non-Verbal, Academic, WAT)
CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('Verbal', 'Non-Verbal', 'Academic', 'WAT')),
  duration_minutes INTEGER DEFAULT 30,
  passing_score REAL DEFAULT 60
);

-- Quiz Questions (Image support for Non-Verbal matrices)
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT,
  question_image_url TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  order_index INTEGER DEFAULT 1
);

-- Quiz Attempts & Leaderboard Tracking
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score REAL NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Enrollments & Pakistani Manual Payment Proof
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  payment_method TEXT CHECK (payment_method IN ('jazzcash', 'easypaisa', 'bank_transfer')),
  trx_id TEXT NOT NULL,
  receipt_screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, course_id)
);

-- ------------------------------------------------------------------------------
-- 2. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_lookup ON enrollments(user_id, course_id, status);
CREATE INDEX IF NOT EXISTS idx_leaderboard ON quiz_attempts(quiz_id, score DESC, time_spent_seconds ASC);

-- ------------------------------------------------------------------------------
-- 3. COMPLETE SEED DATA (ALL 41 COURSES)
-- ------------------------------------------------------------------------------

-- A. Core Preparation Master Packs
INSERT OR IGNORE INTO courses (title, slug, category, qualification, target_gender, regular_price, sale_price, whatsapp_group_link, syllabus_summary) VALUES
('ISSB Complete Master Preparation Course (Army, Navy, PAF)', 'issb-complete-prep', 'issb', 'Intermediate / Graduation', 'Both', 8000, 4500, 'https://chat.whatsapp.com/sample-issb-vip', 'Screening, 10-Second WAT, Picture Stories, SRT, GTO Bridge & Command Tasks, Interviews & Physical Drills.'),
('Initial Intelligence Master Course (Verbal & Non-Verbal Speed Mastery)', 'initial-intelligence-mastery', 'initial_prep', 'Matric / Intermediate', 'Both', 5000, 2500, 'https://chat.whatsapp.com/sample-intelligence-vip', 'Number/Letter Series, Analogies, Blood Relations, Coding, Matrices, Rotations, Paper Folding.'),
('Initial Academic Test Master Course (Math, Physics, English, GK)', 'initial-academic-mastery', 'initial_prep', 'Matric / Intermediate', 'Both', 6000, 3500, 'https://chat.whatsapp.com/sample-academic-vip', 'English Prepositions, General & Advanced Math, Physics Formulas, Defense GK, Pak Studies, Islamic Studies.');

-- B. Pakistan Army Courses
INSERT OR IGNORE INTO courses (title, slug, category, qualification, target_gender, regular_price, sale_price, whatsapp_group_link, syllabus_summary) VALUES
('Pakistan Army - Soldier Preparation', 'army-soldier', 'army', 'Matric', 'Boys', 4000, 2000, 'https://chat.whatsapp.com/sample-soldier-vip', 'Matric-level English, General Math, Islamic Studies, GK, and Physical test standards.'),
('Pakistan Army - Clerk Preparation', 'army-clerk', 'army', 'Matric / Intermediate', 'Boys', 4500, 2200, 'https://chat.whatsapp.com/sample-clerk-vip', 'English typing, Computer basics, Grammar, Arithmetic, and Initial tests.'),
('Pakistan Army - PMA Long Course (Commission)', 'pma-long-course', 'army', 'Intermediate (FA/FSc/ICS)', 'Boys', 7000, 3800, 'https://chat.whatsapp.com/sample-pma-vip', 'Full Initial computerized intelligence, Academic (English, Math, Physics, GK), ISSB guidelines.'),
('Pakistan Army - AFNS (Armed Forces Nursing Services)', 'afns-nursing', 'army', 'Intermediate (FSc Pre-Medical)', 'Girls', 6500, 3500, 'https://chat.whatsapp.com/sample-afns-vip', 'Biology, Chemistry, Physics, English, and Female-specific medical & interview guidelines.'),
('Pakistan Army - AMC (Army Medical Cadet)', 'amc-medical-cadet', 'army', 'Intermediate (FSc Pre-Medical)', 'Boys', 7000, 4000, 'https://chat.whatsapp.com/sample-amc-vip', 'High-difficulty Biology, Chemistry, Physics, English, and Medical intelligence prep.'),
('Pakistan Army - TCC (Technical Cadet Course)', 'tcc-technical-cadet', 'army', 'Intermediate (FSc Pre-Engineering/ICS)', 'Boys', 7000, 4000, 'https://chat.whatsapp.com/sample-tcc-vip', 'Advanced Mathematics, Physics, English, Computer Science, and Engineering aptitude test.'),
('Pakistan Army - SSC (Short Service Commission)', 'army-ssc', 'army', 'Graduation / Masters', 'Boys', 7500, 4200, 'https://chat.whatsapp.com/sample-armyssc-vip', 'Branch-specific academics, Verbal/Non-Verbal intelligence, and direct ISSB preparation.'),
('Pakistan Army - LCC (Lady Cadet Course)', 'army-lcc', 'army', 'Graduation / Masters', 'Girls', 7500, 4200, 'https://chat.whatsapp.com/sample-lcc-vip', 'Subject specialization, General knowledge, Verbal/Non-Verbal intelligence, and ISSB preparation.');

-- C. Pakistan Navy Courses
INSERT OR IGNORE INTO courses (title, slug, category, qualification, target_gender, regular_price, sale_price, whatsapp_group_link, syllabus_summary) VALUES
('Pakistan Navy - FMT (Female Medical Technician)', 'navy-fmt', 'navy', 'Matric (Science with Biology)', 'Girls', 4500, 2200, 'https://chat.whatsapp.com/sample-navyfmt-vip', 'Matric Biology, Chemistry, English, General Knowledge, and Intelligence test.'),
('Pakistan Navy - Naval Police', 'navy-police', 'navy', 'Matric', 'Boys', 4000, 2000, 'https://chat.whatsapp.com/sample-navypolice-vip', 'Intelligence, General Science, English, Mathematics, and physical drill prep.'),
('Pakistan Navy - Sailor', 'navy-sailor', 'navy', 'Matric (Science)', 'Boys', 4000, 2000, 'https://chat.whatsapp.com/sample-navysailor-vip', 'Intelligence tests, Matric Physics, Chemistry, Math, and English test.'),
('Pakistan Navy - Marine', 'navy-marine', 'navy', 'Matric', 'Boys', 4000, 2000, 'https://chat.whatsapp.com/sample-navymarine-vip', 'Intelligence tests, General Science, Basic Math, and Navy Marine physical benchmarks.'),
('Pakistan Navy - Technical Branch', 'navy-technical', 'navy', 'Matric (Science)', 'Boys', 4500, 2200, 'https://chat.whatsapp.com/sample-navytech-vip', 'Technical aptitude, Applied Physics, Mathematics, English, and Intelligence tests.'),
('Pakistan Navy - PN Cadet Commission', 'pn-cadet', 'navy', 'Intermediate (FSc Pre-Eng/ICS)', 'Boys', 7000, 3800, 'https://chat.whatsapp.com/sample-pncadet-vip', 'Computerized Initial Test (Verbal, Non-Verbal, Math, Physics, English, GK) + ISSB prep.'),
('Pakistan Navy - SSC (Short Service Commission)', 'navy-ssc', 'navy', 'Graduation', 'Both', 7500, 4200, 'https://chat.whatsapp.com/sample-navyssc-vip', 'Branch test (Operations, Marine Engineering, Supply, Education) + ISSB.');

-- D. Pakistan Air Force (PAF) Courses
INSERT OR IGNORE INTO courses (title, slug, category, qualification, target_gender, regular_price, sale_price, whatsapp_group_link, syllabus_summary) VALUES
('PAF - FMA (Female Medical Assistant)', 'paf-fma', 'paf', 'Matric (Science with Biology)', 'Girls', 4500, 2200, 'https://chat.whatsapp.com/sample-paffma-vip', 'Matric Biology, Chemistry, English, and PAF Intelligence test.'),
('PAF - Aerotrade', 'paf-aerotrade', 'paf', 'Matric (Science)', 'Boys', 4500, 2200, 'https://chat.whatsapp.com/sample-aerotrade-vip', 'PAF Intelligence, Matric Physics, Mathematics, and English.'),
('PAF - Aerotec', 'paf-aerotec', 'paf', 'Matric (Science)', 'Boys', 4500, 2200, 'https://chat.whatsapp.com/sample-aerotec-vip', 'Technical aptitude, Physics, Mathematics, and PAF electronic screening.'),
('PAF - Aerosupport', 'paf-aerosupport', 'paf', 'Matric (Science)', 'Boys', 4500, 2200, 'https://chat.whatsapp.com/sample-aerosupport-vip', 'Intelligence, General Science, Math, and ground operations aptitude.'),
('PAF - PF & DI (Physical Fitness & Drill Instructor)', 'paf-pf-di', 'paf', 'Matric', 'Boys', 4000, 2000, 'https://chat.whatsapp.com/sample-pfdi-vip', 'Basic Intelligence, General Knowledge, and rigorous physical standard guidelines.'),
('PAF - Fire Fighter', 'paf-firefighter', 'paf', 'Matric', 'Boys', 4000, 2000, 'https://chat.whatsapp.com/sample-paffire-vip', 'Intelligence, General Science, Basic English, and Physical endurance prep.'),
('PAF - Medical Assistant', 'paf-medical-assistant', 'paf', 'Matric (Science with Biology)', 'Boys', 4500, 2200, 'https://chat.whatsapp.com/sample-pafmed-vip', 'Biology, Chemistry, English, and PAF Medical branch entrance test.'),
('PAF - GDP (General Duty Pilot)', 'paf-gdp', 'paf', 'Intermediate (FSc Pre-Eng/Pre-Med/ICS)', 'Both', 7000, 3800, 'https://chat.whatsapp.com/sample-pafgdp-vip', 'High-speed Intelligence, Advanced Physics, English, Flying Aptitude test + ISSB.'),
('PAF - AD (Air Defence)', 'paf-ad', 'paf', 'Intermediate (FSc Pre-Eng/ICS)', 'Both', 7000, 3800, 'https://chat.whatsapp.com/sample-pafad-vip', 'Intelligence, Radar concepts, Physics, Advanced Math + ISSB preparation.'),
('PAF - CAE (College of Aeronautical Engineering)', 'paf-cae', 'paf', 'Intermediate (FSc Pre-Engineering)', 'Both', 7500, 4000, 'https://chat.whatsapp.com/sample-pafcae-vip', 'Rigorous Mathematics, Mechanics, Electromagnetism, English + ISSB preparation.'),
('PAF - A & SD (Admin & Special Duties)', 'paf-asd', 'paf', 'Intermediate (FA/FSc/ICS/I.Com)', 'Both', 6500, 3500, 'https://chat.whatsapp.com/sample-pafasd-vip', 'Intelligence, English, General Knowledge, Pakistan Affairs + ISSB preparation.'),
('PAF - Logistics Branch', 'paf-logistics', 'paf', 'Intermediate (FSc/ICS/I.Com)', 'Both', 6500, 3500, 'https://chat.whatsapp.com/sample-paflog-vip', 'Intelligence, Math, English, Supply chain basics + ISSB preparation.');

-- E. Cadet Colleges, Entry Tests & Academics
INSERT OR IGNORE INTO courses (title, slug, category, qualification, target_gender, regular_price, sale_price, whatsapp_group_link, syllabus_summary) VALUES
('Military Colleges Entry Test Prep (Class 5th to 11th)', 'military-college-prep', 'cadet_college', 'Class 5th to 11th', 'Both', 6000, 3000, 'https://chat.whatsapp.com/sample-militarycoll-vip', 'Prep for MCJ, MCM, MCS: English, Mathematics, Urdu, General Science, and Interview.'),
('PAF Colleges Entry Test Prep (Class 5th to 11th)', 'paf-college-prep', 'cadet_college', 'Class 5th to 11th', 'Both', 6000, 3000, 'https://chat.whatsapp.com/sample-pafcoll-vip', 'Prep for PAF College Sargodha & Lower Topa: English, Math, General Science, and Interview.'),
('Cadet Colleges Entry Test Prep (Class 5th to 11th)', 'cadet-college-prep', 'cadet_college', 'Class 5th to 11th', 'Both', 6000, 3000, 'https://chat.whatsapp.com/sample-cadetcoll-vip', 'Prep for Hasan Abdal, Kohat, Petaro, Batrasi, and all provincial cadet colleges.'),
('MDCAT Comprehensive Preparation', 'mdcat-prep', 'entry_test', 'FSc Pre-Medical', 'Both', 8000, 4500, 'https://chat.whatsapp.com/sample-mdcat-vip', 'Complete PMDC syllabus: Biology, Chemistry, Physics, English, and Logical Reasoning.'),
('ECAT Comprehensive Preparation', 'ecat-prep', 'entry_test', 'FSc Pre-Engineering / ICS', 'Both', 8000, 4500, 'https://chat.whatsapp.com/sample-ecat-vip', 'UET pattern: Advanced Mathematics, Physics, Chemistry / Computer Science, and English.'),
('LAT (Law Admission Test) Preparation', 'lat-prep', 'entry_test', 'Intermediate / A-Levels', 'Both', 5000, 2500, 'https://chat.whatsapp.com/sample-lat-vip', 'HEC LAT syllabus: Essay (Urdu/English), Personal Statement, MCQs (English, GK, Pak Studies).'),
('N-CAT (Nursing College Admissions Test)', 'n-cat-prep', 'entry_test', 'FSc Pre-Medical', 'Both', 5000, 2500, 'https://chat.whatsapp.com/sample-ncat-vip', 'Pre-Medical fundamentals, Anatomy basics, Chemistry, Physics, and English comprehension.'),
('Universities Entry Test Master Pack', 'university-entry-test', 'entry_test', 'Intermediate / A-Levels', 'Both', 6000, 3000, 'https://chat.whatsapp.com/sample-uni-vip', 'Preparation for NUST (NET), FAST (NU), GIKI, PIEAS, and COMSATS tests.'),
('Spoken English & Communication Skills', 'spoken-english', 'academics', 'All Levels', 'Both', 4000, 2000, 'https://chat.whatsapp.com/sample-english-vip', 'Fluency development, Military interview speaking confidence, Pronunciation, Vocabulary.'),
('Online Schooling (Grade 1 to 10)', 'online-schooling-1-10', 'academics', 'Grade 1 to 10', 'Both', 5000, 2500, 'https://chat.whatsapp.com/sample-school-vip', 'Complete syllabus coverage for Federal, Punjab, and Sindh board examinations.'),
('Online Coaching (Grade 11 & 12 / FSC / ICS)', 'online-coaching-11-12', 'academics', 'Grade 11 & 12', 'Both', 6000, 3000, 'https://chat.whatsapp.com/sample-college-vip', 'Specialized lectures in Physics, Mathematics, Chemistry, Biology, and Computer Science.');

-- ------------------------------------------------------------------------------
-- 4. SEED SAMPLE LESSON 1 (FREE DEMO) FOR KEY COURSES
-- ------------------------------------------------------------------------------
INSERT OR IGNORE INTO lessons (course_id, title, order_index, video_url, is_free_preview) VALUES
(1, 'Lecture 1: The 14 Leadership Qualities & ISSB Scoring Secrets', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1),
(1, 'Lecture 2: Complete Word Association Test (WAT) Framework', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 0),
(2, 'Lecture 1: 10 Golden Shortcuts to Solve Any Verbal Series in 5 Seconds', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1),
(3, 'Lecture 1: 50 High-Frequency Prepositions in Forces Tests', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 1);