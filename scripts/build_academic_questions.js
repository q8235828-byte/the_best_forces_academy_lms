const fs = require('fs');
const path = require('path');

// ==========================================
// MATRIC LEVEL ACADEMIC QUESTIONS (50 Qs)
// ==========================================
const matricQuestions = [
  // English (10 Qs)
  {
    category: "Matric English",
    q: "Choose the correct preposition: She is very good ______ Mathematics.",
    a: "at", b: "in", c: "on", d: "with", cor: "A",
    exp: "The correct preposition with the adjective 'good' indicating skill is 'good at' (good at something)."
  },
  {
    category: "Matric English",
    q: "What is the synonym of the word 'COURAGEOUS'?",
    a: "Cowardly", b: "Brave", c: "Fearful", d: "Timid", cor: "B",
    exp: "'Courageous' means possessing or showing courage; brave and valiant."
  },
  {
    category: "Matric English",
    q: "Identify the part of speech of the underlined word: Ali ran *quickly* to catch the bus.",
    a: "Noun", b: "Adjective", c: "Adverb", d: "Verb", cor: "C",
    exp: "'Quickly' modifies the action verb 'ran', answering how he ran. Hence, it is an Adverb."
  },
  {
    category: "Matric English",
    q: "Change to Passive Voice: 'The soldier shoots the target.'",
    a: "The target was shot by the soldier.", b: "The target is shot by the soldier.", c: "The target is being shot.", d: "The target has been shot.", cor: "B",
    exp: "Present Indefinite active voice ('shoots') changes to 'is/am/are + 3rd form (shot) + by'."
  },
  {
    category: "Matric English",
    q: "Choose the correctly spelled word:",
    a: "Lieutanant", b: "Lieutenant", c: "Leutenant", d: "Leiutenant", cor: "B",
    exp: "The correct military spelling is 'Lieutenant'."
  },
  {
    category: "Matric English",
    q: "What is the antonym of 'VICTORY'?",
    a: "Triumph", b: "Defeat", c: "Success", d: "Conquest", cor: "B",
    exp: "The opposite of 'Victory' (winning) is 'Defeat' (loss)."
  },
  {
    category: "Matric English",
    q: "Fill in the blank: Neither Ali nor his friends ______ present in the academy yesterday.",
    a: "was", b: "were", c: "is", d: "are", cor: "B",
    exp: "With 'Neither... nor...', the verb agrees with the closer subject ('friends' -> plural 'were')."
  },
  {
    category: "Matric English",
    q: "Choose the correct meaning of the idiom: 'A piece of cake'.",
    a: "Very delicious", b: "Very easy task", c: "Very expensive", d: "Difficult test", cor: "B",
    exp: "'A piece of cake' is a common idiom meaning something that is very simple and easy to accomplish."
  },
  {
    category: "Matric English",
    q: "Fill in the blank: He has been serving in the Pakistan Army ______ 2018.",
    a: "for", b: "since", c: "from", d: "by", cor: "B",
    exp: "We use 'since' for a specific point in past time (since 2018)."
  },
  {
    category: "Matric English",
    q: "What is the plural of the word 'CRISIS'?",
    a: "Crisises", b: "Crises", c: "Crisis", d: "Crisi", cor: "B",
    exp: "Words of Greek origin ending in -is form plural with -es: Crisis -> Crises."
  },

  // Mathematics (10 Qs)
  {
    category: "Matric Mathematics",
    q: "What are the roots of the quadratic equation: x² - 5x + 6 = 0?",
    a: "2 and 3", b: "-2 and -3", c: "1 and 6", d: "-1 and 6", cor: "A",
    exp: "Factoring: (x - 2)(x - 3) = 0 => x = 2 and x = 3."
  },
  {
    category: "Matric Mathematics",
    q: "If log₁₀(x) = 3, what is the value of x?",
    a: "30", b: "100", c: "1000", d: "300", cor: "C",
    exp: "In exponential form: x = 10³ = 1000."
  },
  {
    category: "Matric Mathematics",
    q: "What is the formula for the expansion of (a - b)²?",
    a: "a² - b²", b: "a² + 2ab + b²", c: "a² - 2ab + b²", d: "a² - 2ab - b²", cor: "C",
    exp: "(a - b)² = a² - 2ab + b²."
  },
  {
    category: "Matric Mathematics",
    q: "In a right-angled triangle, if base = 3 cm and perpendicular = 4 cm, what is the hypotenuse?",
    a: "5 cm", b: "6 cm", c: "7 cm", d: "8 cm", cor: "A",
    exp: "Pythagoras theorem: h = √(3² + 4²) = √(9 + 16) = √25 = 5 cm."
  },
  {
    category: "Matric Mathematics",
    q: "If 4 men complete a trench in 6 days, how many days will 8 men take to complete the same trench?",
    a: "2 days", b: "3 days", c: "4 days", d: "12 days", cor: "B",
    exp: "Inverse variation: Men × Days = Constant => 4 × 6 = 8 × D => D = 24 / 8 = 3 days."
  },
  {
    category: "Matric Mathematics",
    q: "What is the sum of interior angles of any triangle?",
    a: "90°", b: "180°", c: "270°", d: "360°", cor: "B",
    exp: "The interior angles of any Euclidean triangle always sum to 180 degrees."
  },
  {
    category: "Matric Mathematics",
    q: "What is the arithmetic mean of 10, 15, 20, 25, 30?",
    a: "18", b: "20", c: "22", d: "25", cor: "B",
    exp: "Mean = Sum / Total = (10 + 15 + 20 + 25 + 30) / 5 = 100 / 5 = 20."
  },
  {
    category: "Matric Mathematics",
    q: "If A = {1, 2, 3} and B = {2, 3, 4}, what is A ∩ B (Intersection)?",
    a: "{1, 4}", b: "{2, 3}", c: "{1, 2, 3, 4}", d: "Empty set", cor: "B",
    exp: "Intersection consists of common elements present in both sets: {2, 3}."
  },
  {
    category: "Matric Mathematics",
    q: "Solve for x: 3x + 15 = 45",
    a: "10", b: "15", c: "20", d: "30", cor: "A",
    exp: "3x = 45 - 15 = 30 => x = 30 / 3 = 10."
  },
  {
    category: "Matric Mathematics",
    q: "What is 15% of 600?",
    a: "75", b: "80", c: "90", d: "100", cor: "C",
    exp: "15% of 600 = (15 / 100) × 600 = 15 × 6 = 90."
  },

  // General Science & Physics (10 Qs)
  {
    category: "Matric Science & Physics",
    q: "What is the SI unit of Force?",
    a: "Joule", b: "Newton", c: "Watt", d: "Pascal", cor: "B",
    exp: "The SI unit of force is the Newton (N), defined as 1 kg·m/s²."
  },
  {
    category: "Matric Science & Physics",
    q: "Newton's Second Law of Motion is represented by the formula:",
    a: "F = ma", b: "P = mv", c: "W = Fd", d: "E = mc²", cor: "A",
    exp: "Newton's second law states that Force = mass × acceleration (F = ma)."
  },
  {
    category: "Matric Science & Physics",
    q: "What is the standard value of acceleration due to gravity (g) near Earth's surface?",
    a: "8.9 m/s²", b: "9.8 m/s²", c: "10.8 m/s²", d: "11.2 m/s²", cor: "B",
    exp: "The standard gravitational acceleration on Earth is approximately 9.8 m/s²."
  },
  {
    category: "Matric Science & Physics",
    q: "What type of lens is used to correct Myopia (Short-sightedness)?",
    a: "Convex lens", b: "Concave lens", c: "Cylindrical lens", d: "Bifocal lens", cor: "B",
    exp: "Concave (diverging) lenses diverge light rays to focus on the retina, correcting short-sightedness."
  },
  {
    category: "Matric Science & Physics",
    q: "What is the formula for Kinetic Energy of a moving body?",
    a: "mgh", b: "½ mv²", c: "mv", d: "ma", cor: "B",
    exp: "Kinetic energy = ½ × mass × (velocity)² (K.E = ½ mv²)."
  },
  {
    category: "Matric Science & Physics",
    q: "Sound waves cannot travel through which of the following?",
    a: "Water", b: "Steel", c: "Air", d: "Vacuum", cor: "D",
    exp: "Sound is a mechanical wave requiring a material medium; it cannot propagate in a vacuum."
  },
  {
    category: "Matric Science & Physics",
    q: "What is the unit of Electric Current?",
    a: "Volt", b: "Ampere", c: "Ohm", d: "Coulomb", cor: "B",
    exp: "The SI unit of electric current is Ampere (A)."
  },
  {
    category: "Matric Science & Physics",
    q: "Which instrument is used to measure atmospheric pressure?",
    a: "Thermometer", b: "Barometer", c: "Hydrometer", d: "Voltmeter", cor: "B",
    exp: "A barometer is used to measure atmospheric air pressure."
  },
  {
    category: "Matric Science & Physics",
    q: "What is the chemical formula of common salt?",
    a: "KCl", b: "NaCl", c: "CaCO₃", d: "NaOH", cor: "B",
    exp: "Common table salt is Sodium Chloride, chemical formula NaCl."
  },
  {
    category: "Matric Science & Physics",
    q: "At what temperature does pure water boil at normal atmospheric pressure?",
    a: "80°C", b: "90°C", c: "100°C", d: "120°C", cor: "C",
    exp: "Pure water boils at 100 degrees Celsius (212°F) at sea level pressure."
  },

  // Pakistan Studies (10 Qs)
  {
    category: "Matric Pakistan Studies",
    q: "When was the historic Pakistan Resolution passed in Lahore?",
    a: "14th August 1947", b: "23rd March 1940", c: "25th December 1876", d: "3rd June 1947", cor: "B",
    exp: "The Pakistan Resolution was adopted on 23rd March 1940 at Minto Park (now Minar-e-Pakistan), Lahore."
  },
  {
    category: "Matric Pakistan Studies",
    q: "Who was the first Governor-General of Pakistan?",
    a: "Liaquat Ali Khan", b: "Quaid-e-Azam Muhammad Ali Jinnah", c: "Khawaja Nazimuddin", d: "Ayub Khan", cor: "B",
    exp: "Quaid-e-Azam Muhammad Ali Jinnah served as the first Governor-General of Pakistan from 14 Aug 1947 until his demise."
  },
  {
    category: "Matric Pakistan Studies",
    q: "What is the height of K2 (Godwin-Austen), the second highest peak in the world?",
    a: "8,126 meters", b: "8,611 meters", c: "8,848 meters", d: "8,047 meters", cor: "B",
    exp: "K2 is 8,611 meters (28,251 ft) high, situated in the Karakoram range of Gilgit-Baltistan, Pakistan."
  },
  {
    category: "Matric Pakistan Studies",
    q: "Which is the longest river in Pakistan?",
    a: "Chenab River", b: "Ravi River", c: "Indus River", d: "Jhelum River", cor: "C",
    exp: "The Indus River is the longest river of Pakistan, measuring approximately 3,180 km."
  },
  {
    category: "Matric Pakistan Studies",
    q: "When did Pakistan become an Islamic Republic under its first constitution?",
    a: "1947", b: "1956", c: "1962", d: "1973", cor: "B",
    exp: "Under the 1956 Constitution (adopted 23rd March 1956), Pakistan officially became an Islamic Republic."
  },
  {
    category: "Matric Pakistan Studies",
    q: "Who composed the music of Pakistan's National Anthem?",
    a: "Hafeez Jalandhari", b: "Ahmed G. Chagla", c: "Mehdi Hassan", d: "Faiz Ahmed Faiz", cor: "B",
    exp: "Ahmed G. Chagla composed the tune (music) in 1949; Hafeez Jalandhari wrote the lyrics in 1952."
  },
  {
    category: "Matric Pakistan Studies",
    q: "Which pass connects Pakistan with China?",
    a: "Khyber Pass", b: "Khunjerab Pass", c: "Bolan Pass", d: "Lowari Pass", cor: "B",
    exp: "The Khunjerab Pass (height 4,693 meters) connects Gilgit-Baltistan, Pakistan with Xinjiang, China."
  },
  {
    category: "Matric Pakistan Studies",
    q: "What is the national flower of Pakistan?",
    a: "Rose", b: "Jasmine (Chambeli)", c: "Sunflower", d: "Tulip", cor: "B",
    exp: "Jasmine (Chambeli) is the official national flower of Pakistan."
  },
  {
    category: "Matric Pakistan Studies",
    q: "In which year did the Kargil conflict take place?",
    a: "1965", b: "1971", c: "1999", d: "2001", cor: "C",
    exp: "The Kargil military engagement between Pakistan and India occurred in the summer of 1999."
  },
  {
    category: "Matric Pakistan Studies",
    q: "Where is the Pakistan Military Academy (PMA) located?",
    a: "Risalpur", b: "Kakul (Abbottabad)", c: "Rawalpindi", d: "Quetta", cor: "B",
    exp: "PMA is situated at Kakul, Abbottabad, Khyber Pakhtunkhwa."
  },

  // Islamic Studies & General Knowledge (10 Qs)
  {
    category: "Matric Islamic Studies & GK",
    q: "What is the total number of Surahs in the Holy Quran?",
    a: "110", b: "114", c: "120", d: "116", cor: "B",
    exp: "The Holy Quran contains exactly 114 Surahs."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "In which Hijri year did the Battle of Badr take place?",
    a: "1 AH", b: "2 AH", c: "3 AH", d: "5 AH", cor: "B",
    exp: "The decisive Battle of Badr occurred on 17 Ramadan in 2 AH."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "Which Surah of the Holy Quran is known as the 'Heart of the Quran'?",
    a: "Surah Al-Fatiha", b: "Surah Yaseen", c: "Surah Al-Ikhlas", d: "Surah Al-Baqarah", cor: "B",
    exp: "Surah Yaseen (Surah 36) is commonly referred to in Hadith literature as the Heart of the Quran."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "What is the rate of Zakat on accumulated wealth held for a full lunar year?",
    a: "2%", b: "2.5%", c: "5%", d: "10%", cor: "B",
    exp: "The prescribed rate of Zakat is 2.5% (1/40th) of qualifying net wealth above Nisab."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "What is the capital city of Australia?",
    a: "Sydney", b: "Canberra", c: "Melbourne", d: "Brisbane", cor: "B",
    exp: "Canberra is the federal capital of Australia."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "Which country is called the 'Land of the Rising Sun'?",
    a: "China", b: "Japan", c: "Norway", d: "Thailand", cor: "B",
    exp: "Japan is internationally nicknamed the 'Land of the Rising Sun' (Nihon / Nippon)."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "What is the largest continent in the world by land area?",
    a: "Africa", b: "Asia", c: "North America", d: "Europe", cor: "B",
    exp: "Asia is the world's largest continent by both land area and population."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "Who was the first recipient of Nishan-e-Haider?",
    a: "Major Raja Aziz Bhatti", b: "Captain Muhammad Sarwar Shaheed", c: "Major Shabbir Sharif", d: "Pilot Officer Rashid Minhas", cor: "B",
    exp: "Captain Muhammad Sarwar Shaheed was the first officer awarded Nishan-e-Haider for his valor in 1948."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "Which is the national animal of Pakistan?",
    a: "Snow Leopard", b: "Markhor", c: "Bengal Tiger", d: "Chakor", cor: "B",
    exp: "The Markhor (wild capra species) is the official national animal of Pakistan."
  },
  {
    category: "Matric Islamic Studies & GK",
    q: "How many mandatory Farz prayers are there in a day for Muslims?",
    a: "3", b: "5", c: "7", d: "4", cor: "B",
    exp: "There are 5 daily obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)."
  }
];

// ==========================================
// INTERMEDIATE (FSc / INTER) ACADEMIC (50 Qs)
// ==========================================
const interQuestions = [
  // FSc Physics (15 Qs)
  {
    category: "Inter Physics",
    q: "If the angle between two non-zero vectors A and B is 90 degrees, their scalar (dot) product is:",
    a: "AB", b: "0", c: "1", d: "-AB", cor: "B",
    exp: "Scalar product A · B = AB cos(θ). Since cos(90°) = 0, A · B = 0."
  },
  {
    category: "Inter Physics",
    q: "At what angle of projection is the horizontal range of a projectile equal to its maximum value?",
    a: "30°", b: "45°", c: "60°", d: "90°", cor: "B",
    exp: "Range R = (v₀² sin 2θ) / g. Max range occurs when sin 2θ = 1 => 2θ = 90° => θ = 45°."
  },
  {
    category: "Inter Physics",
    q: "What is the escape velocity from the surface of the Earth?",
    a: "9.8 km/s", b: "11.2 km/s", c: "7.9 km/s", d: "15.4 km/s", cor: "B",
    exp: "Escape velocity v_esc = √(2gR) ≈ √(2 × 9.8 × 6.4 × 10⁶) ≈ 11.2 km/s."
  },
  {
    category: "Inter Physics",
    q: "The maximum efficiency of an ideal heat engine operating between temperatures T_H and T_C is given by:",
    a: "1 - (T_C / T_H)", b: "1 - (T_H / T_C)", c: "(T_H - T_C) / T_C", d: "T_C / T_H", cor: "A",
    exp: "Carnot efficiency η = 1 - (T_C / T_H), where temperatures are expressed in Kelvin."
  },
  {
    category: "Inter Physics",
    q: "The phenomenon in which frequency of waves changes due to relative motion between source and observer is:",
    a: "Compton effect", b: "Doppler effect", c: "Photoelectric effect", d: "Raman effect", cor: "B",
    exp: "The Doppler effect describes the apparent shift in observed wave frequency due to relative motion."
  },
  {
    category: "Inter Physics",
    q: "What is the SI unit of Magnetic Flux?",
    a: "Tesla", b: "Weber", c: "Henry", d: "Gauss", cor: "B",
    exp: "The SI unit of magnetic flux (Φ = B · A) is Weber (Wb = T·m²)."
  },
  {
    category: "Inter Physics",
    q: "According to Einstein's photoelectric equation, the kinetic energy of emitted photoelectrons depends on:",
    a: "Intensity of light", b: "Frequency of incident light", c: "Angle of incidence", d: "Source distance", cor: "B",
    exp: "K.E_max = hf - Φ. Energy depends directly on the frequency (f) of the incident photons."
  },
  {
    category: "Inter Physics",
    q: "In an alternating current (AC) circuit containing pure inductance, the current:",
    a: "Leads voltage by 90°", b: "Lags voltage by 90°", c: "Is in phase with voltage", d: "Lags voltage by 180°", cor: "B",
    exp: "In a pure inductor (L), voltage leads current by 90 degrees (or current lags by 90°)."
  },
  {
    category: "Inter Physics",
    q: "Bernoulli's principle for fluid flow is a direct consequence of the conservation of:",
    a: "Linear Momentum", b: "Energy", c: "Mass", d: "Angular Momentum", cor: "B",
    exp: "Bernoulli's equation represents the conservation of mechanical energy per unit volume in streamline flow."
  },
  {
    category: "Inter Physics",
    q: "What is the dimensional formula for Work and Energy?",
    a: "[MLT⁻¹]", b: "[ML²T⁻²]", c: "[ML⁻¹T⁻²]", d: "[ML²T⁻³]", cor: "B",
    exp: "Work = Force × Displacement = [MLT⁻²] × [L] = [ML²T⁻²]."
  },
  {
    category: "Inter Physics",
    q: "Which quantum particle mediates the electromagnetic force?",
    a: "Gluon", b: "Photon", c: "W Boson", d: "Graviton", cor: "B",
    exp: "The photon is the gauge boson carrier of the electromagnetic interaction."
  },
  {
    category: "Inter Physics",
    q: "A radioactive isotope has a half-life of 10 days. What fraction of the original sample remains after 30 days?",
    a: "1/4", b: "1/8", c: "1/16", d: "1/6", cor: "B",
    exp: "30 days = 3 half-lives. Fraction remaining = (1/2)³ = 1/8."
  },
  {
    category: "Inter Physics",
    q: "The magnetic force on a charge q moving with velocity v in a magnetic field B is maximum when the angle is:",
    a: "0°", b: "90°", c: "180°", d: "45°", cor: "B",
    exp: "Magnetic force F = qvB sin θ. Maximum force occurs when sin θ = 1, i.e., θ = 90°."
  },
  {
    category: "Inter Physics",
    q: "In Young's Double Slit Experiment, fringe width increases when:",
    a: "Slit separation increases", b: "Screen distance D increases", c: "Wavelength decreases", d: "Frequency increases", cor: "B",
    exp: "Fringe width β = λD / d. Increasing distance to screen (D) directly increases fringe separation."
  },
  {
    category: "Inter Physics",
    q: "The acceleration of a simple harmonic oscillator is proportional to its:",
    a: "Velocity", b: "Displacement from mean position", c: "Mass", d: "Amplitude squared", cor: "B",
    exp: "In SHM, acceleration a = -ω²x, directly proportional to displacement x and directed towards the equilibrium position."
  },

  // FSc Mathematics (15 Qs)
  {
    category: "Inter Mathematics",
    q: "If a matrix A has determinant |A| = 0, the matrix is called:",
    a: "Identity Matrix", b: "Singular Matrix", c: "Non-singular Matrix", d: "Symmetric Matrix", cor: "B",
    exp: "A square matrix with determinant equal to zero is termed a Singular Matrix (its inverse does not exist)."
  },
  {
    category: "Inter Mathematics",
    q: "What is the derivative of sin(2x) with respect to x?",
    a: "cos(2x)", b: "2 cos(2x)", c: "-2 cos(2x)", d: "½ cos(2x)", cor: "B",
    exp: "By chain rule: d/dx [sin(2x)] = cos(2x) × d/dx(2x) = 2 cos(2x)."
  },
  {
    category: "Inter Mathematics",
    q: "Evaluate the limit: lim (x → 0) [sin(x) / x] = ?",
    a: "0", b: "1", c: "Infinity", d: "Undefined", cor: "B",
    exp: "Fundamental calculus theorem: lim (x → 0) [sin(x) / x] = 1 (where x is in radians)."
  },
  {
    category: "Inter Mathematics",
    q: "What is the integral ∫ e^(3x) dx?",
    a: "3 e^(3x) + C", b: "⅓ e^(3x) + C", c: "e^(3x) + C", d: "e^(3x)/x + C", cor: "B",
    exp: "∫ e^(kx) dx = (1/k) e^(kx) + C. For k = 3, result is ⅓ e^(3x) + C."
  },
  {
    category: "Inter Mathematics",
    q: "If two non-vertical lines with slopes m₁ and m₂ are perpendicular, then:",
    a: "m₁ = m₂", b: "m₁ · m₂ = -1", c: "m₁ · m₂ = 1", d: "m₁ + m₂ = 0", cor: "B",
    exp: "Perpendicular lines satisfy the condition m₁ · m₂ = -1 (slopes are negative reciprocals)."
  },
  {
    category: "Inter Mathematics",
    q: "What is the value of cos(2θ) in terms of cos(θ) and sin(θ)?",
    a: "cos²θ + sin²θ", b: "cos²θ - sin²θ", c: "2 cos²θ + 1", d: "1 - sin²θ", cor: "B",
    exp: "Double angle identity: cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ."
  },
  {
    category: "Inter Mathematics",
    q: "What is the radius of the circle given by x² + y² = 49?",
    a: "49", b: "7", c: "14", d: "3.5", cor: "B",
    exp: "Standard equation of circle centered at origin: x² + y² = r² => r = √49 = 7."
  },
  {
    category: "Inter Mathematics",
    q: "Find the 10th term of an arithmetic progression where first term a = 2 and common difference d = 3:",
    a: "27", b: "29", c: "31", d: "32", cor: "B",
    exp: "a_n = a + (n - 1)d => a₁₀ = 2 + (10 - 1)3 = 2 + 27 = 29."
  },
  {
    category: "Inter Mathematics",
    q: "What is the derivative of ln(x) with respect to x?",
    a: "e^x", b: "1/x", c: "x", d: "-1/x²", cor: "B",
    exp: "d/dx [ln(x)] = 1/x for x > 0."
  },
  {
    category: "Inter Mathematics",
    q: "Evaluate the integral: ∫ (2x + 5) dx =",
    a: "2x² + 5x + C", b: "x² + 5x + C", c: "x² + C", d: "2 + C", cor: "B",
    exp: "∫ 2x dx + ∫ 5 dx = 2(x²/2) + 5x + C = x² + 5x + C."
  },
  {
    category: "Inter Mathematics",
    q: "The solution of the equation tan(θ) = 1 in the first quadrant is:",
    a: "30° (π/6)", b: "45° (π/4)", c: "60° (π/3)", d: "90° (π/2)", cor: "B",
    exp: "tan(45°) = tan(π/4) = 1."
  },
  {
    category: "Inter Mathematics",
    q: "What is the value of the combination ⁵C₂?",
    a: "20", b: "10", c: "5", d: "15", cor: "B",
    exp: "⁵C₂ = 5! / (2! · 3!) = (5 × 4) / (2 × 1) = 10."
  },
  {
    category: "Inter Mathematics",
    q: "What is the magnitude of the 3D vector v = 2i + 3j + 6k?",
    a: "6", b: "7", c: "8", d: "11", cor: "B",
    exp: "|v| = √(2² + 3² + 6²) = √(4 + 9 + 36) = √49 = 7."
  },
  {
    category: "Inter Mathematics",
    q: "What is the slope of the linear equation 3x - 4y + 8 = 0?",
    a: "-¾", b: "¾", c: "4/3", d: "-4/3", cor: "B",
    exp: "4y = 3x + 8 => y = (¾)x + 2. Slope m = ¾."
  },
  {
    category: "Inter Mathematics",
    q: "If A and B are mutually exclusive events, then P(A ∩ B) equals:",
    a: "1", b: "0", c: "P(A) · P(B)", d: "P(A) + P(B)", cor: "B",
    exp: "Mutually exclusive events cannot happen at the same time; their joint probability P(A ∩ B) = 0."
  },

  // Advanced English (10 Qs)
  {
    category: "Inter English",
    q: "Complete the Third Conditional sentence: 'If he had prepared thoroughly, he ______ the commission exam.'",
    a: "would pass", b: "would have passed", c: "will pass", d: "had passed", cor: "B",
    exp: "Third conditional structure: If + past perfect (had prepared) -> would have + past participle (passed)."
  },
  {
    category: "Inter English",
    q: "What is the meaning of the word 'TENACIOUS'?",
    a: "Weak and fragile", b: "Holding firmly and persistent", c: "Careless", d: "Timid", cor: "B",
    exp: "'Tenacious' refers to someone holding fast, persistent, and determined in purpose."
  },
  {
    category: "Inter English",
    q: "Choose the correct indirect speech: He said, 'I saw an eagle yesterday.'",
    a: "He said that he sees an eagle yesterday.", b: "He said that he had seen an eagle the previous day.", c: "He said he saw an eagle.", d: "He said that he was seeing an eagle.", cor: "B",
    exp: "Past indefinite ('saw') changes to past perfect ('had seen'); 'yesterday' changes to 'the previous day'."
  },
  {
    category: "Inter English",
    q: "Identify the figure of speech: 'The brave soldier fought like a lion in the battlefield.'",
    a: "Metaphor", b: "Simile", c: "Personification", d: "Hyperbole", cor: "B",
    exp: "A comparison using 'like' or 'as' is a Simile."
  },
  {
    category: "Inter English",
    q: "What is the antonym of 'AMBIGUOUS'?",
    a: "Vague", b: "Clear and explicit", c: "Obscure", d: "Doubtful", cor: "B",
    exp: "'Ambiguous' means open to more than one interpretation; its antonym is 'Clear' or 'Explicit'."
  },
  {
    category: "Inter English",
    q: "Choose the sentence with correct subject-verb agreement:",
    a: "Each of the naval officers were decorated.", b: "Each of the naval officers was decorated.", c: "Each of the naval officers are decorated.", d: "Each of the naval officers have decorated.", cor: "B",
    exp: "'Each' is grammatically singular and requires the singular verb 'was'."
  },
  {
    category: "Inter English",
    q: "What is the meaning of the phrasal verb 'CALL OFF'?",
    a: "To postpone", b: "To cancel", c: "To summon", d: "To telephone", cor: "B",
    exp: "To 'call off' an operation or meeting means to cancel it."
  },
  {
    category: "Inter English",
    q: "Choose the word closest in meaning to 'PRUDENT':",
    a: "Reckless", b: "Wise and discreet", c: "Cruel", d: "Lazy", cor: "B",
    exp: "'Prudent' means acting with or showing care, wisdom, and thought for the future."
  },
  {
    category: "Inter English",
    q: "Select the correctly punctuated sentence:",
    a: "The General said 'Victory belongs to the disciplined.'", b: "The General said, \"Victory belongs to the disciplined.\"", c: "The General, said \"Victory belongs to the disciplined\"", d: "The General said: victory belongs to the disciplined.", cor: "B",
    exp: "Standard quotation punctuation places a comma before the opening quotation mark and closes the period inside."
  },
  {
    category: "Inter English",
    q: "What is the noun form of the verb 'CONCLUDE'?",
    a: "Concluded", b: "Conclusion", c: "Concluder", d: "Conclusively", cor: "B",
    exp: "The noun form derived from 'conclude' is 'Conclusion'."
  },

  // Defense & Pakistan Affairs GK (10 Qs)
  {
    category: "Inter Defense & GK",
    q: "Who was the youngest recipient of the prestigious Nishan-e-Haider?",
    a: "Major Raja Aziz Bhatti", b: "Pilot Officer Rashid Minhas", c: "Captain Karnal Sher Khan", d: "Major Shabbir Sharif", cor: "B",
    exp: "Pilot Officer Rashid Minhas (PAF) was 20 years old when he embraced martyrdom on 20 August 1971."
  },
  {
    category: "Inter Defense & GK",
    q: "What is the rank equivalent in the Pakistan Navy to a Major in the Pakistan Army?",
    a: "Sub-Lieutenant", b: "Lieutenant Commander", c: "Commander", d: "Captain", cor: "B",
    exp: "Major (Army) = Lieutenant Commander (Navy) = Squadron Leader (Air Force)."
  },
  {
    category: "Inter Defense & GK",
    q: "When did Pakistan successfully conduct its nuclear tests at Chaghi, Balochistan?",
    a: "23rd March 1998", b: "28th May 1998 (Youm-e-Takbeer)", c: "14th August 1998", d: "6th September 1998", cor: "B",
    exp: "Pakistan conducted nuclear tests on 28th May 1998 at Chaghi, commemorated annually as Youm-e-Takbeer."
  },
  {
    category: "Inter Defense & GK",
    q: "The Siachen Glacier, known as the world's highest battlefield, is located in which mountain range?",
    a: "Himalayas", b: "Eastern Karakoram Range", c: "Hindu Kush", d: "Sulaiman Range", cor: "B",
    exp: "Siachen Glacier is located in the eastern Karakoram range in the Himalayas system."
  },
  {
    category: "Inter Defense & GK",
    q: "What is the highest military gallantry decoration of the United States?",
    a: "Victoria Cross", b: "Medal of Honor", c: "Legion of Merit", d: "Silver Star", cor: "B",
    exp: "The Medal of Honor is the highest military award for valor presented by the United States."
  },
  {
    category: "Inter Defense & GK",
    q: "Which seaport of Pakistan was developed with Chinese collaboration on the Arabian Sea?",
    a: "Port Qasim", b: "Gwadar Port", c: "Karachi Port", d: "Pasni Port", cor: "B",
    exp: "Gwadar deep-sea port in Balochistan is the crown project of CPEC on the Arabian Sea."
  },
  {
    category: "Inter Defense & GK",
    q: "What does the abbreviation 'ISPR' stand for in the Pakistan Armed Forces?",
    a: "Inter Services Planning Registry", b: "Inter Services Public Relations", c: "Internal Security Police Regiment", d: "Intelligence Strategic Policy Review", cor: "B",
    exp: "ISPR stands for Inter Services Public Relations, the official media wing of Pakistan Armed Forces."
  },
  {
    category: "Inter Defense & GK",
    q: "Which international organization was founded on 24th October 1945 after World War II?",
    a: "League of Nations", b: "United Nations (UN)", c: "NATO", d: "OIC", cor: "B",
    exp: "The United Nations (UN) was officially established on 24 October 1945."
  },
  {
    category: "Inter Defense & GK",
    q: "Operation Swift Retort was conducted by the Pakistan Air Force on:",
    a: "6th September 1965", b: "27th February 2019", c: "14th August 2018", d: "23rd March 2020", cor: "B",
    exp: "PAF launched Operation Swift Retort on 27 February 2019 in response to the Balakot airspace violation."
  },
  {
    category: "Inter Defense & GK",
    q: "What is the standard length of the PMA Long Course for Commissioned Officers in Pakistan Army?",
    a: "1 Year", b: "2 Years", c: "3 Years", d: "4 Years", cor: "B",
    exp: "The standard training duration of the PMA Long Course at Kakul is 2 years (4 terms)."
  }
];

function formatQuestions(arr, quizId, startId) {
  return arr.map((item, idx) => ({
    id: startId + idx,
    quiz_id: quizId,
    category: item.category,
    question_text: item.q,
    option_a: item.a,
    option_b: item.b,
    option_c: item.c,
    option_d: item.d,
    correct_option: item.cor,
    explanation: item.exp,
    order_index: idx + 1
  }));
}

const formattedMatric = formatQuestions(matricQuestions, 3, 301);
const formattedInter = formatQuestions(interQuestions, 4, 401);

const fileContent = `// Auto-generated Comprehensive Academic Questions (Matric Level & Intermediate Level)
import { QuizQuestion } from '@/types';

export const MATRIC_ACADEMIC_QUESTIONS: QuizQuestion[] = ${JSON.stringify(formattedMatric, null, 2)};

export const INTER_ACADEMIC_QUESTIONS: QuizQuestion[] = ${JSON.stringify(formattedInter, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/academic-questions-data.ts'), fileContent, 'utf-8');
console.log(`Generated ${formattedMatric.length} Matric questions and ${formattedInter.length} Inter questions!`);
