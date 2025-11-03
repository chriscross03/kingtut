import React from "react";

interface SkillFormProps {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  courses: Array<{ id: number; name: string }>;
  getLearningAreasByCourse: (
    courseId: number
  ) => Array<{ id: number; name: string }>;
}

const SkillForm: React.FC<SkillFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  courses,
  getLearningAreasByCourse,
}) => {
  const selectedCourseId = formData.courseId
    ? parseInt(formData.courseId)
    : null;
  const filteredLearningAreas = selectedCourseId
    ? getLearningAreasByCourse(selectedCourseId)
    : [];

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Skill</h3>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Course *</span>
        <select
          required
          value={formData.courseId || ""}
          onChange={(e) => {
            handleInputChange("courseId", e.target.value);
            handleInputChange("learningAreaId", "");
          }}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Learning Area *</span>
        <select
          required
          disabled={!selectedCourseId}
          value={formData.learningAreaId || ""}
          onChange={(e) => handleInputChange("learningAreaId", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            opacity: selectedCourseId ? 1 : 0.6,
          }}
        >
          <option value="">
            {selectedCourseId
              ? "Select a learning area"
              : "Select a course first"}
          </option>
          {filteredLearningAreas.map((learningArea) => (
            <option key={learningArea.id} value={learningArea.id}>
              {learningArea.name}
            </option>
          ))}
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
        disabled={
          !formData.courseId || !formData.learningAreaId || !formData.name
        }
        style={{
          padding: "10px 16px",
          background:
            !formData.courseId || !formData.learningAreaId || !formData.name
              ? "#cbd5e1"
              : "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor:
            !formData.courseId || !formData.learningAreaId || !formData.name
              ? "not-allowed"
              : "pointer",
        }}
      >
        Create Skill
      </button>
    </form>
  );
};

export default SkillForm;
