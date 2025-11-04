// lib/proficiency-updater.ts

import { PrismaClient, ProficiencyLevel } from "@/generated/prisma";
import { calculateWeightedScore } from "./calculate-weighted-score";
import { determineProficiencyLevel } from "./determine-proficiency";

const prisma = new PrismaClient();

/**
 * Calculate weighted score (blend old and new scores)
 * @param oldScore - Previous score
 * @param newScore - New score
 * @param oldWeight - Weight for old score (default 0.7 = 70%)
 * @param newWeight - Weight for new score (default 0.3 = 30%)
 */

export async function updateSkillProficiency(
  userId: number,
  skillId: number,
  newScore: number,
  questionsAnswered: number = 1
): Promise<void> {
  try {
    const existing = await prisma.skillProficiency.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    if (existing) {
      // Update existing proficiency with weighted average
      const updatedScore = calculateWeightedScore(existing.score, newScore);
      const level = determineProficiencyLevel(updatedScore);

      await prisma.skillProficiency.update({
        where: {
          userId_skillId: {
            userId,
            skillId,
          },
        },
        data: {
          score: updatedScore,
          level,
          questionsAnswered: { increment: questionsAnswered },
          questionSetsCompleted: { increment: 1 },
          lastUpdated: new Date(),
        },
      });
    } else {
      // Create new proficiency record
      const level = determineProficiencyLevel(newScore);

      await prisma.skillProficiency.create({
        data: {
          userId,
          skillId,
          score: newScore,
          level,
          questionsAnswered,
          questionSetsCompleted: 1,
          lastUpdated: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error updating skill proficiency:", error);
    // Don't throw - proficiency updates shouldn't break quiz submission
  }
}
