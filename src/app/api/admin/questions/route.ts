import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    // Verify the question set exists
    const questionSet = await prisma.questionSet.findUnique({
      where: { id: parseInt(questionSetId) },
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
    let parsedOptions;
    try {
      parsedOptions =
        typeof options === "string" ? JSON.parse(options) : options;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid options format. Please provide valid JSON array" },
        { status: 400 }
      );
    }

    // Create the question
    const question = await prisma.question.create({
      data: {
        questionText,
        options: parsedOptions,
        correctAnswer,
        explanation: explanation || null,
        questionSetId: parseInt(questionSetId),
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

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
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
