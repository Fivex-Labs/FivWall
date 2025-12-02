"use client";

import * as React from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import { Note } from "@/types";
import { cn } from "@/lib/utils";
import { X, Paperclip, Tag, Maximize2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { NOTE_COLORS } from "@/constants/colors";
import { NoteEditor } from "@/components/editor/NoteEditor";

function KanbanCard({ note }: { note: Note }) {
    const { updateNote, deleteNote, setFullscreenNoteId } = useNoteStore();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: note.id,
        data: { note },
    });
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [tagInput, setTagInput] = React.useState("");
    const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Helper to check if color is light (duplicated for now, could be util)
    const isLightColor = (color: string) => color !== '#202124';
    const textColorClass = isLightColor(note.color) ? "text-gray-900 placeholder:text-gray-500" : "text-gray-100 placeholder:text-gray-400";
    const borderColorClass = isLightColor(note.color) ? "border-black/10" : "border-white/10";
    const tagBgClass = isLightColor(note.color) ? "bg-black/10 text-black" : "bg-white/10 text-white";

    const handleAttachClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    // For Kanban, we just append the image HTML to content for now
                    // ideally we'd use the editor instance if we had one here, 
                    // but for simplicity let's just append an img tag
                    const imgTag = `<img src="${result}" />`;
                    updateNote(note.id, { content: (note.content || "") + imgTag });
                }
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            const newTag = tagInput.split(",")[0].trim();
            if (newTag) {
                updateNote(note.id, { tags: [newTag] });
                setTagInput("");
                setIsTagDialogOpen(false);
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = (note.tags || []).filter(tag => tag !== tagToRemove);
        updateNote(note.id, { tags: updatedTags });
    };

    const handleContentChange = (content: string) => {
        updateNote(note.id, { content });
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={{ ...style, backgroundColor: note.color }}
                {...listeners}
                {...attributes}
                className={cn(
                    "p-4 rounded shadow-sm mb-2 cursor-grab active:cursor-grabbing min-h-[100px] flex flex-col group relative",
                    textColorClass
                )}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="font-bold flex-1">{note.title || "Untitled"}</div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()}>
                        <button
                            className="p-1 hover:bg-black/10 rounded"
                            onClick={() => setFullscreenNoteId(note.id)}
                            title="Maximize"
                        >
                            <Maximize2 className="w-3 h-3" />
                        </button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="p-1 hover:bg-black/10 rounded" title="Change color">
                                    <Palette className="w-3 h-3" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {NOTE_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => updateNote(note.id, { color: color.value })}
                                            className={cn(
                                                "w-8 h-8 rounded-md transition-transform hover:scale-110 ring-1 ring-white/10",
                                                color.name === 'Dark' ? 'border border-gray-600' : '',
                                                note.color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                                            )}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="p-1 hover:bg-black/10 rounded"><X className="w-3 h-3" /></button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Note?</DialogTitle>
                                    <DialogDescription>Are you sure you want to delete this note?</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                    <Button variant="destructive" onClick={() => deleteNote(note.id)}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="text-sm mb-2 pointer-events-none max-h-[300px] overflow-hidden">
                    <NoteEditor
                        content={note.content}
                        onChange={handleContentChange}
                        editable={false}
                        className="text-sm"
                        isLightBackground={isLightColor(note.color)}
                    />
                </div>

                <div className="mt-auto flex items-center gap-2 text-xs opacity-70 pt-2 border-t border-black/5" onPointerDown={(e) => e.stopPropagation()}>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    <button onClick={handleAttachClick} className="hover:opacity-100"><Paperclip className="w-3 h-3" /></button>

                    {(!note.tags || note.tags.length === 0) && (
                        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="hover:opacity-100"><Tag className="w-3 h-3" /></button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Label</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        placeholder="Label..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                    />
                                </div>
                                <DialogFooter><Button onClick={handleAddTag}>Save</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap" onPointerDown={(e) => e.stopPropagation()}>
                        {note.tags.map(tag => (
                            <div key={tag} className={cn("group/tag flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px]", tagBgClass)}>
                                <span>{tag}</span>
                                <button onClick={() => removeTag(tag)} className="opacity-0 group-hover/tag:opacity-100 hover:text-red-500"><X className="w-2 h-2" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function KanbanColumn({ tag, notes }: { tag: string; notes: Note[] }) {
    const { setNodeRef } = useDroppable({
        id: tag,
    });

    return (
        <div className="flex flex-col w-80 shrink-0">
            <div className="font-bold mb-4 px-2 uppercase text-sm tracking-wider opacity-70">
                {tag || "No Tag"} <span className="opacity-50">({notes.length})</span>
            </div>
            <div
                ref={setNodeRef}
                className="flex-1 bg-muted/20 rounded-lg p-2 min-h-[200px]"
            >
                {notes.map((note) => (
                    <KanbanCard key={note.id} note={note} />
                ))}
            </div>
        </div>
    );
}

export function Board() {
    const { notes, updateNote, activeColorFilter } = useNoteStore();
    const [activeNote, setActiveNote] = React.useState<Note | null>(null);

    const filteredNotes = activeColorFilter
        ? notes.filter((n) => n.color === activeColorFilter)
        : notes;

    // Extract unique tags and include "No Tag"
    const tags = React.useMemo(() => {
        const allTags = new Set<string>();
        notes.forEach(n => {
            if (n.tags && n.tags.length > 0) {
                n.tags.forEach(t => allTags.add(t));
            }
        });
        // Ensure "No Tag" is always first or present
        return ["", ...Array.from(allTags).sort()];
    }, [notes]);

    const handleDragStart = (event: any) => {
        setActiveNote(event.active.data.current?.note);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const noteId = active.id as string;
            const newTag = over.id as string;

            // Update note tag
            // If newTag is "", clear tags. Else set to [newTag] (since user said 1 label at a time)
            const tags = newTag ? [newTag] : [];
            updateNote(noteId, { tags });
        }
        setActiveNote(null);
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full w-full gap-4 overflow-x-auto p-4 pt-20 bg-background">
                {tags.map((tag) => (
                    <KanbanColumn
                        key={tag}
                        tag={tag}
                        notes={filteredNotes.filter((n) => {
                            if (!tag) return !n.tags || n.tags.length === 0;
                            return n.tags?.includes(tag);
                        })}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeNote ? (
                    <div
                        className="p-4 rounded shadow-xl opacity-80 rotate-3 cursor-grabbing"
                        style={{ backgroundColor: activeNote.color, color: activeNote.color === '#202124' ? '#ededed' : '#171717', width: 300 }}
                    >
                        <div className="font-bold mb-1">{activeNote.title || "Untitled"}</div>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: activeNote.content || "" }} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
