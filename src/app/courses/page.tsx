"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFetchResource } from "../../hooks/useFetchResource";
import { Course } from "@/generated/prisma";

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
        <p>Loading courses...</p>
      </div>
    );
  }

  if (courses.error) {
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
        <p style={{ color: "red" }}>
          Error loading courses: {courses.error.message}
        </p>
      </div>
    );
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

      {courses.data.length === 0 ? (
        <p>No courses available at the moment.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {courses.data.map((course) => (
            <li key={course.id} style={{ marginBottom: "1.2rem" }}>
              <Link
                href={`/courses/${course.slug || course.id}`}
                style={{
                  textDecoration: "none",
                  color: "#1a73e8",
                  fontSize: "1.15rem",
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
                    {course.name}
                  </h3>
                  {course.description && (
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "0.9rem",
                      }}
                    >
                      {course.description}
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
