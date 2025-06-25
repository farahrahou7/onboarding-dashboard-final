
const monthYear = document.getElementById('monthYear');
const calendar = document.getElementById('calendar');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const activityList = document.getElementById('activity-list');

let currentDate = new Date();
let activities = JSON.parse(localStorage.getItem("activities")) || [];

function formatKey(date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

function saveActivities() {
  localStorage.setItem("activities", JSON.stringify(activities));
}

function renderCalendar() {
  calendar.innerHTML = '';
  activityList.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  monthYear.textContent = currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const firstDateDisplayed = new Date(year, month, 1 - startDay);

  for (let i = 0; i < startDay; i++) {
    const day = document.createElement('div');
    day.textContent = prevMonthLastDate - startDay + i + 1;
    day.classList.add('inactive');
    calendar.appendChild(day);
  }

  for (let dayNum = 1; dayNum <= lastDayOfMonth; dayNum++) {
    const cell = document.createElement('div');
    cell.textContent = dayNum;

    const dateObj = new Date(year, month, dayNum);
    const dateKey = formatKey(dateObj);

    const matching = activities.filter(a => a.date === dateKey);
    if (matching.length > 0) {
      const tag = document.createElement('div');
      tag.textContent = matching[0].title;
      tag.style.fontSize = "12px";
      tag.style.marginTop = "5px";
      tag.style.color = "#2e7d32";
      cell.appendChild(tag);

      const li = document.createElement('li');
      li.textContent = `${matching[0].title} (${dateKey})`;
      activityList.appendChild(li);
    }

    cell.onclick = () => {
      const title = prompt("Voer een training in:");
      if (!title) return;
      activities.push({ date: dateKey, title });
      saveActivities();
      renderCalendar();
    };

    calendar.appendChild(cell);
  }

  const totalCells = calendar.children.length;
  const remainder = totalCells % 5;
  if (remainder !== 0) {
    for (let i = 0; i < 5 - remainder; i++) {
      const filler = document.createElement('div');
      filler.classList.add('inactive');
      calendar.appendChild(filler);
    }
  }
}

prevMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
