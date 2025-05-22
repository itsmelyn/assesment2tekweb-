// Class Note
class Note {
    constructor(id, title, content, timestamp = new Date().toISOString()) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Static method to create a Note from a plain object (e.g., from Local Storage)
    static fromObject(obj) {
        return new Note(obj.id, obj.title, obj.content, obj.timestamp);
    }
}

// Class NoteApp
class NoteApp {
    constructor() {
        this.notes = [];
        this.loadNotes(); // Load notes from Local Storage on initialization
        this.initEventListeners();
        this.displayNotes(); // Initial display of notes
    }

    // --- Local Storage Operations ---
    loadNotes() {
        const notesData = localStorage.getItem('personalJournalNotes');
        if (notesData) {
            const parsedNotes = JSON.parse(notesData);
            this.notes = parsedNotes.map(Note.fromObject); // Rehydrate Note objects
        }
    }

    saveNotes() {
        localStorage.setItem('personalJournalNotes', JSON.stringify(this.notes));
    }

    // --- CRUD Operations ---

    // Create
    async addNote(title, content) {
        const id = Date.now().toString(); // Simple unique ID
        const newNote = new Note(id, title, content);
        this.notes.push(newNote);
        this.saveNotes();
        await this.simulateServerSend(newNote, 'create'); // Simulate sending to server
        this.displayNotes(); // Re-render notes
    }

    // Read (implicit in displayNotes and getFilteredNotes)

    // Update
    async updateNote(id, newTitle, newContent) {
        const noteIndex = this.notes.findIndex(note => note.id === id);
        if (noteIndex > -1) {
            this.notes[noteIndex].title = newTitle;
            this.notes[noteIndex].content = newContent;
            this.notes[noteIndex].timestamp = new Date().toISOString(); // untuk mengupdate waktu jurnal yg di buat
            this.saveNotes();
            await this.simulateServerSend(this.notes[noteIndex], 'update'); // Simulate sending to server
            this.displayNotes(); // Re-render notes
        }
    }

    // Delete
    async deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        await this.simulateServerSend({ id: id }, 'delete'); // Simulate sending deletion to server
        this.displayNotes(); // Re-render notes
    }

    // --- Display and DOM Manipulation ---
    displayNotes(filteredNotes = this.notes) {
        const notesListDiv = document.getElementById('notes-list');
        notesListDiv.innerHTML = ''; // Clear existing notes

        if (filteredNotes.length === 0) {
            notesListDiv.innerHTML = '<p class="no-notes-message">No journal entries found.</p>';
            return;
        }

        const sortedNotes = [...filteredNotes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sortedNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            noteItem.dataset.id = note.id; // Store ID for easy access

            const formattedDate = new Date(note.timestamp).toLocaleString();

            noteItem.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <p class="note-date">Last Updated: ${formattedDate}</p>
                <div class="note-actions">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            `;
            notesListDiv.appendChild(noteItem);
        });

        // menambahkan Add event listeners dengan new buttons
        this.addNoteButtonListeners();
    }

    addNoteButtonListeners() {
        document.querySelectorAll('.edit-button').forEach(button => {
            button.onclick = (event) => this.handleEdit(event);
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.onclick = (event) => this.handleDelete(event);
        });
    }

    // --- Event Handlers ---
    initEventListeners() {
        document.getElementById('note-form').addEventListener('submit', this.handleFormSubmit.bind(this));
        document.getElementById('filter-keyword').addEventListener('input', this.handleFilterChange.bind(this));
        document.getElementById('filter-date').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('clear-filters').addEventListener('click', this.clearFilters.bind(this));
    }

    async handleFormSubmit(event) {
        event.preventDefault(); // mencegah reload halaman
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title && content) { // input data title dan content
            await this.addNote(title, content);
            titleInput.value = ''; // Clear form
            contentInput.value = '';
        } else {
            alert('Please enter both a title and content for your journal entry.');
        }
    }

    handleEdit(event) {
        const noteItem = event.target.closest('.note-item');
        const noteId = noteItem.dataset.id;
        const currentNote = this.notes.find(note => note.id === noteId);

        if (currentNote) {
            const newTitle = prompt('Edit Title:', currentNote.title);// untuk memuncul kan notif edit title
            const newContent = prompt('Edit Content:', currentNote.content);// untuk memunculkan notif edit content

            if (newTitle !== null && newContent !== null) { // User didn't cancel
                if (newTitle.trim() !== '' && newContent.trim() !== '') {
                    this.updateNote(noteId, newTitle.trim(), newContent.trim());
                } else {
                    alert('Title and content cannot be empty.');
                }
            }
        }
    }

    handleDelete(event) {
        const noteItem = event.target.closest('.note-item');
        const noteId = noteItem.dataset.id;

        if (confirm('Are you sure you want to delete this journal entry?')) {
            this.deleteNote(noteId);
        }
    } //untuk memuncul notifikasi ketika ingin menghapus jurnal

    handleFilterChange() {
        const keyword = document.getElementById('filter-keyword').value.toLowerCase().trim();
        const date = document.getElementById('filter-date').value; // YYYY-MM-DD format

        let filteredNotes = this.notes;

        if (keyword) { //untuk memilih judul content yg di buat
            filteredNotes = filteredNotes.filter(note =>
                note.title.toLowerCase().includes(keyword) ||
                note.content.toLowerCase().includes(keyword)
            );
        }

        if (date) { //untuk mengclear judul content yg di buat
            filteredNotes = filteredNotes.filter(note => {
                const noteDate = new Date(note.timestamp).toISOString().split('T')[0];
                return noteDate === date;
            });
        }

        this.displayNotes(filteredNotes);
    }

    clearFilters() {
        document.getElementById('filter-keyword').value = '';
        document.getElementById('filter-date').value = '';
        this.displayNotes(); // menunjukan semua content
    }


    // --- Async Operations (Simulated Server Send) ---
    simulateServerSend(data, action) {
        console.log(`Simulating server send for ${action} operation...`, data);
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`Server simulation complete for ${action}. Data:`, data);
                // In a real application, you would handle API response here
                resolve({ success: true, message: `${action} successful` });
            }, 500); // Simulate network latency
        });
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new NoteApp();
});