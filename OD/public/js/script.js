const apiBase = "https://onboarding-dashboard-final.onrender.com/api";
const userId = "user123";

// Kalender elementen
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const plannedActivitiesList = document.getElementById("plannedActivities");

let current = new Date();

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const rows = 25; // 5 weken × 5 werkdagen

  const monthName = current.toLocaleString("nl-NL", { month: "long" });
  monthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

  for (let i = 0; i < rows; i++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    const dayNum = i - startDay + 1;

    if (i < startDay) {
      dayEl.textContent = prevMonthLastDay - (startDay - i - 1);
      dayEl.classList.add("inactive");
    } else if (dayNum > daysInMonth) {
      dayEl.textContent = dayNum - daysInMonth;
      dayEl.classList.add("inactive");
    } else {
      const dateStr = formatDate(year, month, dayNum);
      dayEl.textContent = dayNum;
      dayEl.dataset.date = dateStr;

      dayEl.addEventListener("click", async () => {
        const title = prompt("Training toevoegen:");
        if (!title) return;

        const activity = { title, date: dateStr, userId };

        await fetch(`${apiBase}/calendar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activity)
        });

        renderCalendar();
      });
    }

    calendarDays.appendChild(dayEl);
  }

  loadActivities();
}

async function loadActivities() {
  const res = await fetch(`${apiBase}/calendar/${userId}`);
  const items = await res.json();
  plannedActivitiesList.innerHTML = "";

  items.forEach(({ date, title, _id }) => {
    const cell = [...document.querySelectorAll(".day")].find(d => d.dataset.date === date);
    if (cell) {
      const span = document.createElement("div");
      span.classList.add("activity");
      span.textContent = title;
      cell.appendChild(span);
    }

    const li = document.createElement("li");
    li.textContent = `${date} – ${title}`;
    li.dataset.id = _id;
    li.addEventListener("click", async () => {
      if (confirm("Verwijderen?")) {
        await fetch(`${apiBase}/calendar/${_id}`, { method: "DELETE" });
        renderCalendar();
      }
    });
    plannedActivitiesList.appendChild(li);
  });
}

// Navigatie
prevMonth.onclick = () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};
nextMonth.onclick = () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

// Checklist
document.querySelectorAll("#materials input[type=checkbox]").forEach((checkbox) => {
  checkbox.addEventListener("change", async () => {
    const label = checkbox.parentElement.textContent.trim();
    await fetch(`${apiBase}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: label, checked: checkbox.checked, userId })
    });
  });
});

async function loadChecklist() {
  const res = await fetch(`${apiBase}/checklist/${userId}`);
  const data = await res.json();
  document.querySelectorAll("#materials input[type=checkbox]").forEach((checkbox) => {
    const label = checkbox.parentElement.textContent.trim();
    const item = data.find(d => d.title === label);
    if (item) checkbox.checked = item.checked;
  });
}

// Notes
const notesContainer = document.getElementById("notesContainer");
document.getElementById("addNote").onclick = async () => {
  const text = prompt("Voeg een notitie toe:");
  if (!text) return;
  await fetch(`${apiBase}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, userId })
  });
  loadNotes();
};

async function loadNotes() {
  const res = await fetch(`${apiBase}/notes/${userId}`);
  const notes = await res.json();
  notesContainer.innerHTML = "";
  notes.forEach(n => {
    const div = document.createElement("div");
    div.className = "note";
    div.textContent = n.text;
    notesContainer.appendChild(div);
  });
}

// Initialisatie
renderCalendar();
loadChecklist();
loadNotes();
