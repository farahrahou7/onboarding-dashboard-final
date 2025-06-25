const calendarDays = document.getElementById("calendarDays");
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
  "Rondleiding & welkom HR",
  "Welkom IT (materiaal, toegangen, apps)",
  "Welkom meter",
  "Welkom N+1",
  "Welcome team (121's)",
  "Intro VTQ (in groep)",
  "Intro HR (HR systems & info)",
  "Intro sales",
  "Intro Solutions & KAM",
  "Intro Finance",
  "Intro sales manager Vet BE",
  "Intro sales manager Vet/retail NL",
  "Intro Sales manager Pharma",
  "Intro BI & IT",
  "Intro Communication",
  "intro Corporate com",
  "Intro E-Commerce"
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

async function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 5) * 5;
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = current.toLocaleString('nl-NL', { month: 'long' });
  monthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

  const activities = await fetchData("https://onboarding-dashboard-final.onrender.com/api/activities");

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    const currentDay = i - firstWeekday + 1;

    if (i < firstWeekday) {
      const dayNum = daysInPrevMonth - firstWeekday + i + 1;
      cell.className = "day inactive";
      cell.textContent = dayNum;
    } else if (currentDay > 0 && currentDay <= daysInMonth) {
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
  modalDate.textContent = `Training op ${dateStr}`;
  activityOptions.innerHTML = "";

  activitiesList.forEach(activity => {
    const btn = document.createElement("button");
    btn.textContent = activity;
    btn.onclick = async () => {
      await saveData("https://onboarding-dashboard-final.onrender.com/api/activities", { date: selectedDate, activity });
      modal.style.display = "none";
      renderCalendar();
    };
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

async function removeActivity(dateStr, event) {
  event.stopPropagation();
  await fetch("https://onboarding-dashboard-final.onrender.com/api/activities", {
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
  const noteText = "Typ hier je notitie...";
  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.textContent = noteText;
  notesContainer.appendChild(note);

  await saveData("https://onboarding-dashboard-final.onrender.com/api/notes", { text: noteText });
};

async function updatePlannedList() {
  const list = document.getElementById("plannedActivities");
  if (!list) return;
  list.innerHTML = "";

  const activities = await fetchData("https://onboarding-dashboard-final.onrender.com/api/activities");
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

document.addEventListener("DOMContentLoaded", async () => {
  await renderCalendar();

  // Check checklist
  const materials = document.querySelectorAll("#materials input[type=checkbox]");
  const savedChecklist = await fetchData("https://onboarding-dashboard-final.onrender.com/api/checklist");
  materials.forEach(checkbox => {
    const found = savedChecklist.find(item => item.label === checkbox.nextSibling.textContent.trim());
    if (found) checkbox.checked = found.checked;
    checkbox.addEventListener("change", () => {
      fetch("https://onboarding-dashboard-final.onrender.com/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: checkbox.nextSibling.textContent.trim(), checked: checkbox.checked })
      });
    });
  });

  // Load notes
  const notes = await fetchData("https://onboarding-dashboard-final.onrender.com/api/notes");
  notes.forEach(n => {
    const note = document.createElement("div");
    note.className = "note";
    note.contentEditable = true;
    note.textContent = n.text;
    notesContainer.appendChild(note);
  });
});
