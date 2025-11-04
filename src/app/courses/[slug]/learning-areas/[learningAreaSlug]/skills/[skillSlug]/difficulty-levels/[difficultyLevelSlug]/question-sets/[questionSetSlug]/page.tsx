"use client";

import PageLayout from "../../../../../../../../../components/PageLayout";
import BackLink from "../../../../../../../../../../../components/BackLink";
import { useParams, usePathname } from "next/navigation";
import { useFetchResource } from "@/hooks/useFetchResource";
import type { Skill, DifficultyLevel, QuestionSet } from "@/generated/prisma";

export default function QuestionSetPage() {
  const pathname = usePathname();
  const params = useParams();
  const {
    slug: courseSlug,
    learningAreaSlug,
    skillSlug,
    difficultyLevelSlug,
    questionSetSlug,
  } = params as {
    slug: string;
    learningAreaSlug: string;
    skillSlug: string;
    difficultyLevelSlug: string;
    questionSetSlug: string;
  };
  const questionSet = useFetchResource<QuestionSet>(
    `/api/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${skillSlug}/difficulty-levels/${difficultyLevelSlug}/question-sets/${questionSetSlug}`
  );

  return (
    <PageLayout title="Question Set" subtitle="Question Set">
      <BackLink href="/courses" label="Back to courses" />
    </PageLayout>
  );
}
