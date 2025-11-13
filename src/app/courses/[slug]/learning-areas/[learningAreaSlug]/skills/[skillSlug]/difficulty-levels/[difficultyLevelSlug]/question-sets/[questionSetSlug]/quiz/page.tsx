"use client";

import QuizPage from "../quiz-components/quiz-page";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Quizz() {
  const rawParams = useParams();
  const rawSearchParams = useSearchParams();
  const router = useRouter();

  const params = rawParams as {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
    questionSetSlug: string;
  };

  const quizAttemptId = rawSearchParams.get("quizAttemptId");

  useEffect(() => {
    if (!quizAttemptId) {
      router.push(
        `/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}`
      );
    }
  }, [quizAttemptId, router, params]);
  if (!quizAttemptId) return null;

  const searchParams = { quizAttemptId };

  return <QuizPage params={params} searchParams={searchParams} />;
}
