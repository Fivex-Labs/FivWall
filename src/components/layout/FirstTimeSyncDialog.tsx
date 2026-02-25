"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cloud, Upload, Download } from "lucide-react";
import { useSyncStore } from "@/store/useSyncStore";
import { resolveFirstTimeSyncChoice } from "@/lib/sync-service";

export function FirstTimeSyncDialog() {
    const { firstTimeSyncDialog } = useSyncStore();
    const [isResolving, setIsResolving] = React.useState(false);

    const handleChoice = async (choice: "push" | "pull") => {
        setIsResolving(true);
        try {
            resolveFirstTimeSyncChoice(choice);
        } finally {
            setIsResolving(false);
        }
    };

    if (!firstTimeSyncDialog) return null;

    const { localCount, remoteCount } = firstTimeSyncDialog;

    return (
        <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent
                className="max-w-md"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-primary" />
                        Sync Your Data
                    </DialogTitle>
                    <DialogDescription>
                        You have notes on this device and in your Google Drive. Choose how to sync:
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto py-4"
                        onClick={() => handleChoice("push")}
                        disabled={isResolving}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="font-semibold">Use local data</span>
                            <span className="text-xs text-muted-foreground font-normal">
                                Upload {localCount} note{localCount !== 1 ? "s" : ""} to Google Drive (replaces Drive data)
                            </span>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto py-4"
                        onClick={() => handleChoice("pull")}
                        disabled={isResolving}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Download className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="font-semibold">Use Google Drive data</span>
                            <span className="text-xs text-muted-foreground font-normal">
                                Replace local with {remoteCount} note{remoteCount !== 1 ? "s" : ""} from Drive
                            </span>
                        </div>
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Your choice will overwrite the other copy. You can export a backup first from the sidebar if needed.
                </p>
            </DialogContent>
        </Dialog>
    );
}
