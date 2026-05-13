export interface Course {
  id: number;
  title: string;
  description: string;
  category?: string;
  level?: string;
}

export const AVAILABLE_COURSES: Course[] = [
  {
    id: 1,
    title: "Data Science Bootcamp",
    description: "Master Python, pandas, ML algorithms and real-world data projects from scratch",
    category: "Data Science",
    level: "beginner",
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    description: "Deep learning, neural networks, NLP and computer vision for aspiring AI engineers",
    category: "AI",
    level: "intermediate",
  },
  {
    id: 3,
    title: "Web Development Bootcamp",
    description: "Full-stack web development with React, Node.js, and modern web technologies",
    category: "Web Dev",
    level: "beginner",
  },
  {
    id: 4,
    title: "Business Analytics",
    description: "Excel, Power BI, SQL and data-driven decision making for business professionals",
    category: "Analytics",
    level: "beginner",
  },
  {
    id: 5,
    title: "Cloud Computing AWS",
    description: "AWS fundamentals, cloud architecture, deployment, and DevOps workflows",
    category: "Cloud",
    level: "intermediate",
  },
];
