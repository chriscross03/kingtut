// app/api/courses/[slug]/.../question-sets/[questionSetSlug]/submit-question/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SubmitQuestionBody {
  questionSetId: number;
  questionId: number;
  answer: string;
  timeSpent: number;
  quizAttemptId?: number; // Optional - for continuing existing attempt
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
        { error: "You must be logged in to submit answers" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { questionSetSlug } = await params;
    const body: SubmitQuestionBody = await request.json();
    const { questionSetId, questionId, answer, timeSpent, quizAttemptId } =
      body;

    // Validate request
    if (!questionId || !answer) {
      return NextResponse.json(
        { error: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    // Get the question with options
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
        questionSet: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check if answer is correct
    let isCorrect = false;
    if (
      question.questionType === "MULTIPLE_CHOICE" ||
      question.questionType === "TRUE_FALSE"
    ) {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      isCorrect = answer === correctOption?.id.toString();
    } else if (question.questionType === "SHORT_ANSWER") {
      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      isCorrect = correctOptions.some(
        (opt) =>
          opt.optionText.toLowerCase().trim() === answer.toLowerCase().trim()
      );
    }

    const pointsEarned = isCorrect ? question.points : 0;

    // Get or create quiz attempt
    let attemptId = quizAttemptId;

    if (!attemptId) {
      // Create new quiz attempt (in-progress)
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
      attemptId = newAttempt.id;
    }

    // Check if answer already exists (update) or create new
    const existingAnswer = await prisma.questionAnswer.findFirst({
      where: {
        userId,
        quizAttemptId: attemptId,
        questionId,
      },
    });

    if (existingAnswer) {
      // Update existing answer
      await prisma.questionAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          userAnswer: answer,
          isCorrect,
          pointsEarned,
          timeSpent,
        },
      });
    } else {
      // Create new answer
      await prisma.questionAnswer.create({
        data: {
          userId,
          quizAttemptId: attemptId,
          questionId,
          userAnswer: answer,
          isCorrect,
          pointsEarned,
          timeSpent,
        },
      });
    }

    return NextResponse.json({
      success: true,
      quizAttemptId: attemptId,
      isCorrect,
      pointsEarned,
      message: "Answer saved",
    });
  } catch (error) {
    console.error("Error submitting question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
