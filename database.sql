-- =============================================
-- STUDENT MANAGEMENT PORTAL — SQL PROJECT
-- Database: MySQL / PostgreSQL / SQLite
-- GenC Next Full Stack Project
-- =============================================


-- =============================================
-- 1. DDL: CREATE TABLES (Normalized to 3NF)
-- =============================================

CREATE TABLE instructors (
    instructor_id   INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    department      VARCHAR(50) NOT NULL,
    phone           VARCHAR(15),
    joining_date    DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE courses (
    course_id       INT PRIMARY KEY AUTO_INCREMENT,
    course_name     VARCHAR(100) NOT NULL,
    department      VARCHAR(50) NOT NULL,
    credits         INT DEFAULT 4,
    instructor_id   INT,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);

CREATE TABLE students (
    student_id      INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    roll_no         VARCHAR(20) UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    dob             DATE,
    gender          ENUM('M', 'F', 'O') DEFAULT 'M',
    course_id       INT NOT NULL,
    semester        INT DEFAULT 1,
    gpa             DECIMAL(3,1) CHECK (gpa >= 0 AND gpa <= 10),
    status          ENUM('Active', 'Pending', 'Inactive', 'Graduated') DEFAULT 'Active',
    enrolled_on     DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE grades (
    grade_id        INT PRIMARY KEY AUTO_INCREMENT,
    student_id      INT NOT NULL,
    subject         VARCHAR(100) NOT NULL,
    marks           INT CHECK (marks >= 0 AND marks <= 100),
    grade_letter    CHAR(2),
    exam_date       DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE fees (
    fee_id          INT PRIMARY KEY AUTO_INCREMENT,
    student_id      INT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    paid            BOOLEAN DEFAULT FALSE,
    payment_date    DATE,
    due_date        DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);


-- =============================================
-- 2. DML: INSERT SAMPLE DATA
-- =============================================

-- Instructors
INSERT INTO instructors (name, email, department) VALUES
('Dr. Rajesh Kumar',    'rajesh@college.edu',   'Computer Science'),
('Dr. Sunita Verma',    'sunita@college.edu',   'Electronics'),
('Dr. Anil Deshmukh',   'anil@college.edu',     'Mechanical'),
('Dr. Meera Nair',      'meera@college.edu',    'Physics'),
('Dr. Pavan Joshi',     'pavan@college.edu',    'Mathematics');

-- Courses
INSERT INTO courses (course_name, department, credits, instructor_id) VALUES
('Computer Science',    'Engineering',  4, 1),
('Electronics',         'Engineering',  4, 2),
('Mechanical',          'Engineering',  4, 3),
('Physics',             'Sciences',     3, 4),
('Mathematics',         'Sciences',     3, 5);

-- Students
INSERT INTO students (name, roll_no, email, dob, gender, course_id, semester, gpa, status, enrolled_on) VALUES
('Ananya Sharma',   'CSE-001', 'ananya@college.edu',   '2002-03-15', 'F', 1, 4, 9.2, 'Active',    '2024-08-01'),
('Rahul Mehta',     'ECE-014', 'rahul@college.edu',    '2001-07-22', 'M', 2, 6, 8.7, 'Active',    '2023-08-01'),
('Priya Iyer',      'PHY-009', 'priya@college.edu',    '2003-01-10', 'F', 4, 2, 7.4, 'Pending',   '2025-08-01'),
('Vikram Reddy',    'CSE-022', 'vikram@college.edu',   '2000-11-05', 'M', 1, 8, 9.5, 'Graduated', '2022-08-01'),
('Neha Gupta',      'MAT-003', 'neha@college.edu',     '2002-09-28', 'F', 5, 4, 8.1, 'Active',    '2024-08-01'),
('Arjun Patel',     'MEC-007', 'arjun@college.edu',    '2001-04-12', 'M', 3, 6, 7.9, 'Active',    '2023-08-01'),
('Kavitha Nair',    'CSE-035', 'kavitha@college.edu',  '2003-06-20', 'F', 1, 2, 8.8, 'Active',    '2025-08-01'),
('Siddharth Das',   'ECE-021', 'sid@college.edu',      '2002-12-03', 'M', 2, 4, 7.1, 'Inactive',  '2024-08-01'),
('Deepa Menon',     'PHY-018', 'deepa@college.edu',    '2001-08-17', 'F', 4, 6, 8.5, 'Active',    '2023-08-01'),
('Rohit Singhania', 'MEC-011', 'rohit@college.edu',    '2003-02-25', 'M', 3, 2, 6.9, 'Pending',   '2025-08-01');

-- Grades
INSERT INTO grades (student_id, subject, marks, grade_letter, exam_date) VALUES
(1,  'Data Structures',    92, 'A+', '2026-03-15'),
(1,  'Algorithms',         88, 'A',  '2026-03-16'),
(2,  'Digital Circuits',   85, 'A',  '2026-03-15'),
(2,  'Signal Processing',  78, 'B+', '2026-03-16'),
(3,  'Quantum Mechanics',  72, 'B',  '2026-03-15'),
(4,  'Machine Learning',   96, 'A+', '2025-03-15'),
(4,  'Operating Systems',  91, 'A+', '2025-03-16'),
(5,  'Linear Algebra',     80, 'A',  '2026-03-15'),
(6,  'Thermodynamics',     76, 'B+', '2026-03-15'),
(7,  'Programming in C',   89, 'A',  '2026-03-15'),
(8,  'VLSI Design',        65, 'B',  '2026-03-15'),
(9,  'Optics',             84, 'A',  '2026-03-15'),
(10, 'Fluid Mechanics',    68, 'B',  '2026-03-15');

-- Fees
INSERT INTO fees (student_id, amount, paid, due_date) VALUES
(1,  120000.00, TRUE,  '2025-12-31'),
(1,  120000.00, FALSE, '2026-06-30'),
(2,  120000.00, TRUE,  '2025-12-31'),
(2,  120000.00, TRUE,  '2026-06-30'),
(3,   60000.00, FALSE, '2026-06-30'),
(4,  120000.00, TRUE,  '2025-12-31'),
(5,   60000.00, TRUE,  '2025-12-31'),
(5,   60000.00, FALSE, '2026-06-30'),
(6,  120000.00, FALSE, '2026-06-30'),
(7,  120000.00, FALSE, '2026-06-30'),
(8,  120000.00, TRUE,  '2025-12-31'),
(9,   60000.00, TRUE,  '2025-12-31'),
(10, 120000.00, FALSE, '2026-06-30');


-- =============================================
-- 3. SELECT QUERIES
-- =============================================

-- a) Basic SELECT — Get all students
SELECT * FROM students;

-- b) WHERE + ORDER BY — Active students sorted by GPA
SELECT name, roll_no, gpa, status
FROM students
WHERE status = 'Active'
ORDER BY gpa DESC;

-- c) INNER JOIN — Students with their course and instructor names
SELECT
    s.name AS student_name,
    s.roll_no,
    c.course_name,
    i.name AS instructor_name,
    s.gpa
FROM students s
INNER JOIN courses c ON s.course_id = c.course_id
INNER JOIN instructors i ON c.instructor_id = i.instructor_id
ORDER BY s.gpa DESC;

-- d) GROUP BY + HAVING — Course-wise student count (only courses with 2+ students)
SELECT
    c.course_name,
    COUNT(*) AS total_students,
    ROUND(AVG(s.gpa), 2) AS avg_gpa,
    MAX(s.gpa) AS highest_gpa,
    MIN(s.gpa) AS lowest_gpa
FROM students s
JOIN courses c ON s.course_id = c.course_id
GROUP BY c.course_name
HAVING COUNT(*) >= 2;

-- e) SUBQUERY — Students with GPA above average
SELECT name, roll_no, gpa
FROM students
WHERE gpa > (SELECT AVG(gpa) FROM students)
ORDER BY gpa DESC;

-- f) CASE expression — Classify students by GPA
SELECT
    name,
    gpa,
    CASE
        WHEN gpa >= 9.0 THEN 'Distinction'
        WHEN gpa >= 8.0 THEN 'First Class'
        WHEN gpa >= 7.0 THEN 'Second Class'
        ELSE 'Needs Improvement'
    END AS performance
FROM students
ORDER BY gpa DESC;

-- g) Aggregates — Fee summary per student
SELECT
    s.name,
    s.roll_no,
    SUM(f.amount) AS total_fees,
    SUM(CASE WHEN f.paid = TRUE THEN f.amount ELSE 0 END) AS paid_amount,
    SUM(CASE WHEN f.paid = FALSE THEN f.amount ELSE 0 END) AS pending_amount
FROM students s
JOIN fees f ON s.student_id = f.student_id
GROUP BY s.student_id, s.name, s.roll_no
ORDER BY pending_amount DESC;

-- h) Top scorer per subject
SELECT g.subject, s.name, g.marks, g.grade_letter
FROM grades g
JOIN students s ON g.student_id = s.student_id
WHERE g.marks = (
    SELECT MAX(g2.marks)
    FROM grades g2
    WHERE g2.subject = g.subject
)
ORDER BY g.marks DESC;

-- i) Department-wise summary
SELECT
    department,
    COUNT(*) AS total_courses,
    SUM(credits) AS total_credits
FROM courses
GROUP BY department;


-- =============================================
-- 4. UPDATE QUERIES
-- =============================================

-- Update GPA after exam
UPDATE students
SET gpa = 9.4
WHERE roll_no = 'CSE-001';

-- Mark fee as paid
UPDATE fees
SET paid = TRUE, payment_date = CURRENT_DATE
WHERE student_id = 3 AND paid = FALSE;

-- Promote all Sem 4 students to Sem 5
UPDATE students
SET semester = semester + 1
WHERE semester = 4 AND status = 'Active';


-- =============================================
-- 5. DELETE QUERIES
-- =============================================

-- Remove inactive student
DELETE FROM grades WHERE student_id = 8;
DELETE FROM fees WHERE student_id = 8;
DELETE FROM students WHERE student_id = 8;


-- =============================================
-- 6. VIEWS (Optional — shows advanced SQL)
-- =============================================

CREATE VIEW student_dashboard AS
SELECT
    s.student_id,
    s.name,
    s.roll_no,
    c.course_name,
    s.semester,
    s.gpa,
    s.status,
    i.name AS instructor
FROM students s
JOIN courses c ON s.course_id = c.course_id
JOIN instructors i ON c.instructor_id = i.instructor_id;

-- Use the view
SELECT * FROM student_dashboard WHERE status = 'Active';