import React from 'react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onEditNote,
  onTogglePin,
  onToggleStar,
  onToggleArchive,
  onDeleteNote,
}) => {
  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No notes found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first note to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEditNote}
          onTogglePin={onTogglePin}
          onToggleStar={onToggleStar}
          onToggleArchive={onToggleArchive}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
};