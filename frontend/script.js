
const API_URL = 'https://onboarding-dashboard-final.onrender.com';

function goToDate(dateStr) {
  const target = new Date(dateStr);
  current = new Date(target.getFullYear(), target.getMonth(), 1);
  renderCalendar();
  setTimeout(() => {
    const el = [...document.querySelectorAll('[data-date]')].find(e => e.dataset.date === dateStr);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

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

let current = new Date(2025, 0);
let selectedDate = null;

const activities = [
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

function renderCalendar() {
  calendarDays.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const monthName = current.toLocaleString('en-GB', { month: 'long' });
  monthYear.textContent = \`\${monthName.charAt(0).toUpperCase() + monthName.slice(1)} \${year}\`;

  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    const currentDay = i - firstWeekday + 1;

    const isWeekend = i % 7 === 5 || i % 7 === 6;
    if (isWeekend) {
      cell.style.display = "none";
    }

    if (i < firstWeekday) {
      const dayNum = daysInPrevMonth - firstWeekday + i + 1;
      cell.className = "day inactive";
      cell.textContent = dayNum;
    } else if (currentDay > 0 && currentDay <= daysInMonth) {
      const date = new Date(year, month, currentDay);
      const dateStr = \`\${year}-\${String(month + 1).padStart(2, "0")}-\${String(currentDay).padStart(2, "0")}\`;

      cell.className = "day";
      cell.textContent = currentDay;
      cell.dataset.date = dateStr;

      fetch(\`\${API_URL}/activities/\${dateStr}\`)
        .then(res => res.json())
        .then(data => {
          if (data && data.activity) {
            const act = document.createElement("div");
            act.className = "activity";
            act.innerHTML = \`\${data.activity} <span style="color:red; float:right; cursor:pointer;" title="Verwijder" onclick="removeActivity('\${dateStr}', event)">×</span>\`;
            cell.appendChild(act);
          }
        })
        .catch(err => console.error('Fout bij ophalen:', err));

      cell.onclick = () => openModal(dateStr);
    } else {
      cell.className = "day empty";
    }

    calendarDays.appendChild(cell);
  }
}

function openModal(dateStr) {
  selectedDate = dateStr;
  modalDate.textContent = \`Corporate Onboarding on \${dateStr}\`;
  activityOptions.innerHTML = "";

  activities.forEach(activity => {
    const btn = document.createElement("button");
    btn.textContent = activity;
    btn.onclick = () => {
      fetch(\`\${API_URL}/activities\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, activity })
      })
      .then(() => {
        modal.style.display = "none";
        renderCalendar();
      })
      .catch(err => console.error('Fout bij opslaan:', err));
    };
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

function removeActivity(dateStr, event) {
  event.stopPropagation();
  fetch(\`\${API_URL}/activities/\${dateStr}\`, {
    method: 'DELETE'
  })
  .then(() => renderCalendar())
  .catch(err => console.error('Fout bij verwijderen:', err));
}

closeModal.onclick = () => modal.style.display = "none";
prevMonth.onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); };
nextMonth.onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); };
addNote.onclick = () => {
  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.textContent = "Typ hier je notitie...";
  notesContainer.appendChild(note);
};

renderCalendar();
