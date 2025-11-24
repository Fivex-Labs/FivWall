"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useNoteStore } from "@/store/useNoteStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SearchCommand() {
    const [open, setOpen] = React.useState(false);
    const { notes, recentSearches, addRecentSearch } = useNoteStore();
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            // Small timeout to ensure the input is mounted and ready
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [open]);

    const filteredNotes = React.useMemo(() => {
        if (!search) return [];
        try {
            // Escape special regex characters
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, 'i');

            return notes.filter(
                (note) =>
                    regex.test(note.title) ||
                    // Only search content if it's not too huge or if we accept the cost
                    // To avoid hanging on huge base64 strings, we could limit the search length
                    // or just rely on the regex being more efficient than toLowerCase() allocation.
                    regex.test(note.content)
            );
        } catch (e) {
            return [];
        }
    }, [notes, search]);

    const handleSelect = (noteId: string) => {
        setOpen(false);
        addRecentSearch(search);
        setSearch(""); // Reset search input
        useNoteStore.getState().setFullscreenNoteId(noteId);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground border border-border"
            >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
                        >
                            <Command shouldFilter={false} className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground">
                                <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Command.Input
                                        ref={inputRef}
                                        value={search}
                                        onValueChange={setSearch}
                                        placeholder="Search notes..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Escape") {
                                                e.preventDefault();
                                                setOpen(false);
                                            }
                                        }}
                                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                    <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                                    {!search && recentSearches.length > 0 && (
                                        <Command.Group heading="Recent Searches">
                                            {recentSearches.map((term) => (
                                                <Command.Item
                                                    key={term}
                                                    value={term}
                                                    onSelect={() => setSearch(term)}
                                                    onPointerDown={(e) => {
                                                        e.preventDefault();
                                                        setSearch(term);
                                                    }}
                                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:opacity-50"
                                                >
                                                    {term}
                                                </Command.Item>
                                            ))}
                                        </Command.Group>
                                    )}

                                    {search && (
                                        <Command.Group heading="Notes">
                                            {filteredNotes.map((note) => (
                                                <Command.Item
                                                    key={note.id}
                                                    value={`${note.title} ${note.content}`}
                                                    onSelect={() => handleSelect(note.id)}
                                                    onPointerDown={(e) => {
                                                        e.preventDefault();
                                                        handleSelect(note.id);
                                                    }}
                                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:opacity-50"
                                                >
                                                    <div
                                                        className="mr-2 h-3 w-3 rounded-full border"
                                                        style={{ backgroundColor: note.color }}
                                                    />
                                                    <span className="truncate">{note.title || "Untitled"}</span>
                                                </Command.Item>
                                            ))}
                                        </Command.Group>
                                    )}
                                </Command.List>
                            </Command>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
