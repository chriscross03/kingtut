import Link from "next/link";

export default function SATMath() {
  const topics = [
    { title: "Algebra", href: "math/algebra" },
    { title: "Advanced Math", href: "math/advanced-math" },
    {
      title: "Problem-Solving and Data Analysis",
      href: "math/problem-solving",
    },
    { title: "Geometry and Trigonometry", href: "math/geo-trig" },
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
        {topics.map((topic, index) => (
          <li key={index} style={{ marginBottom: "1.2rem" }}>
            <Link
              href={topic.href}
              style={{
                textDecoration: "none",
                color: "#1a73e8",
                fontSize: "1.15rem",
                fontWeight: "500",
              }}
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
