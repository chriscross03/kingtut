export default function MultChoiceCard({ question, index, update }: any) {
  return (
    <>
      {question.options?.map((opt: any, optIndex: number) => (
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
              const updated = question.options.map((x: any, i: number) => ({
                ...x,
                isCorrect: i === optIndex,
              }));
              update(index, { options: updated });
            }}
          />
        </div>
      ))}
    </>
  );
}
