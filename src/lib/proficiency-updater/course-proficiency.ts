import { PrismaClient, ProficiencyLevel } from "@/generated/prisma";
import { determineProficiencyLevel } from "./determine-proficiency";

const prisma = new PrismaClient();

export async function updateCourseProficiency(
  userId: number,
  courseId: number
): Promise<void> {
  try {
    // Get all learning areas in this course
    const learningAreas = await prisma.learningArea.findMany({
      where: { courseId },
      select: { id: true },
    });

    const learningAreaIds = learningAreas.map((la) => la.id);

    // Get user's proficiency for all these learning areas
    const laProficiencies = await prisma.learningAreaProficiency.findMany({
      where: {
        userId,
        learningAreaId: { in: learningAreaIds },
      },
    });

    if (laProficiencies.length === 0) {
      return; // No data yet
    }

    // Calculate average score
    const averageScore =
      laProficiencies.reduce((sum, lap) => sum + lap.score, 0) /
      laProficiencies.length;

    const level = determineProficiencyLevel(averageScore);

    // Update or create course proficiency
    const existing = await prisma.courseProficiency.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      await prisma.courseProficiency.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          score: averageScore,
          level,
          learningAreasCompleted: laProficiencies.length,
          totalLearningAreas: learningAreaIds.length,
          lastUpdated: new Date(),
        },
      });
    } else {
      await prisma.courseProficiency.create({
        data: {
          userId,
          courseId,
          score: averageScore,
          level,
          learningAreasCompleted: laProficiencies.length,
          totalLearningAreas: learningAreaIds.length,
          lastUpdated: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error updating course proficiency:", error);
  }
}
