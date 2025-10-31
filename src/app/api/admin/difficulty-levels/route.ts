import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import slugify from "slugify";

const prisma = new PrismaClient();

// POST - Create a new difficulty level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, level, skillId, description, isActive = true } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Difficulty level name is required" },
        { status: 400 }
      );
    }

    if (!level) {
      return NextResponse.json(
        { error: "Level number is required" },
        { status: 400 }
      );
    }

    if (!skillId) {
      return NextResponse.json(
        { error: "Skill selection is required" },
        { status: 400 }
      );
    }

    // Verify the skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: parseInt(skillId) },
      include: {
        learningArea: {
          include: {
            course: true,
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

    // Check if difficulty level with this name already exists for this skill
    const existingDifficultyLevel = await prisma.difficultyLevel.findFirst({
      where: {
        name,
        skillId: parseInt(skillId),
      },
    });

    if (existingDifficultyLevel) {
      return NextResponse.json(
        {
          error:
            "A difficulty level with this name already exists for this skill",
        },
        { status: 409 }
      );
    }

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Create the difficulty level
    const difficultyLevel = await prisma.difficultyLevel.create({
      data: {
        name,
        slug,
        description,
        level: parseInt(level),
        skillId: parseInt(skillId),
        isActive,
      },
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
    });

    return NextResponse.json(
      {
        message: "Difficulty level created successfully",
        difficultyLevel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating difficulty level:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch all difficulty levels
export async function GET() {
  try {
    const difficultyLevels = await prisma.difficultyLevel.findMany({
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
      orderBy: [
        { skill: { learningArea: { courseId: "asc" } } },
        { skill: { learningAreaId: "asc" } },
        { skillId: "asc" },
        { level: "asc" },
      ],
    });

    return NextResponse.json({ difficultyLevels });
  } catch (error) {
    console.error("Error fetching difficulty levels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
