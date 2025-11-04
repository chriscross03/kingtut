/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.
  - Added the required column `pointsEarned` to the `QuestionAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `QuestionSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `QuestionSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPoints` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseProficiency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'BEGINNING',
    "score" REAL NOT NULL,
    "learningAreasCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalLearningAreas" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseProficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseProficiency_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseProficiency" ("courseId", "id", "lastUpdated", "learningAreasCompleted", "level", "score", "totalLearningAreas", "userId") SELECT "courseId", "id", "lastUpdated", "learningAreasCompleted", "level", "score", "totalLearningAreas", "userId" FROM "CourseProficiency";
DROP TABLE "CourseProficiency";
ALTER TABLE "new_CourseProficiency" RENAME TO "CourseProficiency";
CREATE UNIQUE INDEX "CourseProficiency_userId_courseId_key" ON "CourseProficiency"("userId", "courseId");
CREATE TABLE "new_LearningAreaProficiency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "learningAreaId" INTEGER NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'BEGINNING',
    "score" REAL NOT NULL,
    "skillsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalSkills" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningAreaProficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningAreaProficiency_learningAreaId_fkey" FOREIGN KEY ("learningAreaId") REFERENCES "LearningArea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LearningAreaProficiency" ("id", "lastUpdated", "learningAreaId", "level", "score", "skillsCompleted", "totalSkills", "userId") SELECT "id", "lastUpdated", "learningAreaId", "level", "score", "skillsCompleted", "totalSkills", "userId" FROM "LearningAreaProficiency";
DROP TABLE "LearningAreaProficiency";
ALTER TABLE "new_LearningAreaProficiency" RENAME TO "LearningAreaProficiency";
CREATE UNIQUE INDEX "LearningAreaProficiency_userId_learningAreaId_key" ON "LearningAreaProficiency"("userId", "learningAreaId");
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "points" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "questionSetId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "QuestionSet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "explanation", "id", "isActive", "questionSetId", "questionText", "updatedAt") SELECT "createdAt", "explanation", "id", "isActive", "questionSetId", "questionText", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_QuestionAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "quizAttemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "timeSpent" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionAnswer_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuestionAnswer" ("createdAt", "id", "isCorrect", "questionId", "quizAttemptId", "timeSpent", "userAnswer", "userId") SELECT "createdAt", "id", "isCorrect", "questionId", "quizAttemptId", "timeSpent", "userAnswer", "userId" FROM "QuestionAnswer";
DROP TABLE "QuestionAnswer";
ALTER TABLE "new_QuestionAnswer" RENAME TO "QuestionAnswer";
CREATE TABLE "new_QuestionSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "number" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 15,
    "difficultyLevelId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuestionSet_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "DifficultyLevel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuestionSet" ("createdAt", "difficultyLevelId", "id", "isActive", "number", "updatedAt") SELECT "createdAt", "difficultyLevelId", "id", "isActive", "number", "updatedAt" FROM "QuestionSet";
DROP TABLE "QuestionSet";
ALTER TABLE "new_QuestionSet" RENAME TO "QuestionSet";
CREATE TABLE "new_QuizAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "questionSetId" INTEGER NOT NULL,
    "score" REAL,
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
INSERT INTO "new_QuizAttempt" ("completedAt", "createdAt", "id", "isCompleted", "questionSetId", "score", "startedAt", "timeSpent", "updatedAt", "userId") SELECT "completedAt", "createdAt", "id", "isCompleted", "questionSetId", "score", "startedAt", "timeSpent", "updatedAt", "userId" FROM "QuizAttempt";
DROP TABLE "QuizAttempt";
ALTER TABLE "new_QuizAttempt" RENAME TO "QuizAttempt";
CREATE TABLE "new_SkillProficiency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'BEGINNING',
    "score" REAL NOT NULL,
    "questionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "questionSetsCompleted" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillProficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkillProficiency_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SkillProficiency" ("id", "lastUpdated", "level", "questionSetsCompleted", "questionsAnswered", "score", "skillId", "userId") SELECT "id", "lastUpdated", "level", "questionSetsCompleted", "questionsAnswered", "score", "skillId", "userId" FROM "SkillProficiency";
DROP TABLE "SkillProficiency";
ALTER TABLE "new_SkillProficiency" RENAME TO "SkillProficiency";
CREATE UNIQUE INDEX "SkillProficiency_userId_skillId_key" ON "SkillProficiency"("userId", "skillId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
