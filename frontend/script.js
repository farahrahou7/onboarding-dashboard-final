// frontend/script.js

const calendarEl = document.getElementById("calendarDays");
const plannedActivitiesList = document.getElementById("plannedActivities");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const userId = "user123"; // statisch of dynamisch zoals gewenst
const apiBase = "https://onboarding-dashboard-final.onrender.com/api/calendar";

// Bouw kalenderdata op
function generateDays(year, month) {
  const days = [];
  const firstOfMonth = new Date(year, month, 1);
  const firstDay = (firstOfMonth.getDay() + 6) % 7; // maandag=0
  const prevLast = new Date(year, month, 0).getDate();
  const currLast = new Date(year, month + 1, 0).getDate();

  // vorige maand
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      dateNum: prevLast - i,
      fullDate: formatDate(year, month - 1, prevLast - i),
      curr: false
    });
  }
  // huidige maand
  for (let d = 1; d <= currLast; d++) {
    days.push({
      dateNum: d,
      fullDate: formatDate(year, month, d),
      curr: true
    });
  }
  // opvullen tot veelvoud van 5 kolommen
  const total = Math.ceil(days.length / 5) * 5;
  for (let i = days.length; i < total; i++) {
    const d = i - currLast - firstDay + 1;
    days.push({
      dateNum: d,
      fullDate: formatDate(year, month + 1, d),
      curr: false
    });
  }
  return days;
}

function formatDate(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

// Render de kalender
function renderCalendar(days) {
  calendarEl.innerHTML = "";
  days.forEach(day => {
    const div = document.createElement("div");
    div.className = "day" + (day.curr ? "" : " inactive");
    div.textContent = day.dateNum;
    div.dataset.date = day.fullDate;

    if (day.curr) {
      div.addEventListener("click", async () => {
        const title = prompt("Geef de training in:");
        if (!title) return;

        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, date: day.fullDate, title })
        });
        const saved = await res.json();
        addActivityToSidebar(saved);
        updateCalendar();
      });
    }

    calendarEl.appendChild(div);
  });
}

// Voeg activiteit toe aan de sidebar-lijst
function addActivityToSidebar(act) {
  const li = document.createElement("li");
  li.textContent = `${act.date} – ${act.title}`;
  li.dataset.id = act._id;

  li.addEventListener("click", async () => {
    if (!confirm("Verwijderen?")) return;
    await fetch(`${apiBase}/${act._id}`, { method: "DELETE" });
    li.remove();
    updateCalendar();
  });

  plannedActivitiesList.appendChild(li);
}

// Laad activiteiten van backend
async function loadActivities() {
  plannedActivitiesList.innerHTML = "";
  const res = await fetch(`${apiBase}/${userId}`);
  const data = await res.json();
  data.forEach(addActivityToSidebar);
  return data;
}

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

async function updateCalendar() {
  const days = generateDays(currentYear, currentMonth);
  renderCalendar(days);

  const activities = await loadActivities();
  activities.forEach(act => {
    const cell = [...calendarEl.children].find(c => c.dataset.date === act.date);
    if (cell) {
      const span = document.createElement("div");
      span.className = "activity";
      span.textContent = act.title;
      cell.appendChild(span);
    }
  });

  document.getElementById("monthYear").textContent =
    new Date(currentYear, currentMonth).toLocaleString("nl-NL", { month: "long", year: "numeric" });
}

prevBtn.addEventListener("click", () => {
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  if (currentMonth === 11) currentYear--;
  updateCalendar();
});

nextBtn.addEventListener("click", () => {
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  if (currentMonth === 0) currentYear++;
  updateCalendar();
});

// start alles
updateCalendar();
