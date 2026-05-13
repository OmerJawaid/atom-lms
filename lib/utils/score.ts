export function getRiskLevel(
  confidenceScore: number,
  careerReadinessScore: number
): "High" | "Medium" | "Low" {
  if (careerReadinessScore < 55) return "High";
  if (confidenceScore < 65) return "Medium";
  return "Low";
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 55) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBg(score: number): string {
  if (score >= 75) return "bg-green-100";
  if (score >= 55) return "bg-yellow-100";
  return "bg-red-100";
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy": return "text-green-600 bg-green-100";
    case "medium": return "text-yellow-600 bg-yellow-100";
    case "hard": return "text-red-600 bg-red-100";
    default: return "text-gray-600 bg-gray-100";
  }
}
