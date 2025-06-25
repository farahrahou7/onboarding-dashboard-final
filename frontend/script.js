from pathlib import Path

# Pad voor de nieuwe samengestelde script.js
script_path = Path("/mnt/data/script.js")

# Inhoud van de samengestelde script.js met volledige integratie voor:
# - Agenda (calendar)
# - Notes
# - Checklist
script_content = """
const BASE_URL = "https://onboarding-dashboard-final.onrender.com";
const USER_ID = "default";

// Elementen
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

let current = new Date();
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
  const res = await fetch(url);
  return await res.json();
}

async function saveData(url, body) {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// RENDER CALENDAR
async function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const monthName = current.toLocaleString('en-GB', { month: 'long' });
  monthYear.textContent = \`\${monthName.charAt(0).toUpperCase() + monthName.slice(1)} \${year}\`;

  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 5) * 5;
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const activities = await fetchData(\`\${BASE_URL}/api/calendar/\${USER_ID}\`);

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    const currentDay = i - firstWeekday + 1;

    if (i < firstWeekday) {
      cell.className = "day inactive";
      cell.textContent = daysInPrevMonth - firstWeekday + i + 1;
    } else if (currentDay > 0 && currentDay <= daysInMonth) {
      const dateStr = \`\${year}-\${String(month + 1).padStart(2, "0")}-\${String(currentDay).padStart(2, "0")}\`;
      cell.className = "day";
      cell.textContent = currentDay;
      cell.dataset.date = dateStr;

      const saved = activities.find(a => a.date === dateStr);
      if (saved) {
        const act = document.createElement("div");
        act.className = "activity";
        act.innerHTML = \`\${saved.title} <span style="color:red; float:right; cursor:pointer;" onclick="removeActivity('\${saved._id}', event)">×</span>\`;
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
  modalDate.textContent = \`Corporate Onboarding on \${dateStr}\`;
  activityOptions.innerHTML = "";

  activitiesList.forEach(activity => {
    const btn = document.createElement("button");
    btn.textContent = activity;
    btn.onclick = async () => {
      await saveData(\`\${BASE_URL}/api/calendar\`, {
        date: selectedDate,
        title: activity,
        userId: USER_ID,
      });
      modal.style.display = "none";
      renderCalendar();
    };
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

async function removeActivity(id, event) {
  event.stopPropagation();
  await fetch(\`\${BASE_URL}/api/calendar/\${id}\`, {
    method: "DELETE"
  });
  renderCalendar();
}

closeModal.onclick = () => modal.style.display = "none";
prevMonth.onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); };
nextMonth.onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); };

// NOTES
addNote.onclick = async () => {
  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.textContent = "Typ hier je notitie...";
  notesContainer.appendChild(note);
  await saveData(\`\${BASE_URL}/api/notes\`, { text: note.textContent, userId: USER_ID });
};

async function loadNotes() {
  const notes = await fetchData(\`\${BASE_URL}/api/notes/\${USER_ID}\`);
  notes.forEach(noteData => {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = noteData.text;
    notesContainer.appendChild(note);
  });
}

// CHECKLIST
async function loadChecklist() {
  const checklist = await fetchData(\`\${BASE_URL}/api/materials/\${USER_ID}\`);
  checklist.forEach(item => {
    const checkbox = document.querySelector(\`input[value="\${item.item}"]\`);
    if (checkbox) checkbox.checked = item.checked;
  });

  document.querySelectorAll("#equipment-list input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", () => {
      fetch(\`\${BASE_URL}/api/materials\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: cb.value, checked: cb.checked, userId: USER_ID }),
      });
    });
  });
}

// PLANNED LIST
async function updatePlannedList() {
  const list = document.getElementById("plannedActivities");
  if (!list) return;
  list.innerHTML = "";

  const activities = await fetchData(\`\${BASE_URL}/api/calendar/\${USER_ID}\`);
  const sorted = activities.sort((a, b) => new Date(a.date) - new Date(b.date));
  for (const { date, title } of sorted) {
    const li = document.createElement("li");
    li.textContent = \`\${date}: \${title}\`;
    li.style.cursor = "pointer";
    li.onclick = () => {
      const [year, month, day] = date.split("-").map(Number);
      current = new Date(year, month - 1, day);
      renderCalendar();
    };
    list.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  loadNotes();
  loadChecklist();
});
"""

# Schrijf de file weg
script_path.write_text(script_content)

# Geef downloadlink
script_path.name
