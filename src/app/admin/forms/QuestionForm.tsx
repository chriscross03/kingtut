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
  ) => Array<{ id: number; name: string }>;
  getDifficultyLevelsBySkill: (
    skillId: number
  ) => Array<{ id: number; name: string; level: number }>;
  getQuestionSetsByDifficultyLevel: (
    difficultyLevelId: number
  ) => Array<{ id: number; number: number }>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  courses,
  getLearningAreasByCourse,
  getSkillsByLearningArea,
  getDifficultyLevelsBySkill,
  getQuestionSetsByDifficultyLevel,
}) => {
  const selectedCourseId = formData.courseId
    ? parseInt(formData.courseId)
    : null;
  const selectedLearningAreaId = formData.learningAreaId
    ? parseInt(formData.learningAreaId)
    : null;
  const selectedSkillId = formData.skillId ? parseInt(formData.skillId) : null;
  const selectedDifficultyLevelId = formData.difficultyLevelId
    ? parseInt(formData.difficultyLevelId)
    : null;

  const filteredLearningAreas = selectedCourseId
    ? getLearningAreasByCourse(selectedCourseId)
    : [];
  const filteredSkills = selectedLearningAreaId
    ? getSkillsByLearningArea(selectedLearningAreaId)
    : [];
  const filteredDifficultyLevels = selectedSkillId
    ? getDifficultyLevelsBySkill(selectedSkillId)
    : [];
  const filteredQuestionSets = selectedDifficultyLevelId
    ? getQuestionSetsByDifficultyLevel(selectedDifficultyLevelId)
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
            handleInputChange("difficultyLevelId", "");
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
            handleInputChange("difficultyLevelId", "");
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
            handleInputChange("difficultyLevelId", "");
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
              {skill.name}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Difficulty Level *</span>
        <select
          required
          disabled={!selectedSkillId}
          value={formData.difficultyLevelId || ""}
          onChange={(e) => {
            handleInputChange("difficultyLevelId", e.target.value);
            handleInputChange("questionSetId", "");
          }}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            opacity: selectedSkillId ? 1 : 0.6,
          }}
        >
          <option value="">
            {selectedSkillId
              ? "Select a difficulty level"
              : "Select a skill first"}
          </option>
          {filteredDifficultyLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Question Set *</span>
        <select
          required
          disabled={!selectedDifficultyLevelId}
          value={formData.questionSetId || ""}
          onChange={(e) => handleInputChange("questionSetId", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            opacity: selectedDifficultyLevelId ? 1 : 0.6,
          }}
        >
          <option value="">
            {selectedDifficultyLevelId
              ? "Select a question set"
              : "Select a difficulty level first"}
          </option>
          {filteredQuestionSets.map((questionSet) => (
            <option key={questionSet.id} value={questionSet.id}>
              Set {questionSet.number}
            </option>
          ))}
        </select>
      </label>

      {/* Question Type */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Question Type *</span>
        <select
          required
          value={formData.questionType || "MULTIPLE_CHOICE"}
          onChange={(e) => handleInputChange("questionType", e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 6,
          }}
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="SHORT_ANSWER">Short Answer</option>
        </select>
      </label>

      {/* Points */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Points *</span>
        <input
          type="number"
          required
          min={1}
          value={formData.points || 1}
          onChange={(e) =>
            handleInputChange("points", parseInt(e.target.value) || 1)
          }
          style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}
        />
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

      {/* Answer Options */}
      <div style={{ display: "grid", gap: 6 }}>
        <span>Answer Options *</span>
        <div style={{ display: "grid", gap: 8 }}>
          {(
            formData.options || [
              { optionText: "", isCorrect: false, orderIndex: 0 },
              { optionText: "", isCorrect: false, orderIndex: 1 },
              { optionText: "", isCorrect: false, orderIndex: 2 },
              { optionText: "", isCorrect: false, orderIndex: 3 },
            ]
          ).map((option: any, index: number) => (
            <div
              key={index}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                type={
                  formData.questionType === "MULTIPLE_CHOICE"
                    ? "radio"
                    : "checkbox"
                }
                name="correctAnswer"
                checked={option.isCorrect}
                onChange={(e) => {
                  const newOptions = [...(formData.options || [])];
                  if (
                    formData.questionType === "MULTIPLE_CHOICE" ||
                    formData.questionType === "TRUE_FALSE"
                  ) {
                    // Single selection: uncheck all others
                    newOptions.forEach((opt: any, i: number) => {
                      opt.isCorrect = i === index;
                    });
                  } else {
                    newOptions[index].isCorrect = e.target.checked;
                  }
                  handleInputChange("options", newOptions);
                }}
                style={{ width: 16, height: 16 }}
              />
              <input
                type="text"
                required
                placeholder={`Option ${index + 1}`}
                value={option.optionText}
                onChange={(e) => {
                  const newOptions = [...(formData.options || [])];
                  newOptions[index].optionText = e.target.value;
                  handleInputChange("options", newOptions);
                }}
                style={{
                  flex: 1,
                  padding: 8,
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                }}
              />
              {formData.questionType === "MULTIPLE_CHOICE" &&
                (formData.options || []).length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = (formData.options || []).filter(
                        (_: any, i: number) => i !== index
                      );
                      newOptions.forEach((opt: any, i: number) => {
                        opt.orderIndex = i;
                      });
                      handleInputChange("options", newOptions);
                    }}
                    style={{
                      padding: "8px 12px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
            </div>
          ))}
        </div>
        {formData.questionType === "MULTIPLE_CHOICE" && (
          <button
            type="button"
            onClick={() => {
              const newOptions = [
                ...(formData.options || []),
                {
                  optionText: "",
                  isCorrect: false,
                  orderIndex: (formData.options || []).length,
                },
              ];
              handleInputChange("options", newOptions);
            }}
            style={{
              padding: "8px 12px",
              background: "#e5e7eb",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            + Add Option
          </button>
        )}
        <p style={{ fontSize: 12, color: "#6b7280" }}>
          {formData.questionType === "MULTIPLE_CHOICE" ||
          formData.questionType === "TRUE_FALSE"
            ? "Select the correct answer"
            : "Check all acceptable answers"}
        </p>
      </div>

      {/* Answer Explaination */}
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

      {/* Submit button */}
      <button
        type="submit"
        disabled={
          !formData.courseId ||
          !formData.learningAreaId ||
          !formData.skillId ||
          !formData.difficultyLevelId ||
          !formData.questionSetId ||
          !formData.questionText ||
          !formData.options ||
          (formData.options || []).length === 0 ||
          (formData.options || []).some((opt: any) => !opt.optionText) ||
          !(formData.options || []).some((opt: any) => opt.isCorrect)
        }
        style={{
          padding: "10px 16px",
          background:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.difficultyLevelId ||
            !formData.questionSetId ||
            !formData.questionText ||
            !formData.options ||
            (formData.options || []).length === 0 ||
            (formData.options || []).some((opt: any) => !opt.optionText) ||
            !(formData.options || []).some((opt: any) => opt.isCorrect)
              ? "#cbd5e1"
              : "#111827",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor:
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.skillId ||
            !formData.difficultyLevelId ||
            !formData.questionSetId ||
            !formData.questionText ||
            !formData.options ||
            (formData.options || []).length === 0 ||
            (formData.options || []).some((opt: any) => !opt.optionText) ||
            !(formData.options || []).some((opt: any) => opt.isCorrect)
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
