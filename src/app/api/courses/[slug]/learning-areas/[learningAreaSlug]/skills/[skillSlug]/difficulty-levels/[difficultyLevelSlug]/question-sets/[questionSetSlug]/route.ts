import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

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
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log("session", session);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to access quizzes" },
        { status: 401 }
      );
    }

    const {
      slug,
      learningAreaSlug,
      skillSlug,
      difficultyLevelSlug,
      questionSetSlug,
    } = await params;

    // Find the question set through the full hierarchy
    const questionSet = await prisma.questionSet.findFirst({
      where: {
        slug: questionSetSlug,
        isActive: true,
        difficultyLevel: {
          slug: difficultyLevelSlug,
          isActive: true,
          skill: {
            slug: skillSlug,
            isActive: true,
            learningArea: {
              slug: learningAreaSlug,
              isActive: true,
              course: {
                slug,
                isActive: true,
              },
            },
          },
        },
      },
      include: {
        questions: {
          where: { isActive: true },
          include: {
            options: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                optionText: true,
                orderIndex: true,
                // Don't include isCorrect - we don't want to leak answers
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
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
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    // Format response - remove explanation and points from questions (don't leak answers)
    const sanitizedQuestions = questionSet.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      points: q.points, // Keep points so users know how much each is worth
      options: q.options,
    }));

    return NextResponse.json({
      questionSet: {
        id: questionSet.id,
        title: questionSet.title,
        slug: questionSet.slug,
        description: questionSet.description,
        number: questionSet.number,
        totalQuestions: questionSet.totalQuestions,
        totalPoints: questionSet.totalPoints,
        estimatedMinutes: questionSet.estimatedMinutes,
        questions: sanitizedQuestions,
        difficultyLevel: {
          name: questionSet.difficultyLevel.name,
          skill: {
            name: questionSet.difficultyLevel.skill.name,
            learningArea: {
              name: questionSet.difficultyLevel.skill.learningArea.name,
              course: {
                name: questionSet.difficultyLevel.skill.learningArea.course
                  .name,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching question set:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
