# Student Management Portal


A student management system where the frontend talks to a Node.js backend, which connects to a PostgreSQL database. Full CRUD operations.

## Tech Stack

| File              | Technology       | What it covers                                              |
|-------------------|------------------|-------------------------------------------------------------|
| `public/index.html`  | HTML5        | Semantic markup, forms, tables, accessibility               |
| `public/style.css`   | CSS3         | Flexbox, Grid, animations, responsive design, variables     |
| `public/scripts.js`  | JavaScript   | Fetch API, CRUD, DOM manipulation, events, validation       |
| `database.sql`       | PostgreSQL   | DDL, DML, JOINs, subqueries, aggregates, CASE, views       |
| `server.js`          | Node.js      | Express REST API, pg client, CRUD endpoints                 |

## Architecture

```
Browser (HTML/CSS/JS)
    ↕ fetch() API calls
Node.js + Express (server.js)
    ↕ pg (node-postgres)
PostgreSQL (database.sql)
```

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running

### Step 1: Create the Database

Open **pgAdmin** (or psql terminal):

```sql
CREATE DATABASE student_portal;
```

Then open Query Tool on `student_portal` and run the entire `database.sql` file.

Or via terminal:
```bash
psql -U postgres -c "CREATE DATABASE student_portal"
psql -U postgres -d student_portal -f database.sql
```

### Step 2: Configure Environment Variables

Set PostgreSQL config in your shell before starting:

```bash
set PG_USER=postgres
set PG_HOST=localhost
set PG_DATABASE=student_portal
set PG_PASSWORD=your_password
set PG_PORT=5432
```

### Step 3: Install Dependencies & Run

```bash
cd student-management-portal
npm install
node server.js
```

You should see:
```
Server running at http://localhost:3000
Connected to PostgreSQL
```

### Step 4: Open in Browser

Go to [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Route                      | Description       |
|--------|----------------------------|-------------------|
| GET    | `/api/students`            | Get all students  |
| GET    | `/api/stats`               | Get dashboard stats|
| POST   | `/api/students`            | Add new student   |
| PUT    | `/api/students/:id`        | Update student    |
| DELETE | `/api/students/:id`        | Delete student    |
| GET    | `/api/students/search/:q`  | Search students   |

## Project Structure

```
student-management-portal/
├── public/
│   ├── index.html       ← Frontend HTML
│   ├── style.css        ← Frontend CSS
│   └── scripts.js       ← Frontend JS (fetch API calls)
├── database.sql         ← PostgreSQL schema + data + queries
├── server.js            ← Node.js Express backend
├── package.json         ← Dependencies
└── README.md            ← This file
```

## Features

- Full CRUD — Add, Read, Update, Delete students
- Data stored in PostgreSQL (not fake array)
- REST API with Express.js
- Real-time search and filter
- Form validation
- Toast notifications
- Responsive design
- Dashboard stats from database

---
