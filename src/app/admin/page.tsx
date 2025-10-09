"use client";

import { useState, useEffect } from "react";

type ContentType =
  | "course"
  | "learningArea"
  | "skill"
  | "questionSet"
  | "question";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ContentType>("course");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [courses, setCourses] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [learningAreas, setLearningAreas] = useState<
    Array<{
      id: number;
      name: string;
      courseId: number;
      course: { name: string };
    }>
  >([]);
  const [skills, setSkills] = useState<
    Array<{
      id: number;
      name: string;
      difficultyLevelId: number;
      difficultyLevel: {
        name: string;
        learningAreaId: number;
        learningArea: {
          name: string;
          courseId: number;
          course: { name: string };
        };
      };
    }>
  >([]);
  const [questionSets, setQuestionSets] = useState<
    Array<{
      id: number;
      number: number;
      skillId: number;
      skill: {
        name: string;
        difficultyLevel: {
          name: string;
          learningArea: {
            name: string;
            course: { name: string };
          };
        };
      };
    }>
  >([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to get learning areas for a specific course
  const getLearningAreasByCourse = (courseId: number) => {
    return learningAreas.filter((la) => la.courseId === courseId);
  };

  // Helper function to get skills for a specific learning area
  const getSkillsByLearningArea = (learningAreaId: number) => {
    return skills.filter(
      (skill) => skill.difficultyLevel.learningAreaId === learningAreaId
    );
  };

  // Helper function to get question sets for a specific skill
  const getQuestionSetsBySkill = (skillId: number) => {
    return questionSets.filter((qs) => qs.skillId === skillId);
  };

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/admin/courses");
        if (response.ok) {
          const data = await response.json();
          // Sort courses alphabetically by name
          const sortedCourses = data.courses.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
          setCourses(sortedCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchLearningAreas = async () => {
      try {
        const response = await fetch("/api/admin/learning-areas");
        if (response.ok) {
          const data = await response.json();
          const sortedLearningAreas = data.learningAreas.sort(
            (a: any, b: any) => a.name.localeCompare(b.name)
          );
          setLearningAreas(sortedLearningAreas);
        }
      } catch (error) {
        console.error("Error fetching learning areas:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/admin/skills");
        if (response.ok) {
          const data = await response.json();
          const sortedSkills = data.skills.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
          setSkills(sortedSkills);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    const fetchQuestionSets = async () => {
      try {
        const response = await fetch("/api/admin/question-sets");
        if (response.ok) {
          const data = await response.json();
          const sortedQuestionSets = data.questionSets.sort(
            (a: any, b: any) => a.number - b.number
          );
          setQuestionSets(sortedQuestionSets);
        }
      } catch (error) {
        console.error("Error fetching question sets:", error);
      }
    };

    fetchCourses();
    fetchLearningAreas();
    fetchSkills();
    fetchQuestionSets();
  }, []);

  // Refresh courses after successful course creation
  const refreshCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses");
      if (response.ok) {
        const data = await response.json();
        const sortedCourses = data.courses.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setCourses(sortedCourses);
      }
    } catch (error) {
      console.error("Error refreshing courses:", error);
    }
  };

  // Refresh learning areas after successful learning area creation
  const refreshLearningAreas = async () => {
    try {
      const response = await fetch("/api/admin/learning-areas");
      if (response.ok) {
        const data = await response.json();
        const sortedLearningAreas = data.learningAreas.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setLearningAreas(sortedLearningAreas);
      }
    } catch (error) {
      console.error("Error refreshing learning areas:", error);
    }
  };

  // Refresh skills after successful skill creation
  const refreshSkills = async () => {
    try {
      const response = await fetch("/api/admin/skills");
      if (response.ok) {
        const data = await response.json();
        const sortedSkills = data.skills.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setSkills(sortedSkills);
      }
    } catch (error) {
      console.error("Error refreshing skills:", error);
    }
  };

  // Refresh question sets after successful question set creation
  const refreshQuestionSets = async () => {
    try {
      const response = await fetch("/api/admin/question-sets");
      if (response.ok) {
        const data = await response.json();
        const sortedQuestionSets = data.questionSets.sort(
          (a: any, b: any) => a.number - b.number
        );
        setQuestionSets(sortedQuestionSets);
      }
    } catch (error) {
      console.error("Error refreshing question sets:", error);
    }
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
      } else if (activeTab === "learningArea") {
        response = await fetch("/api/admin/learning-areas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else if (activeTab === "skill") {
        response = await fetch("/api/admin/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else if (activeTab === "questionSet") {
        response = await fetch("/api/admin/question-sets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else if (activeTab === "question") {
        response = await fetch("/api/admin/questions", {
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
        if (activeTab === "course") {
          alert(`Course created successfully! ID: ${result.course.id}`);
          // Refresh the courses list
          await refreshCourses();
        } else if (activeTab === "learningArea") {
          alert(
            `Learning area created successfully! ID: ${result.learningArea.id}`
          );
          // Refresh the learning areas list
          await refreshLearningAreas();
        } else if (activeTab === "skill") {
          alert(`Skill created successfully! ID: ${result.skill.id}`);
          // Refresh the skills list
          await refreshSkills();
        } else if (activeTab === "questionSet") {
          alert(
            `Question set created successfully! ID: ${result.questionSet.id}`
          );
          // Refresh the question sets list
          await refreshQuestionSets();
        } else if (activeTab === "question") {
          alert(`Question created successfully! ID: ${result.question.id}`);
        }
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
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
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

  const renderSkillForm = () => {
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
              // Clear learning area when course changes
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
            onChange={(e) =>
              handleInputChange("learningAreaId", e.target.value)
            }
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
          disabled={
            !formData.courseId ||
            !formData.learningAreaId ||
            !formData.difficulty ||
            !formData.name
          }
          style={{
            padding: "10px 16px",
            background:
              !formData.courseId ||
              !formData.learningAreaId ||
              !formData.difficulty ||
              !formData.name
                ? "#cbd5e1"
                : "#111827",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor:
              !formData.courseId ||
              !formData.learningAreaId ||
              !formData.difficulty ||
              !formData.name
                ? "not-allowed"
                : "pointer",
          }}
        >
          Create Skill
        </button>
      </form>
    );
  };

  const renderQuestionSetForm = () => {
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
              // Clear dependent selections when course changes
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
              // Clear skill selection when learning area changes
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
            onChange={(e) =>
              handleInputChange("number", Number(e.target.value))
            }
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

  const renderQuestionForm = () => {
    const selectedCourseId = formData.courseId
      ? parseInt(formData.courseId)
      : null;
    const selectedLearningAreaId = formData.learningAreaId
      ? parseInt(formData.learningAreaId)
      : null;
    const selectedSkillId = formData.skillId
      ? parseInt(formData.skillId)
      : null;

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
              // Clear dependent selections when course changes
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
              // Clear dependent selections when learning area changes
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
              // Clear question set selection when skill changes
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
              {selectedSkillId
                ? "Select a question set"
                : "Select a skill first"}
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
