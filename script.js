const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const filterButtons = document.querySelectorAll(".filter");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");


document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});


addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return alert("Enter a task!");

    addTaskToUI(text, false);
    saveTasks();
    taskInput.value = "";
});


function addTaskToUI(text, completed) {
    const li = document.createElement("li");

    const spanText = document.createElement("span");
    spanText.textContent = text;
    if (completed) spanText.classList.add("task-completed");

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("btns");

    // Done Button
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "Done";

    completeBtn.onclick = () => {
        spanText.classList.toggle("task-completed");
        saveTasks();
    };

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Del";

    deleteBtn.onclick = () => {
        li.remove();
        saveTasks();
    };

    btnDiv.appendChild(completeBtn);
    btnDiv.appendChild(deleteBtn);

    li.appendChild(spanText);
    li.appendChild(btnDiv);

    taskList.appendChild(li);

    updateCounters();
}


function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        const text = li.querySelector("span").textContent;
        const done = li.querySelector("span").classList.contains("task-completed");
        tasks.push({ text, completed: done });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounters();
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(t => addTaskToUI(t.text, t.completed));
}


function updateCounters() {
    const tasks = document.querySelectorAll("#taskList li");
    const completed = document.querySelectorAll(".task-completed").length;
    const pending = tasks.length - completed;

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

// Filter tasks
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter.active").classList.remove("active");
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        document.querySelectorAll("#taskList li").forEach(li => {
            const completed = li.querySelector("span").classList.contains("task-completed");

            if (filter === "all") li.style.display = "flex";
            else if (filter === "completed") li.style.display = completed ? "flex" : "none";
            else if (filter === "pending") li.style.display = !completed ? "flex" : "none";
        });
    });
});


themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});


function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    }
}
