import React, { useState } from 'react';
import { Search, Plus, Moon, Sun, Settings, Archive, Star, FileText, Menu, X } from 'lucide-react';
// Update the import path if ThemeContext is located elsewhere, for example:
import { useTheme } from '../context/ThemeContext';
// Or, if the file does not exist, create 'ThemeContext.tsx' in the correct folder.
import { ViewType, SortType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewNote: () => void;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: string[];
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  searchTerm,
  onSearchChange,
  onNewNote,
  viewType,
  onViewTypeChange,
  sortType,
  onSortChange,
  selectedTags,
  onTagsChange,
  allTags,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'all', label: 'All Notes', icon: FileText },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'archived', label: 'Archived', icon: Archive },
  ];

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">QuillPad</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={onNewNote}
              className="w-full flex items-center gap-3 px-4 py-3 text-left bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>

            <div className="space-y-1 mt-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewTypeChange(item.id as ViewType)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                    viewType === item.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                <div className="space-y-1">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>
              <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={sortType}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
            >
              <option value="updated">Last Updated</option>
              <option value="date">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};