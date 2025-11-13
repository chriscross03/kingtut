"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLayout from "@/app/courses/components/PageLayout";
import Link from "next/link";

interface Answer {
  id: number;
  questionText: string;
  questionType: string;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
  correctOption?: string;
  allOptions: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  explanation?: string;
}

interface QuizData {
  id: number;
  title: string;
  difficulty: string;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  totalTime: number;
  completedAt: string;
  correctCount: number;
  totalQuestions: number;
}

interface QuizResults {
  success: boolean;
  quiz: QuizData;
  answers: Answer[];
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
    questionSetSlug: string;
  }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");

  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) {
      setError("No submission ID provided");
      setLoading(false);
      return;
    }

    async function fetchResults() {
      try {
        const response = await fetch(
          `/api/courses/${resolvedParams.slug}/learning-areas/${resolvedParams.learningAreaSlug}/skills/${resolvedParams.skillSlug}/difficulty-levels/${resolvedParams.difficultyLevelSlug}/question-sets/${resolvedParams.questionSetSlug}/fetch-submission?attemptId=${submissionId}`
        );

        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setResults(data);
        } else {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.error || "Failed to load results");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load quiz results"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [submissionId, resolvedParams]);

  if (loading) {
    return (
      <PageLayout title="Loading Results...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading your results...</div>
        </div>
      </PageLayout>
    );
  }

  if (error || !results) {
    return (
      <PageLayout title="Error">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-red-600 text-lg">
            {error || "Failed to load results"}
          </div>
          <Link
            href={`/courses/${resolvedParams.slug}/learning-areas/${resolvedParams.learningAreaSlug}/skills/${resolvedParams.skillSlug}/difficulty-levels/${resolvedParams.difficultyLevelSlug}`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Difficulty Levels
          </Link>
        </div>
      </PageLayout>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PageLayout title={`Results: ${results.quiz.title}`}>
      <div className="max-w-4xl mx-auto">
        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
                results.quiz.passed
                  ? "bg-green-100 border-4 border-green-500"
                  : "bg-red-100 border-4 border-red-500"
              }`}
            >
              <span
                className={`text-4xl font-bold ${
                  results.quiz.passed ? "text-green-700" : "text-red-700"
                }`}
              >
                {Math.round(results.quiz.percentage)}%
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {results.quiz.passed
                ? "Congratulations! 🎉"
                : "Keep Practicing! 💪"}
            </h2>
            <p className="text-gray-600 text-lg">
              {results.quiz.passed
                ? "You passed this quiz!"
                : "You can retry to improve your score"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {results.quiz.earnedPoints}/{results.quiz.totalPoints}
              </div>
              <div className="text-sm text-gray-600 mt-1">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {results.quiz.correctCount}/{results.quiz.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {formatTime(results.quiz.totalTime)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Question Review</h3>
          {results.answers.map((answer, index) => (
            <div
              key={answer.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                answer.isCorrect ? "border-green-200" : "border-red-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Question {index + 1}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    answer.isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>

              <p className="text-gray-800 mb-4">{answer.questionText}</p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Your Answer:{" "}
                  </span>
                  <span
                    className={
                      answer.isCorrect ? "text-green-700" : "text-red-700"
                    }
                  >
                    {answer.userAnswer}
                  </span>
                </div>
                {!answer.isCorrect && answer.correctOption && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Correct Answer:{" "}
                    </span>
                    <span className="text-green-700">
                      {answer.correctOption}
                    </span>
                  </div>
                )}
                {answer.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      Explanation:{" "}
                    </span>
                    <span className="text-gray-600">{answer.explanation}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Time: </span>
                  <span>{formatTime(answer.timeSpent)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link
            href={`/courses/${resolvedParams.slug}/learning-areas/${resolvedParams.learningAreaSlug}/skills/${resolvedParams.skillSlug}/difficulty-levels/${resolvedParams.difficultyLevelSlug}/question-sets/${resolvedParams.questionSetSlug}`}
            className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
          >
            Retake Quiz
          </Link>
          <Link
            href={`/courses/${resolvedParams.slug}/learning-areas/${resolvedParams.learningAreaSlug}/skills/${resolvedParams.skillSlug}/difficulty-levels/${resolvedParams.difficultyLevelSlug}`}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 font-medium"
          >
            Back to Question Sets
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
