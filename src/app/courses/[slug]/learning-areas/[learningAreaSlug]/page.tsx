"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { LearningArea, DifficultyLevel, Skill } from "@/generated/prisma";
import BackLink from "@/components/BackLink";
import PageLayout from "../../../components/PageLayout";
import ResourceList from "../../../components/ResourceList";
import { usePathname } from "next/navigation";

// Extend LearningArea to include nested DifficultyLevels and Skills
interface SkillWithDifficultyLevels extends Skill {
  difficultyLevels: DifficultyLevel[];
}

interface LearningAreaWithSkills extends LearningArea {
  skills: SkillWithDifficultyLevels[];
}

export default function LearningAreaPage() {
  const pathname = usePathname();

  const params = useParams();
  const courseSlug = params.slug as string;
  const learningAreaSlug = params.learningAreaSlug as string;

  // Fetch learning area from nested API
  const learningArea = useFetchResource<LearningAreaWithSkills>(
    `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}`
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

  if (!learningAreaData) {
    return (
      <div className="text-gray-600 italic text-center py-16">
        Learning area not found.
      </div>
    );
  }

  return (
    <PageLayout
      title={learningAreaData.name}
      subtitle={learningAreaData.description || ""}
    >
      <BackLink href="/courses" label="Back to courses" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Skills</h2>

      <ResourceList
        items={learningAreaData.skills || []}
        basePath={`${pathname}/skills/`}
      />
    </PageLayout>
  );
}
