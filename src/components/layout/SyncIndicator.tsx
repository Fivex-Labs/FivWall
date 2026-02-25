"use client";

import * as React from "react";
import { useSyncStore } from "@/store/useSyncStore";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerPush } from "@/lib/sync-service";
import { cn } from "@/lib/utils";

function formatLastSynced(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    if (diffMins < 1) {
        return diffSecs <= 10 ? "just now" : `${diffSecs}s ago`;
    }
    if (diffMins < 60) {
        return `${diffMins}m ago`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }
    return date.toLocaleString();
}

export function SyncIndicator({ className }: { className?: string }) {
    const { isLoggedIn, syncStatus, lastSyncedAt, error } = useSyncStore();
    const [isRetrying, setIsRetrying] = React.useState(false);

    if (!isLoggedIn) return null;

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await triggerPush();
        } finally {
            setIsRetrying(false);
        }
    };

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                className
            )}
        >
            {syncStatus === "syncing" && (
                <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Syncing...</span>
                </>
            )}
            {syncStatus === "synced" && lastSyncedAt && (
                <>
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Saved to Google Drive {formatLastSynced(lastSyncedAt)}</span>
                </>
            )}
            {syncStatus === "error" && (
                <>
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                    <span className="text-destructive">{error || "Sync failed"}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="h-6 px-2 text-xs"
                    >
                        {isRetrying ? "Retrying..." : "Retry"}
                    </Button>
                </>
            )}
        </div>
    );
}
