import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const difficultyLevels = await prisma.difficultyLevel.findMany({
      where: { isActive: true },
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
    console.error("Error fetching difficulty levels (public):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
