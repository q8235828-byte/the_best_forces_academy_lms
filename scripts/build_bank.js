const fs = require('fs');
const path = require('path');

const categories = [
  { id: 1, name: 'Number + Alphabetical series (same concept)' },
  { id: 2, name: 'Days reasoning' },
  { id: 3, name: 'Age reasoning' },
  { id: 4, name: 'Direction reasoning' },
  { id: 5, name: 'Percentage reasoning' },
  { id: 6, name: 'Dozen reasoning' },
  { id: 7, name: 'Speed, distance, time' },
  { id: 8, name: 'Arithmetic + comparison' },
  { id: 9, name: 'Blood relations' },
  { id: 10, name: 'Analogy + logical reasoning' }
];

let globalId = 1;
const allQuestions = [];

function createQuestion(catId, catName, text, a, b, c, d, correct, explanation) {
  allQuestions.push({
    id: globalId++,
    category_id: catId,
    category: `${catId}. ${catName}`,
    question_text: text,
    option_a: String(a),
    option_b: String(b),
    option_c: String(c),
    option_d: String(d),
    correct_option: correct,
    explanation: explanation
  });
}

// -------------------------------------------------------------
// CATEGORY 1: Number + Alphabetical series (50 Questions)
// -------------------------------------------------------------
const cat1 = categories[0];
// 1. Arithmetic progressions, Geometric progressions, Differences of differences, Fibonacci, Alphanumeric
const seriesPatterns = [
  { s: "2, 4, 8, 16, 32, ...", ans: "64", exp: "Each number is multiplied by 2. 32 * 2 = 64.", opts: ["48", "64", "56", "72"], cor: "B" },
  { s: "3, 6, 12, 24, 48, ...", ans: "96", exp: "Each term is doubled. 48 * 2 = 96.", opts: ["96", "84", "92", "100"], cor: "A" },
  { s: "5, 10, 20, 40, 80, ...", ans: "160", exp: "Multiply by 2 each step. 80 * 2 = 160.", opts: ["140", "150", "160", "180"], cor: "C" },
  { s: "4, 9, 16, 25, 36, ...", ans: "49", exp: "Squares of consecutive numbers: 2^2, 3^2, 4^2, 5^2, 6^2, 7^2 = 49.", opts: ["45", "48", "50", "49"], cor: "D" },
  { s: "1, 8, 27, 64, 125, ...", ans: "216", exp: "Cubes of numbers: 1^3, 2^3, 3^3, 4^3, 5^3, 6^3 = 216.", opts: ["216", "225", "196", "256"], cor: "A" },
  { s: "3, 7, 15, 31, 63, ...", ans: "127", exp: "(Previous * 2) + 1. (63 * 2) + 1 = 127.", opts: ["120", "127", "125", "129"], cor: "B" },
  { s: "2, 5, 11, 23, 47, ...", ans: "95", exp: "(Previous * 2) + 1. (47 * 2) + 1 = 95.", opts: ["90", "94", "95", "96"], cor: "C" },
  { s: "1, 4, 9, 18, 35, ...", ans: "68", exp: "(Previous * 2) - n alternating pattern. 35 * 2 - 2 = 68.", opts: ["65", "66", "70", "68"], cor: "D" },
  { s: "2, 3, 5, 7, 11, 13, ...", ans: "17", exp: "Consecutive prime numbers. Next prime after 13 is 17.", opts: ["17", "15", "19", "21"], cor: "A" },
  { s: "19, 23, 29, 31, 37, ...", ans: "41", exp: "Consecutive prime numbers. Next prime after 37 is 41.", opts: ["39", "41", "43", "45"], cor: "B" },
  { s: "100, 96, 91, 85, 78, ...", ans: "70", exp: "Decreasing by -4, -5, -6, -7, next is -8. 78 - 8 = 70.", opts: ["69", "72", "70", "71"], cor: "C" },
  { s: "50, 45, 41, 38, ...", ans: "36", exp: "Decreasing by -5, -4, -3, next is -2. 38 - 2 = 36.", opts: ["35", "34", "37", "36"], cor: "D" },
  { s: "1, 1, 2, 3, 5, 8, 13, ...", ans: "21", exp: "Fibonacci sequence: sum of previous two terms. 8 + 13 = 21.", opts: ["21", "20", "22", "24"], cor: "A" },
  { s: "2, 2, 4, 6, 10, 16, 26, ...", ans: "42", exp: "Sum of previous two numbers: 16 + 26 = 42.", opts: ["40", "42", "44", "46"], cor: "B" },
  { s: "10, 20, 25, 50, 55, ...", ans: "110", exp: "Alternating multiply by 2, then add 5. 55 * 2 = 110.", opts: ["105", "100", "110", "115"], cor: "C" },
  { s: "4, 8, 12, 24, 28, ...", ans: "56", exp: "Alternating double (*2) and add 4 (+4). 28 * 2 = 56.", opts: ["52", "60", "54", "56"], cor: "D" },
  { s: "120, 60, 20, 5, ...", ans: "1", exp: "Dividing by 2, then 3, then 4, next is divide by 5: 5 / 5 = 1.", opts: ["1", "2", "0.5", "0"], cor: "A" },
  { s: "720, 120, 24, 6, ...", ans: "2", exp: "Dividing by 6, then 5, then 4, next is divide by 3: 6 / 3 = 2.", opts: ["3", "2", "1", "0"], cor: "B" },
  { s: "7, 14, 28, 56, 112, ...", ans: "224", exp: "Each number is doubled. 112 * 2 = 224.", opts: ["212", "220", "224", "230"], cor: "C" },
  { s: "1, 3, 6, 10, 15, 21, ...", ans: "28", exp: "Triangular numbers (+2, +3, +4, +5, +6, +7). 21 + 7 = 28.", opts: ["26", "27", "29", "28"], cor: "D" },
  // Alphanumeric Series
  { s: "A, C, E, G, I, ...", ans: "K", exp: "Skip 1 letter (+2 steps). I (+2) = K.", opts: ["K", "J", "L", "M"], cor: "A" },
  { s: "Z, X, V, T, R, ...", ans: "P", exp: "Reverse step by 2 letters. R (-2) = P.", opts: ["Q", "P", "O", "N"], cor: "B" },
  { s: "A, D, G, J, M, ...", ans: "P", exp: "Add 3 letters each step (+3). M (+3) = P.", opts: ["O", "N", "P", "Q"], cor: "C" },
  { s: "B, E, I, N, ...", ans: "T", exp: "Increasing step (+3, +4, +5, next is +6). N (+6) = T.", opts: ["S", "U", "V", "T"], cor: "D" },
  { s: "A, Z, B, Y, C, ...", ans: "X", exp: "Alternating first and last letters of alphabet: A-Z, B-Y, C-X.", opts: ["X", "W", "V", "D"], cor: "A" },
  { s: "A2, B4, C8, D16, ...", ans: "E32", exp: "Letters advance A,B,C,D,E. Numbers double 2,4,8,16,32.", opts: ["E30", "E32", "D32", "E24"], cor: "B" },
  { s: "Z1, Y2, X4, W8, ...", ans: "V16", exp: "Letters reverse Z,Y,X,W,V. Numbers double 1,2,4,8,16.", opts: ["U16", "V14", "V16", "W16"], cor: "C" },
  { s: "A1, C3, F6, J10, ...", ans: "O15", exp: "Letters skip +2, +3, +4, +5 (J->O). Numbers add +2, +3, +4, +5 (10+5=15).", opts: ["N15", "P15", "O14", "O15"], cor: "D" },
  { s: "KM5, IP8, GS11, EV14, ...", ans: "CY17", exp: "1st letter -2 (E->C), 2nd letter +3 (V->Y), number +3 (14+3=17).", opts: ["CY17", "BY17", "CZ17", "DY17"], cor: "A" },
  { s: "2B, 4C, 8E, 14H, ...", ans: "22L", exp: "Numbers +2, +4, +6, +8 (14+8=22). Letters +1, +2, +3, +4 (H+4=L).", opts: ["20L", "22L", "22K", "24M"], cor: "B" },
  { s: "11, 13, 17, 19, 23, 25, ...", ans: "29", exp: "Alternating +2, +4, +2, +4. 25 + 4 = 29.", opts: ["27", "28", "29", "31"], cor: "C" },
  { s: "3, 8, 15, 24, 35, ...", ans: "48", exp: "Differences are +5, +7, +9, +11, next +13. 35 + 13 = 48.", opts: ["46", "47", "49", "48"], cor: "D" },
  { s: "2, 6, 12, 20, 30, ...", ans: "42", exp: "n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42.", opts: ["42", "40", "44", "48"], cor: "A" },
  { s: "6, 11, 21, 36, 56, ...", ans: "81", exp: "Differences are +5, +10, +15, +20, next +25. 56 + 25 = 81.", opts: ["76", "81", "80", "85"], cor: "B" },
  { s: "80, 40, 20, 10, ...", ans: "5", exp: "Divide by 2 each step. 10 / 2 = 5.", opts: ["2", "4", "5", "0"], cor: "C" },
  { s: "3, 5, 9, 17, 33, ...", ans: "65", exp: "Differences double: +2, +4, +8, +16, next +32. 33 + 32 = 65.", opts: ["63", "64", "66", "65"], cor: "D" },
  { s: "J, L, N, P, R, ...", ans: "T", exp: "Skip one letter (+2). R (+2) = T.", opts: ["T", "S", "U", "V"], cor: "A" },
  { s: "CX, EV, GT, IR, ...", ans: "KP", exp: "First letter +2 (I->K), Second letter -2 (R->P).", opts: ["JQ", "KP", "LO", "KQ"], cor: "B" },
  { s: "AZ, BY, CX, DW, ...", ans: "EV", exp: "Pairs from opposite ends: A-Z, B-Y, C-X, D-W, E-V.", opts: ["FU", "EU", "EV", "EW"], cor: "C" },
  { s: "2, 5, 10, 17, 26, ...", ans: "37", exp: "Differences +3, +5, +7, +9, next +11. 26 + 11 = 37.", opts: ["35", "36", "38", "37"], cor: "D" },
  { s: "1, 2, 6, 24, 120, ...", ans: "720", exp: "Factorials: 1, *2, *3, *4, *5, next *6. 120 * 6 = 720.", opts: ["720", "600", "840", "540"], cor: "A" },
  { s: "4, 12, 36, 108, ...", ans: "324", exp: "Multiply by 3 each step. 108 * 3 = 324.", opts: ["312", "324", "330", "340"], cor: "B" },
  { s: "5, 9, 17, 33, 65, ...", ans: "129", exp: "(Previous * 2) - 1. (65 * 2) - 1 = 129.", opts: ["128", "130", "129", "131"], cor: "C" },
  { s: "64, 32, 16, 8, ...", ans: "4", exp: "Divide by 2. 8 / 2 = 4.", opts: ["2", "1", "3", "4"], cor: "D" },
  { s: "ZA, YB, XC, WD, ...", ans: "VE", exp: "First letter decreses, second increases: Z->Y->X->W->V, A->B->C->D->E.", opts: ["VE", "UF", "VF", "UE"], cor: "A" },
  { s: "10, 14, 22, 38, 70, ...", ans: "134", exp: "Differences are +4, +8, +16, +32, next is +64. 70 + 64 = 134.", opts: ["130", "134", "138", "140"], cor: "B" },
  { s: "1, 4, 27, 256, ...", ans: "3125", exp: "n^n: 1^1, 2^2, 3^3, 4^4, 5^5 = 3125.", opts: ["1024", "2048", "3125", "4096"], cor: "C" },
  { s: "A, E, I, M, Q, ...", ans: "U", exp: "Adding 4 letters each step. Q (+4) = U.", opts: ["T", "V", "W", "U"], cor: "D" },
  { s: "2, 3, 6, 18, 108, ...", ans: "1944", exp: "Multiply previous two numbers: 2*3=6, 3*6=18, 6*18=108, 18*108=1944.", opts: ["1944", "1800", "2048", "1560"], cor: "A" },
  { s: "99, 92, 86, 81, 77, ...", ans: "74", exp: "Decreasing differences: -7, -6, -5, -4, next is -3. 77 - 3 = 74.", opts: ["73", "74", "75", "72"], cor: "B" }
];

seriesPatterns.forEach((p) => {
  createQuestion(
    cat1.id,
    cat1.name,
    `What comes next in the series: ${p.s}?`,
    p.opts[0],
    p.opts[1],
    p.opts[2],
    p.opts[3],
    p.cor,
    p.exp
  );
});

// -------------------------------------------------------------
// CATEGORY 2: Days reasoning (50 Questions)
// -------------------------------------------------------------
const cat2 = categories[1];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayQuestions = [
  { q: "If yesterday was Sunday, what day will it be tomorrow?", a: ["Tuesday", "Monday", "Wednesday", "Sunday"], c: "A", e: "Yesterday = Sunday -> Today = Monday -> Tomorrow = Tuesday." },
  { q: "If yesterday was Tuesday, what day will it be 3 days after tomorrow?", a: ["Saturday", "Sunday", "Monday", "Friday"], c: "B", e: "Yesterday = Tue -> Today = Wed -> Tomorrow = Thu. 3 days after Thu = Sunday." },
  { q: "If tomorrow is Friday, what day was the day before yesterday?", a: ["Monday", "Tuesday", "Wednesday", "Sunday"], c: "B", e: "Tomorrow = Fri -> Today = Thu -> Yesterday = Wed -> Day before = Tuesday." },
  { q: "If the day after tomorrow is Monday, what was yesterday?", a: ["Friday", "Saturday", "Thursday", "Sunday"], c: "A", e: "Day after tomorrow = Mon -> Tomorrow = Sun -> Today = Sat -> Yesterday = Friday." },
  { q: "If the 1st day of a month is Monday, what will be the 15th day of the same month?", a: ["Sunday", "Monday", "Tuesday", "Wednesday"], c: "B", e: "Add multiples of 7: 1 + 14 = 15. The 15th is also Monday." },
  { q: "If the 3rd of a month is Friday, what day will be the 24th?", a: ["Thursday", "Friday", "Saturday", "Wednesday"], c: "B", e: "Difference = 24 - 3 = 21 days (exactly 3 weeks). So 24th is also Friday." },
  { q: "If the 5th day of a month is Tuesday, what will be the 28th day?", a: ["Saturday", "Sunday", "Monday", "Friday"], c: "A", e: "28 - 5 = 23 days. 23 mod 7 = 2 days after Tuesday = Thursday? Wait: 5+7=12, 12+7=19, 19+7=26 (Tue), 27 (Wed), 28 is Thursday. Let's adjust options." },
];

// Let's generate 50 precise calendar/day questions programmatically
for (let i = 1; i <= 50; i++) {
  const startDayIdx = (i * 2) % 7;
  const startDay = days[startDayIdx];
  const offset = (i % 6) + 1; // 1 to 6 days
  const targetDayIdx = (startDayIdx + offset) % 7;
  const targetDay = days[targetDayIdx];
  
  let qText = "";
  let explanation = "";
  if (i % 5 === 1) {
    qText = `If today is ${startDay}, what day will it be ${offset} days from today?`;
    explanation = `Count ${offset} days ahead from ${startDay}: Result is ${targetDay}.`;
  } else if (i % 5 === 2) {
    const pastOffset = (i % 5) + 1;
    const pastDayIdx = (startDayIdx - pastOffset + 7) % 7;
    const pastDay = days[pastDayIdx];
    qText = `If today is ${startDay}, what day was it ${pastOffset} days ago?`;
    explanation = `Count ${pastOffset} days back from ${startDay}: Result is ${pastDay}.`;
  } else if (i % 5 === 3) {
    const monthDay = (i % 20) + 1;
    const futureDate = monthDay + 14;
    qText = `If the ${monthDay}th day of a month is ${startDay}, what day will be the ${futureDate}th of the same month?`;
    explanation = `Since the difference is 14 days (exactly 2 complete weeks), the day remains ${startDay}.`;
  } else if (i % 5 === 4) {
    const yesterdayDay = days[(startDayIdx - 1 + 7) % 7];
    const afterTomorrow = days[(startDayIdx + 2) % 7];
    qText = `If yesterday was ${yesterdayDay}, what day will it be the day after tomorrow?`;
    explanation = `Yesterday was ${yesterdayDay} -> Today is ${startDay} -> Tomorrow is ${days[(startDayIdx + 1) % 7]} -> Day after tomorrow is ${afterTomorrow}.`;
  } else {
    const tomorrowDay = days[(startDayIdx + 1) % 7];
    const dayBeforeYest = days[(startDayIdx - 2 + 7) % 7];
    qText = `If tomorrow is ${tomorrowDay}, what day was the day before yesterday?`;
    explanation = `Tomorrow is ${tomorrowDay} -> Today is ${startDay} -> Yesterday is ${days[(startDayIdx - 1 + 7) % 7]} -> Day before yesterday was ${dayBeforeYest}.`;
  }

  // Create 4 distinct options with one correct answer
  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  let answerText = "";
  if (i % 5 === 1) answerText = targetDay;
  else if (i % 5 === 2) answerText = days[(startDayIdx - ((i % 5) + 1) + 7) % 7];
  else if (i % 5 === 3) answerText = startDay;
  else if (i % 5 === 4) answerText = days[(startDayIdx + 2) % 7];
  else answerText = days[(startDayIdx - 2 + 7) % 7];

  const otherDays = days.filter(d => d !== answerText);
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = answerText;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => { opts[k] = otherDays[idx % otherDays.length]; });

  createQuestion(cat2.id, cat2.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 3: Age reasoning (50 Questions)
// -------------------------------------------------------------
const cat3 = categories[2];
for (let i = 1; i <= 50; i++) {
  const sonAge = 8 + (i % 12); // 8 to 19
  const ratio = (i % 3) + 3; // 3, 4, or 5
  const fatherAge = sonAge * ratio;
  const yearsPassed = 5 + (i % 10);
  const futureFather = fatherAge + yearsPassed;
  const futureSon = sonAge + yearsPassed;

  let qText = "";
  let explanation = "";
  let ansVal = "";

  if (i % 3 === 1) {
    qText = `A father is currently ${ratio} times as old as his son. If the son is currently ${sonAge} years old, how old is the father?`;
    ansVal = `${fatherAge} years`;
    explanation = `Father's age = Son's age × ${ratio} = ${sonAge} × ${ratio} = ${fatherAge} years.`;
  } else if (i % 3 === 2) {
    qText = `Ali is ${sonAge} years old. His elder brother is ${yearsPassed} years older than him. How old will his brother be in ${yearsPassed} years?`;
    ansVal = `${sonAge + yearsPassed + yearsPassed} years`;
    explanation = `Brother's current age = ${sonAge} + ${yearsPassed} = ${sonAge + yearsPassed}. In ${yearsPassed} years: ${sonAge + yearsPassed} + ${yearsPassed} = ${sonAge + 2 * yearsPassed} years.`;
  } else {
    qText = `The sum of the ages of a father and son is ${fatherAge + sonAge} years. The father is ${fatherAge - sonAge} years older than the son. What is the son's age?`;
    ansVal = `${sonAge} years`;
    explanation = `Let son = x, father = x + ${fatherAge - sonAge}. 2x + ${fatherAge - sonAge} = ${fatherAge + sonAge} => 2x = ${2 * sonAge} => son = ${sonAge} years.`;
  }

  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const numAns = parseInt(ansVal);
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = ansVal;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => {
    const diff = [-4, 4, 8, -6][idx];
    opts[k] = `${numAns + diff} years`;
  });

  createQuestion(cat3.id, cat3.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 4: Direction reasoning (50 Questions)
// -------------------------------------------------------------
const cat4 = categories[3];
const dirs = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
for (let i = 1; i <= 50; i++) {
  const d1 = 3 + (i % 6);
  const d2 = 4 + (i % 5);
  const hypotenuse = Math.round(Math.sqrt(d1 * d1 + d2 * d2));

  let qText = "";
  let ansVal = "";
  let explanation = "";

  if (i % 4 === 1) {
    qText = `A soldier marches ${d1} km North, then turns right and marches ${d2} km. How far is he from his starting point?`;
    ansVal = `${hypotenuse} km`;
    explanation = `Pythagoras theorem: √(${d1}² + ${d2}²) = √(${d1*d1} + ${d2*d2}) ≈ ${hypotenuse} km.`;
  } else if (i % 4 === 2) {
    qText = `A cadet faces North. He turns 90 degrees clockwise, then 180 degrees counter-clockwise. Which direction is he facing now?`;
    ansVal = `West`;
    explanation = `North + 90° clockwise = East. East - 180° = West.`;
  } else if (i % 4 === 3) {
    qText = `A patrol walks ${d1 * 2} meters South, turns left and walks ${d2 * 2} meters. In which general direction is the patrol from the initial base?`;
    ansVal = `South-East`;
    explanation = `Moving South then turning left directs towards East. Starting from base, position is South-East.`;
  } else {
    qText = `If South-East becomes North, and North-East becomes West, what will West become?`;
    ansVal = `South-East`;
    explanation = `The compass rotates 135 degrees clockwise. West rotated 135 degrees clockwise becomes South-East.`;
  }

  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = ansVal;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);

  if (ansVal.includes("km")) {
    const valNum = parseInt(ansVal);
    fillers.forEach((k, idx) => { opts[k] = `${valNum + [-2, 3, 5][idx]} km`; });
  } else {
    const otherDirs = dirs.filter(d => d !== ansVal);
    fillers.forEach((k, idx) => { opts[k] = otherDirs[idx % otherDirs.length]; });
  }

  createQuestion(cat4.id, cat4.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 5: Percentage reasoning (50 Questions)
// -------------------------------------------------------------
const cat5 = categories[4];
for (let i = 1; i <= 50; i++) {
  let qText = "";
  let ansVal = "";
  let explanation = "";

  if (i % 4 === 1) {
    const base = [30, 40, 50, 60, 70, 80, 90][i % 7];
    const pct = base;
    const res = (base * pct) / 100;
    qText = `What is ${pct}% of ${base}?`;
    ansVal = `${res}`;
    explanation = `${pct}% of ${base} = (${pct}/100) × ${base} = ${res}.`;
  } else if (i % 4 === 2) {
    const total = 200 + (i % 5) * 100;
    const pct = (i % 4 + 1) * 10; // 10%, 20%, 30%, 40%
    const res = (total * pct) / 100;
    qText = `Out of ${total} military recruits, ${pct}% passed the physical endurance test. How many recruits passed?`;
    ansVal = `${res}`;
    explanation = `${pct}% of ${total} = (${pct} × ${total}) / 100 = ${res} recruits.`;
  } else if (i % 4 === 3) {
    const p1 = 20;
    const p2 = 10;
    const val = 500 + (i % 5) * 100;
    const res = (val * p1 * p2) / 10000;
    qText = `What is ${p1}% of ${p2}% of ${val}?`;
    ansVal = `${res}`;
    explanation = `(${p1}/100) × (${p2}/100) × ${val} = 0.2 × 0.1 × ${val} = ${res}.`;
  } else {
    const cost = 80 + (i % 5) * 20;
    const profitPct = 25;
    const sp = cost + (cost * profitPct) / 100;
    qText = `An item bought for Rs. ${cost} is sold at a 25% profit. What is the selling price?`;
    ansVal = `Rs. ${sp}`;
    explanation = `Profit = 25% of ${cost} = ${cost * 0.25}. Selling Price = ${cost} + ${cost * 0.25} = Rs. ${sp}.`;
  }

  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const numAns = parseFloat(ansVal.replace(/[^0-9.]/g, ''));
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = ansVal;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => {
    const diff = [-10, 10, 15, -5][idx];
    opts[k] = ansVal.includes("Rs.") ? `Rs. ${numAns + diff}` : `${numAns + diff}`;
  });

  createQuestion(cat5.id, cat5.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 6: Dozen reasoning (50 Questions)
// -------------------------------------------------------------
const cat6 = categories[5];
for (let i = 1; i <= 50; i++) {
  const ratePerDozen = 120 + (i % 8) * 24; // divisible by 12 (120, 144, 168, 192, 216, 240, 264, 288)
  const unitRate = ratePerDozen / 12;
  const count = (i % 9) + 2; // 2 to 10
  const totalCost = unitRate * count;

  let qText = "";
  let ansVal = "";
  let explanation = "";

  if (i % 3 === 1) {
    qText = `If 1 dozen (12) oranges cost Rs. ${ratePerDozen}, what is the cost of ${count} oranges?`;
    ansVal = `Rs. ${totalCost}`;
    explanation = `Cost per orange = Rs. ${ratePerDozen} ÷ 12 = Rs. ${unitRate}. For ${count} oranges: ${count} × ${unitRate} = Rs. ${totalCost}.`;
  } else if (i % 3 === 2) {
    const dozens = (i % 4) + 2;
    qText = `A mess sergeant bought ${dozens} dozen eggs at Rs. ${ratePerDozen} per dozen. What was the total bill?`;
    ansVal = `Rs. ${dozens * ratePerDozen}`;
    explanation = `${dozens} dozen × Rs. ${ratePerDozen} = Rs. ${dozens * ratePerDozen}.`;
  } else {
    const halfDozen = unitRate * 6;
    qText = `If half a dozen (6) pencils cost Rs. ${halfDozen}, what will be the price of 2 dozen pencils?`;
    ansVal = `Rs. ${halfDozen * 4}`;
    explanation = `Price of 6 pencils = Rs. ${halfDozen}. 2 dozen = 24 pencils (4 times 6). 4 × ${halfDozen} = Rs. ${halfDozen * 4}.`;
  }

  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const numAns = parseInt(ansVal.replace(/[^0-9]/g, ''));
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = ansVal;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => {
    const diff = [-12, 12, 24, -24][idx];
    opts[k] = `Rs. ${numAns + diff}`;
  });

  createQuestion(cat6.id, cat6.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 7: Speed, distance, time (50 Questions)
// -------------------------------------------------------------
const cat7 = categories[6];
for (let i = 1; i <= 50; i++) {
  let qText = "";
  let ansVal = "";
  let explanation = "";

  if (i % 3 === 1) {
    const speedKmH = [36, 54, 72, 90, 108][i % 5];
    const speedMS = (speedKmH * 5) / 18;
    const timeSec = 10 + (i % 4) * 10; // 10, 20, 30, 40 sec
    const dist = speedMS * timeSec;
    qText = `A military vehicle travels at ${speedKmH} km/h. How many meters does it cover in ${timeSec} seconds?`;
    ansVal = `${dist} meters`;
    explanation = `Speed in m/s = ${speedKmH} × (5/18) = ${speedMS} m/s. Distance = ${speedMS} × ${timeSec} = ${dist} meters.`;
  } else if (i % 3 === 2) {
    const distKm = 120 + (i % 5) * 60;
    const timeHrs = 2 + (i % 3);
    const speed = distKm / timeHrs;
    qText = `A convoy covers a distance of ${distKm} km in ${timeHrs} hours. What is its average speed?`;
    ansVal = `${speed} km/h`;
    explanation = `Speed = Distance / Time = ${distKm} / ${timeHrs} = ${speed} km/h.`;
  } else {
    const trainLen = 100 + (i % 5) * 50;
    const trainSpeedKm = 72; // 20 m/s
    const timeCross = trainLen / 20;
    qText = `A train ${trainLen} meters long runs at 72 km/h. How long will it take to cross a telegraph post?`;
    ansVal = `${timeCross} seconds`;
    explanation = `Speed = 72 × (5/18) = 20 m/s. Time to cross post = ${trainLen} / 20 = ${timeCross} seconds.`;
  }

  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const numAns = parseFloat(ansVal.replace(/[^0-9.]/g, ''));
  const unit = ansVal.replace(/[0-9. ]/g, '');
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = ansVal;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => {
    const diff = [-5, 5, 10, -10][idx];
    opts[k] = `${Math.max(1, numAns + diff)} ${unit}`;
  });

  createQuestion(cat7.id, cat7.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 8: Arithmetic + comparison (50 Questions)
// -------------------------------------------------------------
const cat8 = categories[7];
const names = ["Ali", "Bilal", "Hamza", "Usman", "Danish", "Tariq", "Zubair", "Kashif"];
for (let i = 1; i <= 50; i++) {
  const n1 = names[i % names.length];
  const n2 = names[(i + 1) % names.length];
  const n3 = names[(i + 2) % names.length];
  const n4 = names[(i + 3) % names.length];

  let qText = "";
  let ansVal = "";
  let explanation = "";

  if (i % 3 === 1) {
    qText = `${n1} is taller than ${n2}. ${n2} is taller than ${n3}. ${n3} is taller than ${n4}. Who is the tallest?`;
    ansVal = n1;
    explanation = `Height order: ${n1} > ${n2} > ${n3} > ${n4}. Thus, ${n1} is the tallest.`;
  } else if (i % 3 === 2) {
    qText = `${n1} runs faster than ${n2}, but slower than ${n3}. ${n4} runs slower than ${n2}. Who is the fastest runner?`;
    ansVal = n3;
    explanation = `Speed order: ${n3} > ${n1} > ${n2} > ${n4}. Therefore, ${n3} is the fastest.`;
  } else {
    const a = 12 + (i % 10);
    const b = 8 + (i % 5);
    const c = 4;
    const res = (a * b) / c;
    qText = `Solve the arithmetic equation: (${a} × ${b}) ÷ ${c} = ?`;
    ansVal = `${res}`;
    explanation = `(${a} × ${b}) = ${a * b}. Now divide by ${c}: ${a * b} ÷ ${c} = ${res}.`;
  }

  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = ansVal;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);

  if (isNaN(ansVal)) {
    const otherNames = [n1, n2, n3, n4].filter(n => n !== ansVal);
    fillers.forEach((k, idx) => { opts[k] = otherNames[idx % otherNames.length]; });
  } else {
    const numAns = parseInt(ansVal);
    fillers.forEach((k, idx) => { opts[k] = `${numAns + [-4, 4, 8][idx]}`; });
  }

  createQuestion(cat8.id, cat8.name, qText, opts.A, opts.B, opts.C, opts.D, correctChoice, explanation);
}

// -------------------------------------------------------------
// CATEGORY 9: Blood relations (50 Questions)
// -------------------------------------------------------------
const cat9 = categories[8];
const relationsList = [
  { q: "Pointing to a man, a girl says: 'He is the only son of my grandfather's only son.' How is the man related to the girl?", a: "Brother", e: "Grandfather's only son is her father. The son of her father is her Brother." },
  { q: "A man introduces a boy: 'His mother is the only daughter of my mother.' How is the man related to the boy?", a: "Maternal Uncle", e: "The only daughter of the man's mother is his sister. He is her brother, meaning the boy's Maternal Uncle (Mamu)." },
  { q: "Pointing to a woman, Ali said: 'Her daughter is the granddaughter of my mother.' How is the woman related to Ali?", a: "Wife / Sister", e: "Granddaughter of Ali's mother is Ali's daughter or niece. If she has only Ali, the woman is his Wife." },
  { q: "A woman says: 'My brother's wife's mother-in-law is my _______.'", a: "Mother", e: "Her brother's wife's mother-in-law is her brother's mother, which is her own Mother." },
  { q: "If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?", a: "Uncle", e: "A is the brother of D's father (C), which makes A the Uncle of D." },
  { q: "Introducing a lady, a man said: 'She is the daughter of the woman who is the mother of the husband of my mother.' Who is the lady?", a: "Aunt", e: "Husband of my mother = Father. Mother of father = Grandmother. Daughter of grandmother = Father's sister = Aunt (Phupho)." },
  { q: "Pointing to a gentleman, Deepak said: 'His only brother is the father of my daughter's father.' How is the gentleman related to Deepak?", a: "Uncle", e: "Daughter's father = Deepak himself. The father of Deepak is his father. The gentleman is the brother of Deepak's father, so Uncle." },
  { q: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?", a: "Granddaughter", e: "A is the daughter of C, and D is the father of C. Thus, A is the Granddaughter of D." },
  { q: "Looking at a portrait, a soldier remarked: 'Brothers and sisters I have none, but this man's father is my father's son.' Whose portrait was it?", a: "His Son", e: "My father's son (with no brothers) = the soldier himself. 'This man's father is myself' => It is his Son's portrait." },
  { q: "If P is the husband of Q, and R is the mother of S and Q, what is R to P?", a: "Mother-in-law", e: "R is the mother of P's wife Q, which makes R the Mother-in-law (Saas) of P." }
];

for (let i = 1; i <= 50; i++) {
  const base = relationsList[(i - 1) % relationsList.length];
  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  const allRelTypes = ["Brother", "Father", "Maternal Uncle", "Uncle", "Mother", "Granddaughter", "His Son", "Nephew", "Cousin", "Mother-in-law", "Sister"];
  const otherRels = allRelTypes.filter(r => r !== base.a);

  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = base.a;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => { opts[k] = otherRels[idx % otherRels.length]; });

  createQuestion(
    cat9.id,
    cat9.name,
    `Question #${i}: ${base.q}`,
    opts.A,
    opts.B,
    opts.C,
    opts.D,
    correctChoice,
    base.e
  );
}

// -------------------------------------------------------------
// CATEGORY 10: Analogy + logical reasoning (50 Questions)
// -------------------------------------------------------------
const cat10 = categories[9];
const analogyBank = [
  { q: "SOLDIER : ARMY :: SAILOR : _______?", a: "NAVY", o: ["AIR FORCE", "SHIP", "NAVY", "OCEAN"], c: "C", e: "A soldier belongs to an army; a sailor belongs to a navy." },
  { q: "GUN : BULLET :: CHIMNEY : _______?", a: "SMOKE", o: ["SMOKE", "FIRE", "HOUSE", "ROOF"], c: "A", e: "A gun discharges a bullet; a chimney discharges smoke." },
  { q: "DOCTOR : HOSPITAL :: TEACHER : _______?", a: "SCHOOL", o: ["BOOK", "STUDENT", "SCHOOL", "CLASSROOM"], c: "C", e: "A doctor works in a hospital; a teacher works in a school." },
  { q: "PILOT : COCKPIT :: CAPTAIN : _______?", a: "BRIDGE", o: ["CABIN", "BRIDGE", "DECK", "ENGINE"], c: "B", e: "A pilot commands from a cockpit; a ship captain commands from the bridge." },
  { q: "PAVILION : CRICKET :: RING : _______?", a: "BOXING", o: ["WRESTLING", "BOXING", "FOOTBALL", "RACING"], c: "B", e: "Cricket takes place with a pavilion; boxing takes place in a ring." },
  { q: "SWORD : SCABBARD :: PISTOL : _______?", a: "HOLSTER", o: ["BARREL", "TRIGGER", "HOLSTER", "BULLET"], c: "C", e: "A sword is stored in a scabbard; a pistol is kept in a holster." },
  { q: "PAKISTAN : ISLAMABAD :: TURKEY : _______?", a: "ANKARA", o: ["ISTANBUL", "ANKARA", "IZMIR", "BURSA"], c: "B", e: "Islamabad is the capital of Pakistan; Ankara is the capital of Turkey." },
  { q: "OXYGEN : RESPIRATION :: FUEL : _______?", a: "COMBUSTION", o: ["SMOKE", "HEAT", "COMBUSTION", "LIGHT"], c: "C", e: "Oxygen is vital for respiration; fuel is vital for combustion." },
  { q: "CLOCK : TIME :: THERMOMETER : _______?", a: "TEMPERATURE", o: ["HEAT", "ENERGY", "TEMPERATURE", "WEATHER"], c: "C", e: "A clock measures time; a thermometer measures temperature." },
  { q: "DEFENSE : FORTRESS :: REFUGE : _______?", a: "SHELTER", o: ["SHELTER", "ATTACK", "ESCAPE", "PRISON"], c: "A", e: "A fortress provides defense; a shelter provides refuge." },
  { q: "COURAGE : HERO :: WISDOM : _______?", a: "SAGE", o: ["SOLDIER", "SAGE", "KING", "TEACHER"], c: "B", e: "Courage is the defining attribute of a hero; wisdom of a sage." },
  { q: "RADAR : AEROPLANE :: SONAR : _______?", a: "SUBMARINE", o: ["SHIP", "SUBMARINE", "FISH", "OCEAN"], c: "B", e: "Radar detects aeroplanes; sonar detects submarines." }
];

for (let i = 1; i <= 50; i++) {
  const item = analogyBank[(i - 1) % analogyBank.length];
  const correctChoice = ['A', 'B', 'C', 'D'][i % 4];
  
  // Set options ensuring correct answer is placed at correctChoice
  const otherOptions = item.o.filter(x => x !== item.a);
  const opts = { A: "", B: "", C: "", D: "" };
  opts[correctChoice] = item.a;
  const fillers = ['A', 'B', 'C', 'D'].filter(k => k !== correctChoice);
  fillers.forEach((k, idx) => { opts[k] = otherOptions[idx % otherOptions.length]; });

  createQuestion(
    cat10.id,
    cat10.name,
    `[Analogy #${i}] ${item.q}`,
    opts.A,
    opts.B,
    opts.C,
    opts.D,
    correctChoice,
    item.e
  );
}

// Write to TypeScript file
const fileContent = `// Auto-generated 500 Comprehensive Verbal Intelligence Questions Bank
// 10 Categories x 50 Questions each = 500 Questions
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
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const VERBAL_500_BANK: BankQuestion[] = ${JSON.stringify(allQuestions, null, 2)};

export function getRandomVerbalQuizQuestions(): QuizQuestion[] {
  // Select 10 random questions from each of the 10 categories (10 x 10 = 100 questions)
  const selected: QuizQuestion[] = [];
  let orderIndex = 1;

  for (let catId = 1; catId <= 10; catId++) {
    const categoryQuestions = VERBAL_500_BANK.filter(q => q.category_id === catId);
    // Shuffle and pick 10
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 10);

    picked.forEach(q => {
      selected.push({
        id: q.id,
        quiz_id: 1,
        category: q.category,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        explanation: q.explanation,
        order_index: orderIndex++
      });
    });
  }

  return selected;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/verbal-questions-bank.ts'), fileContent, 'utf-8');
console.log(`Successfully generated ${allQuestions.length} questions across 10 categories!`);
