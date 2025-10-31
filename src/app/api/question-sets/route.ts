import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const questionSets = await prisma.questionSet.findMany({
      where: { isActive: true },
      include: {
        difficultyLevel: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ questionSets });
  } catch (error) {
    console.error("Error fetching question sets (public):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
