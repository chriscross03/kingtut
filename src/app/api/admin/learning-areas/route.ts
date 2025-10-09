import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, courseId, isActive = true } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Learning area name is required" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course selection is required" },
        { status: 400 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Selected course does not exist" },
        { status: 404 }
      );
    }

    // Check if learning area with this name already exists in this course
    const existingLearningArea = await prisma.learningArea.findFirst({
      where: {
        name,
        courseId: parseInt(courseId),
      },
    });

    if (existingLearningArea) {
      return NextResponse.json(
        {
          error: "A learning area with this name already exists in this course",
        },
        { status: 409 }
      );
    }

    // Create the learning area
    const learningArea = await prisma.learningArea.create({
      data: {
        name,
        description: description || null,
        courseId: parseInt(courseId),
        isActive,
      },
      include: {
        course: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Learning area created successfully",
        learningArea,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating learning area:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const learningAreas = await prisma.learningArea.findMany({
      include: {
        course: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ learningAreas });
  } catch (error) {
    console.error("Error fetching learning areas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
