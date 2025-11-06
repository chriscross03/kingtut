import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Get quiz attempt with full details
 */
export async function getQuizAttemptWithDetails(quizAttemptId: number) {
  const quizAttempt = await prisma.quizAttempt.findUnique({
    where: { id: quizAttemptId },
    include: {
      answers: {
        include: {
          question: {
            include: {
              options: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
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
    throw new Error("Quiz attempt not found");
  }

  return quizAttempt;
}

/**
 * Get or create quiz attempt
 */
export async function getOrCreateQuizAttempt(
  userId: number,
  questionSetId: number,
  quizAttemptId?: number
) {
  // If attemptId provided, get existing
  if (quizAttemptId) {
    const existing = await prisma.quizAttempt.findUnique({
      where: { id: quizAttemptId },
    });

    if (!existing) {
      throw NextResponse.json(
        { error: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existing.userId !== userId) {
      throw NextResponse.json(
        { error: "Unauthorized access to quiz attempt" },
        { status: 403 }
      );
    }

    return existing;
  }

  const ongoingAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId,
      questionSetId,
      isCompleted: false,
    },
  });

  if (ongoingAttempt) {
    // Option 1: just return it
    return ongoingAttempt;
  }

  // Create new attempt
  const newAttempt = await prisma.quizAttempt.create({
    data: {
      userId,
      questionSetId,
      earnedPoints: 0,
      totalPoints: 0,
      percentage: 0,
      startedAt: new Date(),
      timeSpent: 0,
      isCompleted: false,
    },
  });

  return newAttempt;
}

/**
 * Get user's latest quiz attempt for a question set
 */
export async function getLatestQuizAttempt(
  userId: number,
  questionSetId: number
) {
  return await prisma.quizAttempt.findFirst({
    where: {
      userId,
      questionSetId,
      isCompleted: false,
    },
    orderBy: {
      startedAt: "desc",
    },
  });
}

/**
 * Get all completed quiz attempts for a user and question set
 */
export async function getCompletedQuizAttempts(
  userId: number,
  questionSetId: number
) {
  return await prisma.quizAttempt.findMany({
    where: {
      userId,
      questionSetId,
      isCompleted: true,
    },
    orderBy: {
      completedAt: "desc",
    },
    include: {
      questionSet: {
        select: {
          title: true,
        },
      },
    },
  });
}
