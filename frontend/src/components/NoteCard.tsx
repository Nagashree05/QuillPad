import React from 'react';
import { Star, Pin, Archive, Trash2, Edit } from 'lucide-react';
import { Note } from '../types';
import { formatRelativeDate, truncateText } from '../utils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onTogglePin,
  onToggleStar,
  onToggleArchive,
  onDelete,
}) => {
  const handleAction = (action: () => void, event: React.MouseEvent) => {
    event.stopPropagation();
    action();
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {note.isPinned && (
            <Pin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          )}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {note.title || 'Untitled'}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => handleAction(() => onToggleStar(note.id), e)}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              note.isStarred ? 'text-yellow-500' : 'text-gray-400'
            }`}
          >
            <Star className="w-4 h-4" fill={note.isStarred ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={(e) => handleAction(() => onTogglePin(note.id), e)}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              note.isPinned ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => handleAction(() => onToggleArchive(note.id), e)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600"
          >
            <Archive className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => handleAction(() => onDelete(note.id), e)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
        {truncateText(note.content)}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{formatRelativeDate(note.updatedAt)}</span>
        <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};