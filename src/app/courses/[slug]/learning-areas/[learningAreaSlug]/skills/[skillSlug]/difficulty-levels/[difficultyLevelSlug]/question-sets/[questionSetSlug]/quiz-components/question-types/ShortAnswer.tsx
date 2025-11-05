import { QuestionWithOptions } from "@/lib/score-calculator";
import React from "react";

interface ShortAnswerQuestionProps {
  question: QuestionWithOptions;
  textAnswer: string;
  handleTextAnswer: (value: string) => void;
}

export default function ShortAnswerQuestion({
  question,
  textAnswer,
  handleTextAnswer,
}: ShortAnswerQuestionProps) {
  if (question.questionType !== "SHORT_ANSWER") return null;

  return (
    <div>
      <textarea
        value={textAnswer}
        onChange={(e) => handleTextAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none min-h-[120px] text-gray-800"
      />
      <p className="mt-2 text-sm text-gray-500">
        Your answer will be saved automatically as you type.
      </p>
    </div>
  );
}
