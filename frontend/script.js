
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
  monthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Ma=0
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    const currentDay = i - firstWeekday + 1;

    const isWeekend = i % 7 === 5 || i % 7 === 6; // Za of Zo
    if (isWeekend) {
      cell.style.display = "none";
    }

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

      const savedActivity = localStorage.getItem("activity_" + dateStr);
      if (savedActivity) {
        const act = document.createElement("div");
        act.className = "activity";
        act.innerHTML = `${savedActivity} <span style="color:red; float:right; cursor:pointer;" title="Verwijder" onclick="removeActivity('${dateStr}', event)">×</span>`;
        cell.appendChild(act);
      }

      cell.onclick = () => openModal(dateStr);
    } else {
      cell.className = "day empty";
    }

    calendarDays.appendChild(cell);
  }
}





function openModal(dateStr) {
  selectedDate = dateStr;
  modalDate.textContent = `Corporate Onboarding on ${dateStr}`;
  activityOptions.innerHTML = "";

  activities.forEach(activity => {
    const btn = document.createElement("button");
    btn.textContent = activity;
    btn.onclick = () => {
      localStorage.setItem("activity_" + selectedDate, activity);
      modal.style.display = "none";
      renderCalendar();
    };
    activityOptions.appendChild(btn);
  });

  modal.style.display = "flex";
}

function removeActivity(dateStr, event) {
  event.stopPropagation();
  localStorage.removeItem("activity_" + dateStr);
  renderCalendar();
}

closeModal.onclick = () => {
  modal.style.display = "none";
};

prevMonth.onclick = () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};

nextMonth.onclick = () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

addNote.onclick = () => {
  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.textContent = "Typ hier je notitie...";
  notesContainer.appendChild(note);
};

renderCalendar();



const durations = {
  "HR Welcome Tour": "1u",
  "Intro IT (equipment, access, apps)": "2u30",
  "Welcome mentor": "1u",
  "Welcome N+1": "2u30",
  "Welcome team (1-to-1s)": "1u",
  "Intro VTQ (group)": "1u",
  "Intro HR (systems & info)": "2u",
  "Intro Sales": "2u",
  "Intro Solutions & KAM": "2u",
  "Intro Finance": "1u",
  "Intro Sales Vet BE": "2u",
  "Intro Sales Vet/Retail NL": "2u",
  "Intro Sales Pharma": "2u",
  "Intro BI & IT": "1u",
  "Intro Communication": "1u",
  "Intro Corporate Communication & CSR": "1u",
  "Intro E-Commerce": "1u",
  "Intro Marketing": "1.5u"
};

function addTooltips() {
  document.querySelectorAll('#activityOptions button').forEach(btn => {
    const label = btn.textContent.trim();
    if (durations[label]) {
      btn.title = 'Duur: ' + durations[label];
    }
  });

  document.querySelectorAll('.activity').forEach(el => {
    const text = el.textContent.trim().replace(/ ×$/, '');
    if (durations[text]) {
      el.title = 'Duur: ' + durations[text];
    }
  });
}

const obsConfig = { childList: true, subtree: true };
const activityObserver = new MutationObserver(addTooltips);
activityObserver.observe(document.body, obsConfig);

function updatePlannedList() {
  const list = document.getElementById("plannedActivities");
  if (!list) return;
  list.innerHTML = "";

  const entries = Object.keys(localStorage)
    .filter(key => key.startsWith("activity_"))
    .map(key => {
      const date = key.replace("activity_", "");
      return { date, text: localStorage.getItem(key) };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const { date, text } of entries) {
    const li = document.createElement("li");
    li.textContent = `${date}: ${text}`;
    li.style.cursor = "pointer";
    li.onclick = () => {
      const [year, month, day] = date.split("-").map(Number);
      current = new Date(year, month - 1, day);
      renderCalendar();
      setTimeout(() => {
        const el = document.querySelector(`[data-date='${date}']`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("highlight");
          setTimeout(() => el.classList.remove("highlight"), 2000);
        }
      }, 100);
    };
    list.appendChild(li);
  }
}

const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.apply(this, arguments);
  updatePlannedList();
};
window.addEventListener("DOMContentLoaded", updatePlannedList);



document.getElementById('plannedActivities').addEventListener('click', function(e) {
  if (e.target && e.target.tagName === 'LI') {
    const dateText = e.target.textContent.split(':')[0];
    goToDate(dateText.trim());
  }
});
