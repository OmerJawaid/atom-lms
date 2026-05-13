export interface CourseRecommendation {
  id: number;
  title: string;
  description: string;
  similarityScore: number;
}

export interface RawRecommendation {
  id: number;
  title: string;
  description: string;
  similarity_score: number;
}

export interface RawRecommendResponse {
  success: boolean;
  profile: {
    skill_level: string;
    primary_goal: string;
    learning_style: string;
    confidence_score: number;
  };
  recommendations: RawRecommendation[];
}
