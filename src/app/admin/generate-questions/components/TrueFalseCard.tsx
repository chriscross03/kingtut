export default function TFCard({ question, index, update }: any) {
  const correctValue =
    question.options.find((o: any) => o.isCorrect)?.optionText ?? "True";

  return (
    <select
      value={correctValue}
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
  );
}
