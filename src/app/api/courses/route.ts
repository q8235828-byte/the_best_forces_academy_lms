import { getPublishedCourses } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const courses = await getPublishedCourses();
    return Response.json({ success: true, courses });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
