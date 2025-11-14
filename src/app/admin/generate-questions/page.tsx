"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QuestionType } from "@/generated/prisma";

interface QuestionSet {
  id: number;
  title: string;
  slug: string;
  difficultyLevel: {
    id: number;
    name: string;
  };
}

interface GeneratedQuestion {
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  options?: Array<{
    optionText: string;
    isCorrect: boolean;
  }>;
  acceptableAnswers?: string[];
  explanation?: string;
  selected?: boolean;
}

export default function GenerateQuestionsPage() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<number | null>(
    null
  );
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [count, setCount] = useState(10);
  const [questionType, setQuestionType] = useState<
    "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER"
  >("MULTIPLE_CHOICE");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Fetch question sets on mount
  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const fetchQuestionSets = async () => {
    try {
      const response = await fetch("/api/admin/question-sets");
      if (response.ok) {
        const data = await response.json();
        setQuestionSets(data.questionSets || []);
      }
    } catch (err) {
      console.error("Failed to fetch question sets:", err);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/admin/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          count,
          questionType,
          additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      // Mark all questions as selected by default AND add questionType
      const questionsWithSelection = data.questions.map((q: any) => ({
        ...q,
        questionType: questionType, // Add the selected questionType from the form
        selected: true,
      }));

      setGeneratedQuestions(questionsWithSelection);
      setSuccessMessage(
        `Successfully generated ${data.count} questions! Review and edit them below.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate questions"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (!selectedQuestionSet) {
      setError("Please select a question set");
      return;
    }

    const selectedQuestions = generatedQuestions.filter((q) => q.selected);

    if (selectedQuestions.length === 0) {
      setError("Please select at least one question to save");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Transform questions to match the API format
      // Transform questions to match the API format
      const questionsToSave = selectedQuestions.map((q, index) => {
        const baseQuestion = {
          questionText: q.questionText,
          questionType: q.questionType,
          points: 10, // Default points
          order: index,
          explanation: q.explanation,
        };

        if (q.questionType === "MULTIPLE_CHOICE" && q.options) {
          return {
            ...baseQuestion,
            options: q.options.map((opt) => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
            })),
          };
        } else if (q.questionType === "TRUE_FALSE" && q.options) {
          return {
            ...baseQuestion,
            options: q.options.map((opt) => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
            })),
          };
        } else if (q.questionType === "SHORT_ANSWER" && q.acceptableAnswers) {
          return {
            ...baseQuestion,
            options: q.acceptableAnswers.map((answer) => ({
              optionText: answer,
              isCorrect: true,
            })),
          };
        }

        return baseQuestion;
      });

      const response = await fetch("/api/admin/save-generated-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSetId: selectedQuestionSet,
          questions: questionsToSave,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save questions");
      }

      setSuccessMessage(
        `Successfully saved ${data.count} questions to the question set!`
      );
      setGeneratedQuestions([]);
      setTopic("");
      setAdditionalContext("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save questions");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleQuestionSelection = (index: number) => {
    setGeneratedQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected: !q.selected } : q))
    );
  };

  const updateQuestion = (
    index: number,
    updates: Partial<GeneratedQuestion>
  ) => {
    setGeneratedQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Generate Questions with AI</h1>
        <Link
          href="/admin"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Admin
        </Link>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Generation Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Topic *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Python Loops, Algebra, World War II"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Question Type *
            </label>
            <select
              value={questionType}
              onChange={(e) =>
                setQuestionType(
                  e.target.value as
                    | "MULTIPLE_CHOICE"
                    | "TRUE_FALSE"
                    | "SHORT_ANSWER"
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty Level *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Questions (1-50) *
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Add any specific requirements, focus areas, or constraints..."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Questions...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Generate Questions
            </>
          )}
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {/* Generated Questions Review */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Review Generated Questions (
              {generatedQuestions.filter((q) => q.selected).length} selected)
            </h2>
            <button
              onClick={() =>
                setGeneratedQuestions((prev) =>
                  prev.map((q) => ({
                    ...q,
                    selected: !prev.every((q) => q.selected),
                  }))
                )
              }
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {generatedQuestions.every((q) => q.selected)
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {generatedQuestions.map((question, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  question.selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={question.selected}
                    onChange={() => toggleQuestionSelection(index)}
                    className="mt-1 h-5 w-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                        {question.questionType.replace("_", " ")}
                      </span>
                    </div>

                    <textarea
                      value={question.questionText}
                      onChange={(e) =>
                        updateQuestion(index, { questionText: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />

                    {question.questionType === "MULTIPLE_CHOICE" &&
                      question.options && (
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-2 px-3 py-2 rounded ${
                                option.isCorrect ? "bg-green-100" : "bg-gray-50"
                              }`}
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <input
                                type="text"
                                value={option.optionText}
                                onChange={(e) => {
                                  const newOptions = [...question.options!];
                                  newOptions[optIndex] = {
                                    ...newOptions[optIndex],
                                    optionText: e.target.value,
                                  };
                                  updateQuestion(index, {
                                    options: newOptions,
                                  });
                                }}
                                className="flex-1 px-2 py-1 border rounded"
                              />
                              <input
                                type="radio"
                                name={`correct-answer-${index}`}
                                checked={option.isCorrect}
                                onChange={() => {
                                  const newOptions = question.options!.map(
                                    (opt, i) => ({
                                      ...opt,
                                      isCorrect: i === optIndex,
                                    })
                                  );
                                  updateQuestion(index, {
                                    options: newOptions,
                                  });
                                }}
                                className="h-4 w-4 text-green-600"
                              />
                              {option.isCorrect && (
                                <span className="text-green-600 text-sm font-medium">
                                  ✓ Correct
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {question.questionType === "TRUE_FALSE" &&
                      question.options && (
                        <div className="mb-3">
                          <span className="text-sm font-medium">
                            Correct Answer:{" "}
                          </span>
                          <select
                            value={
                              question.options.find((opt) => opt.isCorrect)
                                ?.optionText || "True"
                            }
                            onChange={(e) => {
                              const newOptions = question.options!.map(
                                (opt) => ({
                                  ...opt,
                                  isCorrect: opt.optionText === e.target.value,
                                })
                              );
                              updateQuestion(index, { options: newOptions });
                            }}
                            className="px-3 py-1 border rounded"
                          >
                            <option value="True">True</option>
                            <option value="False">False</option>
                          </select>
                        </div>
                      )}

                    {question.questionType === "SHORT_ANSWER" &&
                      question.acceptableAnswers && (
                        <div className="mb-3">
                          <span className="text-sm font-medium">
                            Acceptable Answers:{" "}
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {question.acceptableAnswers.map(
                              (answer, ansIndex) => (
                                <span
                                  key={ansIndex}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                                >
                                  {answer}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {question.explanation && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Explanation: </span>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Save to Question Set</h3>
            <div className="flex gap-4">
              <select
                value={selectedQuestionSet || ""}
                onChange={(e) =>
                  setSelectedQuestionSet(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a question set...</option>
                {questionSets.map((qs) => (
                  <option key={qs.id} value={qs.id}>
                    {qs.title} ({qs.difficultyLevel.name})
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveQuestions}
                disabled={isSaving || !selectedQuestionSet}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
              >
                {isSaving ? "Saving..." : "Save Selected Questions"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
