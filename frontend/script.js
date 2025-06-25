from pathlib import Path

# Set the output path
output_path = Path("/mnt/data/script.js")

# Full fixed script.js content for calendar, notes, and materials integration
fixed_script = """
const calendarEl = document.getElementById("calendarDays");
const plannedActivitiesList = document.getElementById("planned-activities");
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note");
const noteList = document.getElementById("note-list");
const checklistContainer = document.getElementById("checklist");

const userId = "user123"; // hardcoded user ID for demo

// ---- CALENDAR ----
function renderCalendar(days) {
  calendarEl.innerHTML = "";
  days.forEach(day => {
    const div = document.createElement("div");
    div.className = `calendar-day ${day.currentMonth ? "" : "prev-next-month"}`;
    div.textContent = day.date;
    div.dataset.date = day.fullDate;

    div.addEventListener("click", () => {
      const title = prompt("Training name:");
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
  li.textContent = `${activity.date} - ${activity.title}`;
  li.dataset.id = activity._id;
  li.addEventListener("click", () => {
    if (confirm("Verwijderen?")) {
      fetch(\`https://onboarding-dashboard-final.onrender.com/api/calendar/\${activity._id}\`, {
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
  const currLast = new Date(year, month + 1, 0).getDate;

  for (let i = firstDay - 1; i > 0; i--) {
    const d = prevLast - i + 1;
    days.push({ date: d, fullDate: formatDate(year, month - 1, d), currentMonth: false });
  }

  for (let d = 1; d <= currLast; d++) {
    days.push({ date: d, fullDate: formatDate(year, month, d), currentMonth: true });
  }

  const total = Math.ceil(days.length / 7) * 7;
  for (let i = days.length + 1; i <= total; i++) {
    const d = i - days.length;
    days.push({ date: d, fullDate: formatDate(year, month + 1, d), currentMonth: false });
  }

  return days;
}

function formatDate(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return \`\${y}-\${mm}-\${dd}\`;
}

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const days = generateDays(currentYear, currentMonth);
renderCalendar(days);

// Load existing activities
fetch(\`https://onboarding-dashboard-final.onrender.com/api/calendar/\${userId}\`)
  .then(res => res.json())
  .then(activities => activities.forEach(addActivityToSidebar));

// ---- NOTES ----
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();
  if (!text) return;
  const note = { text, userId };

  fetch("https://onboarding-dashboard-final.onrender.com/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  })
  .then(res => res.json())
  .then(saved => {
    const li = document.createElement("li");
    li.textContent = saved.text;
    li.dataset.id = saved._id;
    li.addEventListener("click", () => {
      if (confirm("Verwijderen?")) {
        fetch(\`https://onboarding-dashboard-final.onrender.com/api/notes/\${saved._id}\`, {
          method: "DELETE"
        }).then(() => li.remove());
      }
    });
    noteList.appendChild(li);
    noteInput.value = "";
  });
});

// Load existing notes
fetch(\`https://onboarding-dashboard-final.onrender.com/api/notes/\${userId}\`)
  .then(res => res.json())
  .then(notes => {
    notes.forEach(note => {
      const li = document.createElement("li");
      li.textContent = note.text;
      li.dataset.id = note._id;
      li.addEventListener("click", () => {
        if (confirm("Verwijderen?")) {
          fetch(\`https://onboarding-dashboard-final.onrender.com/api/notes/\${note._id}\`, {
            method: "DELETE"
          }).then(() => li.remove());
        }
      });
      noteList.appendChild(li);
    });
  });

// ---- CHECKLIST ----
fetch(\`https://onboarding-dashboard-final.onrender.com/api/checklist/\${userId}\`)
  .then(res => res.json())
  .then(items => {
    checklistContainer.innerHTML = "";
    items.forEach(item => {
      const div = document.createElement("div");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = item.checked;
      input.addEventListener("change", () => {
        fetch(\`https://onboarding-dashboard-final.onrender.com/api/checklist/\${item._id}\`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked: input.checked })
        });
      });
      div.append(input, item.title);
      checklistContainer.appendChild(div);
    });
  });
"""

# Write the fixed script to file
output_path.write_text(fixed_script.strip())
output_path
