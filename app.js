
(function(){
  let notes = [];
  let currentNoteId = null;
  let filterTag = null;

  function loadNotes() {
    try {
      return JSON.parse(localStorage.getItem('pkm_notes') || '[]');
    } catch(e) {
      return [];
    }
  }
  function saveNotes() {
    localStorage.setItem('pkm_notes', JSON.stringify(notes));
  }
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  function parseTags(content) {
    const tags = new Set();
    content.replace(/#(\w+)/g, (match, tag) => { tags.add(tag); return match; });
    return Array.from(tags);
  }
  function parseLinks(content) {
    const links = [];
    content.replace(/\[\[([^\]]+)\]\]/g, (match, title) => { links.push(title); return match; });
    return links;
  }
  function renderNoteList() {
    const listDiv = document.getElementById('note-list');
    listDiv.innerHTML = '';
    let filtered = notes;
    if (filterTag) {
      filtered = notes.filter(n => (n.tags || []).includes(filterTag));
    }
    filtered.sort((a,b) => b.updated - a.updated);
    filtered.forEach(note => {
      const div = document.createElement('div');
      div.className = 'note-item' + (note.id === currentNoteId ? ' active' : '');
      div.textContent = note.title || 'Untitled';
      div.onclick = () => openNoteViewer(note);
      listDiv.appendChild(div);
    });
  }
  function openNoteEditor(note) {
    currentNoteId = note ? note.id : null;
    document.getElementById('viewer').style.display = 'none';
    document.getElementById('editor').style.display = 'flex';
    document.getElementById('note-title').value = note ? note.title : '';
    document.getElementById('note-content').value = note ? note.content : '';
  }
  function openNoteViewer(note) {
    currentNoteId = note.id;
    document.getElementById('editor').style.display = 'none';
    document.getElementById('viewer').style.display = 'block';
    document.getElementById('viewer-title').textContent = note.title;
    // sanitize and convert content
    let html = note.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
      const encoded = encodeURIComponent(title);
      return `<a href="#" class="note-link" data-title="${encoded}">[[${title}]]</a>`;
    });
    html = html.replace(/\n/g, '<br>');
    const viewerContent = document.getElementById('viewer-content');
    viewerContent.innerHTML = html;
    // tags
    const tagsDiv = document.getElementById('viewer-tags');
    tagsDiv.innerHTML = '';
    (note.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = '#' + tag;
      span.onclick = () => {
        filterTag = tag;
        renderNoteList();
      };
      tagsDiv.appendChild(span);
    });
    // backlinks
    const backlinksList = document.getElementById('backlinks-list');
    backlinksList.innerHTML = '';
    notes.forEach(n => {
      if (n.id !== note.id) {
        const links = parseLinks(n.content);
        if (links.includes(note.title)) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = n.title;
          a.onclick = () => openNoteViewer(n);
          li.appendChild(a);
          backlinksList.appendChild(li);
        }
      }
    });
    renderNoteList();
  }
  document.getElementById('new-note').onclick = () => {
    filterTag = null;
    openNoteEditor(null);
  };
  document.getElementById('save-note').onclick = () => {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value;
    if (currentNoteId) {
      const note = notes.find(n => n.id === currentNoteId);
      note.title = title || 'Untitled';
      note.content = content;
      note.tags = parseTags(content);
      note.updated = Date.now();
    } else {
      const note = {
        id: generateId(),
        title: title || 'Untitled',
        content: content,
        tags: parseTags(content),
        created: Date.now(),
        updated: Date.now(),
      };
      notes.push(note);
    }
    saveNotes();
    const current = notes.find(n => n.id === currentNoteId) || notes[notes.length - 1];
    openNoteViewer(current);
  };
  // link click
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target && target.classList.contains('note-link')) {
      e.preventDefault();
      const title = decodeURIComponent(target.dataset.title);
      const note = notes.find(n => n.title === title);
      if (note) {
        openNoteViewer(note);
      } else {
        // new stub note
        openNoteEditor({ id: null, title: title, content: '' });
      }
    }
  });
  window.addEventListener('load', () => {
    notes = loadNotes();
    renderNoteList();
    if (notes.length > 0) {
      openNoteViewer(notes[0]);
    }
  });
})();
