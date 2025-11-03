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
      difficultyLevelSlug: string;
    }>;
  }
) {
  try {
    const { slug, learningAreaSlug, skillSlug, difficultyLevelSlug } =
      await params;

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
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Then fetch the specific difficulty level for this skill
    const difficultyLevel = await prisma.difficultyLevel.findFirst({
      where: {
        slug: difficultyLevelSlug,
        skillId: skill.id, // Use the skill ID directly
        isActive: true,
      },
      include: {
        questionSets: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        skill: true,
      },
    });

    if (!difficultyLevel) {
      return NextResponse.json(
        { error: "Difficulty level not found for this skill" },
        { status: 404 }
      );
    }

    return NextResponse.json({ difficultyLevel: [difficultyLevel] });
  } catch (error) {
    console.error("Error fetching difficulty level:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
