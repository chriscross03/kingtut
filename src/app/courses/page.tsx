"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFetchResource } from "../../hooks/useFetchResource";
import { Course } from "@/generated/prisma";
import { CourseList, CourseLoading, CourseError } from "./components";

export default function CoursesPage() {
  const sortFn = useMemo(
    () => (a: Course, b: Course) => {
      if (!a || !b) return 0; // handle nulls gracefully
      return a.name.localeCompare(b.name);
    },
    []
  );
  const courses = useFetchResource("/api/courses", sortFn);

  if (courses.loading) {
    return <CourseLoading />;
  }

  if (courses.error) {
    return <CourseError error={courses.error} />;
  }

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Courses</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Explore lessons and resources to help you learn.
      </p>

      {<CourseList courses={courses.data} />}
    </div>
  );
}
