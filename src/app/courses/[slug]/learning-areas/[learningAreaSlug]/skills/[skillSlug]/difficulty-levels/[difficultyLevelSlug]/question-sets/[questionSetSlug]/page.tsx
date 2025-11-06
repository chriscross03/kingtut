"use client";

import PageLayout from "../../../../../../../../../components/PageLayout";
import BackLink from "../../../../../../../../../../../components/BackLink";
import { useParams, useRouter } from "next/navigation";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { QuestionSet } from "@/generated/prisma";
import { useFetchSingleResource } from "@/hooks/useFetchSingeResource";

function QuestionSetClient() {
  const params = useParams();
  const router = useRouter();

  const {
    slug: courseSlug,
    learningAreaSlug,
    skillSlug,
    difficultyLevelSlug,
    questionSetSlug,
  } = params as {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
    questionSetSlug: string;
  };

  const {
    data: fetchedQuestionSet,
    loading,
    error,
  } = useFetchSingleResource<QuestionSet>(
    `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${skillSlug}/difficulty-levels/${difficultyLevelSlug}/question-sets/${questionSetSlug}`
  );

  const questionSet = fetchedQuestionSet;
  const handleStartQuiz = () => {
    router.push(
      `/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${skillSlug}/difficulty-levels/${difficultyLevelSlug}/question-sets/${questionSetSlug}/quiz`
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading question set.</p>;
  if (!questionSet) {
    return (
      <div className="text-gray-600 italic text-center py-16">
        Question set not found.
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col items-start gap-4">
      <p className="text-lg text-gray-600">
        {questionSet?.description || "Get ready to begin this question set."}
      </p>

      <button
        onClick={handleStartQuiz}
        disabled={!questionSet}
        className="px-6 py-3 text-lg font-semibold rounded-xl shadow bg-blue-600 text-white hover:bg-blue-700"
      >
        Start Quiz
      </button>
    </div>
  );
}

export default function QuestionSetPage() {
  return (
    <PageLayout title="Question Set" subtitle="Question Set">
      <BackLink href="/courses" label="Back to courses" />
      <QuestionSetClient />
    </PageLayout>
  );
}
