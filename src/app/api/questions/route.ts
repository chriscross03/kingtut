import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      include: {
        questionSet: {
          include: {
            skill: {
              include: {
                difficultyLevel: {
                  include: {
                    learningArea: {
                      include: { course: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions (public):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
