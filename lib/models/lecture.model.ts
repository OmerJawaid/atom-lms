export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  durationMinutes: number;
  orderIndex: number;
  lectureType: "video" | "reading" | "lab";
  isPublished: boolean;
  createdAt?: string;
}

export interface LectureProgress {
  id: string;
  studentId: string;
  lectureId: string;
  courseId: string;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
  completedAt?: string;
  createdAt?: string;
}
