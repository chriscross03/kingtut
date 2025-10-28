import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import slugify from "slugify";
import type {
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

// Response types
interface SkillResponse {
  message: string;
  skill: SkillWithRelations;
}

interface SkillsResponse {
  skills: SkillWithRelations[];
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SkillResponse | ErrorResponse>> {
  try {
    const body = await request.json();
    const {
      name,
      description,
      learningAreaId,
      difficulty,
      isActive = true,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }

    if (!learningAreaId) {
      return NextResponse.json(
        { error: "Learning area selection is required" },
        { status: 400 }
      );
    }

    if (!difficulty) {
      return NextResponse.json(
        { error: "Difficulty selection is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Verify the learning area exists
    const learningArea: LearningAreaWithCourse | null =
      await prisma.learningArea.findUnique({
        where: { id: parseInt(learningAreaId) },
        include: { course: true },
      });

    if (!learningArea) {
      return NextResponse.json(
        { error: "Selected learning area does not exist" },
        { status: 404 }
      );
    }

    // Check if skill with this name already exists in this learning area
    const existingSkill: Skill | null = await prisma.skill.findFirst({
      where: {
        name,
        difficultyLevel: {
          learningAreaId: parseInt(learningAreaId),
        },
      },
    });

    if (existingSkill) {
      return NextResponse.json(
        {
          error: "A skill with this name already exists in this learning area",
        },
        { status: 409 }
      );
    }

    // Find or create the difficulty level
    let difficultyLevel: DifficultyLevel | null =
      await prisma.difficultyLevel.findFirst({
        where: {
          name: difficulty,
          learningAreaId: parseInt(learningAreaId),
        },
      });

    if (!difficultyLevel) {
      // Create the difficulty level if it doesn't exist
      const levelNumber =
        difficulty === "Beginner" ? 1 : difficulty === "Intermediate" ? 2 : 3;

      difficultyLevel = await prisma.difficultyLevel.create({
        data: {
          name: difficulty,
          level: levelNumber,
          learningAreaId: parseInt(learningAreaId),
        },
      });
    }

    // Create the skill
    const skill: SkillWithRelations = await prisma.skill.create({
      data: {
        name,
        slug,
        description: description || null,
        learningAreaId: parseInt(learningAreaId),
        difficultyLevelId: difficultyLevel.id,
        isActive,
      },
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

    return NextResponse.json(
      {
        message: "Skill created successfully",
        skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<
  NextResponse<SkillsResponse | ErrorResponse>
> {
  try {
    const skills: SkillWithRelations[] = await prisma.skill.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
