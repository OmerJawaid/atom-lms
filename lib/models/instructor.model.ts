export interface Instructor {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  bio?: string;
  assignedCourses: number;
  rating: number;
  status: "active" | "inactive" | "pending";
  createdAt?: string;
  assignedCohorts?: number;
  avgLearnerScore?: number;
  completionRate?: number;
}
