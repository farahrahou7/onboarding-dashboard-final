
const API_BASE_URL = 'https://onboarding-dashboard-final.onrender.com/api';

// ✅ Materials checklist
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', async () => {
    await fetch(\`\${API_BASE_URL}/checklist\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: checkbox.nextSibling.textContent.trim(),
        checked: checkbox.checked
      })
    });
  });
});

// ✅ Notes
document.querySelector('.add-note-btn')?.addEventListener('click', async () => {
  const note = prompt('Add a note:');
  if (note) {
    await fetch(\`\${API_BASE_URL}/notes\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note })
    });
    alert('Note added!');
  }
});

// ✅ Calendar click handler
document.querySelectorAll('.calendar-cell')?.forEach(cell => {
  cell.addEventListener('click', async () => {
    const date = cell.textContent.trim();
    const activity = prompt(\`Add activity on \${date}:\`);
    if (activity) {
      await fetch(\`\${API_BASE_URL}/calendar\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: \`2025-01-\${date.padStart(2, '0')}\`, activity })
      });
      alert(\`Activity added on \${date}\`);
    }
  });
});
