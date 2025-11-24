"use client";

import * as React from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function ColorFilter() {
    const { notes, activeColorFilter, setColorFilter } = useNoteStore();

    // Extract unique colors from active notes
    const activeColors = React.useMemo(() => {
        const colors = new Set<string>();
        notes.forEach(note => {
            if (note.color) {
                colors.add(note.color);
            }
        });
        return Array.from(colors);
    }, [notes]);

    if (activeColors.length === 0) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-full border shadow-sm transition-all hover:bg-card">
            <div className="flex items-center gap-2">
                {activeColors.map((color) => (
                    <button
                        key={color}
                        onClick={() => setColorFilter(activeColorFilter === color ? null : color)}
                        className={cn(
                            "w-4 h-4 rounded-full border transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            activeColorFilter === color ? "ring-2 ring-ring ring-offset-2 scale-110" : "opacity-70 hover:opacity-100"
                        )}
                        style={{ backgroundColor: color }}
                        title={`Filter by ${color}`}
                    />
                ))}
            </div>

            <AnimatePresence>
                {activeColorFilter && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                        onClick={() => setColorFilter(null)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
