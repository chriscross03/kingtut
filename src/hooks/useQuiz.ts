// hooks/useQuiz.ts
import { useState, useEffect } from "react";
import type { QuestionWithOptions } from "@/lib/score-calculator";

interface Answer {
  questionId: number;
  answer: string | string[];
  timeSpent: number;
}

export function useQuiz(questions: QuestionWithOptions[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];

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

  const handleNext = () =>
    currentQuestionIndex < questions.length - 1 &&
    setCurrentQuestionIndex((prev) => prev + 1);
  const handlePrevious = () =>
    currentQuestionIndex > 0 && setCurrentQuestionIndex((prev) => prev - 1);

  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  )?.answer;

  return {
    currentQuestionIndex,
    currentQuestion,
    answers,
    currentAnswer,
    handleAnswer,
    handleNext,
    handlePrevious,
    setCurrentQuestionIndex,
  };
}
