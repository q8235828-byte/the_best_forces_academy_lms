import React from 'react';
import { notFound } from 'next/navigation';
import CourseDetailClient from '@/components/CourseDetailClient';
import { INITIAL_COURSES } from '@/lib/courses-data';

export const runtime = 'edge';

export function generateStaticParams() {
  return INITIAL_COURSES.map((course) => ({
    slug: course.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CourseDetailPage({ params }: PageProps) {
  const { slug } = params;
  const course = INITIAL_COURSES.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}
