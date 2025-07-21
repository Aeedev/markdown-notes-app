// script.js
const editor = document.getElementById('editor');
const uploadInput = document.getElementById('upload-image');
const uploadBtn = document.getElementById('upload-btn');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');
const saveBtn = document.getElementById('save-note');
const addNoteBtn = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');
const toggleThemeBtn = document.getElementById('toggle-theme');
const insertTitleBtn = document.getElementById('title-btn');
const attachInput = document.getElementById('attach-file');
const attachBtn = document.getElementById('attach-btn');
const deleteSelectedBtn = document.getElementById('delete-selected');
const deleteAllBtn = document.getElementById('delete-all');

let notes = JSON.parse(localStorage.getItem('greenNotes')) || [];

function getRelativeTime(timestamp) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function updateNotesList() {
  notesList.innerHTML = '';
  notes = notes.filter(note => note && typeof note === 'object' && note.content);

  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.classList.add('note-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'select-note';
    checkbox.dataset.index = index;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'note-title';
    titleDiv.textContent = note.title || 'Untitled Note';
    titleDiv.onclick = () => {
      editor.innerHTML = note.content;
    };

    const metaDiv = document.createElement('div');
    metaDiv.className = 'note-meta';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'note-time';
    timeDiv.id = `note-time-${index}`;
    if (note.timestamp) {
      const relative = getRelativeTime(note.timestamp);
      const absolute = note.formatted;
      timeDiv.innerHTML = `🕒 ${relative}<br>(${absolute})`;
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-note';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      saveNotes();
      updateNotesList();
    };

    metaDiv.appendChild(timeDiv);
    metaDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(titleDiv);
    li.appendChild(metaDiv);
    notesList.appendChild(li);
  });
}

function saveNotes() {
  localStorage.setItem('greenNotes', JSON.stringify(notes));
}

saveBtn.addEventListener('click', () => {
  const content = editor.innerHTML.trim();
  if (content) {
    const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : 'Untitled Note';
    const timestamp = new Date().toISOString();
    const formatted = new Date().toLocaleString();
    notes.push({ title, content, timestamp, formatted });
    saveNotes();
    updateNotesList();
    alert('Note saved!');
  } else {
    alert('Write something before saving.');
  }
});

addNoteBtn.onclick = () => {
  editor.innerHTML = '';
};

clearBtn.onclick = () => {
  editor.innerHTML = '';
};

exportBtn.onclick = () => {
  const content = editor.innerText;
  const blob = new Blob([content], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.download = 'note.md';
  link.href = URL.createObjectURL(blob);
  link.click();
};

uploadBtn.onclick = () => uploadInput.click();

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      editor.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

attachBtn.onclick = () => attachInput.click();

attachInput.addEventListener('change', () => {
  const file = attachInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const link = document.createElement('a');
      link.href = e.target.result;
      link.download = file.name;
      link.textContent = `📎 ${file.name}`;
      link.target = '_blank';
      link.style.display = 'block';
      link.style.marginTop = '8px';
      link.style.wordBreak = 'break-all';
      editor.appendChild(link);
    };
    reader.readAsDataURL(file);
  }
});

insertTitleBtn.onclick = () => {
  const title = prompt('Enter your note title:');
  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title;
    editor.appendChild(h1);
  }
};

toggleThemeBtn.onclick = () => {
  document.body.classList.toggle('dark');
};

deleteSelectedBtn.onclick = () => {
  const selectedIndexes = Array.from(document.querySelectorAll('.select-note:checked')).map(
    checkbox => parseInt(checkbox.dataset.index)
  );
  notes = notes.filter((_, index) => !selectedIndexes.includes(index));
  saveNotes();
  updateNotesList();
};

deleteAllBtn.onclick = () => {
  if (confirm('Are you sure you want to delete all notes?')) {
    notes = [];
    saveNotes();
    updateNotesList();
  }
};

setInterval(() => {
  document.querySelectorAll('.note-time').forEach((el, index) => {
    const note = notes[index];
    if (note && note.timestamp) {
      const relative = getRelativeTime(note.timestamp);
      const absolute = note.formatted;
      el.innerHTML = `🕒 ${relative}<br>(${absolute})`;
    }
  });
}, 60000);

updateNotesList();
