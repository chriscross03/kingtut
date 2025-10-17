import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import type {
  Question,
  QuestionSet,
  Skill,
  DifficultyLevel,
  LearningArea,
  Course,
} from "../../../../generated/prisma";

const prisma = new PrismaClient();

// Type for nested relations
type LearningAreaWithCourse = LearningArea & {
  course: Course;
};

type DifficultyLevelWithRelations = DifficultyLevel & {
  learningArea: LearningAreaWithCourse;
};

type SkillWithRelations = Skill & {
  difficultyLevel: DifficultyLevelWithRelations;
};

type QuestionSetWithRelations = QuestionSet & {
  skill: SkillWithRelations;
};

type QuestionWithRelations = Question & {
  questionSet: QuestionSetWithRelations;
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

export async function POST(
  request: NextRequest
): Promise<NextResponse<QuestionResponse | ErrorResponse>> {
  try {
    const body = await request.json();
    const {
      questionText,
      options,
      correctAnswer,
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

    if (!correctAnswer) {
      return NextResponse.json(
        { error: "Correct answer is required" },
        { status: 400 }
      );
    }

    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set selection is required" },
        { status: 400 }
      );
    }

    const parsedQuestionSetId = parseInt(questionSetId);

    // Verify the question set exists
    const questionSet: QuestionSetWithRelations | null =
      await prisma.questionSet.findUnique({
        where: { id: parsedQuestionSetId },
        include: {
          skill: {
            include: {
              difficultyLevel: {
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
        options: parsedOptions,
        correctAnswer,
        explanation: explanation || null,
        questionSetId: parsedQuestionSetId,
        isActive,
      },
      include: {
        questionSet: {
          include: {
            skill: {
              include: {
                difficultyLevel: {
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
            skill: {
              include: {
                difficultyLevel: {
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
