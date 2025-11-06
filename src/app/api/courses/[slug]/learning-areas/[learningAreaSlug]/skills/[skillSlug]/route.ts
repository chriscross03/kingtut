import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

console.log("Runtime:", process.env.NEXT_RUNTIME);

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
          include: {
            questionSets: true,
          },
        },
      },
    });
    console.error("Skill:", skill);

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
