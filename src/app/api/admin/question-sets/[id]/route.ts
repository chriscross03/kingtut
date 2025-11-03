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
  context: any
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const params = context?.params;
    const resolvedParams =
      typeof params?.then === "function" ? await params : params;
    const id = resolvedParams?.id;
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { id } = await params;
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
