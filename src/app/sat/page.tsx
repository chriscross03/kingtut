import Link from "next/link";

export default function SATPage() {
  const lessons = [
    { title: "Reading and Writing Practice", href: "/sat/reading-writing" },
    { title: "Math Practice", href: "/sat/math" },
    { title: "Digital SAT Tips", href: "/sat/tips" },
    { title: "Full-Length Practice Tests", href: "/sat/practice-tests" },
  ];

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>SAT Practice</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Explore lessons and resources to help you prepare for the SAT.
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {lessons.map((lesson, index) => (
          <li key={index} style={{ marginBottom: "1.2rem" }}>
            <Link
              href={lesson.href}
              style={{
                textDecoration: "none",
                color: "#1a73e8",
                fontSize: "1.15rem",
                fontWeight: "500",
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
