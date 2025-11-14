"use client";

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
          {question.questionType === "MULTIPLE_CHOICE" &&
            question.options &&
            question.options.map((opt: any, optIndex: number) => (
              <div key={optIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={opt.optionText}
                  onChange={(e) => {
                    const updated = [...question.options];
                    updated[optIndex] = {
                      ...updated[optIndex],
                      optionText: e.target.value,
                    };
                    update(index, { options: updated });
                  }}
                  className="flex-1 px-2 py-1 border rounded"
                />
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={opt.isCorrect}
                  onChange={() => {
                    const updated = question.options.map(
                      (x: any, i: number) => ({
                        ...x,
                        isCorrect: i === optIndex,
                      })
                    );
                    update(index, { options: updated });
                  }}
                />
              </div>
            ))}

          {question.questionType === "TRUE_FALSE" && question.options && (
            <select
              value={
                question.options.find((o: any) => o.isCorrect)?.optionText ??
                "True"
              }
              onChange={(e) => {
                const updated = question.options.map((opt: any) => ({
                  ...opt,
                  isCorrect: opt.optionText === e.target.value,
                }));
                update(index, { options: updated });
              }}
              className="px-3 py-1 border rounded"
            >
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}

          {question.questionType === "SHORT_ANSWER" &&
            question.acceptableAnswers && (
              <div>
                {question.acceptableAnswers.map((answer: any, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm mr-2"
                  >
                    {answer}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
