import { useFetchResource } from "./useFetchResource";

export function useResourceData() {
  const courses = useFetchResource("/api/courses", (a, b) =>
    a.name.localeCompare(b.name)
  );
  const learningAreas = useFetchResource("/api/learning-areas", (a, b) =>
    a.name.localeCompare(b.name)
  );
  const skills = useFetchResource("/api/skills", (a, b) =>
    a.name.localeCompare(b.name)
  );
  const questionSets = useFetchResource(
    "/api/question-sets",
    (a, b) => a.number - b.number
  );
  const questions = useFetchResource("/api/questions");

  return { courses, learningAreas, skills, questionSets, questions };
}
