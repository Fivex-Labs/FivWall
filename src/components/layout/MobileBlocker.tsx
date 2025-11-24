"use client";

import * as React from "react";
import { Monitor, Smartphone } from "lucide-react";

export function MobileBlocker() {
    return (
        <div className="fixed inset-0 z-[100000] bg-background flex flex-col items-center justify-center p-8 text-center md:hidden">
            <div className="flex items-center gap-4 mb-8 text-muted-foreground">
                <Smartphone className="w-12 h-12 opacity-50" />
                <div className="w-px h-12 bg-border" />
                <Monitor className="w-16 h-16 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-4">Desktop Experience Only</h1>
            <p className="text-muted-foreground max-w-sm">
                FivWall is designed for the productivity and screen real estate of laptops and desktops.
            </p>
            <p className="text-muted-foreground max-w-sm mt-2">
                Please access this application on a larger screen for the best experience.
            </p>
        </div>
    );
}
