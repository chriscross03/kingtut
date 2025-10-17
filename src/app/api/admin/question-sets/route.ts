import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import type {
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

// Response types
interface QuestionSetResponse {
  message: string;
  questionSet: QuestionSetWithRelations;
}

interface QuestionSetsResponse {
  questionSets: QuestionSetWithRelations[];
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<QuestionSetResponse | ErrorResponse>> {
  try {
    const body = await request.json();
    const { number, skillId, isActive = true } = body;

    // Validate required fields
    if (!number) {
      return NextResponse.json(
        { error: "Question set number is required" },
        { status: 400 }
      );
    }

    if (!skillId) {
      return NextResponse.json(
        { error: "Skill selection is required" },
        { status: 400 }
      );
    }

    // Validate number is between 1-5
    const questionNumber = parseInt(number);
    if (questionNumber < 1 || questionNumber > 5) {
      return NextResponse.json(
        { error: "Question set number must be between 1 and 5" },
        { status: 400 }
      );
    }

    const parsedSkillId = parseInt(skillId);

    // Verify the skill exists
    const skill: SkillWithRelations | null = await prisma.skill.findUnique({
      where: { id: parsedSkillId },
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
    });

    if (!skill) {
      return NextResponse.json(
        { error: "Selected skill does not exist" },
        { status: 404 }
      );
    }

    // Check if question set with this number already exists for this skill
    const existingQuestionSet: QuestionSet | null =
      await prisma.questionSet.findFirst({
        where: {
          number: questionNumber,
          skillId: parsedSkillId,
        },
      });

    if (existingQuestionSet) {
      return NextResponse.json(
        {
          error: `Question set ${questionNumber} already exists for this skill`,
        },
        { status: 409 }
      );
    }

    // Create the question set
    const questionSet: QuestionSetWithRelations =
      await prisma.questionSet.create({
        data: {
          number: questionNumber,
          skillId: parsedSkillId,
          isActive,
        },
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

    return NextResponse.json(
      {
        message: "Question set created successfully",
        questionSet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question set:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<
  NextResponse<QuestionSetsResponse | ErrorResponse>
> {
  try {
    const questionSets: QuestionSetWithRelations[] =
      await prisma.questionSet.findMany({
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
        orderBy: { createdAt: "desc" },
      });

    return NextResponse.json({ questionSets });
  } catch (error) {
    console.error("Error fetching question sets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
