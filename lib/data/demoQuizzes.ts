export interface QuizMeta {
  id: string;
  courseId: string;
  lectureId?: string;
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  passingScore: number;
  timeLimitMinutes: number;
  isAdaptive: boolean;
  isPublished: boolean;
}

export const DEMO_QUIZZES: QuizMeta[] = [
  // Data Analytics Bootcamp
  { id: "q1000000-0000-0000-0000-000000000001", courseId: "c1000000-0000-0000-0000-000000000001", lectureId: "l1000000-0000-0000-0000-000000000002", title: "SQL Foundations Quiz", description: "Test your knowledge of SQL queries, joins, and aggregations", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
  { id: "q1000000-0000-0000-0000-000000000002", courseId: "c1000000-0000-0000-0000-000000000001", lectureId: "l1000000-0000-0000-0000-000000000001", title: "Data Analytics Basics Quiz", description: "Fundamentals of data analytics concepts and methodologies", difficulty: "easy", passingScore: 60, timeLimitMinutes: 10, isAdaptive: true, isPublished: true },
  { id: "q1000000-0000-0000-0000-000000000003", courseId: "c1000000-0000-0000-0000-000000000001", lectureId: "l1000000-0000-0000-0000-000000000003", title: "Python Data Analysis Quiz", description: "Test your pandas, NumPy, and data manipulation skills", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
  { id: "q1000000-0000-0000-0000-000000000004", courseId: "c1000000-0000-0000-0000-000000000001", lectureId: "l1000000-0000-0000-0000-000000000005", title: "Statistical Foundations Quiz", description: "Probability, distributions, and hypothesis testing", difficulty: "hard", passingScore: 70, timeLimitMinutes: 20, isAdaptive: true, isPublished: true },
  // AI/ML Foundations
  { id: "q2000000-0000-0000-0000-000000000001", courseId: "c2000000-0000-0000-0000-000000000002", lectureId: "l2000000-0000-0000-0000-000000000001", title: "ML Foundations Quiz", description: "Core machine learning concepts and algorithms", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
  { id: "q2000000-0000-0000-0000-000000000002", courseId: "c2000000-0000-0000-0000-000000000002", lectureId: "l2000000-0000-0000-0000-000000000003", title: "Decision Trees & Ensembles Quiz", description: "Tree-based algorithms and ensemble methods", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
  { id: "q2000000-0000-0000-0000-000000000003", courseId: "c2000000-0000-0000-0000-000000000002", lectureId: "l2000000-0000-0000-0000-000000000004", title: "Neural Networks Quiz", description: "Deep learning fundamentals, backpropagation, and regularization", difficulty: "hard", passingScore: 65, timeLimitMinutes: 20, isAdaptive: true, isPublished: true },
  { id: "q2000000-0000-0000-0000-000000000004", courseId: "c2000000-0000-0000-0000-000000000002", lectureId: "l2000000-0000-0000-0000-000000000005", title: "Model Evaluation Quiz", description: "Metrics, cross-validation, and bias-variance tradeoff", difficulty: "hard", passingScore: 65, timeLimitMinutes: 20, isAdaptive: true, isPublished: true },
  // Business Analytics
  { id: "q3000000-0000-0000-0000-000000000001", courseId: "c3000000-0000-0000-0000-000000000003", lectureId: "l3000000-0000-0000-0000-000000000001", title: "Business Analytics Fundamentals Quiz", description: "KPIs, business metrics, and analytics frameworks", difficulty: "easy", passingScore: 60, timeLimitMinutes: 10, isAdaptive: false, isPublished: true },
  { id: "q3000000-0000-0000-0000-000000000002", courseId: "c3000000-0000-0000-0000-000000000003", lectureId: "l3000000-0000-0000-0000-000000000002", title: "Excel Analytics Quiz", description: "Advanced Excel functions, PivotTables, and Power Query", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: false, isPublished: true },
  { id: "q3000000-0000-0000-0000-000000000003", courseId: "c3000000-0000-0000-0000-000000000003", lectureId: "l3000000-0000-0000-0000-000000000003", title: "Power BI Quiz", description: "DAX, data modeling, and Power BI report building", difficulty: "hard", passingScore: 65, timeLimitMinutes: 20, isAdaptive: true, isPublished: true },
  // Cloud AWS
  { id: "q4000000-0000-0000-0000-000000000001", courseId: "c4000000-0000-0000-0000-000000000004", lectureId: "l4000000-0000-0000-0000-000000000001", title: "AWS Cloud Fundamentals Quiz", description: "Core AWS services, IAM, and cloud concepts", difficulty: "easy", passingScore: 60, timeLimitMinutes: 12, isAdaptive: true, isPublished: true },
  { id: "q4000000-0000-0000-0000-000000000002", courseId: "c4000000-0000-0000-0000-000000000004", lectureId: "l4000000-0000-0000-0000-000000000002", title: "EC2 and Compute Quiz", description: "EC2 instances, Auto Scaling, and load balancing", difficulty: "medium", passingScore: 65, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
  // Agentic AI
  { id: "q5000000-0000-0000-0000-000000000001", courseId: "c5000000-0000-0000-0000-000000000005", lectureId: "l5000000-0000-0000-0000-000000000001", title: "Agentic AI Fundamentals Quiz", description: "AI agents, the agent loop, and frameworks", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
  { id: "q5000000-0000-0000-0000-000000000002", courseId: "c5000000-0000-0000-0000-000000000005", lectureId: "l5000000-0000-0000-0000-000000000002", title: "Prompt Engineering Quiz", description: "Advanced prompting, CoT, and LLM parameters", difficulty: "medium", passingScore: 60, timeLimitMinutes: 15, isAdaptive: true, isPublished: true },
];

export function getQuizzesByCourse(courseId: string): QuizMeta[] {
  return DEMO_QUIZZES.filter((q) => q.courseId === courseId);
}

export function getQuizById(id: string): QuizMeta | undefined {
  return DEMO_QUIZZES.find((q) => q.id === id);
}

export function getQuizByLecture(lectureId: string): QuizMeta | undefined {
  return DEMO_QUIZZES.find((q) => q.lectureId === lectureId);
}
