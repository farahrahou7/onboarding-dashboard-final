
const monthYear = document.getElementById('monthYear');
const calendar = document.getElementById('calendar');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let currentDate = new Date();

function renderCalendar() {
  calendar.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  monthYear.textContent = currentDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.textContent = prevMonthLastDate - i;
    day.classList.add('inactive');
    calendar.appendChild(day);
  }

  for (let i = 1; i <= lastDayOfMonth; i++) {
    const day = document.createElement('div');
    day.textContent = i;
    calendar.appendChild(day);
  }

  const totalCells = calendar.children.length;
  const remainder = totalCells % 5;
  if (remainder !== 0) {
    for (let i = 1; i <= (5 - remainder); i++) {
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
