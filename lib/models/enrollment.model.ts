export interface Enrollment {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  cohortId?: string;
  cohortName?: string;
  enrollmentStatus: "active" | "paused" | "completed" | "dropped";
  paymentStatus: "demo" | "paid" | "pending" | "refunded";
  progressPercent: number;
  completionStatus: "not_started" | "in_progress" | "completed";
  enrolledAt: string;
}
