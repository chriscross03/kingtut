import CourseItem from "./CourseItem";
import { Course } from "@/generated/prisma";

type Props = {
  courses: Course[];
};

export default function CourseList({ courses }: Props) {
  if (courses.length === 0) {
    return <p>No courses available at the moment.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </ul>
  );
}
