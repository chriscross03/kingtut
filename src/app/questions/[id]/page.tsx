import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export const revalidate = 0;

export default async function QuestionPage({ params }: Props) {
  const id = parseInt(params.id);
  if (Number.isNaN(id)) return notFound();

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      questionSet: {
        include: {
          difficultyLevel: {
            include: {
              skill: {
                include: { learningArea: { include: { course: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!question) return notFound();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Question #{question.id}</h1>
      <p>{question.questionText}</p>

      <h3>Options</h3>
      <ul>
        {(question.options as unknown as string[]).map((opt, i) => (
          <li key={i}>
            {String.fromCharCode(65 + i)}. {opt}
          </li>
        ))}
      </ul>

      <p>
        <strong>Correct Answer:</strong> {question.correctAnswer}
      </p>

      {question.explanation && (
        <section>
          <h3>Explanation</h3>
          <p>{question.explanation}</p>
        </section>
      )}

      <section>
        <h4>Context</h4>
        <p>
          Course: {question.questionSet?.difficultyLevel?.skill?.learningArea?.course?.name}
        </p>
        <p>
          Learning Area: {question.questionSet?.difficultyLevel?.skill?.learningArea?.name}
        </p>
        <p>
          Skill: {question.questionSet?.difficultyLevel?.name} — {question.questionSet?.difficultyLevel?.skill?.name}
        </p>
      </section>
    </main>
  );
}
