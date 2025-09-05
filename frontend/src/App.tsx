import React, { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { NotesGrid } from './components/NotesGrid';
import { NoteEditor } from './components/NoteEditor';
import { ThemeProvider } from './context/ThemeContext';
import { useNotes } from './hooks/useNotes';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './context/ThemeContext';
import { Note } from './types';

const AppContent: React.FC = () => {
  const {
    notes,
    loading,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    viewType,
    setViewType,
    sortType,
    setSortType,
    allTags,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();
  
  const { toggleTheme } = useTheme();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNewNote = () => {
    setIsCreatingNote(true);
    setEditingNote(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreatingNote(false);
  };

  const handleSaveNote = async (noteData: any) => {
    if (editingNote) {
      return await updateNote(editingNote.id, noteData);
    } else {
      const newNote = await createNote(noteData);
      return !!newNote;
    }
  };

  const handleCloseEditor = () => {
    setEditingNote(null);
    setIsCreatingNote(false);
  };

  const handleTogglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { isPinned: !note.isPinned });
    }
  };

  const handleToggleStar = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { isStarred: !note.isStarred });
    }
  };

  const handleToggleArchive = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { isArchived: !note.isArchived });
    }
  };

  useKeyboardShortcuts({
    onNewNote: handleNewNote,
    onSearch: () => searchInputRef.current?.focus(),
    onToggleTheme: toggleTheme,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewNote={handleNewNote}
        viewType={viewType}
        onViewTypeChange={setViewType}
        sortType={sortType}
        onSortChange={setSortType}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        allTags={allTags}
      >
        <div className="p-6">
          <NotesGrid
            notes={notes}
            onEditNote={handleEditNote}
            onTogglePin={handleTogglePin}
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            onDeleteNote={deleteNote}
          />
        </div>
      </Layout>

      {(isCreatingNote || editingNote) && (
        <NoteEditor
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onClose={handleCloseEditor}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
        }}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;