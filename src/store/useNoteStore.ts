import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note, NoteStore } from '@/types';

export const useNoteStore = create<NoteStore>()(
    persist(
        (set, get) => ({
            notes: [],
            recentSearches: [],

            addNote: (noteData) => {
                const newNote: Note = {
                    ...noteData,
                    id: Math.random().toString(36).substring(2, 9),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    zIndex: get().notes.length + 1,
                };
                set((state) => ({ notes: [...state.notes, newNote] }));
            },

            updateNote: (id, updates) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
                    ),
                }));
            },

            // ... (rest of actions)

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                }));
            },

            bringToFront: (id) => {
                set((state) => {
                    const maxZ = Math.max(...state.notes.map((n) => n.zIndex), 0);
                    return {
                        notes: state.notes.map((note) =>
                            note.id === id ? { ...note, zIndex: maxZ + 1 } : note
                        ),
                    };
                });
            },

            addRecentSearch: (query) => {
                set((state) => {
                    const filtered = state.recentSearches.filter((s) => s !== query);
                    return { recentSearches: [query, ...filtered].slice(0, 5) };
                });
            },

            clearRecentSearches: () => {
                set({ recentSearches: [] });
            },

            currentView: 'wall',
            setView: (view) => set({ currentView: view }),

            fullscreenNoteId: null,
            setFullscreenNoteId: (id) => set({ fullscreenNoteId: id }),

            activeColorFilter: null,
            setColorFilter: (color) => set({ activeColorFilter: color }),

            importData: (data, mode = 'replace') => {
                try {
                    // Basic validation
                    if (!Array.isArray(data.notes)) throw new Error("Invalid data format");

                    set((state) => {
                        let newNotes = data.notes;
                        let newRecentSearches = data.recentSearches || [];

                        if (mode === 'append') {
                            // In append mode, we need to ensure IDs are unique
                            // We'll regenerate IDs for imported notes to avoid conflicts
                            const existingIds = new Set(state.notes.map(n => n.id));

                            newNotes = data.notes.map((note: Note) => {
                                let newId = note.id;
                                // If ID exists, generate a new one
                                if (existingIds.has(newId)) {
                                    newId = Math.random().toString(36).substring(2, 9);
                                }
                                return { ...note, id: newId, zIndex: state.notes.length + note.zIndex };
                            });

                            newNotes = [...state.notes, ...newNotes];

                            // Merge recent searches, keeping unique ones
                            const uniqueSearches = new Set([...state.recentSearches, ...newRecentSearches]);
                            newRecentSearches = Array.from(uniqueSearches).slice(0, 10);
                        }

                        return {
                            notes: newNotes,
                            recentSearches: newRecentSearches,
                            // Reset view state only if replacing? Or maybe keep it simple
                            fullscreenNoteId: null,
                            activeColorFilter: null,
                        };
                    });
                    return true;
                } catch (e) {
                    console.error("Import failed", e);
                    return false;
                }
            },

            organizeNotes: () => {
                set((state) => {
                    // Simple grid packing
                    const notes = [...state.notes];
                    const cols = Math.floor(window.innerWidth / 320); // 300px width + gap
                    const gap = 20;
                    const width = 300;
                    const height = 300; // Estimate height or use fixed

                    const sorted = notes.sort((a, b) => b.updatedAt - a.updatedAt);

                    const organized = sorted.map((note, i) => {
                        const col = i % cols;
                        const row = Math.floor(i / cols);
                        return {
                            ...note,
                            x: col * (width + gap) + 50,
                            y: row * (height + gap) + 50,
                        };
                    });

                    return { notes: organized };
                });
            },

            clearAllData: () => {
                set({
                    notes: [],
                    recentSearches: [],
                    fullscreenNoteId: null,
                    activeColorFilter: null,
                });
            },

            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            isSidebarCollapsed: false,
            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
        }),
        {
            name: 'fivwall-storage',
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') {
                    return localStorage;
                }
                // Dummy storage for SSR
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
