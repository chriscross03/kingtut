import React from "react";

interface QuestionFormProps {
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
  getQuestionSetsBySkill: (
    skillId: number
  ) => Array<{ id: number; number: number }>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  courses,
  getLearningAreasByCourse,
  getSkillsByLearningArea,
  getQuestionSetsBySkill,
}) => {
  const selectedCourseId = formData.courseId
    ? parseInt(formData.courseId)
    : null;
  const selectedLearningAreaId = formData.learningAreaId
    ? parseInt(formData.learningAreaId)
    : null;
  const selectedSkillId = formData.skillId ? parseInt(formData.skillId) : null;
  const filteredLearningAreas = selectedCourseId
    ? getLearningAreasByCourse(selectedCourseId)
    : [];
  const filteredSkills = selectedLearningAreaId
    ? getSkillsByLearningArea(selectedLearningAreaId)
    : [];
  const filteredQuestionSets = selectedSkillId
    ? getQuestionSetsBySkill(selectedSkillId)
    : [];
  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Add New Question</h3>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Course *</span>
        <select
          required
          value={formData.courseId || ""}
          onChange={(e) => {
            handleInputChange("courseId", e.target.value);
            handleInputChange("learningAreaId", "");
            handleInputChange("skillId", "");
            handleInputChange("questionSetId", "");
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
            handleInputChange("questionSetId", "");
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
          onChange={(e) => {
            handleInputChange("skillId", e.target.value);
            handleInputChange("questionSetId", "");
          }}
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
        <span>Question Set *</span>
        <select
          required
          disabled={!selectedSkillId}
          value={formData.questionSetId || ""}
          onChange={(e) => handleInputChange("questionSetId", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            opacity: selectedSkillId ? 1 : 0.6,
          }}
        >
          <option value="">
            {selectedSkillId ? "Select a question set" : "Select a skill first"}
          </option>
          {filteredQuestionSets.map((questionSet) => (
            <option key={questionSet.id} value={questionSet.id}>
              Set {questionSet.number}
            </option>
          ))}
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
        disabled={
          !formData.courseId ||
          !formData.learningAreaId ||
          !formData.skillId ||
          !formData.questionSetId ||
          !formData.questionText ||
          !formData.options ||
          !formData.correctAnswer
        }
        style={{
          padding: "10px 16px",
          background:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.questionSetId ||
            !formData.questionText ||
            !formData.options ||
            !formData.correctAnswer
              ? "#cbd5e1"
              : "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.questionSetId ||
            !formData.questionText ||
            !formData.options ||
            !formData.correctAnswer
              ? "not-allowed"
              : "pointer",
        }}
      >
        Create Question
      </button>
    </form>
  );
};

export default QuestionForm;
