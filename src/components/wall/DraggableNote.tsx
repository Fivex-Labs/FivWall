"use client";

import * as React from "react";
import { motion, useDragControls } from "framer-motion";
import { Note } from "@/types";
import { useNoteStore } from "@/store/useNoteStore";
import { NoteEditor, NoteEditorHandle } from "@/components/editor/NoteEditor";
import { X, GripHorizontal, Maximize2, Minimize2, Paperclip, Tag, Trash2, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { NOTE_COLORS } from "@/constants/colors";

// Simple debounce implementation to avoid adding lodash dependency just for this
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const callbackRef = React.useRef(callback);
    React.useLayoutEffect(() => {
        callbackRef.current = callback;
    });
    return React.useMemo(
        () =>
            (...args: any[]) => {
                // @ts-ignore
                if (window.timeoutId) clearTimeout(window.timeoutId);
                // @ts-ignore
                window.timeoutId = setTimeout(() => callbackRef.current(...args), delay);
            },
        [delay]
    );
}

// Helper to check if color is light
const isLightColor = (color: string) => {
    // Simple check for the specific light colors we use (Yellow, Green, Pink, Blue, Purple)
    // Dark mode default is #202124 (dark gray)
    const lightColors = ['#e8eaed', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8'];
    // Also check for hex values close to white if needed, but for now specific list is safer for our palette
    // Actually, let's use the logic from the previous code:
    return color !== '#202124';
};

interface DraggableNoteProps {
    note: Note;
}

export function DraggableNote({ note }: DraggableNoteProps) {
    const { updateNote, deleteNote, bringToFront, setFullscreenNoteId } = useNoteStore();
    const dragControls = useDragControls();
    // Removed local isExpanded state
    const editorRef = React.useRef<NoteEditorHandle>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [tagInput, setTagInput] = React.useState("");
    const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);

    // Debounced update for content to avoid too many writes
    const handleContentChange = (content: string) => {
        updateNote(note.id, { content });
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFullscreenNoteId(note.id);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    editorRef.current?.insertImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            // Only take the first tag if multiple entered, or just the whole string as one tag
            // User requested "only allow 1 tag per note"
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

    const textColorClass = isLightColor(note.color) ? "text-gray-900 placeholder:text-gray-500" : "text-gray-100 placeholder:text-gray-400";
    const borderColorClass = isLightColor(note.color) ? "border-black/10" : "border-white/10";
    const hoverBgClass = isLightColor(note.color) ? "hover:bg-black/5" : "hover:bg-white/10";
    const tagBgClass = isLightColor(note.color) ? "bg-black/10 text-black" : "bg-white/10 text-white";

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ x: note.x, y: note.y, scale: 0.8, opacity: 0 }}
            animate={{
                x: note.x,
                y: note.y,
                width: 300,
                height: "auto",
                zIndex: note.zIndex,
                position: "absolute",
                scale: 1,
                opacity: 1
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            onDragEnd={(e, info) => {
                updateNote(note.id, {
                    x: note.x + info.offset.x,
                    y: note.y + info.offset.y,
                });
            }}
            onPointerDown={() => bringToFront(note.id)}
            className={cn(
                "flex flex-col rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-2xl",
                "border",
                borderColorClass,
                "min-h-[200px]"
            )}
            style={{
                backgroundColor: note.color,
            }}
        >
            {/* Header / Drag Handle */}
            <div
                className={cn("flex items-center justify-between px-2 py-1", isLightColor(note.color) ? "bg-black/5" : "bg-white/5")}
                onPointerDown={(e) => dragControls.start(e)}
                style={{ cursor: 'grab' }}
            >
                <div className="flex items-center gap-2">
                    <GripHorizontal className={cn("w-4 h-4 opacity-50", textColorClass)} />
                    <button
                        onClick={toggleExpand}
                        className={cn("p-1 rounded-full transition-colors", hoverBgClass, textColorClass)}
                        title="Maximize"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className={cn("p-1 rounded-full transition-colors", hoverBgClass, textColorClass)}
                                title="Change color"
                            >
                                <Palette className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
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
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()} // Prevent drag start
                            className={cn("p-1 rounded-full transition-colors", hoverBgClass, textColorClass)}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Note?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. Are you sure you want to delete this note?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={() => deleteNote(note.id)}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                <input
                    type="text"
                    value={note.title}
                    onChange={(e) => updateNote(note.id, { title: e.target.value })}
                    placeholder="Title"
                    className={cn("w-full bg-transparent text-lg font-bold focus:outline-none mb-2", textColorClass)}
                />
                <div className={textColorClass}>
                    <NoteEditor
                        ref={editorRef}
                        content={note.content}
                        onChange={handleContentChange}
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            {/* Footer / Toolbar */}
            <div className={cn("flex items-center gap-2 px-4 py-2 border-t text-xs opacity-70", borderColorClass, textColorClass)}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button
                    onClick={handleAttachClick}
                    className="flex items-center gap-1 hover:opacity-100 transition-opacity"
                >
                    <Paperclip className="w-3 h-3" />
                    <span>Attach</span>
                </button>

                {(!note.tags || note.tags.length === 0) && (
                    <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                className="flex items-center gap-1 hover:opacity-100 transition-opacity"
                            >
                                <Tag className="w-3 h-3" />
                                <span>Label</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Label</DialogTitle>
                                <DialogDescription>
                                    Add a label to organize your note.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="work"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddTag();
                                        }
                                    }}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddTag}>Save Label</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 ml-2 flex-wrap">
                        {note.tags.map(tag => (
                            <div key={tag} className={cn("group flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px]", tagBgClass)}>
                                <span>{tag}</span>
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                >
                                    <X className="w-2 h-2" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
