/*
  Warnings:

  - You are about to drop the column `score` on the `QuizAttempt` table. All the data in the column will be lost.
  - Added the required column `earnedPoints` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "questionSetId" INTEGER NOT NULL,
    "earnedPoints" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "timeSpent" INTEGER,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "QuestionSet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizAttempt" ("completedAt", "createdAt", "id", "isCompleted", "passed", "percentage", "questionSetId", "startedAt", "timeSpent", "totalPoints", "updatedAt", "userId") SELECT "completedAt", "createdAt", "id", "isCompleted", "passed", "percentage", "questionSetId", "startedAt", "timeSpent", "totalPoints", "updatedAt", "userId" FROM "QuizAttempt";
DROP TABLE "QuizAttempt";
ALTER TABLE "new_QuizAttempt" RENAME TO "QuizAttempt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
