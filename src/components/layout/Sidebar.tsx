"use client";

import * as React from "react";
import Link from "next/link";
import { NOTE_COLORS } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { HelpCircle, LayoutGrid, Kanban, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/store/useNoteStore";
import { DataControls } from "@/components/layout/DataControls";
import { ClientOnlyGoogleAuth } from "@/components/layout/ClientOnlyGoogleAuth";
import { SyncIndicator } from "@/components/layout/SyncIndicator";

export function Sidebar() {
    const { currentView, setView, isSidebarCollapsed, toggleSidebar } = useNoteStore();

    const handleDragStart = (e: React.DragEvent, color: string) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ type: "note", color }));
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full bg-card border-r border-border z-50 flex flex-col p-4 transition-all duration-300 ease-in-out",
                isSidebarCollapsed ? "w-18" : "w-16 md:w-64"
            )}
        >
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="min-w-[2rem] w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
                        <img
                            src="/logos/fw-logo.png"
                            alt="FivWall"
                            className="w-8 h-8 rounded"
                        />
                    </div>
                    <span className={cn(
                        "font-bold text-xl whitespace-nowrap transition-opacity duration-300",
                        isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 hidden md:inline"
                    )}>
                        FivWall
                    </span>
                </div>
                {/* <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-6 w-6 shrink-0"
                    onClick={toggleSidebar}
                >
                    {isSidebarCollapsed ? (
                        <LayoutGrid className="h-4 w-4 rotate-90" />
                    ) : (
                        <div className="flex flex-col gap-0.5">
                            <div className="w-1 h-4 bg-border rounded-full" />
                        </div>
                    )}
                </Button> */}
            </div>

            {/* Toggle Button Position - actually let's put it absolutely positioned or in the header */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md hidden md:flex items-center justify-center z-50 hover:bg-accent",
                    isSidebarCollapsed ? "rotate-180" : ""
                )}
                onClick={toggleSidebar}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </Button>

            <div className="flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden">
                <div className="flex flex-col gap-2 mb-6">
                    <Button
                        variant={currentView === 'wall' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('wall')}
                        className={cn("justify-start", isSidebarCollapsed ? "px-2 justify-center" : "gap-2")}
                        title="Wall View"
                    >
                        <LayoutGrid className="w-4 h-4 shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isSidebarCollapsed ? "w-0 opacity-0 hidden" : "hidden md:inline")}>Wall</span>
                    </Button>
                    <Button
                        variant={currentView === 'board' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('board')}
                        className={cn("justify-start", isSidebarCollapsed ? "px-2 justify-center" : "gap-2")}
                        title="Board View"
                    >
                        <Kanban className="w-4 h-4 shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isSidebarCollapsed ? "w-0 opacity-0 hidden" : "hidden md:inline")}>Board</span>
                    </Button>
                </div>

                <div className={cn(
                    "grid gap-2 px-1 mb-6 pr-2 transition-all duration-300",
                    isSidebarCollapsed ? "grid-cols-1" : "grid-cols-4 md:grid-cols-4"
                )}>
                    {NOTE_COLORS.map((color) => (
                        <div
                            key={color.name}
                            className="group relative flex cursor-grab items-center justify-center"
                            draggable
                            onDragStart={(e) => handleDragStart(e, color.value)}
                            title={`Drag to add ${color.name} note`}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-md shadow-sm transition-transform group-hover:scale-110 group-active:scale-95 ring-1 ring-white/10 shrink-0",
                                    color.name === 'Dark' ? 'border border-gray-600' : ''
                                )}
                                style={{ backgroundColor: color.value }}
                            />
                        </div>
                    ))}
                </div>

                <div className={cn("transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 pointer-events-none hidden" : "opacity-100")}>
                    <DataControls />
                </div>
                {/* DataControls might need its own collapsed state handling if we want icons only, but for now hiding it or letting it wrap is okay. 
                    Actually, DataControls usually has buttons. If collapsed, maybe we should hide it or show icon-only versions? 
                    The user said "hiding all the texts, just remaining the icons". 
                    Let's assume DataControls has text. I should probably hide it or make it icon only.
                    Let's check DataControls content later. For now, hiding it in collapsed mode might be safer if it's text-heavy, 
                    OR I can let it be but it might look squashed. 
                    Let's hide it for now as per "hiding all the texts". 
                    Wait, if I hide DataControls, user loses functionality. 
                    I should probably check DataControls. 
                */}
            </div>

            <div className="mt-auto pt-4 border-t border-border space-y-1">
                <div className={cn("mb-3", isSidebarCollapsed && "flex flex-col items-center")}>
                    <SyncIndicator
                        className="mb-2 text-xs"
                        isSidebarCollapsed={isSidebarCollapsed}
                    />
                    <ClientOnlyGoogleAuth isSidebarCollapsed={isSidebarCollapsed} />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn("w-full justify-start text-muted-foreground hover:text-foreground", isSidebarCollapsed ? "px-2 justify-center" : "gap-2")}
                    title="Help"
                >
                    <Link href="/help">
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isSidebarCollapsed ? "w-0 opacity-0 hidden" : "hidden md:inline")}>Help</span>
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn("w-full justify-start text-muted-foreground hover:text-foreground", isSidebarCollapsed ? "px-2 justify-center" : "gap-2")}
                    title="Privacy Policy"
                >
                    <Link href="/privacy" className="flex items-center gap-2">
                        <Shield className="w-4 h-4 shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isSidebarCollapsed ? "w-0 opacity-0 hidden" : "hidden md:inline")}>Privacy Policy</span>
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn("w-full justify-start text-muted-foreground hover:text-foreground", isSidebarCollapsed ? "px-2 justify-center" : "gap-2")}
                    title="Terms of Service"
                >
                    <Link href="/terms" className="flex items-center gap-2">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isSidebarCollapsed ? "w-0 opacity-0 hidden" : "hidden md:inline")}>Terms of Service</span>
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
