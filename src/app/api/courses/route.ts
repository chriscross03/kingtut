import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true }, // Only show active courses to students
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses (public):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
