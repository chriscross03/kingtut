"use client";

import { useState } from "react";

type ContentType =
  | "course"
  | "learningArea"
  | "skill"
  | "questionSet"
  | "question";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ContentType>("course");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;

      if (activeTab === "course") {
        response = await fetch("/api/admin/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // For other types, just log for now
        console.log(`Creating ${activeTab}:`, formData);
        alert(`${activeTab} created! (Backend integration coming next)`);
        setFormData({});
        return;
      }

      if (response.ok) {
        const result = await response.json();
        alert(`Course created successfully! ID: ${result.course.id}`);
        setFormData({});
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error occurred");
    }
  };

  const renderCourseForm = () => (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Course</h3>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Course Name *</span>
        <input
          type="text"
          required
          placeholder="e.g., SAT Math, SAT English"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Description</span>
        <textarea
          placeholder="Course description..."
          rows={3}
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            resize: "vertical",
          }}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange("isActive", e.target.checked)}
        />
        <span>Active (available to users)</span>
      </label>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Create Course
      </button>
    </form>
  );

  const renderLearningAreaForm = () => (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Learning Area</h3>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Course *</span>
        <select
          required
          value={formData.courseId || ""}
          onChange={(e) => handleInputChange("courseId", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select a course</option>
          <option value="1">SAT Math</option>
          <option value="2">SAT English</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Learning Area Name *</span>
        <input
          type="text"
          required
          placeholder="e.g., Algebra, Information and Ideas"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Description</span>
        <textarea
          placeholder="Learning area description..."
          rows={3}
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            resize: "vertical",
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Create Learning Area
      </button>
    </form>
  );

  const renderSkillForm = () => (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Skill</h3>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Learning Area *</span>
        <select
          required
          value={formData.learningAreaId || ""}
          onChange={(e) => handleInputChange("learningAreaId", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select a learning area</option>
          <option value="1">Algebra</option>
          <option value="2">Geometry</option>
          <option value="3">Information and Ideas</option>
          <option value="4">Craft and Structure</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Difficulty *</span>
        <select
          required
          value={formData.difficulty || ""}
          onChange={(e) => handleInputChange("difficulty", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Hard">Hard</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Skill Name *</span>
        <input
          type="text"
          required
          placeholder="e.g., Radicals, Polynomials, Main Idea"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Description</span>
        <textarea
          placeholder="Skill description..."
          rows={3}
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            resize: "vertical",
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Create Skill
      </button>
    </form>
  );

  const renderQuestionSetForm = () => (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Question Set</h3>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Skill *</span>
        <select
          required
          value={formData.skillId || ""}
          onChange={(e) => handleInputChange("skillId", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select a skill</option>
          <option value="1">Radicals</option>
          <option value="2">Polynomials</option>
          <option value="3">Main Idea</option>
          <option value="4">Supporting Evidence</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Question Set Number (1-5) *</span>
        <select
          required
          value={formData.number || ""}
          onChange={(e) => handleInputChange("number", Number(e.target.value))}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select set number</option>
          <option value="1">Set 1</option>
          <option value="2">Set 2</option>
          <option value="3">Set 3</option>
          <option value="4">Set 4</option>
          <option value="5">Set 5</option>
        </select>
      </label>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Create Question Set
      </button>
    </form>
  );

  const renderQuestionForm = () => (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Question</h3>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Question Set *</span>
        <select
          required
          value={formData.questionSetId || ""}
          onChange={(e) => handleInputChange("questionSetId", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select a question set</option>
          <option value="1">Radicals - Set 1</option>
          <option value="2">Radicals - Set 2</option>
          <option value="3">Polynomials - Set 1</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Question Text *</span>
        <textarea
          required
          placeholder="Enter the question..."
          rows={4}
          value={formData.questionText || ""}
          onChange={(e) => handleInputChange("questionText", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            resize: "vertical",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Answer Options (JSON format) *</span>
        <textarea
          required
          placeholder='["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"]'
          rows={3}
          value={formData.options || ""}
          onChange={(e) => handleInputChange("options", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            resize: "vertical",
            fontFamily: "monospace",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Correct Answer *</span>
        <input
          type="text"
          required
          placeholder="e.g., A, B, C, or D"
          value={formData.correctAnswer || ""}
          onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Explanation</span>
        <textarea
          placeholder="Explanation of the correct answer..."
          rows={3}
          value={formData.explanation || ""}
          onChange={(e) => handleInputChange("explanation", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            resize: "vertical",
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Create Question
      </button>
    </form>
  );

  const tabs = [
    { id: "course", label: "Course", icon: "📚" },
    { id: "learningArea", label: "Learning Area", icon: "🎯" },
    { id: "skill", label: "Skill", icon: "🔧" },
    { id: "questionSet", label: "Question Set", icon: "📝" },
    { id: "question", label: "Question", icon: "❓" },
  ] as const;

  const renderForm = () => {
    switch (activeTab) {
      case "course":
        return renderCourseForm();
      case "learningArea":
        return renderLearningAreaForm();
      case "skill":
        return renderSkillForm();
      case "questionSet":
        return renderQuestionSetForm();
      case "question":
        return renderQuestionForm();
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Content Management
      </h1>

      <p style={{ color: "#6b7280", marginBottom: 32 }}>
        Manage your SAT prep content hierarchy from courses down to individual
        questions.
      </p>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 32,
          borderBottom: "1px solid #e5e7eb",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setFormData({});
            }}
            style={{
              padding: "12px 16px",
              border: "none",
              background: activeTab === tab.id ? "#111827" : "transparent",
              color: activeTab === tab.id ? "white" : "#6b7280",
              cursor: "pointer",
              borderRadius: "6px 6px 0 0",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div
        style={{
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          background: "#fafafa",
        }}
      >
        {renderForm()}
      </div>

      {/* Hierarchy Info */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: "#f3f4f6",
          borderRadius: 8,
          fontSize: 14,
          color: "#374151",
        }}
      >
        <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Content Hierarchy:</h4>
        <div style={{ display: "grid", gap: 4 }}>
          <div>
            📚 <strong>Course</strong> → 🎯 <strong>Learning Area</strong> → 🔧{" "}
            <strong>Skill</strong> → 📝 <strong>Question Set</strong> → ❓{" "}
            <strong>Question</strong>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
            Create content in order from top to bottom. Each level depends on
            the previous one.
          </div>
        </div>
      </div>
    </div>
  );
}
