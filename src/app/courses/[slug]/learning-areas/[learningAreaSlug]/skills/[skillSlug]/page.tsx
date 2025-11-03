"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { Skill, DifficultyLevel } from "@/generated/prisma";
import BackLink from "@/components/BackLink";
import PageLayout from "../../../../../components/PageLayout";
import ResourceList from "../../../../../components/ResourceList";

interface SkillWithDifficultyLevels extends Skill {
  difficultyLevels: DifficultyLevel[];
}

export default function SkillPage() {
  const pathname = usePathname();
  const params = useParams();
  const {
    slug: courseSlug,
    learningAreaSlug,
    skillSlug,
  } = params as {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
  };

  // Fetch learning area from nested API
  const skill = useFetchResource<SkillWithDifficultyLevels>(
    `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${skillSlug}`
  );
  const skillData = skill.data[0]; // Only one learning area

  // Loading state
  if (skill.loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500 text-lg">Loading skill...</p>
      </div>
    );
  }

  // Error state
  if (skill.error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-xl mx-auto mt-8">
        <p>Error: {skill.error.message}</p>
      </div>
    );
  }

  // Not found state
  if (!skillData) {
    return (
      <div className="text-gray-600 italic text-center py-16">
        Skill not found.
      </div>
    );
  }
  return (
    <PageLayout title={skillData.name} subtitle={skillData.description || ""}>
      <BackLink href="/courses" label="Back to courses" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Skills</h2>

      <ResourceList
        items={skillData.difficultyLevels || []}
        basePath={`${pathname}/difficulty-levels/`}
      />
    </PageLayout>
  );
}
