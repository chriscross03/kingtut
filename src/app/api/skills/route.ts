import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const skills = await prisma.skill.findMany({
      where: { isActive: true },
      include: {
        learningArea: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error fetching skills (public):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
