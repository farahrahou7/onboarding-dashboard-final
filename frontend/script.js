# Let's generate the corrected script.js file with the appropriate backend BASE_URL updates
script_content = """
const BASE_URL = "https://onboarding-dashboard-final.onrender.com";

const calendarDays = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const modal = document.getElementById("activityModal");
const modalDate = document.getElementById("modalDate");
const activityOptions = document.getElementById("activityOptions");
const closeModal = document.getElementById("closeModal");
const notesContainer = document.getElementById("notesContainer");
const addNote = document.getElementById("addNote");

let current = new Date(2025, 0);
let selectedDate = null;

const activitiesList = [
  "HR Welcome Tour",
  "Intro IT (equipment, access, apps)",
  "Welcome mentor",
  "Welcome N+1",
  "Welcome team (1-to-1s)",
  "Intro VTQ (group)",
  "Intro HR (systems & info)",
  "Intro Sales",
  "Intro Solutions & KAM",
  "Intro Finance",
  "Intro Sales Vet BE",
  "Intro Sales Vet/Retail NL",
  "Intro Sales Pharma",
  "Intro BI & IT",
  "Intro Communication",
  "Intro Corporate Communication & CSR",
  "Intro E-Commerce",
  "Intro Marketing"
];

async function fetchData(url) {
  const res = await fetch(`${BASE_URL}${url}`);
  return await res.json();
}

async function saveData(url, body) {
  await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const monthName = current.toLocaleString('en-GB', { month: 'long' });
  monthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 5) * 5;
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const activities = await fetchData("/api/calendar");

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    const currentDay = i - firstWeekday + 1;

    if (i < firstWeekday) {
      const dayNum = daysInPrevMonth - firstWeekday + i + 1;
      cell.className = "day inactive";
      cell.textContent = dayNum;
    } else if (currentDay > 0 && currentDay <= daysInMonth) {
      const date = new Date(year, month, currentDay);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;

      cell.className = "day";
      cell.textContent = currentDay;
      cell.dataset.date = dateStr;

      const saved = activities.find(a => a.date === dateStr);
      if (saved) {
        const act = document.createElement("div");
        act.className = "activity";
        act.innerHTML = `${saved.activity} <span style="color:red; float:right; cursor:pointer;" onclick="removeActivity('${dateStr}', event)">×</span>`;
        cell.appendChild(act);
      }

      cell.onclick = () => openModal(dateStr);
    } else {
      cell.className = "day empty";
    }

    calendarDays.appendChild(cell);
  }

  updatePlannedList();
}

async function openModal(dateStr) {
  selectedDate = dateStr;
  modalDate.textContent = `Corporate Onboarding on ${dateStr}`;
  activityOptions.innerHTML = "";

  activitiesList.forEach(activity => {
    const btn = document.createElement("button");
    btn.textContent = activity;
    btn.onclick = async () => {
      await saveData("/api/calendar", { date: selectedDate, activity });
      modal.style.display = "none";
      renderCalendar();
    };
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

async function removeActivity(dateStr, event) {
  event.stopPropagation();
  await fetch(`${BASE_URL}/api/calendar`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: dateStr }),
  });
  renderCalendar();
}

closeModal.onclick = () => modal.style.display = "none";
prevMonth.onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); };
nextMonth.onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); };

addNote.onclick = async () => {
  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.textContent = "Typ hier je notitie...";
  notesContainer.appendChild(note);

  await saveData("/api/notes", { text: note.textContent });
};

async function updatePlannedList() {
  const list = document.getElementById("plannedActivities");
  if (!list) return;
  list.innerHTML = "";

  const activities = await fetchData("/api/calendar");

  const sorted = activities.sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const { date, activity } of sorted) {
    const li = document.createElement("li");
    li.textContent = `${date}: ${activity}`;
    li.style.cursor = "pointer";
    li.onclick = () => {
      const [year, month, day] = date.split("-").map(Number);
      current = new Date(year, month - 1, day);
      renderCalendar();
    };
    list.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", renderCalendar);
"""

# Save the file for the user to download
path = "/mnt/data/script.js"
with open(path, "w", encoding="utf-8") as f:
    f.write(script_content)

path
