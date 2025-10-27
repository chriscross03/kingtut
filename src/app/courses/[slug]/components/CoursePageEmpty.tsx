import Link from "next/link";

export default function CoursePageEmpty() {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>Course not found</h1>
      <Link href="/courses" style={{ color: "#1a73e8" }}>
        ← Back to courses
      </Link>
    </div>
  );
}
