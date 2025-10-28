/*
  Warnings:

  - Made the column `learningAreaId` on table `Skill` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "difficultyLevelId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "learningAreaId" INTEGER NOT NULL,
    CONSTRAINT "Skill_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "DifficultyLevel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Skill_learningAreaId_fkey" FOREIGN KEY ("learningAreaId") REFERENCES "LearningArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Skill" ("createdAt", "description", "difficultyLevelId", "id", "isActive", "learningAreaId", "name", "slug", "updatedAt") SELECT "createdAt", "description", "difficultyLevelId", "id", "isActive", "learningAreaId", "name", "slug", "updatedAt" FROM "Skill";
DROP TABLE "Skill";
ALTER TABLE "new_Skill" RENAME TO "Skill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
