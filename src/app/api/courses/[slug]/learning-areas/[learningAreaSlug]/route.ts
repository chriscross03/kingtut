import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; learningAreaSlug: string }> }
) {
  try {
    // Await the params
    const { slug, learningAreaSlug } = await params;

    // Fetch the learning area belonging to the specific course
    const learningArea = await prisma.learningArea.findFirst({
      where: {
        slug: learningAreaSlug,
        isActive: true,
        course: { slug }, // ensures the learning area belongs to this course
      },
      include: {
        skills: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          include: {
            difficultyLevels: {
              where: { isActive: true },
              orderBy: { level: "asc" },
            },
          },
        },
      },
    });

    if (!learningArea) {
      return NextResponse.json(
        { error: "Learning area not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ learningAreas: [learningArea] });
  } catch (error) {
    console.error("Error fetching learning area:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
