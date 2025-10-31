"use client";

import { useParams } from "next/navigation";
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
  const params = useParams();
  const courseSlug = params.slug as string;

  const course = useFetchResource<CourseWithLearningAreas>(
    `/api/courses/${courseSlug}`
  );

  // Grab the first item (since it's a single course endpoint)
  const courseData = course.data[0];

  // Handle loading state
  if (course.loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500 text-lg">Loading course...</p>
      </div>
    );
  }

  // Handle error state
  if (course.error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-xl mx-auto mt-8">
        <p>Error: {course.error.message}</p>
      </div>
    );
  }

  // Handle empty course
  if (!courseData) {
    return (
      <div className="text-gray-600 italic text-center py-16">
        Course not found.
      </div>
    );
  }

  // Render the page when courseData exists
  return (
    <PageLayout title={courseData.name} subtitle={courseData.description || ""}>
      <BackLink href="/courses" label="Back to courses" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Learning Areas</h2>

      <ResourceList
        items={courseData.learningAreas || []}
        basePath={`/courses/${courseData.slug}/learning-areas`}
      />
    </PageLayout>
  );
}
