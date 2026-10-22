import { INITIAL_COURSES, SAMPLE_LESSONS } from './courses-data';
import { SAMPLE_QUIZZES } from './quizzes-data';
import { Course, Lesson, Quiz } from '@/types';

/**
 * Cloudflare D1 Native SQLite Database Helper
 * Complies with AI_MEMORY.md rules for edge runtime access
 */
export async function getDatabase() {
  try {
    // Dynamic import to avoid build errors during local Node.js compilation
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const context = getRequestContext();
    if (context && context.env && (context.env as any).DB) {
      return (context.env as any).DB;
    }
  } catch (err) {
    // Fallback when running outside Cloudflare Edge (e.g. standard local next dev)
  }
  return null;
}

/**
 * Fetch all published courses from D1 or fallback seed
 */
export async function getPublishedCourses(): Promise<Course[]> {
  const db = await getDatabase();
  if (db) {
    const { results } = await db.prepare("SELECT * FROM courses WHERE is_published = 1 ORDER BY id ASC").all();
    return results as unknown as Course[];
  }
  return INITIAL_COURSES;
}

/**
 * Fetch course by slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const db = await getDatabase();
  if (db) {
    const course = await db.prepare("SELECT * FROM courses WHERE slug = ? AND is_published = 1").bind(slug).first();
    return (course as unknown as Course) || null;
  }
  return INITIAL_COURSES.find((c) => c.slug === slug) || null;
}

/**
 * Fetch lessons for a course
 */
export async function getCourseLessons(courseId: number): Promise<Lesson[]> {
  const db = await getDatabase();
  if (db) {
    const { results } = await db.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC").bind(courseId).all();
    return results as unknown as Lesson[];
  }
  return SAMPLE_LESSONS[courseId] || [];
}
