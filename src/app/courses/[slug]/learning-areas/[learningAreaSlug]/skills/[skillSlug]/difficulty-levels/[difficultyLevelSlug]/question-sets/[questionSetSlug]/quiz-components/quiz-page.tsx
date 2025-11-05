"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/app/courses/components/PageLayout";
import QuizQuestion from "./QuizQuestion";
import QuizProgress from "./QuizProgress";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { Question } from "@/generated/prisma";
import type { QuestionSet } from "@/generated/prisma";
import { QuestionWithOptions } from "@/lib/score-calculator";

interface QuestionSetWithQuestions extends QuestionSet {
  questions: QuestionWithOptions[];
}

interface Answer {
  questionId: number;
  answer: string | string[]; // string for single, array for multiple choice
  timeSpent: number; // in seconds
}

export default function QuizPage({
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch question set
  const { data, loading, error } = useFetchResource<QuestionSetWithQuestions>(
    `/api/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}`
  );

  const questionSet = data[0];
  const questions: QuestionWithOptions[] =
    questionSet?.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      points: q.points,
      explanation: q.explanation || null,
      questionSetId: q.questionSetId,
      isActive: q.isActive,
      createdAt: new Date(q.createdAt),
      updatedAt: new Date(q.updatedAt),
      options: q.options?.map((o) => ({
        id: o.id,
        questionId: q.id,
        optionText: o.optionText,
        isCorrect: false, // hide correct answer from frontend
        createdAt: new Date(), // or some placeholder
        orderIndex: o.orderIndex,
      })),
    })) || [];

  const currentQuestion = questions[currentQuestionIndex];
  // Reset start time when question changes
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswer = (answer: string | string[]) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer,
      timeSpent,
    };

    // Update or add answer
    setAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.questionId === currentQuestion.id
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            questionSetId: questionSet.id,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Navigate to results page with submission ID
        router.push(
          `/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}/results?submissionId=${result.submissionId}`
        );
      } else {
        throw new Error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current answer for this question
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  )?.answer;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = currentAnswer !== undefined;

  if (loading) {
    return (
      <PageLayout title="Loading Quiz...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading questions...</div>
        </div>
      </PageLayout>
    );
  }

  if (error || !questionSet) {
    return (
      <PageLayout title="Error">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-600">
            Failed to load quiz. Please try again.
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={questionSet.title}
      subtitle={questionSet.description || ""}
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <QuizProgress
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          answeredCount={answers.length}
        />

        {/* Question */}
        <div className="mt-8">
          <QuizQuestion
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>

        {/* Question Navigation Grid */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Jump to Question:</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers.some((a) => a.questionId === q.id);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-10 h-10 rounded-lg border-2 text-sm font-medium
                    ${isCurrent ? "border-blue-600 bg-blue-600 text-white" : ""}
                    ${
                      !isCurrent && isAnswered
                        ? "border-green-600 bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      !isCurrent && !isAnswered
                        ? "border-gray-300 bg-white hover:bg-gray-50"
                        : ""
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
