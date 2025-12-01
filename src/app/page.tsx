"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Canvas } from "@/components/wall/Canvas";
import { Board } from "@/components/kanban/Board";
import { SearchCommand } from "@/components/search/SearchCommand";
import { useNoteStore } from "@/store/useNoteStore";
import { FullscreenNote } from "@/components/wall/FullscreenNote";
import { ColorFilter } from "@/components/layout/ColorFilter";
import { MobileBlocker } from "@/components/layout/MobileBlocker";

import { cn } from "@/lib/utils";

export default function Home() {
  const { currentView, isSidebarCollapsed } = useNoteStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <MobileBlocker />
      <SearchCommand />
      <ColorFilter />
      <Sidebar />
      <main
        className={cn(
          "flex-1 relative h-full overflow-hidden transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "ml-16" : "ml-16 md:ml-64"
        )}
      >
        {currentView === 'wall' ? <Canvas /> : <Board />}
        <FullscreenNote />
      </main>
    </div>
  );
}
