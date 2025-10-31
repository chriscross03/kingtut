import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
      learningAreaSlug: string;
      skillSlug: string;
    }>;
  }
) {
  try {
    const { slug, learningAreaSlug, skillSlug } = await params;

    // Find the specific skill that belongs to the given course and learning area
    const skill = await prisma.skill.findFirst({
      where: {
        slug: skillSlug,
        isActive: true,
        learningArea: {
          slug: learningAreaSlug,
          isActive: true,
          course: {
            slug,
            isActive: true,
          },
        },
      },
      include: {
        difficultyLevels: {
          where: { isActive: true },
          orderBy: { level: "asc" },
        },
      },
    });

    console.log(skill?.difficultyLevels);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ skill: [skill] });
  } catch (error) {
    console.error("Error fetching difficulty levels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
