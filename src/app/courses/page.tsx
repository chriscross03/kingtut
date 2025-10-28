"use client";

import { useMemo } from "react";
import { useFetchResource } from "../../hooks/useFetchResource";
import { Course } from "@/generated/prisma";
import BackLink from "@/components/BackLink";
import PageLayout from "./components/PageLayout";
import ResourceList from "./components/ResourceList";

export default function CoursesPage() {
  const sortFn = useMemo(
    () => (a: Course, b: Course) => a.name.localeCompare(b.name),
    []
  );

  const { data, loading, error } = useFetchResource<Course>(
    "/api/courses",
    sortFn
  );

  return (
    <PageLayout
      title="Courses"
      subtitle="Explore lessons and resources to help you learn."
    >
      <BackLink href="/" label="Go back home" />
      <ResourceList
        items={data}
        loading={loading}
        error={error}
        basePath="/courses"
      />
    </PageLayout>
  );
}
