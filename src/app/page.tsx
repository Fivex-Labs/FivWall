"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Canvas } from "@/components/wall/Canvas";
import { Board } from "@/components/kanban/Board";
import { SearchCommand } from "@/components/search/SearchCommand";
import { useNoteStore } from "@/store/useNoteStore";
import { FullscreenNote } from "@/components/wall/FullscreenNote";
import { ColorFilter } from "@/components/layout/ColorFilter";
import { MobileBlocker } from "@/components/layout/MobileBlocker";

export default function Home() {
  const { currentView } = useNoteStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <MobileBlocker />
      <SearchCommand />
      <ColorFilter />
      <Sidebar />
      <main className="flex-1 relative ml-16 md:ml-64 h-full overflow-hidden">
        {currentView === 'wall' ? <Canvas /> : <Board />}
        <FullscreenNote />
      </main>
    </div>
  );
}
