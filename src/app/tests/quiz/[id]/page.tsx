import React from 'react';
import { notFound } from 'next/navigation';
import QuizAttemptClient from '@/components/QuizAttemptClient';
import { SAMPLE_QUIZZES, SAMPLE_QUESTIONS } from '@/lib/quizzes-data';

export const runtime = 'edge';

export function generateStaticParams() {
  return SAMPLE_QUIZZES.map((q) => ({
    id: q.id.toString(),
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function QuizAttemptPage({ params }: PageProps) {
  const quizId = parseInt(params.id, 10);
  const quiz = SAMPLE_QUIZZES.find((q) => q.id === quizId);
  const questions = SAMPLE_QUESTIONS[quizId] || SAMPLE_QUESTIONS[1];

  if (!quiz) {
    notFound();
  }

  return <QuizAttemptClient quiz={quiz} questions={questions} />;
}
