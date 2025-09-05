import React, { useState, useEffect } from 'react';
import { Save, X, Eye, EyeOff, Download, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

interface NoteEditorProps {
  note?: Note;
  onSave: (data: CreateNoteRequest | UpdateNoteRequest) => Promise<boolean>;
  onClose: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await onSave({
        title: title || 'Untitled',
        content,
        tags,
      });
      if (success) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 border-none focus:outline-none flex-1 mr-4"
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={handleExport} className="btn-secondary">
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={onClose} className="btn-secondary">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="input-field text-sm"
            />
            <button onClick={addTag} className="px-3 py-1 text-sm bg-accent-600 text-white rounded">
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  #{tag}
                  <X className="w-3 h-3" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {!showPreview && (
            <div className="flex-1 flex flex-col">
              <textarea
                placeholder="Start writing your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-6 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
              />
            </div>
          )}
          
          {showPreview && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown>{content || 'Nothing to preview yet...'}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span>
              {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
            </span>
            <span>
              Press Ctrl+S to save • Esc to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};