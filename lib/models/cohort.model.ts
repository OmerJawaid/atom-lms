export interface Cohort {
  id: string;
  name: string;
  programId?: string;
  instructorId?: string;
  programName?: string;
  instructorName?: string;
  startDate?: string;
  endDate?: string;
  capacity: number;
  enrolledCount: number;
  status: "upcoming" | "active" | "completed" | "paused";
  averageCompletion?: number;
  averageQuizScore?: number;
  riskCount?: number;
  createdAt?: string;
}
