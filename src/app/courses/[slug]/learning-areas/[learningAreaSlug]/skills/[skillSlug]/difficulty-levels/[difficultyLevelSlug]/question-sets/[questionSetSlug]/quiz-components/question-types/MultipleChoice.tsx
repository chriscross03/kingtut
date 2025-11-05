import React from "react";
import type { Question } from "@/generated/prisma";
import { QuestionWithOptions } from "@/lib/score-calculator";
import { QuestionOption } from "@/generated/prisma";

interface MultipleChoiceQuestionProps {
  question: QuestionWithOptions;
  options: QuestionOption[];
  selectedOption: string;
  onSelect: (optionId: string) => void;
}

export default function MultipleChoiceQuestion({
  question,
  options,
  selectedOption,
  onSelect,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.id}
          className={`
            flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
            ${
              selectedOption === String(option.id)
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option.id}
            checked={selectedOption === String(option.id)}
            onChange={() => onSelect(String(option.id))}
            className="w-4 h-4 text-blue-600"
          />
          <span className="ml-3 text-gray-800">{option.optionText}</span>
        </label>
      ))}
    </div>
  );
}
