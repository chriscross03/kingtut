"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useFetchResource } from "../../../../../hooks/useFetchResource";

export default function LearningAreaPage() {
  const params = useParams();
  const courseSlug = params.slug as string;
  const learningAreaSlug = params.learningAreaSlug as string;

  // Fetch skills for this learning area
  const skills = useFetchResource("/api/skills", (a, b) =>
    a.name.localeCompare(b.name)
  );

  if (skills.loading) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1>Loading skills...</h1>
      </div>
    );
  }

  if (skills.error) {
    return (
      <div
        style={{
          padding: "2rem",
          fontFamily: "sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1>Error loading skills</h1>
        <p style={{ color: "red" }}>Error: {skills.error.message}</p>
        <Link href={`/courses/${courseSlug}`} style={{ color: "#1a73e8" }}>
          ← Back to course
        </Link>
      </div>
    );
  }

  // Filter skills by learning area slug (we'll need to enhance this)
  const learningAreaSkills = skills.data.filter(
    (skill) => skill.difficultyLevel.learningArea.slug === learningAreaSlug
  );

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
        href={`/courses/${courseSlug}`}
        style={{ color: "#1a73e8", textDecoration: "none" }}
      >
        ← Back to course
      </Link>

      <h1
        style={{ fontSize: "2.5rem", marginBottom: "1rem", marginTop: "2rem" }}
      >
        Skills
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Practice specific skills in this learning area.
      </p>

      {learningAreaSkills.length === 0 ? (
        <p>No skills available for this learning area yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {learningAreaSkills.map((skill) => (
            <li key={skill.id} style={{ marginBottom: "1rem" }}>
              <Link
                href={`/courses/${courseSlug}/learning-areas/${learningAreaSlug}/skills/${
                  skill.slug || skill.id
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
                    {skill.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "#6b7280",
                      fontSize: "0.9rem",
                    }}
                  >
                    Difficulty: {skill.difficultyLevel.name}
                  </p>
                  {skill.description && (
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "0.9rem",
                      }}
                    >
                      {skill.description}
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
