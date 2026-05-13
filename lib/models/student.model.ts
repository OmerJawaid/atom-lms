export interface Student {
  id: string;
  name: string;
  email: string;
  inputText?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  primaryGoal?: string;
  learningStyle?: string;
  confidenceScore?: number;
  preferredCourse?: string;
  careerReadinessScore?: number;
  createdAt?: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  inputText?: string;
  skillLevel?: string;
  primaryGoal?: string;
  learningStyle?: string;
  confidenceScore?: number;
  preferredCourse?: string;
  careerReadinessScore?: number;
}
