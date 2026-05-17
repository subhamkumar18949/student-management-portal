// ===== API BASE URL =====
const API = "/api";

let editingId = null;


// ===== DOM ELEMENTS =====
const form         = document.getElementById("studentForm");
const tableBody    = document.getElementById("tableBody");
const searchInput  = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const filterStatus = document.getElementById("filterStatus");
const submitBtn    = document.getElementById("submitBtn");


// ===== EVENT LISTENERS =====
form.addEventListener("submit", handleSubmit);
form.addEventListener("reset", function () {
  editingId = null;
  submitBtn.textContent = "Add Student";
  clearErrors();
});

searchInput.addEventListener("input", debounce(loadStudents, 300));
filterCourse.addEventListener("change", loadStudents);
filterStatus.addEventListener("change", loadStudents);


// ===== DEBOUNCE =====
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}


// ===== FORM VALIDATION =====
function validateForm() {
  let isValid = true;
  clearErrors();

  const name   = document.getElementById("name").value.trim();
  const rollNo = document.getElementById("rollNo").value.trim();
  const email  = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value;
  const gpa    = document.getElementById("gpa").value;

  if (name.length < 2) {
    showFieldError("name");
    isValid = false;
  }
  if (rollNo.length < 1) {
    showFieldError("rollNo");
    isValid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError("email");
    isValid = false;
  }
  if (!course) {
    showFieldError("course");
    isValid = false;
  }
  if (gpa === "" || parseFloat(gpa) < 0 || parseFloat(gpa) > 10) {
    showFieldError("gpa");
    isValid = false;
  }

  return isValid;
}

function showFieldError(fieldId) {
  document.getElementById(fieldId).parentElement.classList.add("invalid");
}

function clearErrors() {
  document.querySelectorAll(".form-group").forEach(function (g) {
    g.classList.remove("invalid");
  });
}


// ===== CREATE / UPDATE — sends data to backend =====
async function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast("Please fix the errors", "error");
    return;
  }

  const studentData = {
    name:    document.getElementById("name").value.trim(),
    roll_no: document.getElementById("rollNo").value.trim(),
    email:   document.getElementById("email").value.trim(),
    course:  document.getElementById("course").value,
    gpa:     parseFloat(document.getElementById("gpa").value),
    status:  document.getElementById("status").value,
  };

  try {
    let response;

    if (editingId) {
      // UPDATE — PUT request
      response = await fetch(API + "/students/" + editingId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    } else {
      // CREATE — POST request
      response = await fetch(API + "/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    }

    const data = await response.json();

    if (response.ok) {
      showToast(data.message, "success");
      form.reset();
      editingId = null;
      submitBtn.textContent = "Add Student";
      clearErrors();
      loadStudents();
      loadStats();
    } else {
      showToast(data.error, "error");
    }
  } catch (err) {
    showToast("Server error. Is the backend running?", "error");
    console.error(err);
  }
}


// ===== DELETE — sends DELETE request to backend =====
async function deleteStudent(id, name) {
  if (!confirm("Delete " + name + "?")) return;

  try {
    const response = await fetch(API + "/students/" + id, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      showToast(data.message, "info");
      loadStudents();
      loadStats();
    } else {
      showToast(data.error, "error");
    }
  } catch (err) {
    showToast("Server error", "error");
    console.error(err);
  }
}


// ===== EDIT — populate form with student data =====
function editStudent(student) {
  document.getElementById("name").value   = student.name;
  document.getElementById("rollNo").value = student.roll_no;
  document.getElementById("email").value  = student.email;
  document.getElementById("course").value = student.course;
  document.getElementById("gpa").value    = student.gpa;
  document.getElementById("status").value = student.status;

  editingId = student.student_id;
  submitBtn.textContent = "Update Student";

  document.getElementById("enrollment").scrollIntoView({ behavior: "smooth" });
}


// ===== LOAD STUDENTS FROM BACKEND =====
async function loadStudents() {
  try {
    const response = await fetch(API + "/students");
    let students = await response.json();

    // Client-side filtering
    const query  = searchInput.value.toLowerCase();
    const course = filterCourse.value;
    const status = filterStatus.value;

    students = students.filter(function (s) {
      const matchSearch = s.name.toLowerCase().includes(query) || s.roll_no.toLowerCase().includes(query);
      const matchCourse = !course || s.course === course;
      const matchStatus = !status || s.status === status;
      return matchSearch && matchCourse && matchStatus;
    });

    renderTable(students);
  } catch (err) {
    tableBody.innerHTML = '<tr><td colspan="6" class="no-data">Cannot connect to server. Run: node server.js</td></tr>';
    console.error(err);
  }
}


// ===== LOAD STATS FROM BACKEND =====
async function loadStats() {
  try {
    const response = await fetch(API + "/stats");
    const stats = await response.json();

    document.getElementById("totalCount").textContent  = stats.total;
    document.getElementById("activeCount").textContent  = stats.active;
    document.getElementById("avgGpa").textContent       = stats.avg_gpa || 0;
    document.getElementById("courseCount").textContent   = stats.courses;
  } catch (err) {
    console.error(err);
  }
}


// ===== RENDER TABLE =====
function renderTable(students) {
  if (students.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No students found.</td></tr>';
    return;
  }

  var html = "";
  students.forEach(function (s) {
    var badgeClass = s.status === "Active" ? "badge-active" :
                     s.status === "Pending" ? "badge-pending" : "badge-inactive";

    html += "<tr>" +
      "<td><strong>" + s.roll_no + "</strong></td>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.course + "</td>" +
      "<td>" + parseFloat(s.gpa).toFixed(1) + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + s.status + "</span></td>" +
      "<td><div class='actions'>" +
        "<button class='btn btn-sm btn-primary' data-id='" + s.student_id + "'>Edit</button>" +
        "<button class='btn btn-sm btn-danger' data-id='" + s.student_id + "' data-name='" + s.name + "'>Delete</button>" +
      "</div></td>" +
    "</tr>";
  });

  tableBody.innerHTML = html;

  // Attach edit/delete events using event delegation
  // (We store the student objects for edit)
  tableBody.querySelectorAll(".btn-primary").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = parseInt(this.dataset.id);
      var student = students.find(function (s) { return s.student_id === id; });
      if (student) editStudent(student);
    });
  });

  tableBody.querySelectorAll(".btn-danger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      deleteStudent(this.dataset.id, this.dataset.name);
    });
  });
}


// ===== TOAST NOTIFICATIONS =====
function showToast(message, type) {
  var container = document.getElementById("toastContainer");
  var toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3000);
}


// ===== INITIAL LOAD =====
loadStudents();
loadStats();