const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// ===== POSTGRESQL CONNECTION =====
const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "student_portal",
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT) || 5432,
});

// Test connection on startup
pool.query("SELECT NOW()")
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL connection error:", err.message));


// ===== API ROUTES =====

// ── GET all students (with JOIN to courses table) ──
app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.student_id,
        s.name,
        s.roll_no,
        s.email,
        c.course_name AS course,
        s.semester,
        s.gpa,
        s.status
      FROM students s
      JOIN courses c ON s.course_id = c.course_id
      ORDER BY s.student_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


// ── GET dashboard stats ──
app.get("/api/stats", async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Active') AS active,
        ROUND(AVG(gpa), 1) AS avg_gpa,
        COUNT(DISTINCT course_id) AS courses
      FROM students
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});


// ── POST — Add a new student ──
app.post("/api/students", async (req, res) => {
  try {
    const { name, roll_no, email, course, gpa, status } = req.body;

    // Get course_id from course name
    const courseResult = await pool.query(
      "SELECT course_id FROM courses WHERE course_name = $1",
      [course]
    );

    if (courseResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid course" });
    }

    const course_id = courseResult.rows[0].course_id;

    const result = await pool.query(
      `INSERT INTO students (name, roll_no, email, course_id, gpa, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING student_id`,
      [name, roll_no, email, course_id, gpa, status]
    );

    res.status(201).json({
      message: name + " added successfully",
      student_id: result.rows[0].student_id,
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      // unique violation
      res.status(400).json({ error: "Roll number or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to add student" });
    }
  }
});


// ── PUT — Update a student ──
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll_no, email, course, gpa, status } = req.body;

    const courseResult = await pool.query(
      "SELECT course_id FROM courses WHERE course_name = $1",
      [course]
    );

    if (courseResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid course" });
    }

    const course_id = courseResult.rows[0].course_id;

    await pool.query(
      `UPDATE students
       SET name = $1, roll_no = $2, email = $3, course_id = $4, gpa = $5, status = $6
       WHERE student_id = $7`,
      [name, roll_no, email, course_id, gpa, status, id]
    );

    res.json({ message: name + " updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update student" });
  }
});


// ── DELETE — Remove a student ──
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from child tables first (grades, fees), then student
    await pool.query("DELETE FROM grades WHERE student_id = $1", [id]);
    await pool.query("DELETE FROM fees WHERE student_id = $1", [id]);
    const result = await pool.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING name",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: result.rows[0].name + " deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete student" });
  }
});


// ── GET — Search students ──
app.get("/api/students/search/:query", async (req, res) => {
  try {
    const query = "%" + req.params.query.toLowerCase() + "%";
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.roll_no, s.email,
              c.course_name AS course, s.gpa, s.status
       FROM students s
       JOIN courses c ON s.course_id = c.course_id
       WHERE LOWER(s.name) LIKE $1 OR LOWER(s.roll_no) LIKE $1`,
      [query]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});


// ===== START SERVER =====
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});