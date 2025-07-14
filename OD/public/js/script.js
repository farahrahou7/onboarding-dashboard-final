const apiBase = "https://onboarding-dashboard-final.onrender.com/api";
const userId = localStorage.getItem("userId");

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
const participantModal = document.getElementById("participantModal");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const saveParticipantBtn = document.getElementById("saveParticipantBtn");
const closeParticipantModal = document.getElementById("closeParticipantModal");
const sessions = [
  { title: "Tour & welcome HR", duration: "1h", trainer: "" },
  {
    title: "Welcome IT (equipment, access, apps)",
    duration: "2h30",
    trainer: "Roel Van Der Veken",
  },
  { title: "Welcome godmother or godfather", duration: "1h", trainer: "" },
  { title: "Welcome N+1", duration: "2h30", trainer: "" },
  { title: "Welcome team (121's)", duration: "2h", trainer: "" },
  { title: "Intro VTQ (in group)", duration: "2h", trainer: "Lisa Smet" },
  { title: "Intro HR (HR systems & info)", duration: "2h", trainer: "" },
  { title: "Intro sales", duration: "2h", trainer: "Bieke De Man" },
  { title: "Intro Solutions & KAM", duration: "2h", trainer: "Lies Jordaens" },
  { title: "Intro Finance", duration: "1h", trainer: "Peter De Veylder" },
  {
    title: "Intro sales manager Vet BE",
    duration: "2h",
    trainer: "Lien De Schutter",
  },
  {
    title: "Intro sales manager Vet NL",
    duration: "2h",
    trainer: "Elien Taffin",
  },
  {
    title: "Intro Sales manager Pharma",
    duration: "1h",
    trainer: "Nancy Miceli",
  },
  { title: "Intro BI & IT", duration: "1h", trainer: "Kristof Van Den Bosch" },
  { title: "Intro Communication", duration: "1h", trainer: "Candice Hamilton" },
  {
    title: "Intro Corporate Communication",
    duration: "1h",
    trainer: "Eva Swaab",
  },
  { title: "Intro E-Commerce", duration: "1h", trainer: "Birger De Geeter" },
  {
    title: "Intro QANRA Pharmacovig",
    duration: "1h",
    trainer: "Jeroen Lievens",
  },
  { title: "Intro Marketing", duration: "1h", trainer: "Annick Janssen" },
  { title: "Safety", duration: "NAV", trainer: "Thomas Van Elst & Eva Swaab" },
  { title: "Pharmacovig", duration: "NAV", trainer: "Jeroen Lievens" },
];

let current = new Date();
let dateActivities = {};
let selectedActivityId = null;

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
  monthYear.textContent = `${
    monthName.charAt(0).toUpperCase() + monthName.slice(1)
  } ${year}`;

  const day = new Date(startDate);
  while (day <= endDate) {
    if (day.getDay() >= 1 && day.getDay() <= 5) {
      // alleen Ma-Vr
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
  (dateActivities[dateStr] || []).forEach((act) => {
    const span = document.createElement("div");
    span.classList.add("activity");
    span.textContent = act.title;

    const session = sessions.find((s) => s.title === act.title);
    const duration = session?.duration || "Unknown";
    const trainer = session?.trainer || "Trainer Unknown";

    // ✅ Deelnemers ophalen voor tooltip
    const participants = act.participants || [];
    const participantNames =
      participants.map((p) => `${p.firstName} ${p.lastName}`).join(", ") ||
      "No participant";

    span.title = `Duration: ${duration}\nTrainer: ${trainer}\nParticipants: ${participantNames}`;

    // Nieuw klikgedrag
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      openParticipantModal(act._id);
    });

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
    body: JSON.stringify({ text, userId }),
  });
  loadNotes();
});

async function loadNotes() {
  const res = await fetch(`${apiBase}/notes/${userId}`);
  const notes = await res.json();
  notesContainer.innerHTML = "";
  notes.forEach((n) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    const noteText = document.createElement("span");
    noteText.textContent = n.text;

    const buttonGroup = document.createElement("div");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-note-btn";
    deleteBtn.title = "Verwijder deze notitie";
    deleteBtn.onclick = async () => {
      await deleteNote(n._id);
      loadNotes();
    };

    buttonGroup.appendChild(deleteBtn);

    noteDiv.appendChild(noteText);
    noteDiv.appendChild(buttonGroup);
    notesContainer.appendChild(noteDiv);
  });
}

async function deleteNote(id) {
  await fetch(`${apiBase}/notes/${id}`, {
    method: "DELETE",
  });
}
async function updateNote(id, newText) {
  await fetch(`${apiBase}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText }),
  });
}

// Planned activities bar (links)
function renderPlannedList() {
  plannedActivitiesList.innerHTML = "";
  Object.keys(dateActivities).forEach((date) => {
    dateActivities[date].forEach((it) => {
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
  sessions.forEach((session) => {
    const btn = document.createElement("button");
    btn.textContent = session.title;
    btn.title = `Duur: ${session.duration}\nTrainer: ${
      session.trainer || "Onbekend"
    }`;
    btn.addEventListener("click", () => addActivity(dateStr, session.title));
    activityOptions.appendChild(btn);
  });
  // Bestaande activiteiten
  (dateActivities[dateStr] || []).forEach((act) => {
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
closeModal.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  } else if (e.target === participantModal) {
    participantModal.style.display = "none";
  }
});

// Activiteit toevoegen
async function addActivity(date, title) {
  // Verzamel alle aangevinkte materialen
  const checkedItems = Array.from(
    document.querySelectorAll("#materials input:checked")
  ).map((checkbox) => checkbox.parentElement.textContent.trim());

  await fetch(`${apiBase}/calendar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, date, title, equipment: checkedItems }),
  });

  await loadActivities();
}

// Open tweede modal
function openParticipantModal(activityId) {
  modal.style.display = "none"; // 👈 sluit eerst training modal
  selectedActivityId = activityId;
  firstNameInput.value = "";
  lastNameInput.value = "";
  participantModal.style.display = "flex";
}

// Sluit tweede modal
closeParticipantModal.addEventListener("click", () => {
  participantModal.style.display = "none";
});

// Opslaan deelnemer
saveParticipantBtn.addEventListener("click", async () => {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  if (!firstName || !lastName) return alert("Gelieve naam in te vullen");
  console.log("selectedActivityId", selectedActivityId);

  await fetch(`${apiBase}/calendar/${selectedActivityId}/participant`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName }),
  });

  participantModal.style.display = "none";
  await loadActivities(); // herlaad kalender
});
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
prevMonth.onclick = () => {
  current.setMonth(current.getMonth() - 1);
  refreshUI();
};
nextMonth.onclick = () => {
  current.setMonth(current.getMonth() + 1);
  refreshUI();
};

// Quel de start
document.addEventListener("DOMContentLoaded", () => {
  loadActivities();
  loadNotes();
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "login.html";
    });
  }
});
