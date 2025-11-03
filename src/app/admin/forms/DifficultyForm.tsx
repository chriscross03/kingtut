import React from "react";

interface Course {
  id: number;
  name: string;
}

interface LearningArea {
  id: number;
  name: string;
  courseId: number;
}

interface Skill {
  id: number;
  name: string;
  learningAreaId: number;
}

interface DifficultyLevelFormProps {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  courses: Course[];
  getLearningAreasByCourse: (courseId: number) => LearningArea[];
  getSkillsByLearningArea: (learningAreaId: number) => Skill[];
}

export default function DifficultyLevelForm({
  formData,
  handleInputChange,
  handleSubmit,
  courses,
  getLearningAreasByCourse,
  getSkillsByLearningArea,
}: DifficultyLevelFormProps) {
  const selectedCourseId = formData.courseId
    ? parseInt(formData.courseId)
    : null;
  const selectedLearningAreaId = formData.learningAreaId
    ? parseInt(formData.learningAreaId)
    : null;

  const learningAreas = selectedCourseId
    ? getLearningAreasByCourse(selectedCourseId)
    : [];
  const skills = selectedLearningAreaId
    ? getSkillsByLearningArea(selectedLearningAreaId)
    : [];

  const orderNames: Record<number, string> = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>
        Add New Difficulty Level
      </h3>

      {/* Course Selection */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Course *</span>
        <select
          required
          value={formData.courseId || ""}
          onChange={(e) => {
            handleInputChange("courseId", e.target.value);
            handleInputChange("learningAreaId", "");
            handleInputChange("skillId", "");
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

      {/* Learning Area Selection */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Learning Area *</span>
        <select
          required
          disabled={!selectedCourseId}
          value={formData.learningAreaId || ""}
          onChange={(e) => {
            handleInputChange("learningAreaId", e.target.value);
            handleInputChange("skillId", "");
          }}
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
          {learningAreas.map((la) => (
            <option key={la.id} value={la.id}>
              {la.name}
            </option>
          ))}
        </select>
      </label>

      {/* Skill Selection */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Skill *</span>
        <select
          required
          disabled={!selectedLearningAreaId}
          value={formData.skillId || ""}
          onChange={(e) => handleInputChange("skillId", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            opacity: selectedLearningAreaId ? 1 : 0.6,
          }}
        >
          <option value="">
            {selectedLearningAreaId
              ? "Select a skill"
              : "Select a learning area first"}
          </option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </label>

      {/* Order Selection */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Order *</span>
        <select
          required
          value={formData.order || ""}
          onChange={(e) => {
            const orderValue = parseInt(e.target.value);

            // always keep order and level in sync
            handleInputChange("order", orderValue);
            handleInputChange("level", orderValue);

            // map order → difficulty name
            const orderNames: Record<number, string> = {
              1: "Beginner",
              2: "Intermediate",
              3: "Advanced",
            };

            if (orderNames[orderValue]) {
              handleInputChange("name", orderNames[orderValue]);
            } else {
              handleInputChange("name", "");
            }
          }}
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        >
          <option value="">Select difficulty order</option>
          <option value="1">1 – Beginner</option>
          <option value="2">2 – Intermediate</option>
          <option value="3">3 – Advanced</option>
        </select>

        <span style={{ fontSize: 12, color: "#6b7280" }}>
          The order determines the difficulty level number and name
          automatically.
        </span>
      </label>

      {/* Auto-filled Difficulty Name */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Difficulty Name</span>
        <input
          type="text"
          value={formData.name || ""}
          readOnly
          placeholder="Will auto-fill based on order selection"
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            backgroundColor: "#f9fafb",
            color: "#6b7280",
          }}
        />
      </label>

      {/* Description */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Description (Optional)</span>
        <textarea
          rows={3}
          placeholder="e.g., Basic factoring with simple expressions"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          !formData.courseId ||
          !formData.learningAreaId ||
          !formData.skillId ||
          !formData.order
        }
        style={{
          padding: "10px 16px",
          background:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.order
              ? "#cbd5e1"
              : "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.order
              ? "not-allowed"
              : "pointer",
        }}
      >
        Create Difficulty Level
      </button>
    </form>
  );
}
