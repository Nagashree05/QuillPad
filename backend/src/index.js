import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix for __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: 'https://your-frontend.vercel.app', //  Vercel URL
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// In-memory storage (replace with database in production)
let notes = [
  {
    id: '1',
    title: 'Welcome to QuillPad!',
    content: '# Welcome to QuillPad!\n\nThis is your first note. QuillPad supports **Markdown** formatting, so you can:\n\n- Create **bold** and *italic* text\n- Add lists and links\n- Write code blocks\n- And much more!\n\nTry creating a new note or editing this one to get started.',
    tags: ['welcome', 'getting-started'],
    isPinned: true,
    isStarred: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ... other notes
];

// Root route - confirmation that backend is running
app.get('/', (req, res) => {
  res.send('QuillPad backend is running');
});

// Get all notes
app.get('/api/notes', (req, res) => {
  try {
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get note by ID
app.get('/api/notes/:id', (req, res) => {
  try {
    const note = notes.find(n => n.id === req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create new note
app.post('/api/notes', (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content is required' });
    }

    const newNote = {
      id: uuidv4(),
      title: title || 'Untitled',
      content: content || '',
      tags: Array.isArray(tags) ? tags : [],
      isPinned: false,
      isStarred: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.unshift(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
app.patch('/api/notes/:id', (req, res) => {
  console.log('Notes:', notes);
  try {
    const noteIndex = notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updates = req.body;
    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    notes[noteIndex] = updatedNote;
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const noteIndex = notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    notes.splice(noteIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 QuillPad backend running on port ${PORT}`);
});

// filepath: backend/src/index.js
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});