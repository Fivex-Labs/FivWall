"use client";

import * as React from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { DraggableNote } from "@/components/wall/DraggableNote";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

export function Canvas() {
  const { notes, addNote, updateNote, activeColorFilter, organizeNotes, _hasHydrated } = useNoteStore();
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  const filteredNotes = activeColorFilter
    ? notes.filter((n) => n.color === activeColorFilter)
    : notes;

  if (!_hasHydrated) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading notes...</div>;
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const { type, color } = JSON.parse(data);
      if (type === "note") {
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollLeft = e.currentTarget.scrollLeft;
        const scrollTop = e.currentTarget.scrollTop;

        const x = e.clientX - rect.left + scrollLeft;
        const y = e.clientY - rect.top + scrollTop;

        addNote({
          title: "",
          content: "",
          color,
          x: x - 150, // Center the note (300px width / 2)
          y: y - 100,
          tags: [],
        });
      }
    } catch (err) {
      console.error("Failed to parse drop data", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      className="relative h-full w-full overflow-auto bg-background pt-20"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <Button
        variant="default"
        size="sm"
        className="fixed bottom-4 right-4 z-[10] shadow-lg opacity-80 hover:opacity-100 border-2 border-black"
        onClick={organizeNotes}
        title="Reorder Notes"
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Reorder
      </Button>

      <div className="min-w-full min-h-full relative">
        {filteredNotes.map((note) => (
          <DraggableNote key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
