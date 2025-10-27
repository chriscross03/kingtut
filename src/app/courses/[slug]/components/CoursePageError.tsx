import Link from "next/link";

type Props = {
  error: Error;
};

export default function CoursePageError({ error }: Props) {
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
      <p style={{ color: "red" }}>Error: {error.message}</p>
      <Link href="/courses" style={{ color: "#1a73e8" }}>
        ← Back to courses
      </Link>
    </div>
  );
}
