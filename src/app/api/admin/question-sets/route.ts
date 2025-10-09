import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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
    if (number < 1 || number > 5) {
      return NextResponse.json(
        { error: "Question set number must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify the skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: parseInt(skillId) },
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
    const existingQuestionSet = await prisma.questionSet.findFirst({
      where: {
        number: parseInt(number),
        skillId: parseInt(skillId),
      },
    });

    if (existingQuestionSet) {
      return NextResponse.json(
        { error: `Question set ${number} already exists for this skill` },
        { status: 409 }
      );
    }

    // Create the question set
    const questionSet = await prisma.questionSet.create({
      data: {
        number: parseInt(number),
        skillId: parseInt(skillId),
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

export async function GET() {
  try {
    const questionSets = await prisma.questionSet.findMany({
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
