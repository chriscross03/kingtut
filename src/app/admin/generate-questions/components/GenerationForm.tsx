"use client";
import { useState } from "react";

export default function GenerationForm({
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  count,
  setCount,
  questionType,
  setQuestionType,
  additionalContext,
  setAdditionalContext,
  onGenerate,
  isGenerating,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Generation Settings</h2>

      {/* Topic + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Topic *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Question Type *
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty *</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium mb-2">Number *</label>
          <input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Additional Context */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Additional Context
        </label>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      {/* Submit */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        {isGenerating ? "Generating..." : "Generate Questions"}
      </button>
    </div>
  );
}
