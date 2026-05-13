-- Atom Adaptive Intelligence Hub - Seed Data
-- Run after schema.sql

-- ============================================================
-- COURSES
-- ============================================================

insert into courses (id, title, slug, track, level, duration, description, is_published) values
('c1000000-0000-0000-0000-000000000001', 'Data Analytics Bootcamp', 'data-analytics-bootcamp', 'Data Analytics', 'Beginner to Intermediate', '8 weeks', 'Excel, Power BI, SQL, Python, Machine Learning, and Automation for job-ready data analytics.', true),
('c2000000-0000-0000-0000-000000000002', 'AI & Machine Learning', 'ai-machine-learning', 'Artificial Intelligence', 'Intermediate to Advanced', '10 weeks', 'Machine Learning, Deep Learning, NLP, Computer Vision, LLMs, and AI projects.', true),
('c3000000-0000-0000-0000-000000000003', 'Business Analytics', 'business-analytics', 'Business Analytics', 'Beginner', '6 weeks', 'Excel, SQL, Power BI dashboards, business reporting, and decision making.', true),
('c4000000-0000-0000-0000-000000000004', 'Cloud Computing AWS', 'cloud-computing-aws', 'Cloud Computing', 'Beginner to Intermediate', '7 weeks', 'AWS fundamentals, cloud architecture, deployment, and DevOps workflows.', true),
('c5000000-0000-0000-0000-000000000005', 'Agentic AI & Automation', 'agentic-ai-automation', 'Automation', 'Intermediate', '5 weeks', 'AI agents, automation workflows, LangChain-style systems, and business productivity.', true)
on conflict (id) do nothing;

-- ============================================================
-- LECTURES: DATA ANALYTICS BOOTCAMP
-- ============================================================

insert into lectures (id, course_id, title, slug, description, content, duration_minutes, order_index, lecture_type) values
('l1010000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Introduction to Data Analytics', 'intro-data-analytics', 'What data analytics is and how it supports business decisions.', 'Data analytics is the process of examining datasets to draw conclusions and inform decision-making. Key topics: data analyst role, data lifecycle, business value of analytics, real-world use cases in finance, retail, and healthcare. A data analyst collects, cleans, and interprets data to answer business questions. The data lifecycle includes collection, cleaning, analysis, visualization, and reporting. Common tools include Excel, SQL, Python, Power BI, and Tableau.', 25, 1, 'video'),
('l1020000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Excel for Data Cleaning', 'excel-data-cleaning', 'Learn spreadsheet cleaning, formatting, formulas, and pivot tables.', 'Excel is the most widely used data tool in business. Key skills: removing duplicates, handling blanks, TRIM/CLEAN formulas, VLOOKUP, INDEX MATCH, IF functions, sorting and filtering, pivot tables, and conditional formatting. Data cleaning is critical before any analysis — garbage in, garbage out. Pivot tables allow you to summarize large datasets quickly without writing a single line of code. Practice with real datasets to build muscle memory.', 30, 2, 'video'),
('l1030000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'SQL Foundations', 'sql-foundations', 'Learn SELECT, WHERE, ORDER BY, GROUP BY, and basic joins.', 'SQL (Structured Query Language) is the standard for querying relational databases. Core concepts: SELECT retrieves data, WHERE filters rows, ORDER BY sorts results, GROUP BY aggregates data, HAVING filters groups, INNER JOIN combines tables, LEFT JOIN includes unmatched rows. Example: SELECT customer_name, SUM(order_amount) FROM orders INNER JOIN customers ON orders.customer_id = customers.id WHERE order_date > 2024-01-01 GROUP BY customer_name ORDER BY SUM(order_amount) DESC. Understanding joins is critical for any data role.', 35, 3, 'video'),
('l1040000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Power BI Dashboarding', 'power-bi-dashboarding', 'Build dashboards and visual reports in Power BI.', 'Power BI is Microsoft''s business intelligence tool. Key concepts: importing data from Excel/SQL/APIs, data modeling with relationships, DAX measures, visual charts (bar, line, pie, map), slicers for filtering, dashboard storytelling, and sharing reports. A great dashboard tells a story — start with the KPI, support with trends, and drill down to details. Best practices: limit to 5-7 visuals per page, use consistent colors, add drill-through pages for deep dives.', 30, 4, 'video'),
('l1050000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Python for Data Analysis', 'python-data-analysis', 'Use Python, pandas, and notebooks for data analysis.', 'Python is the most popular language for data analysis. Key libraries: pandas for dataframes, numpy for numerical ops, matplotlib/seaborn for visualization, Jupyter for notebooks. Core skills: reading CSV files, selecting columns, filtering rows, handling missing values, groupby operations, merging datasets, and basic plotting. pandas DataFrame is like an Excel spreadsheet in Python. Example: df.groupby("category")["sales"].sum().sort_values(ascending=False) gives you top categories by sales instantly.', 40, 5, 'video'),
('l1060000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'Intro to Machine Learning', 'intro-machine-learning', 'Understand supervised learning and model evaluation.', 'Machine learning is teaching computers to learn from data. Types: supervised learning (labeled data, predict output), unsupervised learning (find patterns), reinforcement learning (reward-based). Key algorithms: Linear Regression for continuous output, Logistic Regression for classification, Decision Trees, Random Forest. Model evaluation: train-test split (80/20), accuracy, precision, recall, F1-score, confusion matrix. Overfitting means your model memorizes training data but fails on new data — prevent with cross-validation and regularization.', 45, 6, 'video')
on conflict (id) do nothing;

-- ============================================================
-- LECTURES: AI & MACHINE LEARNING
-- ============================================================

insert into lectures (id, course_id, title, slug, description, content, duration_minutes, order_index, lecture_type) values
('l2010000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002', 'Machine Learning Foundations', 'ml-foundations', 'Understand supervised and unsupervised learning.', 'Machine learning foundations: algorithms, bias-variance tradeoff, feature engineering, cross-validation, regularization (L1/L2), gradient descent. Supervised learning includes regression (predict numbers) and classification (predict categories). Unsupervised includes clustering (K-Means, DBSCAN) and dimensionality reduction (PCA). Feature engineering is often more impactful than algorithm choice. The bias-variance tradeoff: high bias = underfitting, high variance = overfitting. Regularization penalizes complexity to prevent overfitting.', 40, 1, 'video'),
('l2020000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'Model Evaluation', 'model-evaluation', 'Accuracy, precision, recall, F1-score, and confusion matrix.', 'Model evaluation metrics: accuracy (overall correct), precision (of predicted positives, how many were correct), recall (of actual positives, how many did we catch), F1-score (harmonic mean of precision and recall), ROC-AUC curve. Confusion matrix: TP (true positive), TN (true negative), FP (false positive), FN (false negative). Cross-validation: k-fold splits data into k parts, trains k times, averages performance. Use precision when false positives are costly; use recall when false negatives are costly.', 35, 2, 'video'),
('l2030000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000002', 'Neural Networks Basics', 'neural-networks-basics', 'Neurons, layers, activation functions, and training.', 'Neural networks are inspired by the brain. Architecture: input layer (features), hidden layers (learned representations), output layer (prediction). Neurons apply weights and bias, then pass through activation functions (ReLU, Sigmoid, Tanh, Softmax). Training: forward pass computes prediction, loss function measures error (MSE, cross-entropy), backpropagation calculates gradients, optimizer (SGD, Adam) updates weights. Deep learning = many hidden layers. PyTorch and TensorFlow/Keras are standard frameworks. Batch size, learning rate, and epochs are key hyperparameters.', 50, 3, 'video'),
('l2040000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000002', 'Natural Language Processing', 'nlp-basics', 'Tokenization, normalization, Bag of Words, TF-IDF.', 'NLP is making computers understand human language. Pipeline: text cleaning, tokenization, stopword removal, stemming/lemmatization, vectorization. Bag of Words counts word frequencies. TF-IDF weights rare words higher. Word2Vec and GloVe create word embeddings (semantic vectors). Applications: sentiment analysis, text classification, named entity recognition, machine translation. spaCy and NLTK are popular Python NLP libraries. Modern NLP uses transformer-based models like BERT and GPT.', 45, 4, 'video'),
('l2050000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000002', 'Transformers and LLMs', 'transformers-llms', 'Attention mechanism, transformers, and large language models.', 'Transformers revolutionized NLP in 2017 (Attention is All You Need paper). Self-attention allows the model to weigh the importance of each word relative to others. BERT uses bidirectional attention for understanding. GPT uses autoregressive attention for generation. LLMs are transformers trained on massive text corpora. They learn world knowledge, reasoning, and language patterns. Fine-tuning adapts a pre-trained LLM to specific tasks. Prompt engineering guides LLM behavior without retraining. RAG (Retrieval Augmented Generation) adds external knowledge to LLMs.', 55, 5, 'video'),
('l2060000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000002', 'Computer Vision Basics', 'computer-vision-basics', 'Images as data, CNNs, and image classification.', 'Computer vision teaches machines to see. Images are 3D arrays (height x width x channels). CNN (Convolutional Neural Network) applies filters to detect edges, shapes, and patterns. Layers: Conv2D (extract features), MaxPooling (reduce size), Flatten, Dense (classify). Transfer learning uses pre-trained models (ResNet, VGG, EfficientNet) as starting points. Applications: image classification, object detection (YOLO), image segmentation, face recognition. Data augmentation (flipping, rotating, cropping) improves model generalization.', 50, 6, 'video')
on conflict (id) do nothing;

-- ============================================================
-- LECTURES: BUSINESS ANALYTICS
-- ============================================================

insert into lectures (id, course_id, title, slug, description, content, duration_minutes, order_index, lecture_type) values
('l3010000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000003', 'Business Analytics Overview', 'business-analytics-overview', 'What is business analytics and why it matters.', 'Business analytics uses data to improve business decisions. Types: descriptive (what happened), diagnostic (why it happened), predictive (what will happen), prescriptive (what to do). Key skills: Excel, SQL, Power BI, communication, and business context. Business analysts bridge the gap between data and decisions. Real-world applications: sales forecasting, customer segmentation, supply chain optimization, financial reporting. KPIs (Key Performance Indicators) measure business health. You need to understand the business before you can analyze the data.', 25, 1, 'video'),
('l3020000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000003', 'Excel Reporting', 'excel-reporting', 'Build professional reports using Excel.', 'Excel reporting fundamentals: named ranges, dynamic charts, dashboard design, data validation dropdowns, conditional formatting for KPIs, SUMIF/COUNTIF formulas, advanced pivot tables, slicers, and print-ready layouts. A great Excel report has a summary tab, detail tabs, and charts. Use consistent formatting: company colors, borders, font sizes. Protect sheets to prevent accidental edits. Excel Power Query automates data refresh from multiple sources. Dynamic named ranges make charts automatically update as data grows.', 30, 2, 'video'),
('l3030000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'SQL for Business Queries', 'sql-business-queries', 'Write SQL queries to answer business questions.', 'SQL for business: writing queries that answer real questions like "which region had highest sales last quarter", "which customers have not purchased in 90 days", "what is the average order value by product category". Key techniques: CTEs (Common Table Expressions) for readable complex queries, window functions (ROW_NUMBER, RANK, LAG/LEAD), subqueries, CASE statements, date functions. Business SQL focuses on aggregation, ranking, and time-series analysis. Always validate results with Excel to catch errors.', 35, 3, 'video'),
('l3040000-0000-0000-0000-000000000004', 'c3000000-0000-0000-0000-000000000003', 'Power BI KPI Dashboards', 'power-bi-kpi-dashboards', 'Build KPI dashboards in Power BI.', 'KPI dashboard design: identify 5-8 key metrics, choose the right visual for each (card for single number, bar for comparison, line for trend, map for geography), use color consistently (green=good, red=bad), add goal lines, use drill-through for details. DAX measures: CALCULATE, FILTER, DIVIDE (safe division), YTD, QTD, PREVIOUSYEAR. Publish to Power BI Service for sharing. Row-Level Security restricts data by user. Scheduled refresh keeps dashboards current automatically.', 30, 4, 'video'),
('l3050000-0000-0000-0000-000000000005', 'c3000000-0000-0000-0000-000000000003', 'Storytelling with Data', 'storytelling-with-data', 'Communicate insights clearly to stakeholders.', 'Data storytelling: structure your insight as a story (context, conflict, resolution), lead with the insight not the data, use visuals to support the narrative. The SCR framework: Situation (background), Complication (problem), Resolution (recommendation). Declutter charts: remove gridlines, simplify axes, use direct labels. Annotation adds context to key data points. Executive presentations need 3-5 key takeaways max. The goal is to drive a decision, not showcase your analysis skills. Practice explaining your analysis in plain English before presenting.', 25, 5, 'video')
on conflict (id) do nothing;

-- ============================================================
-- LECTURES: CLOUD COMPUTING AWS
-- ============================================================

insert into lectures (id, course_id, title, slug, description, content, duration_minutes, order_index, lecture_type) values
('l4010000-0000-0000-0000-000000000001', 'c4000000-0000-0000-0000-000000000004', 'Cloud Computing Fundamentals', 'cloud-fundamentals', 'Introduction to cloud concepts and benefits.', 'Cloud computing delivers computing services over the internet: servers, storage, databases, networking, software, analytics, and AI. Key benefits: scalability, cost efficiency, global reach, reliability, and speed of innovation. Deployment models: public cloud (AWS, Azure, GCP), private cloud (on-premise), hybrid cloud. Service models: IaaS (infrastructure), PaaS (platform), SaaS (software). AWS is the market leader with 200+ services. The cloud shifts CAPEX (capital expense) to OPEX (operational expense). Key concepts: regions, availability zones, edge locations.', 25, 1, 'video'),
('l4020000-0000-0000-0000-000000000002', 'c4000000-0000-0000-0000-000000000004', 'AWS Core Services', 'aws-core-services', 'EC2, RDS, Lambda, and IAM fundamentals.', 'AWS Core Services: EC2 (Elastic Compute Cloud) — virtual servers in the cloud, choose instance type, OS, and storage. RDS (Relational Database Service) — managed databases (MySQL, PostgreSQL, Aurora). Lambda — serverless functions that run on events, no server management. S3 (Simple Storage Service) — object storage for files, images, backups. IAM (Identity and Access Management) — users, roles, policies, and permissions. VPC (Virtual Private Cloud) — isolated network for your resources. CloudWatch — monitoring and logging. Always follow least-privilege principle for IAM policies.', 40, 2, 'video'),
('l4030000-0000-0000-0000-000000000003', 'c4000000-0000-0000-0000-000000000004', 'Storage and S3', 'storage-s3', 'S3 buckets, policies, static hosting, and versioning.', 'Amazon S3 (Simple Storage Service): store any amount of data, retrieve it from anywhere. Key concepts: buckets (containers), objects (files), keys (paths). Storage classes: Standard (frequent access), Infrequent Access, Glacier (archival). S3 features: versioning (track changes), lifecycle policies (auto-move to cheaper storage), cross-region replication, event notifications to Lambda, static website hosting, presigned URLs for secure temporary access. S3 Access Control: bucket policies (JSON), ACLs, Block Public Access. S3 is 11 nines (99.999999999%) durable — almost impossible to lose data.', 35, 3, 'video'),
('l4040000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000004', 'Deployment Basics', 'deployment-basics', 'Deploy applications with EC2, ECS, and Elastic Beanstalk.', 'AWS deployment options: EC2 for full control (launch AMI, configure security groups, deploy code manually or with user data scripts), Elastic Beanstalk for managed PaaS (just upload code, AWS handles infrastructure), ECS (Elastic Container Service) for Docker containers, App Runner for containerized web apps with zero configuration. CI/CD with CodePipeline: Source (GitHub) → Build (CodeBuild) → Deploy (CodeDeploy or ECS). Blue/Green deployment: run new version alongside old, switch traffic when ready, roll back instantly if issues arise. Infrastructure as Code: CloudFormation or CDK.', 35, 4, 'video'),
('l4050000-0000-0000-0000-000000000005', 'c4000000-0000-0000-0000-000000000004', 'DevOps Workflow', 'devops-workflow', 'CI/CD pipelines, Docker, and infrastructure automation.', 'DevOps combines development and operations for faster, more reliable software delivery. Key practices: CI (Continuous Integration) — automatically test on every commit; CD (Continuous Delivery/Deployment) — automate deployment to production. Docker: package application and dependencies into containers for consistent environments. Docker Compose for multi-container apps locally. Kubernetes (EKS on AWS) orchestrates container clusters at scale. Monitoring: CloudWatch metrics and alarms, X-Ray for distributed tracing, centralized logging with CloudWatch Logs. Infrastructure as Code with Terraform or AWS CDK makes environments reproducible and auditable.', 40, 5, 'video')
on conflict (id) do nothing;

-- ============================================================
-- LECTURES: AGENTIC AI & AUTOMATION
-- ============================================================

insert into lectures (id, course_id, title, slug, description, content, duration_minutes, order_index, lecture_type) values
('l5010000-0000-0000-0000-000000000001', 'c5000000-0000-0000-0000-000000000005', 'Introduction to AI Agents', 'intro-ai-agents', 'What are AI agents and how they differ from regular AI.', 'AI agents are autonomous systems that perceive their environment, reason, and take actions to achieve goals. Unlike traditional AI (one input, one output), agents can plan multi-step tasks, use tools, and adapt to results. Key concepts: agent loop (observe, think, act), tool use (APIs, search, code execution), memory (short-term context, long-term vector store), planning (decompose tasks into steps). Types: ReAct (Reason + Act), Plan-and-Execute, Multi-Agent systems. Popular frameworks: LangChain, LlamaIndex, AutoGen. Real applications: autonomous research assistant, coding agent, customer service agent.', 30, 1, 'video'),
('l5020000-0000-0000-0000-000000000002', 'c5000000-0000-0000-0000-000000000005', 'Prompt Engineering for Agents', 'prompt-engineering-agents', 'Design effective prompts for AI agent systems.', 'Prompt engineering for agents: system prompts define agent persona and capabilities, few-shot examples teach format, chain-of-thought prompting improves reasoning, structured output prompts (JSON mode) ensure parseable results. Key techniques: role prompting ("You are an expert data analyst"), instruction following ("Always cite sources"), output format specification ("Return JSON with keys: answer, confidence, sources"), negative prompts ("Do not hallucinate"). ReAct prompting: "Think step by step. If you need information, use a tool. When you have enough information, provide the final answer." Temperature: 0 for deterministic, 0.7-1.0 for creative tasks.', 35, 2, 'video'),
('l5030000-0000-0000-0000-000000000003', 'c5000000-0000-0000-0000-000000000005', 'Workflow Automation', 'workflow-automation', 'Build automated workflows with AI integration.', 'Workflow automation connects apps and services to eliminate manual tasks. Tools: n8n (open-source, self-hosted), Make/Integromat, Zapier, and custom Python scripts. Key patterns: trigger → process → action. AI-enhanced automation: classify incoming emails with LLM, extract structured data from PDFs, generate summaries of documents, route tasks to appropriate teams based on content. Building blocks: HTTP nodes (call any API), data transformation, conditional logic, loops, error handling, and retry logic. Webhooks enable real-time triggers. Scheduling runs workflows on a timer. Always add error notifications and logging for production workflows.', 35, 3, 'video'),
('l5040000-0000-0000-0000-000000000004', 'c5000000-0000-0000-0000-000000000005', 'Building an AI Assistant', 'building-ai-assistant', 'Create a practical AI assistant with tools and memory.', 'Building an AI assistant: define purpose and scope, choose LLM (GPT-4, Gemini, Claude), design tool set, implement memory, create conversation interface. Essential tools for a data assistant: search (for current information), calculator (for precise math), database query (for specific data), file reader (for document analysis). Memory types: conversation buffer (last N turns), summary memory (compressed history), vector memory (semantic search over past interactions). RAG implementation: chunk documents, embed with model, store in Pinecone/Weaviate/Supabase, retrieve top-k relevant chunks, inject into prompt. Evaluation: track task completion rate, user satisfaction, hallucination rate.', 45, 4, 'video'),
('l5050000-0000-0000-0000-000000000005', 'c5000000-0000-0000-0000-000000000005', 'Agentic AI Capstone', 'agentic-ai-capstone', 'Build a complete agentic AI system from scratch.', 'Capstone project: build a business intelligence agent that can answer questions about a company''s data by autonomously writing SQL queries, generating charts, and producing a written report. System design: user query → agent planner → tool selection (SQL tool, chart tool, search tool) → execution → synthesis → response. Key challenges: handling ambiguous queries, validating tool outputs, managing context window, graceful error handling. Deployment: containerize with Docker, expose via FastAPI, add authentication, set up monitoring. Evaluation: build a test suite with known questions and correct answers, measure accuracy and latency. Present your agent to stakeholders with a live demo.', 50, 5, 'video')
on conflict (id) do nothing;

-- ============================================================
-- QUIZZES (one per lecture)
-- ============================================================

insert into quizzes (id, course_id, lecture_id, title, difficulty, passing_score, time_limit_minutes, is_adaptive) values
-- Data Analytics Bootcamp
('q1010000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'l1010000-0000-0000-0000-000000000001', 'Data Analytics Basics Quiz', 'medium', 60, 10, true),
('q1020000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'l1020000-0000-0000-0000-000000000002', 'Excel Analytics Quiz', 'easy', 60, 10, true),
('q1030000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'l1030000-0000-0000-0000-000000000003', 'SQL Foundations Quiz', 'medium', 60, 15, true),
('q1040000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'l1040000-0000-0000-0000-000000000004', 'Power BI Quiz', 'medium', 60, 10, true),
('q1050000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'l1050000-0000-0000-0000-000000000005', 'Python Data Analysis Quiz', 'medium', 60, 15, true),
('q1060000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'l1060000-0000-0000-0000-000000000006', 'Machine Learning Basics Quiz', 'hard', 60, 15, true),
-- AI & Machine Learning
('q2010000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002', 'l2010000-0000-0000-0000-000000000001', 'ML Foundations Quiz', 'medium', 60, 15, true),
('q2020000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'l2020000-0000-0000-0000-000000000002', 'Model Evaluation Quiz', 'medium', 60, 15, true),
('q2030000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000002', 'l2030000-0000-0000-0000-000000000003', 'Neural Networks Quiz', 'hard', 60, 15, true),
('q2040000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000002', 'l2040000-0000-0000-0000-000000000004', 'NLP Basics Quiz', 'medium', 60, 15, true),
('q2050000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000002', 'l2050000-0000-0000-0000-000000000005', 'Transformers and LLMs Quiz', 'hard', 60, 15, true),
-- Business Analytics
('q3010000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000003', 'l3010000-0000-0000-0000-000000000001', 'Business Analytics Overview Quiz', 'easy', 60, 10, true),
('q3020000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000003', 'l3020000-0000-0000-0000-000000000002', 'Excel Reporting Quiz', 'easy', 60, 10, true),
('q3030000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'l3030000-0000-0000-0000-000000000003', 'SQL for Business Quiz', 'medium', 60, 15, true),
('q3040000-0000-0000-0000-000000000004', 'c3000000-0000-0000-0000-000000000003', 'l3040000-0000-0000-0000-000000000004', 'KPI Dashboards Quiz', 'medium', 60, 10, true),
('q3050000-0000-0000-0000-000000000005', 'c3000000-0000-0000-0000-000000000003', 'l3050000-0000-0000-0000-000000000005', 'Data Storytelling Quiz', 'easy', 60, 10, true)
on conflict (id) do nothing;

-- ============================================================
-- QUESTIONS: SQL FOUNDATIONS QUIZ
-- ============================================================

insert into questions (id, quiz_id, question_text, options, correct_answer, explanation, difficulty, topic, points, order_index) values
('qn103001-0000-0000-0000-000000000001', 'q1030000-0000-0000-0000-000000000003', 'What does SELECT do in SQL?',
 '[{"label":"A","value":"Deletes data from a table"},{"label":"B","value":"Retrieves data from a table"},{"label":"C","value":"Creates a new server"},{"label":"D","value":"Encrypts the database"}]',
 'B', 'SELECT is used to retrieve data from one or more tables in a database.', 'easy', 'SQL Basics', 1, 1),
('qn103002-0000-0000-0000-000000000002', 'q1030000-0000-0000-0000-000000000003', 'Which clause is used to filter rows in SQL?',
 '[{"label":"A","value":"ORDER BY"},{"label":"B","value":"GROUP BY"},{"label":"C","value":"WHERE"},{"label":"D","value":"HAVING"}]',
 'C', 'WHERE filters rows before any grouping. HAVING filters after GROUP BY. ORDER BY sorts results.', 'easy', 'SQL Basics', 1, 2),
('qn103003-0000-0000-0000-000000000003', 'q1030000-0000-0000-0000-000000000003', 'What is INNER JOIN used for?',
 '[{"label":"A","value":"Returns all rows from both tables"},{"label":"B","value":"Returns only matching rows from both tables"},{"label":"C","value":"Deletes records from joined tables"},{"label":"D","value":"Creates a backup of both tables"}]',
 'B', 'INNER JOIN returns only the rows where the join condition is true in both tables. LEFT JOIN would return all rows from the left table.', 'medium', 'SQL Joins', 1, 3),
('qn103004-0000-0000-0000-000000000004', 'q1030000-0000-0000-0000-000000000003', 'Which clause groups rows for aggregate functions?',
 '[{"label":"A","value":"JOIN BY"},{"label":"B","value":"SORT BY"},{"label":"C","value":"GROUP BY"},{"label":"D","value":"CLUSTER BY"}]',
 'C', 'GROUP BY groups rows with the same values so aggregate functions like COUNT, SUM, AVG can be applied to each group.', 'medium', 'SQL Aggregation', 1, 4),
('qn103005-0000-0000-0000-000000000005', 'q1030000-0000-0000-0000-000000000003', 'Which keyword removes duplicate rows from SELECT results?',
 '[{"label":"A","value":"UNIQUE"},{"label":"B","value":"DISTINCT"},{"label":"C","value":"REMOVE"},{"label":"D","value":"CLEAN"}]',
 'B', 'SELECT DISTINCT eliminates duplicate rows from the result set. UNIQUE is used in CREATE TABLE constraints, not SELECT.', 'hard', 'SQL Basics', 1, 5)
on conflict (id) do nothing;

-- ============================================================
-- QUESTIONS: DATA ANALYTICS BASICS QUIZ
-- ============================================================

insert into questions (id, quiz_id, question_text, options, correct_answer, explanation, difficulty, topic, points, order_index) values
('qn101001-0000-0000-0000-000000000001', 'q1010000-0000-0000-0000-000000000001', 'What is the primary purpose of data analytics?',
 '[{"label":"A","value":"To store large files"},{"label":"B","value":"To draw conclusions from data to inform decisions"},{"label":"C","value":"To build software applications"},{"label":"D","value":"To design databases"}]',
 'B', 'Data analytics involves examining datasets to draw conclusions and support decision-making across all business functions.', 'easy', 'Data Analytics', 1, 1),
('qn101002-0000-0000-0000-000000000002', 'q1010000-0000-0000-0000-000000000001', 'Which type of analytics answers "What happened?"',
 '[{"label":"A","value":"Predictive Analytics"},{"label":"B","value":"Prescriptive Analytics"},{"label":"C","value":"Descriptive Analytics"},{"label":"D","value":"Cognitive Analytics"}]',
 'C', 'Descriptive analytics summarizes historical data to answer what happened. Predictive answers what will happen. Prescriptive answers what to do.', 'easy', 'Analytics Types', 1, 2),
('qn101003-0000-0000-0000-000000000003', 'q1010000-0000-0000-0000-000000000001', 'Which is NOT a common step in the data lifecycle?',
 '[{"label":"A","value":"Data Collection"},{"label":"B","value":"Data Monetization"},{"label":"C","value":"Data Cleaning"},{"label":"D","value":"Data Visualization"}]',
 'B', 'The data lifecycle includes collection, cleaning, analysis, visualization, and reporting. Monetization is a business strategy, not a step in the analytical process.', 'medium', 'Data Lifecycle', 1, 3),
('qn101004-0000-0000-0000-000000000004', 'q1010000-0000-0000-0000-000000000001', 'A data analyst primarily works with which type of data?',
 '[{"label":"A","value":"Encrypted classified data"},{"label":"B","value":"Structured and semi-structured business data"},{"label":"C","value":"Only unstructured text data"},{"label":"D","value":"Physical sensor data only"}]',
 'B', 'Data analysts primarily work with structured data (spreadsheets, databases) and semi-structured data (JSON, logs) to answer business questions.', 'medium', 'Data Analyst Role', 1, 4),
('qn101005-0000-0000-0000-000000000005', 'q1010000-0000-0000-0000-000000000001', 'Which analytics type recommends actions based on predictions?',
 '[{"label":"A","value":"Descriptive"},{"label":"B","value":"Diagnostic"},{"label":"C","value":"Predictive"},{"label":"D","value":"Prescriptive"}]',
 'D', 'Prescriptive analytics recommends specific actions based on predictions. It is the most advanced form — using optimization and simulation to suggest the best course of action.', 'hard', 'Analytics Types', 1, 5)
on conflict (id) do nothing;

-- ============================================================
-- QUESTIONS: PYTHON DATA ANALYSIS QUIZ
-- ============================================================

insert into questions (id, quiz_id, question_text, options, correct_answer, explanation, difficulty, topic, points, order_index) values
('qn105001-0000-0000-0000-000000000001', 'q1050000-0000-0000-0000-000000000005', 'Which Python library is primarily used for dataframe manipulation?',
 '[{"label":"A","value":"NumPy"},{"label":"B","value":"Matplotlib"},{"label":"C","value":"Pandas"},{"label":"D","value":"SciPy"}]',
 'C', 'Pandas provides DataFrames and Series for data manipulation. NumPy handles numerical arrays. Matplotlib handles visualization.', 'easy', 'Python Libraries', 1, 1),
('qn105002-0000-0000-0000-000000000002', 'q1050000-0000-0000-0000-000000000005', 'How do you read a CSV file into a pandas DataFrame?',
 '[{"label":"A","value":"pd.load_csv(''file.csv'')"},{"label":"B","value":"pd.read_csv(''file.csv'')"},{"label":"C","value":"pandas.open(''file.csv'')"},{"label":"D","value":"pd.import_csv(''file.csv'')"}]',
 'B', 'pd.read_csv() is the standard function to load CSV files into a DataFrame. It has many parameters for handling headers, dtypes, missing values, and more.', 'easy', 'Pandas Basics', 1, 2),
('qn105003-0000-0000-0000-000000000003', 'q1050000-0000-0000-0000-000000000005', 'Which method handles missing values in a DataFrame?',
 '[{"label":"A","value":"df.remove_nan()"},{"label":"B","value":"df.fillna() or df.dropna()"},{"label":"C","value":"df.clean_data()"},{"label":"D","value":"df.fix_missing()"}]',
 'B', 'fillna() fills missing values with a specified value. dropna() removes rows/columns with missing values. Both are standard pandas methods for handling NaN.', 'medium', 'Data Cleaning', 1, 3),
('qn105004-0000-0000-0000-000000000004', 'q1050000-0000-0000-0000-000000000005', 'What does df.groupby("category")["sales"].sum() return?',
 '[{"label":"A","value":"Total sales for the entire DataFrame"},{"label":"B","value":"Sum of sales grouped by each category"},{"label":"C","value":"Count of rows in each category"},{"label":"D","value":"Average sales per category"}]',
 'B', 'groupby().sum() calculates the sum of the specified column for each group. This is equivalent to GROUP BY SUM in SQL.', 'medium', 'Pandas GroupBy', 1, 4),
('qn105005-0000-0000-0000-000000000005', 'q1050000-0000-0000-0000-000000000005', 'Which Jupyter magic command runs a shell command?',
 '[{"label":"A","value":"%run"},{"label":"B","value":"!command"},{"label":"C","value":"%shell"},{"label":"D","value":"@command"}]',
 'B', 'The ! prefix runs shell commands in Jupyter. For example, !pip install pandas installs a package without leaving the notebook.', 'hard', 'Jupyter Notebooks', 1, 5)
on conflict (id) do nothing;

-- ============================================================
-- QUESTIONS: ML FOUNDATIONS QUIZ
-- ============================================================

insert into questions (id, quiz_id, question_text, options, correct_answer, explanation, difficulty, topic, points, order_index) values
('qn201001-0000-0000-0000-000000000001', 'q2010000-0000-0000-0000-000000000001', 'What is the difference between supervised and unsupervised learning?',
 '[{"label":"A","value":"Supervised uses labeled data; unsupervised finds patterns in unlabeled data"},{"label":"B","value":"Supervised is faster; unsupervised uses labeled data"},{"label":"C","value":"They are the same concept"},{"label":"D","value":"Supervised learns without data; unsupervised needs data"}]',
 'A', 'Supervised learning uses labeled input-output pairs to train a model. Unsupervised learning finds hidden patterns in data without labeled outputs.', 'easy', 'ML Types', 1, 1),
('qn201002-0000-0000-0000-000000000002', 'q2010000-0000-0000-0000-000000000001', 'What is overfitting in machine learning?',
 '[{"label":"A","value":"Model performs well on training data but poorly on new data"},{"label":"B","value":"Model is too simple to learn patterns"},{"label":"C","value":"Model trains too quickly"},{"label":"D","value":"Model uses too little data"}]',
 'A', 'Overfitting occurs when a model memorizes the training data including noise, causing poor generalization to new data. It is high variance, low bias.', 'easy', 'ML Concepts', 1, 2),
('qn201003-0000-0000-0000-000000000003', 'q2010000-0000-0000-0000-000000000001', 'Which technique prevents overfitting by penalizing model complexity?',
 '[{"label":"A","value":"Data augmentation"},{"label":"B","value":"Feature scaling"},{"label":"C","value":"Regularization (L1/L2)"},{"label":"D","value":"One-hot encoding"}]',
 'C', 'Regularization adds a penalty term to the loss function for model complexity. L1 (Lasso) can zero out features. L2 (Ridge) shrinks all weights. Both prevent overfitting.', 'medium', 'Regularization', 1, 3),
('qn201004-0000-0000-0000-000000000004', 'q2010000-0000-0000-0000-000000000001', 'What does cross-validation help with?',
 '[{"label":"A","value":"Speeding up training"},{"label":"B","value":"Reducing dataset size"},{"label":"C","value":"Getting a more reliable estimate of model performance"},{"label":"D","value":"Generating synthetic data"}]',
 'C', 'Cross-validation (k-fold) gives a more reliable performance estimate by training on k different splits of data, reducing the impact of a single lucky or unlucky train-test split.', 'medium', 'Model Validation', 1, 4),
('qn201005-0000-0000-0000-000000000005', 'q2010000-0000-0000-0000-000000000001', 'Which optimizer adapts learning rates for each parameter individually?',
 '[{"label":"A","value":"SGD (Stochastic Gradient Descent)"},{"label":"B","value":"Adam (Adaptive Moment Estimation)"},{"label":"C","value":"Batch Gradient Descent"},{"label":"D","value":"Newton Method"}]',
 'B', 'Adam optimizer adapts learning rates per parameter using estimates of first and second moments of gradients. It typically converges faster than plain SGD for deep learning.', 'hard', 'Optimization', 1, 5)
on conflict (id) do nothing;

-- ============================================================
-- DEMO STUDENTS
-- ============================================================

insert into students (id, name, email, input_text, skill_level, primary_goal, learning_style, confidence_score, career_readiness_score) values
('s1000000-0000-0000-0000-000000000001', 'Ali Khan', 'ali@example.com', 'I am a beginner and I want to learn data science and machine learning through practical projects.', 'beginner', 'data science and machine learning', 'hands-on practical learner', 60, 52),
('s2000000-0000-0000-0000-000000000002', 'Sara Ahmed', 'sara@example.com', 'I know Python basics and I want to become an AI engineer through real projects.', 'intermediate', 'artificial intelligence', 'project-based learner', 72, 68),
('s3000000-0000-0000-0000-000000000003', 'Hamza Raza', 'hamza@example.com', 'I want to learn Excel, SQL and Power BI for business dashboards.', 'beginner', 'business analytics', 'hands-on practical learner', 64, 48),
('s4000000-0000-0000-0000-000000000004', 'Ayesha Noor', 'ayesha@example.com', 'I am advanced and want to improve machine learning and deep learning.', 'advanced', 'data science and machine learning', 'theory-first learner', 85, 82),
('s5000000-0000-0000-0000-000000000005', 'Usman Malik', 'usman@example.com', 'I am new and want to learn cloud computing and deployment from scratch.', 'beginner', 'cloud computing', 'hands-on practical learner', 55, 40)
on conflict (id) do nothing;

-- Demo lecture progress
insert into lecture_progress (student_id, lecture_id, course_id, status, progress_percent, completed_at) values
('s1000000-0000-0000-0000-000000000001', 'l1010000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'completed', 100, now() - interval '3 days'),
('s1000000-0000-0000-0000-000000000001', 'l1020000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'completed', 100, now() - interval '2 days'),
('s1000000-0000-0000-0000-000000000001', 'l1030000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'in_progress', 60, null),
('s2000000-0000-0000-0000-000000000002', 'l2010000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002', 'completed', 100, now() - interval '4 days'),
('s2000000-0000-0000-0000-000000000002', 'l2020000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'completed', 100, now() - interval '2 days'),
('s3000000-0000-0000-0000-000000000003', 'l3010000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000003', 'completed', 100, now() - interval '1 day')
on conflict (student_id, lecture_id) do nothing;

-- Demo quiz attempts
insert into quiz_attempts (id, student_id, quiz_id, lecture_id, answers, score, total_questions, correct_count, accuracy, weighted_score, next_difficulty, passed, ai_feedback, weak_topics) values
('a1000001-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'q1010000-0000-0000-0000-000000000001', 'l1010000-0000-0000-0000-000000000001',
 '[{"questionId":"qn101001-0000-0000-0000-000000000001","selectedAnswer":"B","correct":true,"topic":"Data Analytics","difficulty":"easy"},{"questionId":"qn101002-0000-0000-0000-000000000002","selectedAnswer":"C","correct":true,"topic":"Analytics Types","difficulty":"easy"},{"questionId":"qn101003-0000-0000-0000-000000000003","selectedAnswer":"A","correct":false,"topic":"Data Lifecycle","difficulty":"medium"},{"questionId":"qn101004-0000-0000-0000-000000000004","selectedAnswer":"B","correct":true,"topic":"Data Analyst Role","difficulty":"medium"},{"questionId":"qn101005-0000-0000-0000-000000000005","selectedAnswer":"C","correct":false,"topic":"Analytics Types","difficulty":"hard"}]',
 60, 5, 3, 60, 50, 'medium', true, 'Good start! You understand the core analytics concepts. Focus on analytics types and the data lifecycle to strengthen your foundation.', '["Analytics Types","Data Lifecycle"]'),
('a1000002-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000001', 'q1030000-0000-0000-0000-000000000003', 'l1030000-0000-0000-0000-000000000003',
 '[{"questionId":"qn103001-0000-0000-0000-000000000001","selectedAnswer":"B","correct":true,"topic":"SQL Basics","difficulty":"easy"},{"questionId":"qn103002-0000-0000-0000-000000000002","selectedAnswer":"C","correct":true,"topic":"SQL Basics","difficulty":"easy"},{"questionId":"qn103003-0000-0000-0000-000000000003","selectedAnswer":"A","correct":false,"topic":"SQL Joins","difficulty":"medium"},{"questionId":"qn103004-0000-0000-0000-000000000004","selectedAnswer":"A","correct":true,"topic":"SQL Aggregation","difficulty":"medium"},{"questionId":"qn103005-0000-0000-0000-000000000005","selectedAnswer":"A","correct":false,"topic":"SQL Basics","difficulty":"hard"}]',
 60, 5, 3, 60, 50, 'medium', true, 'You have a good grasp of basic SQL. SQL Joins need more practice — review INNER vs LEFT JOIN with hands-on examples.', '["SQL Joins","SQL Basics"]'),
('a2000001-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000002', 'q2010000-0000-0000-0000-000000000001', 'l2010000-0000-0000-0000-000000000001',
 '[{"questionId":"qn201001-0000-0000-0000-000000000001","selectedAnswer":"A","correct":true,"topic":"ML Types","difficulty":"easy"},{"questionId":"qn201002-0000-0000-0000-000000000002","selectedAnswer":"A","correct":true,"topic":"ML Concepts","difficulty":"easy"},{"questionId":"qn201003-0000-0000-0000-000000000003","selectedAnswer":"C","correct":true,"topic":"Regularization","difficulty":"medium"},{"questionId":"qn201004-0000-0000-0000-000000000004","selectedAnswer":"C","correct":true,"topic":"Model Validation","difficulty":"medium"},{"questionId":"qn201005-0000-0000-0000-000000000005","selectedAnswer":"B","correct":true,"topic":"Optimization","difficulty":"hard"}]',
 100, 5, 5, 100, 95, 'hard', true, 'Excellent! Perfect score on ML Foundations. You are ready for advanced deep learning topics. Move on to model evaluation and neural networks.', '[]')
on conflict (id) do nothing;
