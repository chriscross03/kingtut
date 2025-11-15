"use client";
import MultChoiceCard from "./MultChoiceCard";
import ShortAnswerCard from "./ShortAnswerCard";
import TFCard from "./TrueFalseCard";

export default function QuestionCard({ question, index, toggle, update }: any) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        question.selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={question.selected}
          onChange={() => toggle(index)}
          className="mt-1 h-5 w-5"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Question {index + 1}</span>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
              {question.questionType.replace("_", " ")}
            </span>
          </div>

          {/* Question Text */}
          <textarea
            value={question.questionText}
            onChange={(e) => update(index, { questionText: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg mb-3"
            rows={2}
          />

          {/* Render MCQ, TF, Short Answer */}
          <textarea
            value={question.questionText}
            onChange={(e) => update(index, { questionText: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg mb-3"
            rows={2}
          />

          {/* Render MCQ, TF, Short Answer */}
          {question.questionType === "MULTIPLE_CHOICE" && (
            <MultChoiceCard question={question} index={index} update={update} />
          )}

          {question.questionType === "TRUE_FALSE" && (
            <TFCard question={question} index={index} update={update} />
          )}

          {question.questionType === "SHORT_ANSWER" && (
            <ShortAnswerCard question={question} />
          )}
        </div>
      </div>
    </div>
  );
}
