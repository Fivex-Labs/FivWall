"use client";

import * as React from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { NoteEditor, NoteEditorHandle } from "@/components/editor/NoteEditor";
import { X, Minimize2, Paperclip, Tag, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { motion, AnimatePresence } from "framer-motion";
import { NOTE_COLORS } from "@/constants/colors";

export function FullscreenNote() {
    const { notes, updateNote, deleteNote, fullscreenNoteId, setFullscreenNoteId } = useNoteStore();
    const note = notes.find((n) => n.id === fullscreenNoteId);
    const editorRef = React.useRef<NoteEditorHandle>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [tagInput, setTagInput] = React.useState("");
    const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);

    if (!note) return null;

    // Helper to check if color is light
    const isLightColor = (color: string) => color !== '#202124';
    const textColorClass = isLightColor(note.color) ? "text-gray-900 placeholder:text-gray-500" : "text-gray-100 placeholder:text-gray-400";
    const borderColorClass = isLightColor(note.color) ? "border-black/10" : "border-white/10";
    const hoverBgClass = isLightColor(note.color) ? "hover:bg-black/5" : "hover:bg-white/10";
    const tagBgClass = isLightColor(note.color) ? "bg-black/10 text-black" : "bg-white/10 text-white";

    const handleClose = () => {
        setFullscreenNoteId(null);
    };

    const handleContentChange = (content: string) => {
        updateNote(note.id, { content });
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

    return (
        <AnimatePresence>
            {fullscreenNoteId && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] bg-background flex flex-col"
                    style={{ backgroundColor: note.color }}
                >
                    {/* Header */}
                    <div className={cn("flex items-center justify-between px-4 py-2", isLightColor(note.color) ? "bg-black/5" : "bg-white/5")}>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className={cn("gap-2", textColorClass, hoverBgClass)}
                            >
                                <Minimize2 className="w-4 h-4" />
                                Minimize
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn("gap-2", textColorClass, hoverBgClass)}
                                    >
                                        <Palette className="w-4 h-4" />
                                        Color
                                    </Button>
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
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className={cn("p-2 rounded-full transition-colors", hoverBgClass, textColorClass)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="z-[10000]">
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
                                    <Button variant="destructive" onClick={() => { deleteNote(note.id); handleClose(); }}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
                        <input
                            type="text"
                            value={note.title}
                            onChange={(e) => updateNote(note.id, { title: e.target.value })}
                            placeholder="Title"
                            className={cn("w-full bg-transparent text-4xl font-bold focus:outline-none mb-6", textColorClass)}
                        />
                        <div className={cn("min-h-[50vh]", textColorClass)}>
                            <NoteEditor
                                ref={editorRef}
                                content={note.content}
                                onChange={handleContentChange}
                                className="min-h-[50vh] text-lg"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={cn("flex items-center gap-4 px-8 py-4 border-t", borderColorClass, textColorClass)}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleAttachClick}
                            className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                        >
                            <Paperclip className="w-4 h-4" />
                            <span>Attach</span>
                        </button>

                        {(!note.tags || note.tags.length === 0) && (
                            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                                    >
                                        <Tag className="w-4 h-4" />
                                        <span>Label</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="z-[10000]">
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
                            <div className="flex gap-2 ml-4 flex-wrap">
                                {note.tags.map(tag => (
                                    <div key={tag} className={cn("group flex items-center gap-1 px-2 py-1 rounded-full text-xs", tagBgClass)}>
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
