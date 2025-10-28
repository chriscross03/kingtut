"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useFetchResource } from "../../../hooks/useFetchResource";
import type { Course, LearningArea } from "../../../generated/prisma";
import { useMemo } from "react";
import BackLink from "@/components/BackLink";
import ResourceList from "../components/ResourceList";
import PageLayout from "../components/PageLayout";

interface CourseWithLearningAreas extends Course {
  learningAreas?: LearningArea[];
}

export default function CoursePage() {
  const sortFn = useMemo(
    () => (a: Course, b: Course) => {
      if (!a || !b) return 0; // handle nulls gracefully
      return a.name.localeCompare(b.name);
    },
    []
  );

  const params = useParams();
  const courseSlug = params.slug as string;

  // Fetch the specific course by slug
  const course = useFetchResource<CourseWithLearningAreas>(
    `/api/courses/${courseSlug}`,
    sortFn
  );
  console.log({
    loading: course.loading,
    data: course.data,
    error: course.error,
  });

  return <PageLayout />;
}
