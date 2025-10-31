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

    // Fetch the specific difficulty level
    const difficultyLevel = await prisma.difficultyLevel.findFirst({
      where: {
        slug: difficultyLevelSlug,
        isActive: true,
        skill: {
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
      },
      include: {
        questionSets: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" }, // keep consistent with prior ordering
        },
        skill: true, // include skill info if needed
      },
    });

    console.log(difficultyLevel?.questionSets);

    if (!difficultyLevel) {
      return NextResponse.json(
        { error: "Difficulty level not found" },
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
