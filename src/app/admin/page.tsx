"use client";

import { useState } from "react";
import CourseForm from "./forms/CourseForm";
import LearningAreaForm from "./forms/LearningAreaForm";
import SkillForm from "./forms/SkillForm";
import QuestionSetForm from "./forms/QuestionSetForm";
import QuestionForm from "./forms/QuestionForm";
import { useResourceData } from "../../hooks/useResourceData";
import { useFormData } from "../../hooks/useFormData";

type ContentType =
  | "course"
  | "learningArea"
  | "skill"
  | "questionSet"
  | "question";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ContentType>("course");
  const [formData, setFormData, handleInputChange] = useFormData<
    Record<string, any>
  >({});
  const { courses, learningAreas, skills, questionSets, questions } =
    useResourceData();

  // Helper function to get learning areas for a specific course
  const getLearningAreasByCourse = (courseId: number) => {
    return learningAreas.data.filter((la) => la.courseId === courseId);
  };

  // Helper function to get skills for a specific learning area
  const getSkillsByLearningArea = (learningAreaId: number) => {
    return skills.data.filter(
      (skill) => skill.difficultyLevel.learningAreaId === learningAreaId
    );
  };

  // Helper function to get question sets for a specific skill
  const getQuestionSetsBySkill = (skillId: number) => {
    return questionSets.data.filter((qs) => qs.skillId === skillId);
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
          await courses.refresh();
        } else if (activeTab === "learningArea") {
          alert(
            `Learning area created successfully! ID: ${result.learningArea.id}`
          );
          await learningAreas.refresh();
        } else if (activeTab === "skill") {
          alert(`Skill created successfully! ID: ${result.skill.id}`);
          await skills.refresh();
        } else if (activeTab === "questionSet") {
          alert(
            `Question set created successfully! ID: ${result.questionSet.id}`
          );
          await questionSets.refresh();
        } else if (activeTab === "question") {
          alert(`Question created successfully! ID: ${result.question.id}`);
          await questions.refresh();
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
        return (
          <CourseForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case "learningArea":
        return (
          <LearningAreaForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            courses={courses.data}
          />
        );
      case "skill":
        return (
          <SkillForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            courses={courses.data}
            getLearningAreasByCourse={getLearningAreasByCourse}
          />
        );
      case "questionSet":
        return (
          <QuestionSetForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            courses={courses.data}
            getLearningAreasByCourse={getLearningAreasByCourse}
            getSkillsByLearningArea={getSkillsByLearningArea}
          />
        );
      case "question":
        return (
          <QuestionForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            courses={courses.data}
            getLearningAreasByCourse={getLearningAreasByCourse}
            getSkillsByLearningArea={getSkillsByLearningArea}
            getQuestionSetsBySkill={getQuestionSetsBySkill}
          />
        );
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
