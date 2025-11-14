"use client";

export default function SaveSection({
  questionSets,
  selectedQuestionSet,
  setSelectedQuestionSet,
  onSave,
  isSaving,
}: any) {
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
          {questionSets.map((qs: any) => (
            <option key={qs.id} value={qs.id}>
              {qs.title} ({qs.difficultyLevel.name})
            </option>
          ))}
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
