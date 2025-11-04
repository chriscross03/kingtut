import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import type { Course, LearningArea } from "../../../../generated/prisma";
import { prisma } from "@/lib/prisma";

// Type for LearningArea with course relation
type LearningAreaWithCourse = LearningArea & {
  course: {
    name: string;
  };
};

// Response types
interface LearningAreaResponse {
  message: string;
  learningArea: LearningAreaWithCourse;
}

interface LearningAreasResponse {
  learningAreas: LearningAreaWithCourse[];
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LearningAreaResponse | ErrorResponse>> {
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

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Verify the course exists
    const course: Course | null = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Selected course does not exist" },
        { status: 404 }
      );
    }

    // Check if learning area with this name already exists in this course
    const existingLearningArea: LearningArea | null =
      await prisma.learningArea.findFirst({
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
    const learningArea: LearningAreaWithCourse =
      await prisma.learningArea.create({
        data: {
          name,
          slug,
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

export async function GET(): Promise<
  NextResponse<LearningAreasResponse | ErrorResponse>
> {
  try {
    const learningAreas: LearningAreaWithCourse[] =
      await prisma.learningArea.findMany({
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
