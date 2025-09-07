import { useState, useEffect, useCallback } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest, ViewType, SortType } from '../types';
import { toast } from 'react-hot-toast';



const API_BASE = 'https://quillpad-bcj3.onrender.com/api';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewType, setViewType] = useState<ViewType>('all');
  const [sortType, setSortType] = useState<SortType>('updated');

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Fetching notes...');
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (noteData: CreateNoteRequest): Promise<Note | null> => {
    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) throw new Error('Failed to create note');
      
      const newNote = await response.json();
      setNotes(prev => [newNote, ...prev]);
      toast.success('Note created successfully');
      return newNote;
    } catch (error) {
      toast.error('Failed to create note');
      console.error('Error creating note:', error);
      return null;
    }
  };

  const updateNote = async (id: string, updates: UpdateNoteRequest): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update note');
      
      const updatedNote = await response.json();
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      toast.success('Note updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
      return false;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Error deleting note:', error);
      return false;
    }
  };

  const filteredAndSortedNotes = notes
    .filter(note => {
      // Filter by view type
      if (viewType === 'starred' && !note.isStarred) return false;
      if (viewType === 'archived' && !note.isArchived) return false;
      if (viewType === 'all' && note.isArchived) return false;

      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!note.title.toLowerCase().includes(search) && 
            !note.content.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        return selectedTags.some(tag => note.tags.includes(tag));
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortType) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    })
    .sort((a, b) => {
      // Always show pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  return {
    notes: filteredAndSortedNotes,
    allNotes: notes,
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
    refetch: fetchNotes,
  };
};