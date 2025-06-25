const apiBase = "https://onboarding-dashboard-final.onrender.com/api";

// Kalenderlogica
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const modal = document.getElementById("activityModal");
const modalDate = document.getElementById("modalDate");
const activityOptions = document.getElementById("activityOptions");
const closeModal = document.getElementById("closeModal");
const plannedActivitiesList = document.getElementById("plannedActivities");

let current = new Date(2025, 0);
let selectedDate = null;

const activities = [
  "HR Welcome Tour", "Intro IT (equipment, access, apps)", "Welcome mentor",
  "Welcome N+1", "Welcome team (1-to-1s)", "Intro VTQ (group)", "Intro HR (systems & info)",
  "Intro Sales", "Intro Solutions & KAM", "Intro Finance", "Intro Sales Vet BE",
  "Intro Sales Vet/Retail NL", "Intro Sales Pharma", "Intro BI & IT", "Intro Communication",
  "Intro Corporate Communication & CSR", "Intro E-Commerce", "Intro Marketing"
];

function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const totalCells = startDay + daysInMonth;
  const rows = Math.ceil(totalCells / 5) * 5;

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
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      dayEl.textContent = dayNum;
      dayEl.dataset.date = dateStr;
      dayEl.addEventListener("click", () => openModal(dateStr));
    }

    calendarDays.appendChild(dayEl);
  }

  loadActivities();
}

function openModal(date) {
  selectedDate = date;
  modalDate.textContent = `Add Activity on ${date}`;
  activityOptions.innerHTML = "";

  activities.forEach((act) => {
    const btn = document.createElement("button");
    btn.textContent = act;
    btn.onclick = () => saveActivity(date, act);
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

async function saveActivity(date, activity) {
  await fetch(`${apiBase}/calendar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, activity })
  });
  modal.style.display = "none";
  renderCalendar();
}

async function loadActivities() {
  const res = await fetch(`${apiBase}/activities`);
  const items = await res.json();
  plannedActivitiesList.innerHTML = "";

  items.forEach(({ date, activity }) => {
    const cell = [...document.querySelectorAll(".day")].find(d => d.dataset.date === date);
    if (cell) {
      const span = document.createElement("div");
      span.classList.add("activity");
      span.textContent = activity;
      cell.appendChild(span);
    }

    const li = document.createElement("li");
    li.textContent = `${date} – ${activity}`;
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
closeModal.onclick = () => modal.style.display = "none";

// Checklist opslaan
document.querySelectorAll("#materials input[type=checkbox]").forEach((checkbox, index) => {
  checkbox.addEventListener("change", async () => {
    const label = checkbox.parentElement.textContent.trim();
    await fetch(`${apiBase}/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, checked: checkbox.checked })
    });
  });
});

async function loadChecklist() {
  const res = await fetch(`${apiBase}/materials`);
  const data = await res.json();
  document.querySelectorAll("#materials input[type=checkbox]").forEach((checkbox) => {
    const label = checkbox.parentElement.textContent.trim();
    const item = data.find(d => d.label === label);
    if (item) checkbox.checked = item.checked;
  });
}

// Notes opslaan
const notesContainer = document.getElementById("notesContainer");
document.getElementById("addNote").onclick = async () => {
  const note = prompt("Add note:");
  if (!note) return;

  await fetch(`${apiBase}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: note })
  });
  loadNotes();
};

async function loadNotes() {
  const res = await fetch(`${apiBase}/notes`);
  const notes = await res.json();
  notesContainer.innerHTML = "";
  notes.forEach(n => {
    const div = document.createElement("div");
    div.className = "note";
    div.textContent = n.text;
    notesContainer.appendChild(div);
  });
}

// Init
renderCalendar();
loadChecklist();
loadNotes();
