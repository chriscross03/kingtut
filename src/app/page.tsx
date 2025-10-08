import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to My Study Hub</h1>
      <p>Choose a subject to get started:</p>

      <Link
        href="/sat"
        style={{
          textDecoration: "none",
          color: "#1a73e8",
          fontSize: "1.2rem",
        }}
      >
        Go to SAT Practice →
      </Link>
    </div>
  );
}
