// app/api/courses/[slug]/.../question-sets/[questionSetSlug]/submit-question/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getQuizAttempt } from "../quiz-attempt-helper";

interface SubmitQuestionBody {
  questionSetId: number;
  questionId: number;
  answer: string;
  timeSpent: number;
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
      console.log("sigma sigma sigma");
      return NextResponse.json(
        { error: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    if (!quizAttemptId) {
      console.error("Missing quizAttemptId");
      return NextResponse.json(
        { error: "Quiz attempt ID is required" },
        { status: 400 }
      );
    }

    if (!questionSetId) {
      console.error("Missing questionSetId");
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    let quizAttempt;
    try {
      quizAttempt = await getQuizAttempt(userId, quizAttemptId);
    } catch (error) {
      console.error("Error getting quiz attempt:", error);
      return NextResponse.json(
        { error: "Quiz attempt not found or invalid" },
        { status: 404 }
      );
    }

    if (quizAttempt.questionSetId !== questionSetId) {
      return NextResponse.json(
        { error: "Quiz attempt does not match question set" },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },
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

    // Check if answer already exists (update) or create new
    const existingAnswer = await prisma.questionAnswer.findFirst({
      where: {
        userId,
        quizAttemptId,
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
          quizAttemptId,
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
      quizAttemptId,
      isCorrect,
      pointsEarned,
      message: "Answer saved",
    });
  } catch (error) {
    console.error("Error submitting question:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
