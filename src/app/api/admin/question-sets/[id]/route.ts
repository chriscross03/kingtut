import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }

    await prisma.questionSet.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
