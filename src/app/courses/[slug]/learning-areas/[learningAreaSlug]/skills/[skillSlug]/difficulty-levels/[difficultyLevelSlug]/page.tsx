"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { Skill, DifficultyLevel, QuestionSet } from "@/generated/prisma";
import BackLink from "@/components/BackLink";
import PageLayout from "../../../../../../../components/PageLayout";
import ResourceList from "../../../../../../../components/ResourceList";

interface DifficultyLevelWithQuestionSets extends DifficultyLevel {
  questionSets: QuestionSet[];
}

export default function DifficultylevelPage() {
  const pathname = usePathname();
  const params = useParams();
  const {
    slug: courseSlug,
    learningAreaSlug,
    skillSlug,
    difficultyLevelSlug,
  } = params as {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
  };

  // Fetch learning area from nested API
  const difficultyLevel = useFetchResource<DifficultyLevelWithQuestionSets>(
    `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${skillSlug}/difficulty-levels/${difficultyLevelSlug}`
  );

  const diffData = difficultyLevel.data[0]; // Only one learning area

  // Loading state
  if (difficultyLevel.loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500 text-lg">
          Loading difficulty level sets...
        </p>
      </div>
    );
  }

  // Error state
  if (difficultyLevel.error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-xl mx-auto mt-8">
        <p>Error: {difficultyLevel.error.message}</p>
      </div>
    );
  }

  // Not found state
  if (!diffData) {
    return (
      <div className="text-gray-600 italic text-center py-16">
        Skill not found.
      </div>
    );
  }
  return (
    <PageLayout title={diffData.name} subtitle={diffData.description || ""}>
      <BackLink href="/courses" label="back to courses" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Skills</h2>

      <ResourceList
        items={(diffData.questionSets || []).map((qs) => ({
          ...qs,
          name: `Question Set ${qs.number}`, // create a readable name
        }))}
        basePath={`${pathname}/difficulty-levels/`}
      />
    </PageLayout>
  );
}
