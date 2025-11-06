import { ProficiencyLevel } from "@/generated/prisma";

export function determineProficiencyLevel(score: number): ProficiencyLevel {
  if (score >= 90) return "SIGMA";
  if (score >= 75) return "ADVANCED";
  if (score >= 50) return "INTERMEDIATE";
  return "BEGINNING";
}
