// app/api/courses/[slug]/.../question-sets/[questionSetSlug]/finalize/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";

const prisma = new PrismaClient();

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
        score: percentage,
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

// Helper function to update skill proficiency
async function updateSkillProficiency(
  userId: number,
  skillId: number,
  newScore: number
) {
  try {
    const existing = await prisma.skillProficiency.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    if (existing) {
      const updatedScore = existing.score * 0.7 + newScore * 0.3;
      let level: "BEGINNING" | "INTERMEDIATE" | "ADVANCED" | "SIGMA" =
        "BEGINNING";
      if (updatedScore >= 90) level = "SIGMA";
      else if (updatedScore >= 75) level = "ADVANCED";
      else if (updatedScore >= 50) level = "INTERMEDIATE";

      await prisma.skillProficiency.update({
        where: {
          userId_skillId: {
            userId,
            skillId,
          },
        },
        data: {
          score: updatedScore,
          level,
          questionsAnswered: { increment: 1 },
          questionSetsCompleted: { increment: 1 },
          lastUpdated: new Date(),
        },
      });
    } else {
      let level: "BEGINNING" | "INTERMEDIATE" | "ADVANCED" | "SIGMA" =
        "BEGINNING";
      if (newScore >= 90) level = "SIGMA";
      else if (newScore >= 75) level = "ADVANCED";
      else if (newScore >= 50) level = "INTERMEDIATE";

      await prisma.skillProficiency.create({
        data: {
          userId,
          skillId,
          score: newScore,
          level,
          questionsAnswered: 1,
          questionSetsCompleted: 1,
          lastUpdated: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error updating skill proficiency:", error);
  }
}
