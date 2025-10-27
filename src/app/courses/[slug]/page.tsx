"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useFetchResource } from "../../../hooks/useFetchResource";
import type { Course, LearningArea } from "../../../generated/prisma";
import { useMemo } from "react";
import {
  CoursePageError,
  CoursePageLoading,
  CoursePageEmpty,
} from "./components";

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
  console.log(course);

  if (course.loading) {
    return <CoursePageLoading />;
  }

  if (course.error) {
    return <CoursePageError error={course.error} />;
  }

  const courseData = course.data[0]; // Since we're fetching a specific course

  if (!courseData) {
    return <CoursePageEmpty />;
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
      <Link
        href="/courses"
        style={{ color: "#1a73e8", textDecoration: "none" }}
      >
        ← Back to courses
      </Link>

      <h1
        style={{ fontSize: "2.5rem", marginBottom: "1rem", marginTop: "2rem" }}
      >
        {courseData.name}
      </h1>

      {courseData.description && (
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
          {courseData.description}
        </p>
      )}

      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        Learning Areas
      </h2>

      {courseData.learningAreas?.length === 0 ? (
        <p>No learning areas available for this course yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {courseData.learningAreas?.map((learningArea) => (
            <li key={learningArea.id} style={{ marginBottom: "1rem" }}>
              <Link
                href={`/courses/${courseSlug}/learning-areas/${
                  learningArea.slug || learningArea.id
                }`}
                style={{
                  textDecoration: "none",
                  color: "#1a73e8",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  display: "block",
                  padding: "1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                    {learningArea.name}
                  </h3>
                  {learningArea.description && (
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "0.9rem",
                      }}
                    >
                      {learningArea.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
