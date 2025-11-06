"use client";

interface SubmitQuestionParams {
  questionSetId: number;
  questionId: number;
  answer: string;
  timeSpent: number;
  quizAttemptId?: number;
  courseSlug: string;
  learningAreaSlug: string;
  skillSlug: string;
  difficultyLevelSlug: string;
  questionSetSlug: string;
}

export function useSubmitQuestion() {
  const submitQuestion = async (params: SubmitQuestionParams) => {
    const {
      questionSetId,
      questionId,
      answer,
      timeSpent,
      quizAttemptId,
      courseSlug,
      learningAreaSlug,
      skillSlug,
      difficultyLevelSlug,
      questionSetSlug,
    } = params;

    const response = await fetch(
      `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${skillSlug}/difficulty-levels/${difficultyLevelSlug}/question-sets/${questionSetSlug}/submit-question`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSetId,
          questionId,
          answer,
          timeSpent,
          quizAttemptId,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to submit question");

    return result;
  };

  return { submitQuestion };
}
