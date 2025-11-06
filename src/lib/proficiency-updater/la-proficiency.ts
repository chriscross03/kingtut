import { PrismaClient } from "@/generated/prisma";
import { determineProficiencyLevel } from "./determine-proficiency";

const prisma = new PrismaClient();

export async function updateLearningAreaProficiency(
  userId: number,
  learningAreaId: number
): Promise<void> {
  try {
    // Get all skills in this learning area
    const skills = await prisma.skill.findMany({
      where: { learningAreaId },
      select: { id: true },
    });

    const skillIds = skills.map((s) => s.id);

    // Get user's proficiency for all these skills
    const skillProficiencies = await prisma.skillProficiency.findMany({
      where: {
        userId,
        skillId: { in: skillIds },
      },
    });

    if (skillProficiencies.length === 0) {
      return; // No data yet
    }

    // Calculate average score
    const averageScore =
      skillProficiencies.reduce((sum, sp) => sum + sp.score, 0) /
      skillProficiencies.length;

    const level = determineProficiencyLevel(averageScore);

    // Update or create learning area proficiency
    const existing = await prisma.learningAreaProficiency.findUnique({
      where: {
        userId_learningAreaId: {
          userId,
          learningAreaId,
        },
      },
    });

    if (existing) {
      await prisma.learningAreaProficiency.update({
        where: {
          userId_learningAreaId: {
            userId,
            learningAreaId,
          },
        },
        data: {
          score: averageScore,
          level,
          skillsCompleted: skillProficiencies.length,
          totalSkills: skillIds.length,
          lastUpdated: new Date(),
        },
      });
    } else {
      await prisma.learningAreaProficiency.create({
        data: {
          userId,
          learningAreaId,
          score: averageScore,
          level,
          skillsCompleted: skillProficiencies.length,
          totalSkills: skillIds.length,
          lastUpdated: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error updating learning area proficiency:", error);
  }
}
