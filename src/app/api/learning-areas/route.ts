import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const learningAreas = await prisma.learningArea.findMany({
      where: { isActive: true },
      include: {
        course: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ learningAreas });
  } catch (error) {
    console.error("Error fetching learning areas (public):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
