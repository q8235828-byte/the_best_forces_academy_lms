export type CourseCategory = 
  | 'issb' 
  | 'initial_prep' 
  | 'army' 
  | 'navy' 
  | 'paf' 
  | 'cadet_college' 
  | 'entry_test' 
  | 'academics';

export type TargetGender = 'Boys' | 'Girls' | 'Both';

export interface Course {
  id: number;
  title: string;
  slug: string;
  category: CourseCategory;
  qualification: string;
  target_gender: TargetGender;
  regular_price: number;
  sale_price: number;
  whatsapp_group_link?: string;
  thumbnail_url?: string;
  syllabus_summary?: string;
  is_published: number;
  updated_at?: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
  video_url: string;
  is_free_preview: number;
  duration_minutes?: number;
  created_at?: string;
}

export interface CourseNote {
  id: number;
  course_id: number;
  lesson_id?: number | null;
  title: string;
  pdf_url: string;
  created_at?: string;
}

export type QuizType = 'Verbal' | 'Non-Verbal' | 'Academic' | 'WAT';

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  test_type: QuizType;
  duration_minutes: number;
  passing_score: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text?: string;
  question_image_url?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  order_index: number;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  quiz_id: number;
  user_name?: string;
  quiz_title?: string;
  score: number;
  total_questions: number;
  time_spent_seconds: number;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  father_name?: string;
  cnic_bform?: string;
  dob?: string;
  gender?: 'Male' | 'Female';
  phone_number: string;
  domicile_district?: string;
  height_feet?: number;
  weight_kg?: number;
  identification_mark?: string;
  religion?: string;
  sect?: string;
  father_occupation?: string;
  monthly_income?: number;
  matric_marks?: number;
  matric_total?: number;
  fsc_marks?: number;
  fsc_total?: number;
  issb_status?: 'Fresh' | 'Repeater';
  bform_document_url?: string;
  current_session_token?: string;
  role: 'student' | 'instructor' | 'admin';
  created_at?: string;
}

export interface Enrollment {
  id: number;
  user_id: string;
  course_id: number;
  course_title?: string;
  student_name?: string;
  student_phone?: string;
  payment_method: 'jazzcash' | 'easypaisa' | 'bank_transfer';
  trx_id: string;
  receipt_screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}
