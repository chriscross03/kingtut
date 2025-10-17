import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import slugify from "slugify";
import type { Course } from "../../../../generated/prisma";

const prisma = new PrismaClient();

interface CourseResponse {
  message: string;
  course: Course;
}

interface CoursesResponse {
  courses: Course[];
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<CourseResponse | ErrorResponse>> {
  try {
    const body = await request.json();
    const { name, description, isActive = true } = body;
    const slug = slugify(name, { lower: true, strict: true });

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Course name is required" },
        { status: 400 }
      );
    }

    // Check if course with this name already exists
    const existingCourse: Course | null = await prisma.course.findUnique({
      where: { name },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this name already exists" },
        { status: 409 }
      );
    }

    // Create the course
    const course: Course = await prisma.course.create({
      data: {
        name,
        slug,
        description: description || null,
        isActive,
      },
    });

    return NextResponse.json(
      {
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<
  NextResponse<CoursesResponse | ErrorResponse>
> {
  try {
    const courses: Course[] = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
