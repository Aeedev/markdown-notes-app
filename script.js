const textarea = document.getElementById('markdown');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clear');
const themeToggle = document.getElementById('toggle-theme');
const exportBtn = document.getElementById('export');

// Load saved notes
textarea.value = localStorage.getItem('markdown') || '';
preview.innerHTML = marked.parse(textarea.value);

// Update preview + save when typing
textarea.addEventListener('input', () => {
  const content = textarea.value;
  localStorage.setItem('markdown', content);
  preview.innerHTML = marked.parse(content);
});

// Clear notes
clearBtn.addEventListener('click', () => {
  if (confirm('Delete all notes?')) {
    textarea.value = '';
    preview.innerHTML = '';
    localStorage.removeItem('markdown');
  }
});

// Dark mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Export notes
exportBtn.addEventListener('click', () => {
  const content = textarea.value.trim();
  if (!content) {
    alert("Nothing to export.");
    return;
  }

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.md";
  a.click();
  URL.revokeObjectURL(url);
});
