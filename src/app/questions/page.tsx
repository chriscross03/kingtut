import Link from "next/link";
import { prisma } from "../../lib/prisma";

type QuestionListItem = {
  id: number;
  questionText: string;
};

export const revalidate = 0; // always fresh in dev; adjust for production

export default async function QuestionsPage() {
  const questions: QuestionListItem[] = await prisma.question.findMany({
    select: { id: true, questionText: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Questions</h1>
      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q.id}>
              <Link href={`/questions/${q.id}`}>{q.questionText}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
