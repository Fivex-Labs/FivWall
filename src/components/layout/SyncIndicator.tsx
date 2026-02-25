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

export function SyncIndicator({
    className,
    isSidebarCollapsed,
}: {
    className?: string;
    isSidebarCollapsed?: boolean;
}) {
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

    const syncedMessage = lastSyncedAt
        ? `Last synced ${formatLastSynced(lastSyncedAt)}`
        : "Synced";

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                isSidebarCollapsed && "justify-center",
                className
            )}
            title={
                syncStatus === "syncing"
                    ? "Syncing..."
                    : syncStatus === "synced"
                      ? syncedMessage
                      : error || "Sync failed"
            }
        >
            {syncStatus === "syncing" && (
                <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    {!isSidebarCollapsed && <span>Syncing...</span>}
                </>
            )}
            {syncStatus === "synced" && lastSyncedAt && (
                <>
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {!isSidebarCollapsed && (
                        <span>Last synced {formatLastSynced(lastSyncedAt)}</span>
                    )}
                </>
            )}
            {syncStatus === "error" && (
                <>
                    {isSidebarCollapsed ? (
                        <button
                            type="button"
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="shrink-0 rounded p-0.5 text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                            title={isRetrying ? "Retrying..." : "Retry sync"}
                        >
                            <AlertCircle className="w-4 h-4" />
                        </button>
                    ) : (
                        <>
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <span className="text-destructive truncate">
                                {error || "Sync failed"}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="h-6 px-2 text-xs shrink-0"
                            >
                                {isRetrying ? "Retrying..." : "Retry"}
                            </Button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
