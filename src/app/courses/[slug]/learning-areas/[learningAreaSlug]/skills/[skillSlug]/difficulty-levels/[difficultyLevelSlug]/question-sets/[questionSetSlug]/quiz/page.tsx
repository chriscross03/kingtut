"use client";

import QuizPage from "../quiz-components/quiz-page";
import { useParams } from "next/navigation";

export default function Quizz() {
  const rawParams = useParams();

  const params = rawParams as {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
    questionSetSlug: string;
    quizAttemptId: string;
  };

  return <QuizPage params={params} />;
}
