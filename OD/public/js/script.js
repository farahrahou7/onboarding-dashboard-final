const apiBase = "https://onboarding-dashboard-final.onrender.com/api";
const userId = "user123";

// DOM-elementen
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const plannedActivitiesList = document.getElementById("plannedActivities");
const modal = document.getElementById("activityModal");
const modalDate = document.getElementById("modalDate");
const activityOptions = document.getElementById("activityOptions");
const closeModal = document.getElementById("closeModal");
const durations = {
  'Tour & welcome HR': '1h',
  'Welcome IT (equipment, access, apps)': '2h30',
  'Welcome godmother or godfather': '1h',
  'Welcome N+1': '2h30',
  "Welcome team (121's)": '2h',
  'Intro VTQ (in group)': '2h',
  'Intro HR (HR systems & info)': '2h',
  'Intro sales': '2h',
  'Intro Solutions & KAM': '2h',
  'Intro Finance': '1h',
  'Intro sales manager Vet BE': '2h',
  'Intro sales manager Vet NL': '2h',
  'Intro Sales manager Pharma': '1h',
  'Intro BI & IT': '1h',
  'Intro Communication': '1h',
  'Intro Corporate Communication': '1h',
  'Intro E-Commerce': '1h',
  'Intro QANRA Pharmacovig': '1h',
  'Intro Marketing': '1h'
};


let current = new Date();
let dateActivities = {}; // bevat geplande activiteiten per datum

// 🗓 Kalender renderen (ma–vr)
function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Start bij de maandag vóór de 1e van de maand
  let startDate = new Date(firstDayOfMonth);
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  // Eindig bij de vrijdag ná de laatste dag van de maand
  let endDate = new Date(lastDayOfMonth);
  while (endDate.getDay() !== 5) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const monthName = current.toLocaleString("en-EN", { month: "long" });
  monthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

  const day = new Date(startDate);
  while (day <= endDate) {
    if (day.getDay() >= 1 && day.getDay() <= 5) { // alleen Ma-Vr
      const cell = document.createElement("div");
      cell.className = "day";

      const dayNum = day.getDate();
      const dateStr = formatDate(day.getFullYear(), day.getMonth(), dayNum);

      cell.textContent = dayNum;
      cell.dataset.date = dateStr;

      if (day.getMonth() !== month) {
        cell.classList.add("inactive"); // andere maand
      }

      cell.addEventListener("click", () => {
        openModal(dateStr);
      });

      calendarDays.appendChild(cell);
      renderActivitiesInCell(cell, dateStr);
    }

    day.setDate(day.getDate() + 1);
  }

  loadActivities();
}


// Toon activiteiten in cel
function renderActivitiesInCell(cell, dateStr) {
  (dateActivities[dateStr] || []).forEach(act => {
    const span = document.createElement("div");
    span.classList.add("activity");
    span.textContent = act.title;

    const duration = durations[act.title] || "Onbekend";

    span.title = `Duur: ${duration}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";
    removeBtn.onclick = async (e) => {
      e.stopPropagation();
      await removeActivity(act._id);
    };

    span.appendChild(removeBtn);
    cell.appendChild(span);
  });
}

// Laad alle activiteiten en her-render
async function loadActivities() {
  const res = await fetch(`${apiBase}/calendar/${userId}`);
  const items = await res.json();
  dateActivities = items.reduce((acc, it) => {
    acc[it.date] = acc[it.date] || [];
    acc[it.date].push(it);
    return acc;
  }, {});
  refreshUI();
}

// UI vernieuwen
function refreshUI() {
  monthYear.textContent = formatCurrentMonth();
  renderCalendar();
  renderPlannedList();
}

// Notes
const notesContainer = document.getElementById("notesContainer");
document.getElementById("addNote").addEventListener("click", async () => {
  const text = prompt("Voeg een notitie toe:");
  if (!text) return;
  await fetch(`${apiBase}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, userId })
  });
  loadNotes();
});

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

// Planned activities bar (links)
function renderPlannedList() {
  plannedActivitiesList.innerHTML = "";
  Object.keys(dateActivities).forEach(date => {
    dateActivities[date].forEach(it => {
      const li = document.createElement("li");
      li.textContent = `${date} – ${it.title}`;
      li.dataset.id = it._id;
      li.addEventListener("click", () => removeActivity(it._id));
      plannedActivitiesList.appendChild(li);
    });
  });
}

// Modal openen
function openModal(dateStr) {
  modalDate.textContent = `Corporate Onboarding op ${dateStr}`;
  activityOptions.innerHTML = "";

  // Alle opties tonen
  Object.keys(durations).forEach(title => {
    const btn = document.createElement("button");
    btn.textContent = title;
    btn.title = `Duur: ${durations[title]}`;
    btn.addEventListener("click", () => addActivity(dateStr, title));
    activityOptions.appendChild(btn);
  });
  // Bestaande activiteiten
  (dateActivities[dateStr] || []).forEach(act => {
    const btn = document.createElement("button");
    btn.classList.add("planned");
    btn.textContent = act.title + " ×";
    btn.title = `Verwijder`;
    btn.addEventListener("click", () => removeActivity(act._id));
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

// Modal sluiten
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// Activiteit toevoegen
async function addActivity(date, title) {
  // Verzamel alle aangevinkte materialen
  const checkedItems = Array.from(document.querySelectorAll('#materials input:checked'))
    .map(checkbox => checkbox.parentElement.textContent.trim());

  await fetch(`${apiBase}/calendar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, date, title, equipment: checkedItems })
  });

  await loadActivities();
}

// Activiteit verwijderen
async function removeActivity(id) {
  await fetch(`${apiBase}/calendar/${id}`, { method: "DELETE" });
  await loadActivities();
}

// Helper functies
function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatCurrentMonth() {
  const mn = current.toLocaleString("nl-NL", { month: "long" });
  return `${mn.charAt(0).toUpperCase() + mn.slice(1)} ${current.getFullYear()}`;
}

// Navigatie
prevMonth.onclick = () => { current.setMonth(current.getMonth() - 1); refreshUI(); };
nextMonth.onclick = () => { current.setMonth(current.getMonth() + 1); refreshUI(); };

// Quel de start
document.addEventListener("DOMContentLoaded", () => {
  loadActivities();
  loadNotes();
});
