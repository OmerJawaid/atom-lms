import { z } from "zod";

export const ProfileRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters").max(1000, "Text must be under 1000 characters"),
});

export const RecommendRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters").max(1000, "Text must be under 1000 characters"),
});

export const QuizHistoryItemSchema = z.object({
  question_id: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  correct: z.boolean(),
});

export const QuizRequestSchema = z.object({
  history: z.array(QuizHistoryItemSchema).min(1, "Quiz history must have at least 1 item"),
});

export const OnboardingRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  text: z.string().min(10, "Learning statement must be at least 10 characters"),
  quizHistory: z.array(QuizHistoryItemSchema).optional(),
});

export type ProfileRequest = z.infer<typeof ProfileRequestSchema>;
export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
export type QuizRequest = z.infer<typeof QuizRequestSchema>;
export type OnboardingRequest = z.infer<typeof OnboardingRequestSchema>;
