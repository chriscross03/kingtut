// app/api/courses/[slug]/.../question-sets/[questionSetSlug]/finalize/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { updateSkillProficiency } from "@/lib/proficiency-updater/skill-proficiency";

interface FinalizeQuizBody {
  quizAttemptId: number;
}

export async function POST(
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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to finalize quiz" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body: FinalizeQuizBody = await request.json();
    const { quizAttemptId } = body;

    if (!quizAttemptId) {
      return NextResponse.json(
        { error: "Quiz attempt ID is required" },
        { status: 400 }
      );
    }

    // Get quiz attempt with answers and question set
    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: { id: quizAttemptId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        questionSet: {
          include: {
            questions: {
              where: { isActive: true },
            },
            difficultyLevel: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!quizAttempt) {
      return NextResponse.json(
        { error: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (quizAttempt.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (quizAttempt.isCompleted) {
      return NextResponse.json(
        { error: "Quiz attempt already finalized" },
        { status: 400 }
      );
    }

    // Calculate final score
    const totalPoints = quizAttempt.questionSet.questions.reduce(
      (sum, q) => sum + q.points,
      0
    );
    const pointsEarned = quizAttempt.answers.reduce(
      (sum, a) => sum + (a.pointsEarned || 0),
      0
    );
    const percentage = totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0;
    const passed = percentage >= 70;
    const totalTimeSpent = quizAttempt.answers.reduce(
      (sum, a) => sum + (a.timeSpent || 0),
      0
    );

    // Update quiz attempt to completed
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: quizAttemptId },
      data: {
        earnedPoints: pointsEarned,
        totalPoints,
        percentage,
        completedAt: new Date(),
        timeSpent: totalTimeSpent,
        isCompleted: true,
      },
    });

    // Update skill proficiency
    const skillId = quizAttempt.questionSet.difficultyLevel.skillId;
    await updateSkillProficiency(userId, skillId, percentage);

    return NextResponse.json({
      success: true,
      submissionId: updatedAttempt.id,
      score: pointsEarned,
      totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      passed,
      timeSpent: totalTimeSpent,
      correctCount: quizAttempt.answers.filter((a) => a.isCorrect).length,
      totalQuestions: quizAttempt.answers.length,
    });
  } catch (error) {
    console.error("Error finalizing quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
