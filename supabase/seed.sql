-- Seed data for Atom Adaptive Intelligence Hub
-- Run after schema.sql

-- 1. Ali Khan
INSERT INTO students (id, name, email, input_text, skill_level, primary_goal, learning_style, confidence_score, preferred_course, career_readiness_score)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'Ali Khan',
  'ali@example.com',
  'I am a beginner and I want to learn data science and machine learning through practical projects.',
  'beginner',
  'data science and machine learning',
  'hands-on practical learner',
  60,
  'Data Science Bootcamp',
  52
) ON CONFLICT (email) DO NOTHING;

INSERT INTO course_recommendations (student_id, course_api_id, title, description, similarity_score, rank)
VALUES
  ('11111111-0000-0000-0000-000000000001', 1, 'Data Science Bootcamp', 'Master Python, pandas, ML algorithms and real-world data projects from scratch', 82, 1),
  ('11111111-0000-0000-0000-000000000001', 2, 'AI & Machine Learning', 'Deep learning, neural networks, NLP and computer vision for aspiring AI engineers', 77, 2),
  ('11111111-0000-0000-0000-000000000001', 4, 'Business Analytics', 'Excel, Power BI, SQL and data-driven decision making for business professionals', 69, 3);

INSERT INTO quiz_attempts (student_id, history, next_difficulty, accuracy, weighted_score, message)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  '[{"question_id": 1, "difficulty": "medium", "correct": true}, {"question_id": 2, "difficulty": "medium", "correct": true}, {"question_id": 3, "difficulty": "medium", "correct": false}]',
  'medium', 67, 50, 'Good progress. Maintaining difficulty.'
);

INSERT INTO learning_roadmaps (student_id, roadmap_title, summary, next_best_lesson, weak_topic, career_readiness_score, roadmap, mentor_message, instructor_note, model_used)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'Personalized Data Science & ML Roadmap',
  'You are best matched with Data Science Bootcamp because your goal is data science and machine learning.',
  'Pandas and Data Cleaning',
  'Machine Learning Foundations',
  52,
  '[{"week": 1, "module": "Python Foundations", "status": "Completed", "reason": "Required for all data science workflows."}, {"week": 2, "module": "Pandas and Data Cleaning", "status": "In Progress", "reason": "Builds practical data handling skills."}, {"week": 3, "module": "Machine Learning Basics", "status": "AI Recommended", "reason": "Matches the learner primary goal."}, {"week": 4, "module": "Model Evaluation", "status": "Upcoming", "reason": "Needed to understand model performance."}, {"week": 5, "module": "Portfolio Project", "status": "Locked", "reason": "Consolidates all learned skills."}]',
  'Focus on hands-on projects and complete a mini ML notebook before moving to advanced AI topics.',
  'Monitor this learner progress in ML foundations and assign project-based exercises.',
  'fallback'
);

-- 2. Sara Ahmed
INSERT INTO students (id, name, email, input_text, skill_level, primary_goal, learning_style, confidence_score, preferred_course, career_readiness_score)
VALUES (
  '22222222-0000-0000-0000-000000000002',
  'Sara Ahmed',
  'sara@example.com',
  'I know Python basics and I want to become an AI engineer through real projects.',
  'intermediate',
  'artificial intelligence',
  'project-based learner',
  72,
  'AI & Machine Learning',
  68
) ON CONFLICT (email) DO NOTHING;

INSERT INTO course_recommendations (student_id, course_api_id, title, description, similarity_score, rank)
VALUES
  ('22222222-0000-0000-0000-000000000002', 2, 'AI & Machine Learning', 'Deep learning, neural networks, NLP and computer vision for aspiring AI engineers', 88, 1),
  ('22222222-0000-0000-0000-000000000002', 1, 'Data Science Bootcamp', 'Master Python, pandas, ML algorithms and real-world data projects from scratch', 75, 2),
  ('22222222-0000-0000-0000-000000000002', 5, 'Cloud Computing AWS', 'AWS fundamentals, cloud architecture, deployment, and DevOps workflows', 62, 3);

INSERT INTO quiz_attempts (student_id, history, next_difficulty, accuracy, weighted_score, message)
VALUES (
  '22222222-0000-0000-0000-000000000002',
  '[{"question_id": 1, "difficulty": "medium", "correct": true}, {"question_id": 2, "difficulty": "medium", "correct": true}, {"question_id": 3, "difficulty": "hard", "correct": true}]',
  'hard', 80, 76, 'Excellent performance! Moving to hard difficulty.'
);

INSERT INTO learning_roadmaps (student_id, roadmap_title, summary, next_best_lesson, weak_topic, career_readiness_score, roadmap, mentor_message, instructor_note, model_used)
VALUES (
  '22222222-0000-0000-0000-000000000002',
  'AI Engineering Roadmap',
  'You are best matched with AI & Machine Learning because your goal is artificial intelligence.',
  'Deep Learning with PyTorch',
  'Deep Learning Architecture',
  68,
  '[{"week": 1, "module": "Python Foundations", "status": "Completed", "reason": "Core language for AI development."}, {"week": 2, "module": "ML Basics", "status": "Completed", "reason": "Foundation for deep learning concepts."}, {"week": 3, "module": "Deep Learning", "status": "AI Recommended", "reason": "Directly aligns with AI engineering goals."}, {"week": 4, "module": "NLP and Computer Vision", "status": "Upcoming", "reason": "Key specializations for AI engineers."}, {"week": 5, "module": "AI Project", "status": "Locked", "reason": "Applies advanced AI skills to a real problem."}]',
  'You are on track — dive deeper into PyTorch and build a small NLP project.',
  'Student is progressing well; introduce neural network projects.',
  'fallback'
);

-- 3. Hamza Raza
INSERT INTO students (id, name, email, input_text, skill_level, primary_goal, learning_style, confidence_score, preferred_course, career_readiness_score)
VALUES (
  '33333333-0000-0000-0000-000000000003',
  'Hamza Raza',
  'hamza@example.com',
  'I want to learn Excel, SQL and Power BI for business dashboards.',
  'beginner',
  'business analytics',
  'hands-on practical learner',
  64,
  'Business Analytics',
  48
) ON CONFLICT (email) DO NOTHING;

-- 4. Usman Malik (High Risk)
INSERT INTO students (id, name, email, input_text, skill_level, primary_goal, learning_style, confidence_score, preferred_course, career_readiness_score)
VALUES (
  '55555555-0000-0000-0000-000000000005',
  'Usman Malik',
  'usman@example.com',
  'I am new and want to learn cloud computing and deployment.',
  'beginner',
  'cloud computing',
  'hands-on practical learner',
  55,
  'Cloud Computing AWS',
  40
) ON CONFLICT (email) DO NOTHING;

INSERT INTO quiz_attempts (student_id, history, next_difficulty, accuracy, weighted_score, message)
VALUES (
  '55555555-0000-0000-0000-000000000005',
  '[{"question_id": 1, "difficulty": "easy", "correct": false}, {"question_id": 2, "difficulty": "easy", "correct": true}, {"question_id": 3, "difficulty": "medium", "correct": false}]',
  'easy', 35, 30, 'Keep practicing the basics. Moving to easier questions.'
);
