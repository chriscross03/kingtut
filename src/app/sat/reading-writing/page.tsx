import Link from "next/link";

export default function SATEnglish() {
  const topics = [
    { title: "Craft and Structure", href: "reading-writing/craft-structure" },
    { title: "Information and Ideas", href: "reading-writing/info-ideas" },
    {
      title: "Standard English Conventions",
      href: "reading-writing/standard-english",
    },
    { title: "Expression of Ideas", href: "reading-writing/expression" },
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
