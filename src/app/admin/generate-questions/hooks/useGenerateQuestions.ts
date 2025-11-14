"use client";

import { useState, useEffect } from "react";

export function useGenerateQuestions() {
  const [questionSets, setQuestionSets] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSets = async () => {
    const res = await fetch("/api/admin/question-sets");
    const data = await res.json();
    setQuestionSets(data.questionSets || []);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const generate = async (payload: any) => {
    setIsGenerating(true);
    setError(null);

    const res = await fetch("/api/admin/generate-questions", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setGeneratedQuestions(
        data.questions.map((q: any) => ({
          ...q,
          questionType: payload.questionType,
          selected: true,
        }))
      );
      setSuccessMessage(`Generated ${data.count} questions.`);
    }

    setIsGenerating(false);
  };

  const save = async (questionSetId: number, transformedQuestions: any[]) => {
    setIsSaving(true);

    const res = await fetch("/api/admin/save-generated-questions", {
      method: "POST",
      body: JSON.stringify({
        questionSetId,
        questions: transformedQuestions,
      }),
    });

    const data = await res.json();

    if (!res.ok) setError(data.error);
    else setSuccessMessage(`Saved ${data.count} questions!`);

    setIsSaving(false);
  };

  return {
    questionSets,
    generatedQuestions,
    setGeneratedQuestions,
    isGenerating,
    isSaving,
    error,
    successMessage,
    generate,
    save,
  };
}
