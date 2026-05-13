import { CourseRecommendation } from "@/lib/models/recommendation.model";

export const FALLBACK_RECOMMENDATIONS: CourseRecommendation[] = [
  {
    id: 1,
    title: "Data Science Bootcamp",
    description: "Master Python, pandas, ML algorithms and real-world data projects from scratch",
    similarityScore: 82,
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    description: "Deep learning, neural networks, NLP and computer vision for aspiring AI engineers",
    similarityScore: 77,
  },
  {
    id: 4,
    title: "Business Analytics",
    description: "Excel, Power BI, SQL and data-driven decision making for business professionals",
    similarityScore: 69,
  },
];

export const DEMO_RECOMMENDATIONS: Record<string, CourseRecommendation[]> = {
  "demo-student-1": [
    { id: 1, title: "Data Science Bootcamp", description: "Master Python, pandas, ML algorithms and real-world data projects from scratch", similarityScore: 82 },
    { id: 2, title: "AI & Machine Learning", description: "Deep learning, neural networks, NLP and computer vision for aspiring AI engineers", similarityScore: 77 },
    { id: 4, title: "Business Analytics", description: "Excel, Power BI, SQL and data-driven decision making for business professionals", similarityScore: 69 },
  ],
  "demo-student-2": [
    { id: 2, title: "AI & Machine Learning", description: "Deep learning, neural networks, NLP and computer vision for aspiring AI engineers", similarityScore: 88 },
    { id: 1, title: "Data Science Bootcamp", description: "Master Python, pandas, ML algorithms and real-world data projects from scratch", similarityScore: 75 },
    { id: 5, title: "Cloud Computing AWS", description: "AWS fundamentals, cloud architecture, deployment, and DevOps workflows", similarityScore: 62 },
  ],
  "demo-student-3": [
    { id: 4, title: "Business Analytics", description: "Excel, Power BI, SQL and data-driven decision making for business professionals", similarityScore: 91 },
    { id: 1, title: "Data Science Bootcamp", description: "Master Python, pandas, ML algorithms and real-world data projects from scratch", similarityScore: 68 },
    { id: 3, title: "Web Development Bootcamp", description: "Full-stack web development with React, Node.js, and modern web technologies", similarityScore: 55 },
  ],
  "demo-student-4": [
    { id: 2, title: "AI & Machine Learning", description: "Deep learning, neural networks, NLP and computer vision for aspiring AI engineers", similarityScore: 94 },
    { id: 1, title: "Data Science Bootcamp", description: "Master Python, pandas, ML algorithms and real-world data projects from scratch", similarityScore: 85 },
    { id: 5, title: "Cloud Computing AWS", description: "AWS fundamentals, cloud architecture, deployment, and DevOps workflows", similarityScore: 71 },
  ],
  "demo-student-5": [
    { id: 5, title: "Cloud Computing AWS", description: "AWS fundamentals, cloud architecture, deployment, and DevOps workflows", similarityScore: 90 },
    { id: 3, title: "Web Development Bootcamp", description: "Full-stack web development with React, Node.js, and modern web technologies", similarityScore: 72 },
    { id: 1, title: "Data Science Bootcamp", description: "Master Python, pandas, ML algorithms and real-world data projects from scratch", similarityScore: 58 },
  ],
};
