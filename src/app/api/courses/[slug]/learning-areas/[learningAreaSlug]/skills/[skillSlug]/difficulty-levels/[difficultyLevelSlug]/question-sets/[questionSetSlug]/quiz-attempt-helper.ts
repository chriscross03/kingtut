import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Get quiz attempt with full details
 */

export async function getQuizAttemptWithDetails(quizAttemptId: number) {
  if (!quizAttemptId) {
    throw NextResponse.json(
      { error: "Quiz attempt ID is required" },
      { status: 400 }
    );
  }
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
        orderBy: { createdAt: "asc" },
      },
      questionSet: {
        include: {
          questions: { where: { isActive: true } },
          difficultyLevel: { include: { skill: true } },
        },
      },
    },
  });

  if (!quizAttempt) {
    throw NextResponse.json(
      { error: "Quiz attempt not found" },
      { status: 404 }
    );
  }

  return quizAttempt;
}

export async function getQuizAttempt(userId: number, quizAttemptId: number) {
  if (!quizAttemptId) {
    throw NextResponse.json(
      { error: "Quiz attempt ID is required" },
      { status: 400 }
    );
  }

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: quizAttemptId },
  });

  if (!attempt) {
    throw NextResponse.json(
      { error: "Quiz attempt not found" },
      { status: 404 }
    );
  }

  if (attempt.userId !== userId) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return attempt;
}

export async function createQuizAttempt(userId: number, questionSetId: number) {
  const ongoing = await prisma.quizAttempt.findFirst({
    where: { userId, questionSetId, isCompleted: false },
  });

  if (ongoing) return ongoing;

  return await prisma.quizAttempt.create({
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
}

export async function getCompletedQuizAttempts(
  userId: number,
  questionSetId: number
) {
  return await prisma.quizAttempt.findMany({
    where: { userId, questionSetId, isCompleted: true },
    orderBy: { completedAt: "desc" },
    include: {
      questionSet: { select: { title: true } },
    },
  });
}
