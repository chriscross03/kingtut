import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import type {
  QuestionType,
  QuestionOption,
  Question,
  QuestionSet,
  Skill,
  DifficultyLevel,
  LearningArea,
  Course,
} from "@/generated/prisma";

// Type for nested relations
type LearningAreaWithCourse = LearningArea & {
  course: Course;
};

type SkillWithRelations = Skill & {
  learningArea: LearningAreaWithCourse;
};

type DifficultyLevelWithRelations = DifficultyLevel & {
  skill: SkillWithRelations;
};

type QuestionSetWithRelations = QuestionSet & {
  difficultyLevel: DifficultyLevelWithRelations;
};

type QuestionWithRelations = Question & {
  questionSet: QuestionSetWithRelations;
  options: QuestionOption[];
};

// Response types
interface QuestionResponse {
  message: string;
  question: QuestionWithRelations;
}

interface QuestionsResponse {
  questions: QuestionWithRelations[];
}

interface ErrorResponse {
  error: string;
}

// Request body type
interface CreateQuestionBody {
  questionText: string;
  questionType: QuestionType;
  points?: number;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
    orderIndex?: number;
  }>;
  explanation?: string;
  questionSetId: string | number;
  isActive?: boolean;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<QuestionResponse | ErrorResponse>> {
  try {
    const body: CreateQuestionBody = await request.json();
    const {
      questionText,
      questionType = "MULTIPLE_CHOICE",
      points = 1,
      options,
      explanation,
      questionSetId,
      isActive = true,
    } = body;

    // Validate required fields
    if (!questionText) {
      return NextResponse.json(
        { error: "Question text is required" },
        { status: 400 }
      );
    }

    if (!options) {
      return NextResponse.json(
        { error: "Answer options are required" },
        { status: 400 }
      );
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: "At least one answer option is required" },
        { status: 400 }
      );
    }

    const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      return NextResponse.json(
        { error: "At least one option must be marked as correct" },
        { status: 400 }
      );
    }

    if (
      (questionType === "MULTIPLE_CHOICE" || questionType === "TRUE_FALSE") &&
      options.filter((opt) => opt.isCorrect).length > 1
    ) {
      return NextResponse.json(
        {
          error:
            "Only one option can be correct for multiple choice and true/false questions",
        },
        { status: 400 }
      );
    }

    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set selection is required" },
        { status: 400 }
      );
    }

    const parsedQuestionSetId = parseInt(questionSetId.toString());

    // Verify the question set exists
    const questionSet: QuestionSetWithRelations | null =
      await prisma.questionSet.findUnique({
        where: { id: parsedQuestionSetId },
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

    // Parse options if it's a string
    let parsedOptions: string[];
    try {
      parsedOptions =
        typeof options === "string" ? JSON.parse(options) : options;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid options format. Please provide valid JSON array" },
        { status: 400 }
      );
    }

    // Validate parsedOptions is an array
    if (!Array.isArray(parsedOptions)) {
      return NextResponse.json(
        { error: "Options must be an array" },
        { status: 400 }
      );
    }

    // Create the question
    const question: QuestionWithRelations = await prisma.question.create({
      data: {
        questionText,
        questionType,
        points,
        explanation: explanation || null,
        questionSetId: parsedQuestionSetId,
        isActive,
        options: {
          create: options.map((option, index) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
            orderIndex: option.orderIndex ?? index,
          })),
        },
      },
      include: {
        questionSet: {
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
        },
        options: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    const totalQuestions = await prisma.question.count({
      where: { questionSetId: parsedQuestionSetId, isActive: true },
    });

    const totalPointsResult = await prisma.question.aggregate({
      where: { questionSetId: parsedQuestionSetId, isActive: true },
      _sum: { points: true },
    });

    await prisma.questionSet.update({
      where: { id: parsedQuestionSetId },
      data: {
        totalQuestions,
        totalPoints: totalPointsResult._sum.points || 0,
      },
    });

    return NextResponse.json(
      {
        message: "Question created successfully",
        question,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<
  NextResponse<QuestionsResponse | ErrorResponse>
> {
  try {
    const questions: QuestionWithRelations[] = await prisma.question.findMany({
      include: {
        questionSet: {
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
        },
        options: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
