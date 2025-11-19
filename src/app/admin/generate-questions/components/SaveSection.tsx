"use client";

import { useMemo } from "react";

export default function SaveSection({
  questionSets,
  selectedQuestionSet,
  setSelectedQuestionSet,
  onSave,
  isSaving,
}: any) {
  // Sort question sets hierarchically
  const sortedQuestionSets = useMemo(() => {
    return [...questionSets].sort((a: any, b: any) => {
      const courseA = a.skill?.learningArea?.course?.name || "Uncategorized";
      const courseB = b.skill?.learningArea?.course?.name || "Uncategorized";
      if (courseA !== courseB) return courseA.localeCompare(courseB);

      const areaA = a.skill?.learningArea?.name || "Uncategorized";
      const areaB = b.skill?.learningArea?.name || "Uncategorized";
      if (areaA !== areaB) return areaA.localeCompare(areaB);

      const skillA = a.skill?.name || "Uncategorized";
      const skillB = b.skill?.name || "Uncategorized";
      if (skillA !== skillB) return skillA.localeCompare(skillB);

      return a.title.localeCompare(b.title);
    });
  }, [questionSets]);

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Save to Question Set</h3>

      <div className="flex gap-4">
        <select
          value={selectedQuestionSet || ""}
          onChange={(e) =>
            setSelectedQuestionSet(
              e.target.value ? parseInt(e.target.value) : null
            )
          }
          className="flex-1 px-3 py-2 border rounded-lg"
        >
          <option value="">Select a question set...</option>
          {sortedQuestionSets.map((qs: any) => {
            const course =
              qs.skill?.learningArea?.course?.name || "Uncategorized";
            const learningArea =
              qs.skill?.learningArea?.name || "Uncategorized";
            const skill = qs.skill?.name || "Uncategorized";
            const difficulty = qs.difficultyLevel?.name || "Unknown";

            return (
              <option key={qs.id} value={qs.id}>
                {course} → {learningArea} → {skill} → {difficulty} → {qs.title}
              </option>
            );
          })}
        </select>

        <button
          onClick={onSave}
          disabled={isSaving || !selectedQuestionSet}
          className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save Questions"}
        </button>
      </div>
    </div>
  );
}
