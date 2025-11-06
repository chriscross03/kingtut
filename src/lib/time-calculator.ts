// lib/time-calculator.ts

import type { AnswerResult } from "./score-calculator";

export interface TimeStats {
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  fastestQuestion: number;
  slowestQuestion: number;
}

export function calculateTimeStats(answerResults: AnswerResult[]): TimeStats {
  const times = answerResults.map((a) => a.timeSpent).filter((t) => t > 0);

  if (times.length === 0) {
    return {
      totalTimeSpent: 0,
      averageTimePerQuestion: 0,
      fastestQuestion: 0,
      slowestQuestion: 0,
    };
  }

  const totalTimeSpent = times.reduce((sum, t) => sum + t, 0);
  const averageTimePerQuestion = Math.round(totalTimeSpent / times.length);
  const fastestQuestion = Math.min(...times);
  const slowestQuestion = Math.max(...times);

  return {
    totalTimeSpent,
    averageTimePerQuestion,
    fastestQuestion,
    slowestQuestion,
  };
}
