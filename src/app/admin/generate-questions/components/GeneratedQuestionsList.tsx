"use client";

import QuestionCard from "./QuestionCard";

export default function GeneratedQuestionsList({
  generatedQuestions,
  toggle,
  update,
  selectAll,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Review Questions (
          {generatedQuestions.filter((q: any) => q.selected).length} selected)
        </h2>
        <button onClick={selectAll} className="text-blue-600 text-sm">
          {generatedQuestions.every((q: any) => q.selected)
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="space-y-4">
        {generatedQuestions.map((q: any, index: number) => (
          <QuestionCard
            key={index}
            index={index}
            question={q}
            toggle={toggle}
            update={update}
          />
        ))}
      </div>
    </div>
  );
}
