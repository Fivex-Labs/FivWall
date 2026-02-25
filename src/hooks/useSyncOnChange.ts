"use client";

import { useEffect } from 'react';
import { initSyncService, triggerPull, restoreSession } from '@/lib/sync-service';
import { isAuthenticated } from '@/lib/google-drive';

/**
 * Restores persisted session, initializes sync service, pulls on tab focus.
 */
export function useSyncOnChange() {
    useEffect(() => {
        restoreSession();
        const cleanup = initSyncService();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isAuthenticated() && navigator.onLine) {
                void triggerPull();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            cleanup();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
}
