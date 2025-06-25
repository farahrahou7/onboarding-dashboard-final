
const API_BASE_URL = 'https://onboarding-dashboard-final.onrender.com/api';

const calendarContainer = document.querySelector('#calendarDays');
const monthYearLabel = document.querySelector('#monthYear');
const prevBtn = document.querySelector('#prevMonth');
const nextBtn = document.querySelector('#nextMonth');

let currentDate = new Date();

function generateCalendar(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Ma = 0
  const prevMonthDays = new Date(year, month, 0).getDate();

  calendarContainer.innerHTML = '';

  // Vorige maand (lichtgrijs)
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-cell muted';
    day.textContent = prevMonthDays - i;
    calendarContainer.appendChild(day);
  }

  // Huidige maand
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = day;
    cell.addEventListener('click', async () => {
      const activity = prompt(`Add activity on ${year}-${month + 1}-${day}:`);
      if (activity) {
        await fetch(`${API_BASE_URL}/calendar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            activity
          })
        });
        alert(`Activity added on ${day}`);
      }
    });
    calendarContainer.appendChild(cell);
  }

  monthYearLabel.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });
});

// Checklist
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', async () => {
    await fetch(`${API_BASE_URL}/checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: checkbox.nextSibling.textContent.trim(),
        checked: checkbox.checked
      })
    });
  });
});

// Notes
document.querySelector('#addNote')?.addEventListener('click', async () => {
  const note = prompt('Add a note:');
  if (note) {
    await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note })
    });
    alert('Note added!');
  }
});
