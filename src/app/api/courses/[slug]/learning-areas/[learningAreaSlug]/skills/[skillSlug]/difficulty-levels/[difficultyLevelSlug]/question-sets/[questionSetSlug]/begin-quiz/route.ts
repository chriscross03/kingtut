// app/api/courses/[slug]/learning-areas/[learningAreaSlug]/skills/[skillSlug]/difficulty-levels/[difficultyLevelSlug]/question-sets/[questionSetSlug]/start-attempt/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { createQuizAttempt } from "../quiz-attempt-helper";

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
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to start a quiz attempt" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { questionSetId, quizAttemptId } = body;

    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    const attempt = await createQuizAttempt(userId, questionSetId);

    return NextResponse.json({
      success: true,
      quizAttemptId: attempt.id,
      isCompleted: attempt.isCompleted,
      startedAt: attempt.startedAt,
    });
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
