import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isActive = true } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Course name is required" },
        { status: 400 }
      );
    }

    // Check if course with this name already exists
    const existingCourse = await prisma.course.findUnique({
      where: { name },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this name already exists" },
        { status: 409 }
      );
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        name,
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

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
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
