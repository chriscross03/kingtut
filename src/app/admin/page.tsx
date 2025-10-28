"use client";

import { useState } from "react";
import CourseForm from "./forms/CourseForm";
import LearningAreaForm from "./forms/LearningAreaForm";
import SkillForm from "./forms/SkillForm";
import QuestionSetForm from "./forms/QuestionSetForm";
import QuestionForm from "./forms/QuestionForm";
import { useResourceData } from "../../hooks/useResourceData";
import { useFormData } from "../../hooks/useFormData";
import BackLink from "@/components/BackLink";

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
        // Generate slug from course name
        const slug = formData.name
          ?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        const courseData = { ...formData, slug };

        response = await fetch("/api/admin/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      let endpoint = "";
      if (activeTab === "course") endpoint = "/api/admin/courses";
      else if (activeTab === "learningArea")
        endpoint = "/api/admin/learning-areas";
      else if (activeTab === "skill") endpoint = "/api/admin/skills";
      else if (activeTab === "questionSet")
        endpoint = "/api/admin/question-sets";
      else if (activeTab === "question") endpoint = "/api/admin/questions";

      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`${activeTab} deleted successfully!`);

        // Refresh data for that tab
        if (activeTab === "course") await courses.refresh();
        else if (activeTab === "learningArea") await learningAreas.refresh();
        else if (activeTab === "skill") await skills.refresh();
        else if (activeTab === "questionSet") await questionSets.refresh();
        else if (activeTab === "question") await questions.refresh();
      } else {
        const error = await response.json();
        alert(`Error deleting ${activeTab}: ${error.error}`);
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
  const renderItemsList = () => {
    let items: any[] = [];
    if (activeTab === "course") items = courses.data;
    else if (activeTab === "learningArea") items = learningAreas.data;
    else if (activeTab === "skill") items = skills.data;
    else if (activeTab === "questionSet") items = questionSets.data;
    else if (activeTab === "question") items = questions.data;

    if (!items.length) return <p className="text-gray-500">No items yet.</p>;

    return (
      <ul className="mt-6 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
          >
            <span>{item.name || item.title || `ID: ${item.id}`}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      <BackLink href="/" label="Go back home" />

      <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-md font-medium ${
              activeTab === tab.id
                ? "bg-gray-900 text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        {renderForm()}
        {renderItemsList()}
      </div>
    </div>
  );
}
