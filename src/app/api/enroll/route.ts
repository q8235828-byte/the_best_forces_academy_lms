import { getDatabase } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId, paymentMethod, trxId, candidateName, candidatePhone } = body;

    if (!courseId || !trxId || !candidatePhone) {
      return Response.json({ success: false, error: 'Missing required enrollment parameters' }, { status: 400 });
    }

    const db = await getDatabase();
    if (db) {
      await db.prepare(
        "INSERT OR REPLACE INTO enrollments (user_id, course_id, payment_method, trx_id, status) VALUES (?, ?, ?, ?, 'pending')"
      ).bind(userId || `usr_${Date.now()}`, courseId, paymentMethod || 'jazzcash', trxId).run();
    }

    return Response.json({
      success: true,
      message: 'Enrollment proof recorded successfully. Verification pending.',
      candidateName,
      trxId
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
