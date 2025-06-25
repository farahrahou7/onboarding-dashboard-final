
const API_BASE_URL = 'https://onboarding-dashboard-final.onrender.com/api';

const calendarContainer = document.querySelector('#calendarDays');
const monthYearLabel = document.querySelector('#monthYear');
const prevBtn = document.querySelector('#prevMonth');
const nextBtn = document.querySelector('#nextMonth');

let currentDate = new Date();

function generateWorkdaysCalendar(year, month) {
  calendarContainer.innerHTML = '';

  const firstDate = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let dayCounter = 1;
  let weekdayCount = 0;

  while (dayCounter <= daysInMonth) {
    const date = new Date(year, month, dayCounter);
    const dayOfWeek = date.getDay();

    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell';
      cell.textContent = dayCounter;

      cell.addEventListener('click', async () => {
        const activity = prompt(`Add activity on ${year}-${month + 1}-${dayCounter}:`);
        if (activity) {
          await fetch(`${API_BASE_URL}/calendar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date: `${year}-${(month + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`,
              activity
            })
          });
          alert(`Activity added on ${dayCounter}`);
        }
      });

      calendarContainer.appendChild(cell);
      weekdayCount++;
    }

    dayCounter++;
  }

  monthYearLabel.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
  generateWorkdaysCalendar(currentDate.getFullYear(), currentDate.getMonth());

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateWorkdaysCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateWorkdaysCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });
});

// Checklist logic
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

// Notes logic
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
