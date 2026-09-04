-- ============================================================================
-- SNIST GUIDE - Cloudflare D1 Initial Data Seeding
-- Migration: 0002_seed_subjects.sql
-- ============================================================================

-- Insert Master Departments
INSERT OR IGNORE INTO departments (id, name, full_name) VALUES
('COMMON', 'COMMON', 'Common to All Departments'),
('DS', 'DATA SCIENCE (DS)', 'Data Science'),
('CSE', 'COMPUTER SCIENCE (CSE)', 'Computer Science & Engineering'),
('AIML', 'ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (AIML)', 'AI & Machine Learning'),
('ECE', 'ECE', 'Electronics & Communication Engineering'),
('EEE', 'EEE', 'Electrical & Electronics Engineering'),
('MECHANICAL', 'MECHANICAL', 'Mechanical Engineering'),
('CIVIL', 'CIVIL', 'Civil Engineering');

-- Insert Academic Years
INSERT OR IGNORE INTO academic_years (id, title, display_number, description, sort_order) VALUES
('first-year', 'First Year', '01', 'Foundation engineering mathematics, sciences, programming, and basic core concepts.', 1),
('second-year', 'Second Year', '02', 'Core departmental subjects, algorithms, data structures, and specialized branch foundations.', 2),
('third-year', 'Third Year', '03', 'Advanced domain topics, professional electives, and engineering labs.', 3),
('fourth-year', 'Fourth Year', '04', 'Industry specializations, major projects, and capstone preparations.', 4);

-- Insert Semesters
INSERT OR IGNORE INTO semesters (id, year_id, title, short_title, description, sort_order) VALUES
('sem-1', 'first-year', 'Semester I', 'SEM 1', 'First Semester core subjects, physics/chemistry cycles, and programming basics.', 1),
('sem-2', 'first-year', 'Semester II', 'SEM 2', 'Second Semester advanced calculus, electrical principles, and engineering graphics.', 2),
('sem-1-y2', 'second-year', 'Semester I', 'SEM 1', 'Third semester foundational core engineering courses.', 1),
('sem-2-y2', 'second-year', 'Semester II', 'SEM 2', 'Fourth semester core branch modules.', 2),
('sem-1-y3', 'third-year', 'Semester I', 'SEM 1', 'Fifth semester advanced professional subjects.', 1),
('sem-2-y3', 'third-year', 'Semester II', 'SEM 2', 'Sixth semester elective and core courses.', 2),
('sem-1-y4', 'fourth-year', 'Semester I', 'SEM 1', 'Seventh semester specialized industrial electives.', 1),
('sem-2-y4', 'fourth-year', 'Semester II', 'SEM 2', 'Eighth semester capstone internship and project phase.', 2);

-- Insert Initial Subjects
INSERT OR IGNORE INTO subjects (id, name, code, year_id, year_title, semester_id, semester_title, status, drive_url, description, created_at, updated_at) VALUES
('sub-m1', 'Engineering Mathematics - I', '22MA101BS', 'first-year', 'First Year', 'sem-1', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-math1', 'Matrices, calculus, multivariable functions, and sequence & series foundations.', datetime('now'), datetime('now')),
('sub-pps', 'Programming for Problem Solving (PPS)', '22CS101ES', 'first-year', 'First Year', 'sem-1', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-pps', 'Algorithmic problem solving, C language fundamentals, arrays, pointers, and memory structures.', datetime('now'), datetime('now')),
('sub-ep', 'Applied Physics', '22PH101BS', 'first-year', 'First Year', 'sem-1', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-physics', 'Wave optics, lasers, fiber optics, quantum mechanics, and semiconductors.', datetime('now'), datetime('now')),
('sub-bee', 'Basic Electrical Engineering (BEE)', '22EE101ES', 'first-year', 'First Year', 'sem-1', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-bee', 'DC & AC circuit theorems, single phase transformers, and electrical machines.', datetime('now'), datetime('now')),
('sub-eg', 'Engineering Graphics & Modeling', '22ME101ES', 'first-year', 'First Year', 'sem-1', 'Semester I', 'COMING SOON', 'https://drive.google.com/drive/folders/1placeholder-snist-graphics', 'CAD modeling, orthographic projections, isometric views, and scales.', datetime('now'), datetime('now')),
('sub-eng', 'English for Skill Enhancement', '22EN101HS', 'first-year', 'First Year', 'sem-1', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-english', 'Professional communication, technical writing, grammar, and presentation mastery.', datetime('now'), datetime('now')),
('sub-ec-lab', 'Applied Chemistry & Environmental Lab', '22CH101BS', 'first-year', 'First Year', 'sem-1', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-chemistry', 'Thermodynamics, electrochemistry, water technology, engineering materials, and green chemistry.', datetime('now'), datetime('now')),
('sub-m2', 'Engineering Mathematics - II', '22MA201BS', 'first-year', 'First Year', 'sem-2', 'Semester II', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-math2', 'Differential equations, Laplace transforms, and vector calculus.', datetime('now'), datetime('now')),
('sub-ds', 'Data Structures & Algorithms', '22CS201PC', 'first-year', 'First Year', 'sem-2', 'Semester II', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-ds', 'Linear and non-linear data structures, searching, sorting, and graph traversals.', datetime('now'), datetime('now')),
('sub-ec', 'Engineering Chemistry', '22CH201BS', 'first-year', 'First Year', 'sem-2', 'Semester II', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-engchem', 'Spectroscopy, polymers, batteries, and material chemistry applications.', datetime('now'), datetime('now')),
('sub-edc', 'Electronic Devices & Circuits (EDC)', '22EC201ES', 'first-year', 'First Year', 'sem-2', 'Semester II', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-edc', 'PN junction diodes, transistors, FETs, and small signal amplifiers.', datetime('now'), datetime('now')),
('sub-python', 'Python Programming for Engineers', '22CS202ES', 'first-year', 'First Year', 'sem-2', 'Semester II', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-python', 'Object-oriented programming, data analysis modules, and scripting in Python.', datetime('now'), datetime('now')),
('sub-ew', 'Engineering Workshop Practice', '22ME201ES', 'first-year', 'First Year', 'sem-2', 'Semester II', 'COMING SOON', 'https://drive.google.com/drive/folders/1placeholder-snist-workshop', 'Carpentry, fitting, tin-smithy, and digital manufacturing basics.', datetime('now'), datetime('now')),
('sub-y2-dbms', 'Database Management Systems (DBMS)', '22CS301PC', 'second-year', 'Second Year', 'sem-1-y2', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-dbms', 'Relational database models, SQL queries, normalization, transactions, and indexing.', datetime('now'), datetime('now')),
('sub-y2-os', 'Operating Systems', '22CS302PC', 'second-year', 'Second Year', 'sem-1-y2', 'Semester I', 'COMING SOON', 'https://drive.google.com/drive/folders/1placeholder-snist-os', 'Process management, synchronization, CPU scheduling, memory management, and file systems.', datetime('now'), datetime('now')),
('sub-y2-fai', 'Foundations of AI & Data Science', '22DS301PC', 'second-year', 'Second Year', 'sem-1-y2', 'Semester I', 'RESOURCES AVAILABLE', 'https://drive.google.com/drive/folders/1placeholder-snist-fai', 'Statistical modeling, exploratory data analysis, search algorithms, and machine intelligence basics.', datetime('now'), datetime('now'));

-- Insert Subject Departments (Relational Junction Table Mappings)
-- Demonstrates multi-department assignments!
INSERT OR IGNORE INTO subject_departments (subject_id, department_id) VALUES
-- Mathematics 1: Common, DS, CSE, AIML, ECE, EEE, MECHANICAL, CIVIL
('sub-m1', 'COMMON'),
('sub-m1', 'DS'),
('sub-m1', 'CSE'),
('sub-m1', 'AIML'),
('sub-m1', 'ECE'),
('sub-m1', 'EEE'),
('sub-m1', 'MECHANICAL'),
('sub-m1', 'CIVIL'),

-- PPS: Common, DS, CSE, AIML, ECE, EEE
('sub-pps', 'COMMON'),
('sub-pps', 'DS'),
('sub-pps', 'CSE'),
('sub-pps', 'AIML'),
('sub-pps', 'ECE'),
('sub-pps', 'EEE'),

-- Applied Physics: Common, ECE, EEE, MECHANICAL, CIVIL
('sub-ep', 'COMMON'),
('sub-ep', 'ECE'),
('sub-ep', 'EEE'),
('sub-ep', 'MECHANICAL'),
('sub-ep', 'CIVIL'),

-- BEE: Common, DS, CSE, AIML, MECHANICAL, CIVIL
('sub-bee', 'COMMON'),
('sub-bee', 'DS'),
('sub-bee', 'CSE'),
('sub-bee', 'AIML'),
('sub-bee', 'MECHANICAL'),
('sub-bee', 'CIVIL'),

-- Engineering Graphics: Common, MECHANICAL, CIVIL, ECE, EEE
('sub-eg', 'COMMON'),
('sub-eg', 'MECHANICAL'),
('sub-eg', 'CIVIL'),
('sub-eg', 'ECE'),
('sub-eg', 'EEE'),

-- English: Common to all
('sub-eng', 'COMMON'),
('sub-eng', 'DS'),
('sub-eng', 'CSE'),
('sub-eng', 'AIML'),
('sub-eng', 'ECE'),
('sub-eng', 'EEE'),
('sub-eng', 'MECHANICAL'),
('sub-eng', 'CIVIL'),

-- Chemistry Lab: Common to all
('sub-ec-lab', 'COMMON'),
('sub-ec-lab', 'DS'),
('sub-ec-lab', 'CSE'),
('sub-ec-lab', 'AIML'),
('sub-ec-lab', 'ECE'),
('sub-ec-lab', 'EEE'),
('sub-ec-lab', 'MECHANICAL'),
('sub-ec-lab', 'CIVIL'),

-- Mathematics 2: Common to all
('sub-m2', 'COMMON'),
('sub-m2', 'DS'),
('sub-m2', 'CSE'),
('sub-m2', 'AIML'),
('sub-m2', 'ECE'),
('sub-m2', 'EEE'),
('sub-m2', 'MECHANICAL'),
('sub-m2', 'CIVIL'),

-- Data Structures: DS, CSE, AIML, ECE
('sub-ds', 'DS'),
('sub-ds', 'CSE'),
('sub-ds', 'AIML'),
('sub-ds', 'ECE'),

-- Engineering Chemistry: Common, DS, CSE, AIML
('sub-ec', 'COMMON'),
('sub-ec', 'DS'),
('sub-ec', 'CSE'),
('sub-ec', 'AIML'),

-- EDC: ECE, EEE
('sub-edc', 'ECE'),
('sub-edc', 'EEE'),

-- Python Programming: DS, CSE, AIML, ECE, EEE
('sub-python', 'DS'),
('sub-python', 'CSE'),
('sub-python', 'AIML'),
('sub-python', 'ECE'),
('sub-python', 'EEE'),

-- Engineering Workshop: Common, MECHANICAL, CIVIL, EEE
('sub-ew', 'COMMON'),
('sub-ew', 'MECHANICAL'),
('sub-ew', 'CIVIL'),
('sub-ew', 'EEE'),

-- Year 2 DBMS: DS, CSE, AIML
('sub-y2-dbms', 'DS'),
('sub-y2-dbms', 'CSE'),
('sub-y2-dbms', 'AIML'),

-- Year 2 OS: DS, CSE, AIML
('sub-y2-os', 'DS'),
('sub-y2-os', 'CSE'),
('sub-y2-os', 'AIML'),

-- Year 2 FAI: DS, AIML
('sub-y2-fai', 'DS'),
('sub-y2-fai', 'AIML');
