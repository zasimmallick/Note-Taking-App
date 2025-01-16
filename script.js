// DOM Elements
const addNoteButton = document.getElementById("addNoteButton");
const notesContainer = document.getElementById("notesContainer");
const noteModal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const noteContent = document.getElementById("noteContent");
const saveNoteButton = document.getElementById("saveNoteButton");
const closeModalButton = document.getElementById("closeModalButton");
const searchInput = document.getElementById("searchInput");

// State
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editNoteId = null;

// Functions
function renderNotes() {
  notesContainer.innerHTML = "";
  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  filteredNotes.forEach(note => {
    const noteCard = document.createElement("div");
    noteCard.classList.add("card", "bg-white", "shadow-lg", "p-4", "rounded-lg");
    noteCard.innerHTML = `
      <p class="text-gray-700">${note.content}</p>
      <div class="mt-4 flex justify-between">
        <button class="btn btn-sm btn-warning edit-note" data-id="${note.id}">Edit</button>
        <button class="btn btn-sm btn-error delete-note" data-id="${note.id}">Delete</button>
      </div>
    `;
    notesContainer.appendChild(noteCard);
  });
}

function openModal(edit = false, noteId = null) {
  noteModal.classList.remove("hidden");
  if (edit) {
    modalTitle.textContent = "Edit Note";
    const noteToEdit = notes.find(note => note.id === noteId);
    noteContent.value = noteToEdit.content;
    editNoteId = noteId;
  } else {
    modalTitle.textContent = "Add Note";
    noteContent.value = "";
    editNoteId = null;
  }
}

function closeModal() {
  noteModal.classList.add("hidden");
}

function saveNote() {
  const content = noteContent.value.trim();
  if (!content) {
    alert("Note content cannot be empty!");
    return;
  }
  if (editNoteId) {
    notes = notes.map(note =>
      note.id === editNoteId ? { ...note, content } : note
    );
  } else {
    const newNote = { id: Date.now(), content };
    notes.push(newNote);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  closeModal();
}

function deleteNote(noteId) {
  notes = notes.filter(note => note.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

// Event Listeners
addNoteButton.addEventListener("click", () => openModal());
closeModalButton.addEventListener("click", closeModal);
saveNoteButton.addEventListener("click", saveNote);
searchInput.addEventListener("input", renderNotes);

notesContainer.addEventListener("click", e => {
  if (e.target.classList.contains("edit-note")) {
    const noteId = parseInt(e.target.dataset.id, 10);
    openModal(true, noteId);
  }
  if (e.target.classList.contains("delete-note")) {
    const noteId = parseInt(e.target.dataset.id, 10);
    deleteNote(noteId);
  }
});

// Initial Render
renderNotes();
