export interface Note {
    id: string;
    title: string;
    content: string; // HTML content
    color: string; // Hex code or class name
    x: number;
    y: number;
    tags: string[];
    zIndex: number;
    createdAt: number;
    updatedAt: number;
}

export interface NoteStore {
    notes: Note[];
    recentSearches: string[];

    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'zIndex'>) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    bringToFront: (id: string) => void;

    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;

    currentView: 'wall' | 'board';
    setView: (view: 'wall' | 'board') => void;
    fullscreenNoteId: string | null;
    setFullscreenNoteId: (id: string | null) => void;
    activeColorFilter: string | null;
    setColorFilter: (color: string | null) => void;
    importData: (data: any, mode?: 'replace' | 'append') => boolean;
    organizeNotes: () => void;
    clearAllData: () => void;

    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}
