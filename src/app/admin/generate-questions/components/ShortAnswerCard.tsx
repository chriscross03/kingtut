export default function ShortAnswerCard({ question }: any) {
  return (
    <div>
      {question.acceptableAnswers?.map((answer: any, i: number) => (
        <span
          key={i}
          className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm mr-2"
        >
          {answer}
        </span>
      ))}
    </div>
  );
}
