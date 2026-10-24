// ====== Elemen ======
const form = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const clearDone = document.getElementById("clearDone");
const listInfo = document.getElementById("listInfo");

const statTotal = document.getElementById("statTotal");
const statDone = document.getElementById("statDone");
const statPending = document.getElementById("statPending");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeText = document.getElementById("welcomeText");
const todayDate = document.getElementById("todayDate");

const STORAGE_KEY = "daftar-kegiatan";
const PRIORITY_ORDER = { Tinggi: 0, Sedang: 1, Rendah: 2 };

// ====== Data ======
let tasks = loadTasks();

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.warn("Data tidak dapat disimpan:", error);
    }
}

// ====== Tanggal ======
function todayString() {
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + m + "-" + d;
}

function formatDate(dateString) {
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    });
}

function isOverdue(task) {
    return !task.done && task.date < todayString();
}

// ====== Tambah tugas ======
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const date = taskDate.value;

    if (title === "") {
        alert("Nama tugas harus diisi!");
        taskTitle.focus();
        return;
    }
    if (date === "") {
        alert("Pilih tenggat waktu terlebih dahulu!");
        taskDate.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random().toString(16).slice(2),
        title: title,
        category: taskCategory.value,
        priority: taskPriority.value,
        date: date,
        done: false
    });

    saveTasks();
    form.reset();
    taskPriority.value = "Sedang";
    taskDate.value = todayString();
    searchInput.value = "";
    filterSelect.value = "semua";
    showTasks();
    taskTitle.focus();
});

// ====== Filter & urutan ======
function getVisibleTasks() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    return tasks
        .filter(function (task) {
            if (keyword && !(task.title + " " + task.category).toLowerCase().includes(keyword)) return false;
            if (filter === "belum") return !task.done;
            if (filter === "selesai") return task.done;
            if (filter === "terlambat") return isOverdue(task);
            return true;
        })
        .sort(function (a, b) {
            if (a.done !== b.done) return a.done ? 1 : -1;
            if (a.date !== b.date) return a.date < b.date ? -1 : 1;
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        });
}

// ====== Tampilan ======
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-item";
    if (task.done) card.classList.add("is-complete");
    if (isOverdue(task)) card.classList.add("is-overdue");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;
    check.setAttribute("aria-label", "Tandai selesai: " + task.title);
    check.addEventListener("change", function () {
        task.done = check.checked;
        saveTasks();
        showTasks();
    });

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const category = document.createElement("span");
    category.className = "tag";
    category.textContent = task.category;

    const priority = document.createElement("span");
    priority.className = "tag priority-" + task.priority;
    priority.textContent = "Prioritas " + task.priority;

    meta.append(category, priority);

    const date = document.createElement("p");
    date.className = "due-date";
    const overdue = isOverdue(task);
    date.classList.toggle("overdue", overdue);
    date.textContent = "Tenggat: " + formatDate(task.date) + (overdue ? " (terlambat)" : "");

    info.append(title, meta, date);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Hapus";
    deleteButton.setAttribute("aria-label", "Hapus tugas: " + task.title);
    deleteButton.addEventListener("click", function () {
        if (confirm('Hapus tugas "' + task.title + '"?')) {
            tasks = tasks.filter(function (t) { return t.id !== task.id; });
            saveTasks();
            showTasks();
        }
    });

    card.append(check, info, deleteButton);
    return card;
}

function showTasks() {
    const visible = getVisibleTasks();

    taskList.innerHTML = "";
    visible.forEach(function (task) {
        taskList.appendChild(createTaskCard(task));
    });

    // Pesan kosong
    emptyState.hidden = visible.length > 0;
    if (tasks.length === 0) {
        emptyTitle.textContent = "Belum ada tugas";
        emptyText.textContent = "Tambahkan tugas pertamamu melalui formulir.";
    } else {
        emptyTitle.textContent = "Tidak ada tugas yang cocok";
        emptyText.textContent = "Ubah kata kunci atau filter untuk melihat tugas lain.";
    }

    updateSummary(visible.length);
}

function updateSummary(visibleCount) {
    const total = tasks.length;
    const done = tasks.filter(function (t) { return t.done; }).length;
    const pending = total - done;
    const overdue = tasks.filter(isOverdue).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    statTotal.textContent = total;
    statDone.textContent = done;
    statPending.textContent = pending;

    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "%";

    listInfo.textContent = total === 0
        ? "Belum ada tugas."
        : "Menampilkan " + visibleCount + " dari " + total + " tugas.";

    clearDone.hidden = done === 0;

    if (total === 0) {
        welcomeTitle.textContent = "Halo!";
        welcomeText.textContent = "Mulai dengan menambahkan tugas pertamamu.";
    } else if (pending === 0) {
        welcomeTitle.textContent = "Semua tugas selesai 🎉";
        welcomeText.textContent = "Kerja bagus! Tambahkan tugas baru bila perlu.";
    } else if (overdue > 0) {
        welcomeTitle.textContent = "Ada " + overdue + " tugas terlambat";
        welcomeText.textContent = "Kerjakan yang terlambat lebih dulu, lalu lanjutkan sisanya.";
    } else {
        welcomeTitle.textContent = "Ada " + pending + " tugas menunggu";
        welcomeText.textContent = "Tetap semangat, selesaikan satu per satu.";
    }
}

// ====== Aksi lain ======
searchInput.addEventListener("input", showTasks);
filterSelect.addEventListener("change", showTasks);

clearDone.addEventListener("click", function () {
    if (confirm("Hapus semua tugas yang sudah selesai?")) {
        tasks = tasks.filter(function (t) { return !t.done; });
        saveTasks();
        showTasks();
    }
});

// ====== Awal ======
todayDate.textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
});
taskDate.value = todayString();
showTasks();
