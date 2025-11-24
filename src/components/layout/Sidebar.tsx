"use client";

import * as React from "react";
import { NOTE_COLORS } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { HelpCircle, LayoutGrid, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/store/useNoteStore";
import { DataControls } from "@/components/layout/DataControls";
import { HelpDialog } from "@/components/layout/HelpDialog";

export function Sidebar() {
    const { currentView, setView, addNote } = useNoteStore();
    const [showHelp, setShowHelp] = React.useState(false);

    const handleDragStart = (e: React.DragEvent, color: string) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ type: "note", color }));
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-16 md:w-64 bg-card border-r border-border z-50 flex flex-col p-4 transition-all duration-300">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    <img
                        src="/logos/fw-logo.png"
                        alt="FivWall"
                        className="w-8 h-8 rounded"
                    />
                </div>
                <span className="font-bold text-xl hidden md:inline">FivWall</span>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-2 mb-6">
                    <Button
                        variant={currentView === 'wall' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('wall')}
                        className="justify-start gap-2"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden md:inline">Wall</span>
                    </Button>
                    <Button
                        variant={currentView === 'board' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('board')}
                        className="justify-start gap-2"
                    >
                        <Kanban className="w-4 h-4" />
                        <span className="hidden md:inline">Board</span>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-1 mb-6 pr-2">
                    {NOTE_COLORS.map((color) => (
                        <div
                            key={color.name}
                            className="group relative flex cursor-grab items-center justify-center aspect-square"
                            draggable
                            onDragStart={(e) => handleDragStart(e, color.value)}
                            title={`Drag to add ${color.name} note`}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 md:w-full md:h-full rounded-md shadow-sm transition-transform group-hover:scale-110 group-active:scale-95 ring-1 ring-white/10",
                                    color.name === 'Dark' ? 'border border-gray-600' : ''
                                )}
                                style={{ backgroundColor: color.value }}
                            />
                        </div>
                    ))}
                </div>

                <DataControls />
            </div>

            <div className="mt-auto pt-4 border-t border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(true)}
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    title="How it works"
                >
                    <HelpCircle className="w-4 h-4" />
                    <span className="hidden md:inline">Help</span>
                </Button>
            </div>

            <HelpDialog open={showHelp} onOpenChange={setShowHelp} />
        </aside>
    );
}
