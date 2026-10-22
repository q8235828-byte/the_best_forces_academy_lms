# Product Requirements Document (PMD)
**Project Title:** THE BEST FORCES ACADEMY LMS  
**Brand Domain:** bestforcesacademy.net  
**Chief Instructor & Admin:** Sir Faryad Tabassum  
**Official WhatsApp / Call:** +92 305 4599659  
**Official Email:** Info@bestforcesacademy.net  
**Target Stack:** Next.js (App Router) + Tailwind CSS + Lucide Icons + Cloudflare D1 (Serverless SQLite at Edge)  
**Deployment Pipeline:** GitHub -> Cloudflare Pages (via `@cloudflare/next-on-pages`)  

---

## 1. System Identity & Global Contact Parameters
* **Application Title:** THE BEST FORCES ACADEMY LMS
* **Domain Name:** bestforcesacademy.net
* **Primary Mentor & Academy Head:** Sir Faryad Tabassum
* **Global WhatsApp Direct Line:** `https://wa.me/923054599659`
* **Contact Phone:** +92 305 4599659
* **Administrative Email:** Info@bestforcesacademy.net
* **Currency Standard:** Pakistani Rupee (PKR)

---

## 2. Core Functional Modules

### A. Free First Demo Video & Video Guard
* Har course ka **Lecture 1 (`order_index = 1`)** hamesha `is_free_preview = 1` par set hoga. Unregistered ya unpaid student bina kisi rukawat ke Lesson 1 play kar sakega.
* Lesson 2 se automated backend paywall enforce hoga jo check karega ke student ka `enrollments.status == 'approved'` hai ya nahi.
* **Floating Watermark Anti-Piracy:** Video player par student ka Full Name aur Mobile Number har 15 seconds baad dynamic coordinates par 20% opacity ke sath move karega taake screen recording na ki ja sake.
* **Single Device Session Rule:** Har student account ek waqt mein sirf ek active session token allow karega. Naye device par login se purana session auto-logout hoga.

### B. Timed Computerized Quiz Engine, Results & Leaderboard
* Computerized test environment mimicking GHQ, NHQ, aur Air HQ testing patterns:
  * Strict countdown timer (per test duration) with automated submission on time expiration.
  * Question Palette (Attempted = Green, Flagged = Yellow, Unattempted = Grey).
  * High-resolution image support for questions and 4 options (lazmi for Non-Verbal pattern matrices).
  * Post-submission scorecard: Score %, total marks, time elapsed, and question-by-question review with explanations.
* **Leaderboard (`/portal/leaderboard`):**
  * Top rankers sorted by: `ORDER BY score DESC, time_spent_seconds ASC`.
  * Top 3 podium display with Gold, Silver, and Bronze badges.

### C. ISSB 10-Second WAT (Word Association Test) Engine
* Screen par 1 single English word display hoga theek 10 seconds ke automated countdown timer ke sath.
* 10 seconds complete hote hi system screen ko bina user action ke agle word par transition karega.
* Student live textarea mein sentence type karega ya screen ke mutabiq offline answer sheet par likhega.

### D. In-App Open PDF Notes Viewer
* Study materials direct in-app embedded PDF viewer ke zariye open honge.
* Features: Page navigation, responsive scaling for mobile, aur dynamic academy footer.

### E. WhatsApp VIP Batch Integration & Instant Support
* **Automated Batch Access:** Har course record mein `whatsapp_group_link` store hoga. Admin enrollment approve karte hi student dashboard par specific course ka official WhatsApp Group join button unlock hoga.
* **In-Lesson Direct Doubt Button:** Har video lecture aur PDF note ke theek niche: *"Ask Sir Faryad Tabassum on WhatsApp"* jo pre-filled question text ke sath direct WhatsApp chat (`+92 305 4599659`) open karega.

### F. Smart ISSB Admission Form + OCR Auto-Fill
* Candidate apna B-Form / CNIC ya Matric/Inter Result Card upload karega.
* Client-side OCR / Edge API scan kar ke fields auto-fill karega: Full Name, Father Name, CNIC/B-Form Number, Date of Birth (Age auto-calculated), Matric & Inter marks.
* Candidate remaining fields (Height, Weight, Mark of Identification, Domicile District, Religion, Sect, Father's Occupation, ISSB Status: Fresh/Repeater) manually verify aur save karega.

### G. Automated Roll Number Slip & Admission Slip (Printable PDF)
* Form verification ke baad system candidate ke liye printable A4 official Roll Number Slip generate karega:
  * Header: **THE BEST FORCES ACADEMY LMS**
  * Roll Number, Student Photo, CNIC, Enrolled Course, Issue Date
  * Verification Stamp & Authorized Signature of Sir Faryad Tabassum.

### H. Admin Dynamic Fee Management & Student Registry
* **Fee Manager (`/admin/courses`):** Admin dashboard se kisi bhi course ki regular price aur sale price instantly update kar sakega bina code change kiye.
* **Master Student Registry (`/admin/students`):** Searchable list of all registered candidates, verification statuses, uploaded documents, test scores, aur payment slips.

---

## 3. Course Master Registry & Slugs

### Core Master Packs
1. `issb-complete-prep` - ISSB Complete Master Preparation Course (Army, Navy, PAF)
2. `initial-intelligence-mastery` - Initial Intelligence Master Course (Verbal & Non-Verbal Speed Mastery)
3. `initial-academic-mastery` - Initial Academic Test Master Course (Math, Physics, English, Chemistry, Biology, GK)

### Pakistan Army Courses
* `army-clerk` - Clerk (After Matric - Boys)
* `army-soldier` - Soldier (After Matric - Boys)
* `pma-long-course` - PMA Long Course (After Inter - Boys)
* `afns-nursing` - AFNS Armed Forces Nursing (After Inter - Girls)
* `amc-medical-cadet` - AMC Army Medical Cadet (After Inter - Boys)
* `tcc-technical-cadet` - TCC Technical Cadet Course (After Inter - Boys)
* `army-ssc` - SSC Short Service Commission (After Graduation - Boys)
* `army-lcc` - LCC Lady Cadet Course (After Graduation - Girls)

### Pakistan Navy Courses
* `navy-fmt` - FMT Female Medical Technician (After Matric - Girls)
* `navy-police` - Naval Police (After Matric - Boys)
* `navy-sailor` - Sailor (After Matric - Boys)
* `navy-marine` - Marine (After Matric - Boys)
* `navy-technical` - Technical Branch (After Matric - Boys)
* `pn-cadet` - PN Cadet Commission (After Inter - Boys)
* `navy-ssc` - SSC Short Service Commission (After Graduation - Boys & Girls)

### Pakistan Air Force (PAF) Courses
* `paf-fma` - FMA Female Medical Assistant (After Matric - Girls)
* `paf-aerotrade` - Aerotrade (After Matric - Boys)
* `paf-aerotec` - Aerotec (After Matric - Boys)
* `paf-aerosupport` - Aerosupport (After Matric - Boys)
* `paf-pf-di` - PF & DI Physical Fitness & Drill Instructor (After Matric - Boys)
* `paf-firefighter` - Fire Fighter (After Matric - Boys)
* `paf-medical-assistant` - Medical Assistant (After Matric - Boys)
* `paf-gdp` - GDP General Duty Pilot (After Inter - Boys & Girls)
* `paf-ad` - AD Air Defence (After Inter - Boys & Girls)
* `paf-cae` - CAE College of Aeronautical Engineering (After Inter - Boys & Girls)
* `paf-asd` - A & SD Admin & Special Duties (After Inter - Boys & Girls)
* `paf-logistics` - Logistics Branch (After Inter - Boys & Girls)

### Cadet Colleges, Entry Tests & Academics
* `military-college-prep` - Military Colleges Entry Tests (5th, 6th, 7th, 8th, 9th, 11th)
* `paf-college-prep` - PAF Colleges Entry Tests (5th, 6th, 7th, 8th, 9th, 11th)
* `cadet-college-prep` - Cadet Colleges Entry Tests (5th, 6th, 7th, 8th, 9th, 11th)
* `mdcat-prep` - MDCAT Preparation
* `ecat-prep` - ECAT Preparation
* `lat-prep` - LAT (Law Admission Test)
* `n-cat-prep` - N-CAT (Nursing College Admissions Test)
* `university-entry-test` - Universities Entry Test Prep
* `spoken-english` - Spoken English & Communication Skills
* `online-schooling-1-10` - Online Schooling (Grade 1 to 10)
* `online-coaching-11-12` - Online Coaching (Grade 11 & 12)

---

## 4. Implementation Rules for AI Engine
1. **Cloudflare D1 Native:** Tamam queries SQLite syntax mein hon. Koi PostgreSQL syntax use nahi karni.
2. **Dynamic Route:** Har course `/courses/[slug]` par open hoga jahan Lesson 1 free stream hoga, jabke Lesson 2 par enrollment popup aayega.
3. **WhatsApp Handlers:** Tamam buttons direct `https://wa.me/923054599659` par pre-filled dynamic text ke sath route honge.