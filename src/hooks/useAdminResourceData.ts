import { useEffect } from "react";
import { useResourceData } from "./useResourceData";

export function useAdminResourceData(activeTab: string) {
  const resources = useResourceData();

  useEffect(() => {
    const {
      courses,
      learningAreas,
      skills,
      difficultyLevels,
      questionSets,
      questions,
    } = resources;

    if (activeTab === "course" && !courses.data.length) courses.refresh();
    else if (activeTab === "learningArea" && !learningAreas.data.length)
      learningAreas.refresh();
    else if (activeTab === "skill" && !skills.data.length) skills.refresh();
    else if (activeTab === "difficultyLevel" && !difficultyLevels.data.length)
      difficultyLevels.refresh();
    else if (activeTab === "questionSet" && !questionSets.data.length)
      questionSets.refresh();
    else if (activeTab === "question" && !questions.data.length)
      questions.refresh();
  }, [activeTab]);

  return resources;
}
