# Ik ga het script.js-bestand vervangen met de volledig werkende versie zoals hierboven beschreven.
fixed_script = """
const calendarEl = document.getElementById("calendarDays");
const plannedActivitiesList = document.getElementById("plannedActivities");
const userId = "user123";

// Kalender tonen
function renderCalendar(days) {
  calendarEl.innerHTML = "";
  days.forEach(day => {
    const div = document.createElement("div");
    div.className = `day ${day.currentMonth ? "" : "inactive"}`;
    div.textContent = day.date;
    div.dataset.date = day.fullDate;

    div.addEventListener("click", () => {
      const title = prompt("Geef de training in:");
      if (!title) return;

      const activity = { title, date: day.fullDate, userId };

      fetch("https://onboarding-dashboard-final.onrender.com/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity)
      })
        .then(res => res.json())
        .then(saved => {
          addActivityToSidebar(saved);
        });
    });

    calendarEl.appendChild(div);
  });
}

function addActivityToSidebar(activity) {
  const li = document.createElement("li");
  li.textContent = `${activity.date} – ${activity.title}`;
  li.dataset.id = activity._id;

  li.addEventListener("click", () => {
    if (confirm("Verwijderen?")) {
      fetch(`https://onboarding-dashboard-final.onrender.com/api/calendar/${activity._id}`, {
        method: "DELETE"
      }).then(() => li.remove());
    }
  });

  plannedActivitiesList.appendChild(li);
}

function generateDays(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  const firstDay = date.getDay() || 7;
  const prevLast = new Date(year, month, 0).getDate();
  const currLast = new Date(year, month + 1, 0).getDate();

  for (let i = firstDay - 1; i > 0; i--) {
    const d = prevLast - i + 1;
    days.push({ date: d, fullDate: formatDate(year, month - 1, d), currentMonth: false });
  }

  for (let d = 1; d <= currLast; d++) {
    days.push({ date: d, fullDate: formatDate(year, month, d), currentMonth: true });
  }

  const total = Math.ceil(days.length / 5) * 5;
  for (let i = days.length + 1; i <= total; i++) {
    const d = i - days.length;
    days.push({ date: d, fullDate: formatDate(year, month + 1, d), currentMonth: false });
  }

  return days;
}

function formatDate(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

function updateCalendar() {
  const monthYear = document.getElementById("monthYear");
  const thisDate = new Date(currentYear, currentMonth);
  monthYear.textContent = thisDate.toLocaleString("default", { month: "long", year: "numeric" });
  const days = generateDays(currentYear, currentMonth);
  renderCalendar(days);
}

document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
});

updateCalendar();

fetch(`https://onboarding-dashboard-final.onrender.com/api/calendar/${userId}`)
  .then(res => res.json())
  .then(data => data.forEach(addActivityToSidebar));
"""

# Schrijf naar bestand
script_path = "/mnt/data/script.js"
with open(script_path, "w", encoding="utf-8") as f:
    f.write(fixed_script.strip())

script_path
