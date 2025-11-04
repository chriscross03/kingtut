// lib/score-calculator.ts

import type { Question, QuestionOption } from "@/generated/prisma";

export interface QuestionWithOptions extends Question {
  options: QuestionOption[];
}

export interface AnswerResult {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}

/**
 * Check if a single answer is correct
 */
export function checkAnswer(
  question: QuestionWithOptions,
  userAnswer: string
): boolean {
  if (
    question.questionType === "MULTIPLE_CHOICE" ||
    question.questionType === "TRUE_FALSE"
  ) {
    // Find correct option
    const correctOption = question.options.find((opt) => opt.isCorrect);
    // Compare option ID
    return userAnswer === correctOption?.id.toString();
  } else if (question.questionType === "SHORT_ANSWER") {
    // Check against all correct options (case-insensitive)
    const correctOptions = question.options.filter((opt) => opt.isCorrect);
    return correctOptions.some(
      (opt) =>
        opt.optionText.toLowerCase().trim() === userAnswer.toLowerCase().trim()
    );
  }

  return false;
}

/**
 * Calculate score for a single question
 */
export function calculateQuestionScore(
  question: QuestionWithOptions,
  userAnswer: string,
  timeSpent: number = 0
): AnswerResult {
  const isCorrect = checkAnswer(question, userAnswer);
  const pointsEarned = isCorrect ? question.points : 0;

  return {
    questionId: question.id,
    userAnswer,
    isCorrect,
    pointsEarned,
    timeSpent,
  };
}

/**
 * Calculate total quiz score
 */
export interface QuizScore {
  totalPoints: number;
  pointsEarned: number;
  percentage: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
}

export function calculateQuizScore(
  answerResults: AnswerResult[],
  questions: QuestionWithOptions[],
  passingPercentage: number = 70
): QuizScore {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const pointsEarned = answerResults.reduce(
    (sum, a) => sum + a.pointsEarned,
    0
  );
  const percentage = totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0;
  const passed = percentage >= passingPercentage;
  const correctCount = answerResults.filter((a) => a.isCorrect).length;

  return {
    totalPoints,
    pointsEarned,
    percentage: Math.round(percentage * 100) / 100,
    passed,
    correctCount,
    totalQuestions: answerResults.length,
  };
}
