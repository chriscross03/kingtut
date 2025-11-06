import type { QuestionWithOptions } from "@/lib/score-calculator";

interface JumpToNavigationProps {
  questions: QuestionWithOptions[];
  currentQuestionIndex: number;
  answers: { questionId: number }[];
  onJumpTo: (index: number) => void;
}

export default function JumpToNavigation({
  questions,
  currentQuestionIndex,
  answers,
  onJumpTo,
}: JumpToNavigationProps) {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium mb-3">Jump to Question:</h3>
      <div className="grid grid-cols-10 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers.some((a) => a.questionId === q.id);
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.id}
              onClick={() => onJumpTo(idx)}
              className={`
                w-10 h-10 rounded-lg border-2 text-sm font-medium
                ${isCurrent ? "border-blue-600 bg-blue-600 text-white" : ""}
                ${
                  !isCurrent && isAnswered
                    ? "border-green-600 bg-green-100 text-green-800"
                    : ""
                }
                ${
                  !isCurrent && !isAnswered
                    ? "border-gray-300 bg-white hover:bg-gray-50"
                    : ""
                }
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
