
const API_BASE_URL = 'https://onboarding-dashboard-final.onrender.com/api';

const calendarContainer = document.querySelector('.calendar-grid');
const monthYearLabel = document.querySelector('h2');
const prevBtn = document.querySelector('.prev-month');
const nextBtn = document.querySelector('.next-month');

let currentDate = new Date();

function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarContainer.innerHTML = ''; // Clear old days

  // Adjust Sunday from 0 to 7 to align with Monday-start week
  const startDay = firstDay === 0 ? 7 : firstDay;

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startDay - 2; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-cell muted';
    day.textContent = prevMonthDays - i;
    calendarContainer.appendChild(day);
  }

  // Current month days
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
          body: JSON.stringify({ date: `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, activity })
        });
        alert(`Activity added on ${day}`);
      }
    });
    calendarContainer.appendChild(cell);
  }

  monthYearLabel.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
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
document.querySelector('.add-note-btn')?.addEventListener('click', async () => {
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
