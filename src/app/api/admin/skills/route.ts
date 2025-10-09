import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    // Verify the learning area exists
    const learningArea = await prisma.learningArea.findUnique({
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
    const existingSkill = await prisma.skill.findFirst({
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
    let difficultyLevel = await prisma.difficultyLevel.findFirst({
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
    const skill = await prisma.skill.create({
      data: {
        name,
        description: description || null,
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

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
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
