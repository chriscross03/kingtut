import { updateLearningAreaProficiency } from "./la-proficiency";
import { updateSkillProficiency } from "./skill-proficiency";
import { updateCourseProficiency } from "./course-proficiency";

export async function updateAllProficiencies(
  userId: number,
  skillId: number,
  learningAreaId: number,
  courseId: number,
  score: number,
  questionsAnswered: number = 1
): Promise<void> {
  // Update in sequence (skill → learning area → course)
  await updateSkillProficiency(userId, skillId, score, questionsAnswered);
  await updateLearningAreaProficiency(userId, learningAreaId);
  await updateCourseProficiency(userId, courseId);
}
