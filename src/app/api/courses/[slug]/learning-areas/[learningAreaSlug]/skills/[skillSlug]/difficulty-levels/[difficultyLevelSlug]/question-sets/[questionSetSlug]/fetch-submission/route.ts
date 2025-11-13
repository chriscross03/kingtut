import { getQuizAttemptWithDetails } from "../quiz-attempt-helper";
import { NextResponse, NextRequest } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

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
    }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get("attemptId"); // Changed from submissionId

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    const quizAttemptId = Number(attemptId);

    if (isNaN(quizAttemptId)) {
      return NextResponse.json(
        { error: "Invalid attempt ID" },
        { status: 400 }
      );
    }

    const quizAttempt = await getQuizAttemptWithDetails(quizAttemptId);

    if (!quizAttempt) {
      return NextResponse.json(
        { error: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    if (quizAttempt.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!quizAttempt.isCompleted) {
      return NextResponse.json(
        { error: "Quiz attempt not completed yet" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quizAttempt.id,
        title: quizAttempt.questionSet.title,
        difficulty: quizAttempt.questionSet.difficultyLevel.name,
        earnedPoints: quizAttempt.earnedPoints,
        totalPoints: quizAttempt.totalPoints,
        percentage: quizAttempt.percentage,
        passed: quizAttempt.percentage >= 70,
        totalTime: quizAttempt.timeSpent,
        completedAt: quizAttempt.completedAt,
        correctCount: quizAttempt.answers.filter((a) => a.isCorrect).length,
        totalQuestions: quizAttempt.answers.length,
      },
      answers: quizAttempt.answers.map((a) => ({
        id: a.id,
        questionText: a.question.questionText,
        questionType: a.question.questionType,
        userAnswer: a.userAnswer,
        isCorrect: a.isCorrect,
        pointsEarned: a.pointsEarned,
        timeSpent: a.timeSpent,
        correctOption: a.question.options.find((o) => o.isCorrect)?.optionText,
        allOptions: a.question.options.map((o) => ({
          id: o.id,
          text: o.optionText,
          isCorrect: o.isCorrect,
        })),
        explanation: a.question.explanation,
      })),
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
