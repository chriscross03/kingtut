import { QuestionWithOptions } from "@/lib/score-calculator";
import React from "react";

interface TrueFalseQuestionProps {
  question: QuestionWithOptions;
  selectedOption: string | null;
  handleMultipleChoice: (value: string) => void;
}

export default function TrueFalseQuestion({
  question,
  selectedOption,
  handleMultipleChoice,
}: TrueFalseQuestionProps) {
  if (question.questionType !== "TRUE_FALSE") return null;

  return (
    <div className="space-y-3">
      {["true", "false"].map((value) => (
        <label
          key={value}
          className={`
            flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
            ${
              selectedOption === value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={value}
            checked={selectedOption === value}
            onChange={() => handleMultipleChoice(value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="ml-3 text-gray-800 capitalize">{value}</span>
        </label>
      ))}
    </div>
  );
}
