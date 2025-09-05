export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isStarred: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteRequest extends Partial<CreateNoteRequest> {
  isPinned?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
}

export type ViewType = 'all' | 'starred' | 'archived';
export type SortType = 'date' | 'title' | 'updated';
export type Theme = 'light' | 'dark';