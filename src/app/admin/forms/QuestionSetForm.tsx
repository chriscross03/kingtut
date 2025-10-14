import React from "react";

interface QuestionSetFormProps {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  courses: Array<{ id: number; name: string }>;
  getLearningAreasByCourse: (
    courseId: number
  ) => Array<{ id: number; name: string }>;
  getSkillsByLearningArea: (
    learningAreaId: number
  ) => Array<{ id: number; name: string; difficultyLevel: { name: string } }>;
}

const QuestionSetForm: React.FC<QuestionSetFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  courses,
  getLearningAreasByCourse,
  getSkillsByLearningArea,
}) => {
  const selectedCourseId = formData.courseId
    ? parseInt(formData.courseId)
    : null;
  const selectedLearningAreaId = formData.learningAreaId
    ? parseInt(formData.learningAreaId)
    : null;
  const filteredLearningAreas = selectedCourseId
    ? getLearningAreasByCourse(selectedCourseId)
    : [];
  const filteredSkills = selectedLearningAreaId
    ? getSkillsByLearningArea(selectedLearningAreaId)
    : [];
  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Question Set</h3>
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
          {filteredLearningAreas.map((learningArea) => (
            <option key={learningArea.id} value={learningArea.id}>
              {learningArea.name}
            </option>
          ))}
        </select>
      </label>
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
          {filteredSkills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name} ({skill.difficultyLevel.name})
            </option>
          ))}
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
        disabled={
          !formData.courseId ||
          !formData.learningAreaId ||
          !formData.skillId ||
          !formData.number
        }
        style={{
          padding: "10px 16px",
          background:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.number
              ? "#cbd5e1"
              : "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.number
              ? "not-allowed"
              : "pointer",
        }}
      >
        Create Question Set
      </button>
    </form>
  );
};

export default QuestionSetForm;
