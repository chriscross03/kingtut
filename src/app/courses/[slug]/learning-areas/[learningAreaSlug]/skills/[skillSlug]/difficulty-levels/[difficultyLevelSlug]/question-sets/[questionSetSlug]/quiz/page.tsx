import QuizPage from "../quiz-components/quiz-page";

export default function Quizz() {
  const params = {
    slug: "course-slug",
    learningAreaSlug: "learning-area-slug",
    skillSlug: "skill-slug",
    difficultyLevelSlug: "difficulty-level-slug",
    questionSetSlug: "question-set-slug",
  };

  return <QuizPage params={params} />;
}
