export interface Course {
  id: string;
  title: string;
  slug: string;
  track: string;
  level: string;
  duration?: string;
  description?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt?: string;
}

export const DEMO_COURSES: Course[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    title: "Data Analytics Bootcamp",
    slug: "data-analytics-bootcamp",
    track: "Data",
    level: "beginner",
    duration: "6 weeks",
    description: "Master SQL, Python, pandas, statistics, and visualization. Build a complete analytics dashboard as your capstone project.",
    isPublished: true,
  },
  {
    id: "c2000000-0000-0000-0000-000000000002",
    title: "AI & Machine Learning Foundations",
    slug: "ai-ml-foundations",
    track: "AI/ML",
    level: "intermediate",
    duration: "8 weeks",
    description: "Linear regression to deep learning and NLP. Hands-on scikit-learn, PyTorch, and transformer models.",
    isPublished: true,
  },
  {
    id: "c3000000-0000-0000-0000-000000000003",
    title: "Business Analytics Pro",
    slug: "business-analytics-pro",
    track: "Business",
    level: "beginner",
    duration: "5 weeks",
    description: "Excel, Power BI, SQL for reporting, and business communication. Present data-driven insights to executives.",
    isPublished: true,
  },
  {
    id: "c4000000-0000-0000-0000-000000000004",
    title: "Cloud Computing with AWS",
    slug: "cloud-computing-aws",
    track: "Cloud",
    level: "intermediate",
    duration: "7 weeks",
    description: "EC2, S3, Lambda, RDS, and serverless architecture. Prepare for AWS Solutions Architect Associate.",
    isPublished: true,
  },
  {
    id: "c5000000-0000-0000-0000-000000000005",
    title: "Agentic AI Engineering",
    slug: "agentic-ai-engineering",
    track: "AI/ML",
    level: "advanced",
    duration: "6 weeks",
    description: "Build autonomous AI agents with LangChain, RAG, tool use, and multi-agent systems using real LLM APIs.",
    isPublished: true,
  },
];

// Legacy support — kept for recommendation engine compatibility
export interface LegacyCourse {
  id: number;
  title: string;
  description: string;
  category?: string;
  level?: string;
}

export const AVAILABLE_COURSES: LegacyCourse[] = [
  { id: 1, title: "Data Science Bootcamp", description: "Master Python, pandas, ML algorithms and real-world data projects from scratch", category: "Data Science", level: "beginner" },
  { id: 2, title: "AI & Machine Learning", description: "Deep learning, neural networks, NLP and computer vision for aspiring AI engineers", category: "AI", level: "intermediate" },
  { id: 3, title: "Web Development Bootcamp", description: "Full-stack web development with React, Node.js, and modern web technologies", category: "Web Dev", level: "beginner" },
  { id: 4, title: "Business Analytics", description: "Excel, Power BI, SQL and data-driven decision making for business professionals", category: "Analytics", level: "beginner" },
  { id: 5, title: "Cloud Computing AWS", description: "AWS fundamentals, cloud architecture, deployment, and DevOps workflows", category: "Cloud", level: "intermediate" },
];
