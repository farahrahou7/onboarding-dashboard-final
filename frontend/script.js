
const monthYear = document.getElementById('monthYear');
const calendar = document.getElementById('calendar');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let currentDate = new Date();

function renderCalendar() {
  calendar.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay() || 7;

  monthYear.textContent = currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

  const prevLastDate = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i > 0; i--) {
    const day = document.createElement('div');
    day.textContent = prevLastDate - i + 1;
    day.classList.add('inactive');
    calendar.appendChild(day);
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement('div');
    day.textContent = i;
    calendar.appendChild(day);
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
