import Link from "next/link";
import { Course } from "@/generated/prisma";

type Props = {
  course: Course;
};

export default function CourseItem({ course }: Props) {
  return (
    <li style={{ marginBottom: "1.2rem" }}>
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
  );
}
