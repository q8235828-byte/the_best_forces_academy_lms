# AI Agent Memory & Operational Guardrails (AI_MEMORY.md)
**Project Title:** THE BEST FORCES ACADEMY LMS  
**Target Platform:** Next.js (App Router) + Cloudflare Pages + Cloudflare D1 (SQLite)  
**Lead Authority:** Sir Faryad Tabassum (+92 305 4599659 | Info@bestforcesacademy.net)  
**Domain:** bestforcesacademy.net  

---

## 1. Non-Negotiable System Constants & Authority Rules
* **Brand Identity:** Never invent placeholder academy names or contact details. Always strictly use:
  * Name: `THE BEST FORCES ACADEMY LMS`
  * Domain: `bestforcesacademy.net`
  * Lead Mentor: `Sir Faryad Tabassum`
  * Official WhatsApp & Phone: `+92 305 4599659` (Format for links: `923054599659`)
  * Official Support Email: `Info@bestforcesacademy.net`
  * Currency: Pakistani Rupee (`PKR`)

---

## 2. Cloudflare D1 (SQLite) Execution Laws
1. **SQLite Syntax Strictness:** Cloudflare D1 uses SQLite. Never emit PostgreSQL or MySQL syntax:
   * ❌ Do NOT use `UUID`, `gen_random_uuid()`, `NOW()`, `TIMESTAMPTZ`, or native `BOOLEAN`.
   * ✅ Use `INTEGER PRIMARY KEY AUTOINCREMENT` for IDs, `INTEGER` (0 or 1) for booleans, and `datetime('now')` for timestamps.
2. **Edge Context Access:** In Server Components and Route Handlers, always access the D1 binding via `@cloudflare/next-on-pages`:
   ```ts
   import { getRequestContext } from '@cloudflare/next-on-pages';

   export const runtime = 'edge';

   export async function GET(request: Request) {
     const db = getRequestContext().env.DB;
     const { results } = await db.prepare("SELECT * FROM courses WHERE is_published = 1").all();
     return Response.json(results);
   }
   if (lesson.order_index === 1 || lesson.is_free_preview === 1) {
  // Allow video playback to everyone (Guests and Unpaid Users)
  return serveVideo(lesson.video_url);
}

// Lessons 2+ REQUIRE verified enrollment
const isEnrolled = await db.prepare(
  "SELECT status FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'approved'"
).bind(userId, lesson.course_id).first();

if (!isEnrolled) {
  return new Response("Payment Required", { status: 402 });
}