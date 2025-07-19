document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('markdown');
  const preview = document.getElementById('preview');
  const clearBtn = document.getElementById('clear');
  const themeToggle = document.getElementById('toggle-theme');
  const exportBtn = document.getElementById('export');
  const saveNoteBtn = document.getElementById('save-note');
  const addNoteBtn = document.getElementById('add-note');
  const notesList = document.getElementById('notes-list');

  const getNotes = () => JSON.parse(localStorage.getItem('savedNotes')) || [];

  textarea.addEventListener('input', () => {
    preview.innerHTML = marked.parse(textarea.value);
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear current note?')) {
      textarea.value = '';
      preview.innerHTML = '';
    }
  });

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
    a.download = "note.md";
    a.click();
    URL.revokeObjectURL(url);
  });

  addNoteBtn.addEventListener('click', () => {
    textarea.value = '';
    preview.innerHTML = '';
  });

  saveNoteBtn.addEventListener('click', () => {
    const content = textarea.value.trim();
    if (!content) {
      alert("Note is empty.");
      return;
    }

    let notes = getNotes();
    const title = content.split('\n')[0].slice(0, 30) || 'Untitled';
    const newNote = {
      title,
      content,
      date: new Date().toISOString()
    };

    if (!notes.find(n => n.content === content)) {
      notes.unshift(newNote);
      localStorage.setItem('savedNotes', JSON.stringify(notes));
      renderNotesList();
      alert("Note saved!");
    } else {
      alert("This note is already saved.");
    }
  });

  function renderNotesList() {
    notesList.innerHTML = '';
    const notes = getNotes();

    notes.forEach((note, index) => {
      const li = document.createElement('li');
      const formattedDate = new Date(note.date).toLocaleString();

      li.innerHTML = `
        <div style="flex:1; overflow:hidden;">
          <div class="note-title" title="${note.title}">${note.title}</div>
          <div style="font-size: 0.75rem; color: gray;">${formattedDate}</div>
        </div>
        <button class="delete-note" data-index="${index}">🗑️</button>
      `;

      li.querySelector('.note-title').addEventListener('click', () => {
        textarea.value = note.content;
        preview.innerHTML = marked.parse(note.content);
      });

      li.querySelector('.delete-note').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm("Delete this note?")) {
          const updatedNotes = getNotes();
          updatedNotes.splice(index, 1);
          localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
          renderNotesList();
        }
      });

      notesList.appendChild(li);
    });
  }

  renderNotesList();
});
