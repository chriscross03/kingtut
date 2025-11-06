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
import { useFetchSingleResource } from "@/hooks/useFetchSingeResource";
import SubmitButton from "./question-nav-components/SubmitButton";
import PreviousButton from "./question-nav-components/PreviousButton";
import JumpToNavigation from "./question-nav-components/JumpNavigation";
import NextButton from "./question-nav-components/NextButton";
import { useSubmitQuestion } from "@/hooks/useSubmitQuestion";
import BackLink from "@/components/BackLink";

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
    quizAttemptId: string;
  };
}) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitQuestion } = useSubmitQuestion();

  // Fetch question set
  const {
    data: fetchedQuestionSet,
    loading,
    error,
  } = useFetchSingleResource<QuestionSetWithQuestions>(
    `/api/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}`
  );

  const questionSet = fetchedQuestionSet;

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading question set.</p>;
  if (!questionSet || !questionSet.questions) {
    return <p>No questions found for this set.</p>;
  }

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

  const handleSubmitQuestion = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const question = questions[currentQuestionIndex];

      // find the most recent answer object for this question
      const userAnswer = answers.find((a) => a.questionId === question.id);

      if (!userAnswer) {
        console.warn("No answer provided for current question.");
        setIsSubmitting(false);
        return;
      }

      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const result = await submitQuestion({
        questionSetId: questionSet.id,
        questionId: question.id,
        answer:
          typeof userAnswer.answer === "string"
            ? userAnswer.answer
            : userAnswer.answer.join(","),
        timeSpent,
        quizAttemptId: parseInt(params.quizAttemptId), // this is the next part we’ll address
        courseSlug: params.slug,
        learningAreaSlug: params.learningAreaSlug,
        skillSlug: params.skillSlug,
        difficultyLevelSlug: params.difficultyLevelSlug,
        questionSetSlug: params.questionSetSlug,
      });

      console.log("Question submitted:", result);

      // move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/courses/${params.slug}/learning-areas/${params.learningAreaSlug}/skills/${params.skillSlug}/difficulty-levels/${params.difficultyLevelSlug}/question-sets/${params.questionSetSlug}/submit-quiz`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            questionSetId: questionSet?.id,
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
      <BackLink href="/courses" label="back to courses" />

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

        <div className="mt-8 flex justify-between items-center">
          <PreviousButton
            onPrevious={handlePrevious}
            disabled={currentQuestionIndex === 0}
          />

          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {!isLastQuestion ? (
            <NextButton onNext={handleSubmitQuestion} disabled={!canProceed} />
          ) : (
            <SubmitButton
              onSubmit={handleSubmitQuiz}
              disabled={!canProceed || isSubmitting}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <JumpToNavigation
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onJumpTo={setCurrentQuestionIndex}
        />
      </div>
    </PageLayout>
  );
}
