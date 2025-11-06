import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import type {
  Skill,
  DifficultyLevel,
  LearningArea,
  Course,
} from "../../../../generated/prisma";

// Type for nested relations
type LearningAreaWithCourse = LearningArea & {
  course: Course;
};

type SkillWithRelations = Skill & {
  learningArea: LearningAreaWithCourse;
  difficultyLevels?: DifficultyLevel[];
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
    const { name, description, learningAreaId, isActive = true } = body;

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
        learningAreaId: parseInt(learningAreaId),
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

    // Create the skill
    const skill: SkillWithRelations = await prisma.skill.create({
      data: {
        name,
        slug,
        description: description || null,
        learningAreaId: parseInt(learningAreaId),
        isActive,
      },
      include: {
        learningArea: {
          include: {
            course: true,
          },
        },
        difficultyLevels: true,
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
        learningArea: {
          include: {
            course: true,
          },
        },
        difficultyLevels: {
          where: { isActive: true },
          orderBy: { level: "asc" },
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
