import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helper";

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
    // ✅ Require authentication using your helper
    const currentUser = await requireAuth();

    const {
      slug,
      learningAreaSlug,
      skillSlug,
      difficultyLevelSlug,
      questionSetSlug,
    } = await params;

    // ✅ Find the question set (same logic as before)
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

    // ✅ Sanitize response (don’t leak correct answers)
    const sanitizedQuestions = questionSet.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      points: q.points,
      options: q.options,
    }));

    return NextResponse.json({
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
              name: questionSet.difficultyLevel.skill.learningArea.course.name,
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
