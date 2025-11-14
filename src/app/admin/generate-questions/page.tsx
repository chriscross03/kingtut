"use client";

import { useState } from "react";
import GenerationForm from "./components/GenerationForm";
import GeneratedQuestionsList from "./components/GeneratedQuestionsList";
import SaveSection from "./components/SaveSection";
import { useGenerateQuestions } from "./hooks/useGenerateQuestions";

export default function GenerateQuestionsPage() {
  const {
    questionSets,
    generatedQuestions,
    setGeneratedQuestions,
    isGenerating,
    isSaving,
    error,
    successMessage,
    generate,
    save,
  } = useGenerateQuestions();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [count, setCount] = useState(10);
  const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
  const [additionalContext, setAdditionalContext] = useState("");
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<number | null>(
    null
  );

  const toggle = (i: number) => {
    setGeneratedQuestions((prev: any) =>
      prev.map((q: any, idx: number) =>
        idx === i ? { ...q, selected: !q.selected } : q
      )
    );
  };

  const update = (i: number, changes: any) => {
    setGeneratedQuestions((prev: any) =>
      prev.map((q: any, idx: number) => (idx === i ? { ...q, ...changes } : q))
    );
  };

  const transformBeforeSave = () => {
    return generatedQuestions
      .filter((q: any) => q.selected)
      .map((q: any, i: number) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        points: 10,
        order: i,
        explanation: q.explanation,
        options:
          q.questionType === "SHORT_ANSWER"
            ? q.acceptableAnswers?.map((a: string) => ({
                optionText: a,
                isCorrect: true,
              }))
            : q.options,
      }));
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      {/* Form */}
      <GenerationForm
        topic={topic}
        setTopic={setTopic}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        count={count}
        setCount={setCount}
        questionType={questionType}
        setQuestionType={setQuestionType}
        additionalContext={additionalContext}
        setAdditionalContext={setAdditionalContext}
        onGenerate={() =>
          generate({
            topic,
            difficulty,
            count,
            questionType,
            additionalContext,
          })
        }
        isGenerating={isGenerating}
      />

      {/* Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-600 mb-4">{successMessage}</div>
      )}

      {/* Questions */}
      {generatedQuestions.length > 0 && (
        <>
          <GeneratedQuestionsList
            generatedQuestions={generatedQuestions}
            toggle={toggle}
            update={update}
            selectAll={() =>
              setGeneratedQuestions((prev: any) =>
                prev.map((q: any) => ({
                  ...q,
                  selected: !prev.every((p: any) => p.selected),
                }))
              )
            }
          />

          <SaveSection
            questionSets={questionSets}
            selectedQuestionSet={selectedQuestionSet}
            setSelectedQuestionSet={setSelectedQuestionSet}
            onSave={() => save(selectedQuestionSet!, transformBeforeSave())}
            isSaving={isSaving}
          />
        </>
      )}
    </div>
  );
}
