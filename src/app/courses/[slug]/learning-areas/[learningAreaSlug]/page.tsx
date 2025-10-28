"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { LearningArea, DifficultyLevel, Skill } from "@/generated/prisma";
import BackLink from "@/components/BackLink";
import PageLayout from "../../../components/PageLayout";
import ResourceList from "../../../components/ResourceList";

// Extend LearningArea to include nested DifficultyLevels and Skills
interface SkillWithDifficultyLevels extends Skill {
  difficultyLevels: DifficultyLevel[];
}

interface LearningAreaWithSkills extends LearningArea {
  skills: SkillWithDifficultyLevels[];
}

export default function LearningAreaPage() {
  const params = useParams();
  const courseSlug = params.slug as string;
  const learningAreaSlug = params.learningAreaSlug as string;

  // Sort function for skills or difficulty levels if needed
  const sortFn = useMemo(
    () => (a: LearningArea, b: LearningArea) => a.name.localeCompare(b.name),
    []
  );

  // Fetch learning area from nested API
  const learningArea = useFetchResource<LearningAreaWithSkills>(
    `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}`,
    sortFn
  );

  const learningAreaData = learningArea.data[0]; // Only one learning area

  // Loading state
  if (learningArea.loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500 text-lg">Loading learning area...</p>
      </div>
    );
  }

  // Error state
  if (learningArea.error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-xl mx-auto mt-8">
        <p>Error: {learningArea.error.message}</p>
      </div>
    );
  }

  console.log("lasdfa;slfka");
  if (!learningAreaData) {
    return (
      <div className="text-gray-600 italic text-center py-16">
        Learning area not found.
      </div>
    );
  }
  console.log("sigma");

  return (
    <PageLayout
      title={learningAreaData.name}
      subtitle={learningAreaData.description || ""}
    >
      <BackLink href={`/courses/${courseSlug}`} label="Back to course" />
      <div className="mt-8 space-y-6">
        {learningAreaData.skills && learningAreaData.skills.length > 0 ? (
          learningAreaData.skills.map((skill) => (
            <div
              key={skill.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
              <ul className="list-disc list-inside text-gray-700">
                {skill.difficultyLevels?.length ? (
                  skill.difficultyLevels.map((level) => (
                    <li key={level.id}>{level.name}</li>
                  ))
                ) : (
                  <li className="italic text-gray-500">No difficulty levels</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">No skills found for this area.</p>
        )}
      </div>
    </PageLayout>
  );
}
