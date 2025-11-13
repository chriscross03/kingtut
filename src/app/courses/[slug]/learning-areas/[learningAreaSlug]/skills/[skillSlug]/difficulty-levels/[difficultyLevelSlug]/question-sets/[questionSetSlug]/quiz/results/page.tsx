"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLayout from "@/app/courses/components/PageLayout";
import Link from "next/link";

interface QuestionResult {
  questionText: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  pointsEarned: number;
}

interface QuizResults {
  submissionId: string;
  totalPoints: number;
  pointsEarned: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in seconds
  questionResults: QuestionResult[];
  questionSetTitle: string;
}

export default function ResultsPage({
  params,
}: {
  params: {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
    questionSetSlug: string;
  };
}) {
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
          `/api/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}/fetch-submission?submissionId=${submissionId}`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
        } else {
          throw new Error("Failed to load results");
        }
      } catch (err) {
        setError("Failed to load quiz results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [submissionId, params]);

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
            href={`/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}`}
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
    <PageLayout title={`Results: ${results.questionSetTitle}`}>
      <div className="max-w-4xl mx-auto">
        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
                results.passed
                  ? "bg-green-100 border-4 border-green-500"
                  : "bg-red-100 border-4 border-red-500"
              }`}
            >
              <span
                className={`text-4xl font-bold ${
                  results.passed ? "text-green-700" : "text-red-700"
                }`}
              >
                {Math.round(results.percentage)}%
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {results.passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
            </h2>
            <p className="text-gray-600 text-lg">
              {results.passed
                ? "You passed this quiz!"
                : "You can retry to improve your score"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {results.pointsEarned}/{results.totalPoints}
              </div>
              <div className="text-sm text-gray-600 mt-1">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {results.questionResults.filter((q) => q.isCorrect).length}/
                {results.questionResults.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Question Review</h3>
          {results.questionResults.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                result.isCorrect ? "border-green-200" : "border-red-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Question {index + 1}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>

              <p className="text-gray-800 mb-4">{result.questionText}</p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Your Answer:{" "}
                  </span>
                  <span
                    className={
                      result.isCorrect ? "text-green-700" : "text-red-700"
                    }
                  >
                    {Array.isArray(result.userAnswer)
                      ? result.userAnswer.join(", ")
                      : result.userAnswer}
                  </span>
                </div>
                {!result.isCorrect && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Correct Answer:{" "}
                    </span>
                    <span className="text-green-700">
                      {Array.isArray(result.correctAnswer)
                        ? result.correctAnswer.join(", ")
                        : result.correctAnswer}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Points: </span>
                  <span>
                    {result.pointsEarned} / {result.points}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link
            href={`/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}`}
            className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
          >
            Retake Quiz
          </Link>
          <Link
            href={`/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}`}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 font-medium"
          >
            Back to Question Sets
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
