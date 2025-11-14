import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { QuestionType } from "@/generated/prisma";

interface SaveQuestionsRequest {
  questionSetId: number;
  questions: Array<{
    questionText: string;
    questionType: QuestionType;
    points: number;
    order?: number;
    explanation?: string;
    options: Array<{
      optionText: string;
      isCorrect: boolean;
      orderIndex?: number;
    }>;
  }>;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface SuccessResponse {
  success: true;
  count: number;
  message: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check
    // if (session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const body: SaveQuestionsRequest = await request.json();
    const { questionSetId, questions } = body;

    // Validate required fields
    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "At least one question is required" },
        { status: 400 }
      );
    }

    // Verify question set exists
    const questionSet = await prisma.questionSet.findUnique({
      where: { id: questionSetId },
      include: {
        difficultyLevel: {
          include: {
            skill: {
              include: {
                learningArea: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Selected question set does not exist" },
        { status: 404 }
      );
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText) {
        return NextResponse.json(
          { error: `Question ${i + 1}: Question text is required` },
          { status: 400 }
        );
      }

      if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
        return NextResponse.json(
          {
            error: `Question ${i + 1}: At least one answer option is required`,
          },
          { status: 400 }
        );
      }

      const hasCorrectAnswer = q.options.some((opt) => opt.isCorrect);
      if (!hasCorrectAnswer) {
        return NextResponse.json(
          {
            error: `Question ${
              i + 1
            }: At least one option must be marked as correct`,
          },
          { status: 400 }
        );
      }

      if (
        (q.questionType === "MULTIPLE_CHOICE" ||
          q.questionType === "TRUE_FALSE") &&
        q.options.filter((opt) => opt.isCorrect).length > 1
      ) {
        return NextResponse.json(
          {
            error: `Question ${i + 1}: Only one option can be correct for ${
              q.questionType
            } questions`,
          },
          { status: 400 }
        );
      }
    }

    // Create all questions in a transaction
    const createdQuestions = await prisma.$transaction(
      questions.map((q, index) =>
        prisma.question.create({
          data: {
            questionText: q.questionText,
            questionType: q.questionType,
            points: q.points || 1,
            explanation: q.explanation || null,
            questionSetId,
            isActive: true,
            options: {
              create: q.options.map((opt, optIndex) => ({
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
                orderIndex: opt.orderIndex ?? optIndex,
              })),
            },
          },
          include: {
            options: {
              orderBy: {
                orderIndex: "asc",
              },
            },
          },
        })
      )
    );

    // Update question set totals (matching your existing logic)
    const totalQuestions = await prisma.question.count({
      where: { questionSetId, isActive: true },
    });

    const totalPointsResult = await prisma.question.aggregate({
      where: { questionSetId, isActive: true },
      _sum: { points: true },
    });

    await prisma.questionSet.update({
      where: { id: questionSetId },
      data: {
        totalQuestions,
        totalPoints: totalPointsResult._sum.points || 0,
      },
    });

    console.log(
      `Successfully saved ${createdQuestions.length} questions to question set ${questionSetId}`
    );

    return NextResponse.json(
      {
        success: true,
        count: createdQuestions.length,
        message: `Successfully saved ${createdQuestions.length} question${
          createdQuestions.length === 1 ? "" : "s"
        } to the question set`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving questions:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
