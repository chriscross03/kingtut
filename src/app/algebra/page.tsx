// pages/algebra.js
import Link from "next/link";

export default function AlgebraPage() {
  const lessons = [
    {
      title: "Solve equations & inequalities",
      href: "/algebra/solve-equations",
    },
    { title: "Linear equations", href: "/algebra/linear-equations" },
    { title: "Quadratic equations", href: "/algebra/quadratic-equations" },
    // add more lessons here
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Algebra</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {lessons.map((lesson, index) => (
          <li key={index} style={{ marginBottom: "1rem" }}>
            <Link
              href={lesson.href}
              style={{
                textDecoration: "none",
                color: "#1a73e8",
                fontSize: "1.1rem",
              }}
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
