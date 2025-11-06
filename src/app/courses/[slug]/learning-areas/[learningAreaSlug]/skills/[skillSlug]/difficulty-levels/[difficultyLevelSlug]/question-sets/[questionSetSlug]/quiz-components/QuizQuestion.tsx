import { useState } from "react";
import {
  MultipleChoiceQuestion,
  ShortAnswerQuestion,
  TrueFalseQuestion,
} from "./question-types";
import { QuestionOption, QuestionType } from "@/generated/prisma";
import { QuestionWithOptions } from "@/lib/score-calculator";

interface QuizQuestionProps {
  question: QuestionWithOptions;
  answer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
  questionNumber: number;
}

export default function QuizQuestion({
  question,
  answer,
  onAnswer,
  questionNumber,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    typeof answer === "string" ? answer : ""
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(answer) ? answer : []
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    typeof answer === "string" ? answer : ""
  );

  const handleMultipleChoice = (optionId: string) => {
    setSelectedOption(optionId);
    onAnswer(optionId);
  };

  const handleMultipleSelect = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOptions(newSelection);
    onAnswer(newSelection);
  };

  const handleTextAnswer = (text: string) => {
    setTextAnswer(text);
    onAnswer(text);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Question {questionNumber}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {question.points} {question.points === 1 ? "point" : "points"}
          </span>
        </div>
        <p className="text-lg text-gray-800 leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {question.questionType === "MULTIPLE_CHOICE" && (
        <MultipleChoiceQuestion
          question={question}
          options={question.options ?? []}
          selectedOption={selectedOption}
          onSelect={handleMultipleChoice}
        />
      )}

      {question.questionType === "TRUE_FALSE" && (
        <TrueFalseQuestion
          question={question}
          selectedOption={selectedOption}
          handleMultipleChoice={handleMultipleChoice}
        />
      )}

      {question.questionType === "SHORT_ANSWER" && (
        <ShortAnswerQuestion
          question={question}
          textAnswer={textAnswer}
          handleTextAnswer={handleTextAnswer}
        />
      )}
    </div>
  );
}
