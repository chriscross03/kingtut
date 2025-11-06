interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredCount,
}: QuizProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const completionPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-600">
            {currentQuestion} of {totalQuestions} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Completion Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-700">
            {answeredCount} answered ({Math.round(completionPercentage)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-gray-700">
            {totalQuestions - answeredCount} remaining
          </span>
        </div>
      </div>
    </div>
  );
}
