import { getQuizAttemptWithDetails } from "../quiz-attempt-helper";
import { NextResponse, NextRequest } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Params } from "next/dist/server/request/params";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
      learningAreaSlug: string;
      skillSlug: string;
      difficultyLevelSlug: string;
      questionSetSlug: string;
      attemptId: string;
    }>;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { attemptId } = await params;
  const quizAttempt = await getQuizAttemptWithDetails(Number(attemptId));

  if (quizAttempt.userId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({
    quiz: {
      title: quizAttempt.questionSet.title,
      difficulty: quizAttempt.questionSet.difficultyLevel.name,
      earnedPoints: quizAttempt.earnedPoints,
      percentage: quizAttempt.percentage,
      passed: quizAttempt.percentage >= 70,
      totalTime: quizAttempt.timeSpent,
    },
    answers: quizAttempt.answers.map((a) => ({
      questionText: a.question.questionText,
      userAnswer: a.userAnswer,
      isCorrect: a.isCorrect,
      correctOption: a.question.options.find((o) => o.isCorrect)?.optionText,
    })),
  });
}
