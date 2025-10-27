type Props = {
  error: Error;
};

export default function CourseError({ error }: Props) {
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
      <p style={{ color: "red" }}>Error loading courses: {error.message}</p>
    </div>
  );
}
